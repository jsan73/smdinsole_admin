<template>
  <main class="container-fluid">
    <h4 class="my-4 ps-3">
      <i class="bi bi-calendar2-check"></i> 관리자 관리
      <small class="text-muted fs-6">관리자의 정보를 등록 및 수정 할 수 있습니다.</small>
    </h4>

    <section class="section dashboard">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body pb-0">
              <div class="row my-3 align-items-center">
                <div class="col d-flex flex-wrap gap-3">
                  <div v-if="isSuperAdmin" class="d-flex align-items-center">
                    <label for="UserName" class="fw-bold me-2" style="white-space: nowrap;">관리자명</label>
                    <input v-model="search.mgrName" type="text" id="UserName" class="form-control" style="width: 150px;" placeholder="관리자명 입력" @keyup.enter="selectManagerList">
                  </div>

                  <div class="d-flex align-items-center">
                    <label for="UserPhone" class="fw-bold me-2" style="white-space: nowrap;">이메일</label>
                    <input v-model="search.mgrId" type="text" id="UserPhone" class="form-control" style="width: 180px;" placeholder="이메일 입력" :readonly="!isSuperAdmin" @keyup.enter="selectManagerList">
                  </div>

                  <div v-if="isSuperAdmin" class="d-flex align-items-center">
                    <label for="inputDate" class="fw-bold me-2" style="white-space: nowrap;">날짜선택</label>
                    <input v-model="search.lastLoginDate" type="date" id="inputDate" class="form-control" style="width: 150px;" @change="selectManagerList">
                  </div>
                </div>

                <div class="col-auto ms-auto">
                  <button class="btn btn-secondary" @click="selectManagerList">
                    <i class="bi bi-search"></i> 조회
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <!-- 목록 테이블 -->
          <div class="card dataTableStyle overflow-auto">
            <div class="card-body">
              <div class="grid-toolbar">
                <div class="grid-total-count">총 {{ totalRows }}건</div>
                <div class="grid-page-size">
                  <label for="managerPageSize" class="form-label mb-0">페이지당</label>
                  <select id="managerPageSize" v-model.number="paginationPageSize" class="form-select form-select-sm" @change="onPageSizeChange">
                    <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}개</option>
                  </select>
                </div>
              </div>
              <ag-grid-vue
                  class="ag-theme-alpine common-grid"
                  :modules="gridModules"
                  :columnDefs="columnDefs"
                  :rowData="managerList"
                  :defaultColDef="defaultColDef"
                  :pagination="false"
                  :paginationPageSize="paginationPageSize"
                  :suppressPaginationPanel="true"
                  :rowHeight="42"
                  :headerHeight="42"
                  :overlayNoRowsTemplate="overlayNoRowsTemplate"
                  :overlayLoadingTemplate="overlayLoadingTemplate"
                  @grid-ready="onGridReady"
                  @pagination-changed="onPaginationChanged"
              />
              <div class="grid-pagination-wrap">
                <div v-if="totalPages > 1" class="grid-pagination">
                  <button type="button" class="btn btn-sm btn-outline-secondary" :disabled="currentPage === 1" @click="goToPage(1)">처음</button>
                  <button type="button" class="btn btn-sm btn-outline-secondary" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">이전</button>
                  <button v-for="page in paginationPages" :key="page" type="button" class="btn btn-sm" :class="page === currentPage ? 'btn-primary' : 'btn-outline-secondary'" @click="goToPage(page)">{{ page }}</button>
                  <button type="button" class="btn btn-sm btn-outline-secondary" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">다음</button>
                  <button type="button" class="btn btn-sm btn-outline-secondary" :disabled="currentPage === totalPages" @click="goToPage(totalPages)">마지막</button>
                </div>
              </div>
              <p class="text-end">
                <button v-if="isSuperAdmin" class="btn btn-primary mt-2 ms-1" @click="appendGuard">관리자 등록</button>
                <button v-if="isSuperAdmin" class="btn btn-primary mt-2 ms-1" @click="allList">전체목록</button>
              </p>
            </div>
          </div><!--// 목록 테이블 -->

        </div>
      </div>
    </section>

  </main><!--// 컨텐츠 영역 -->
</template>

<script>
import utils from "@/utils/utils";
import api from "@/api/api";
import { AgGridVue } from "@ag-grid-community/vue";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-alpine.css";

export default {
  name: "AdminManager",
  components: {
    AgGridVue,
  },
  data() {
    return {
      gridApi: null,
      gridModules: [ClientSideRowModelModule],
      managerList: [],
      paginationPageSize: 20,
      pageSizeOptions: [10, 20, 50, 100],
      currentPage: 1,
      totalPages: 0,
      totalRows: 0,
      defaultColDef: {
        sortable: true,
        resizable: true,
        suppressMovable: true,
      },
      overlayNoRowsTemplate: '<span class="text-muted">조회된 데이터가 없습니다.</span>',
      overlayLoadingTemplate: '<div class="ag-overlay-loading-center" style="width: 220px;"><div class="mb-2 text-muted">조회 중...</div><div class="progress" style="height: 6px;"><div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%;"></div></div></div>',
      search: {
        mgrdName:'',
        mgrId:'',
        lastLoginDate:'',
      },
      columnDefs: [
        {
          headerName: "No",
          valueGetter: this.noValueGetter,
          width: 80,
          sortable: false,
        },
        {
          headerName: "구분",
          valueGetter: params => this.getManagerValue(params.data, 1, ["MGR_TYPE", "mgrType"]),
          width: 100,
          cellRenderer: this.managerTypeRenderer,
        },
        {
          headerName: "이메일(ID)",
          valueGetter: params => this.getManagerValue(params.data, 2, ["MGR_ID", "mgrId"]),
          minWidth: 180,
          flex: 1,
          cellRenderer: this.managerIdRenderer,
        },
        { headerName: "이름", valueGetter: params => this.getManagerValue(params.data, 3, ["MGR_NAME", "mgrName"]), width: 130 },
        { headerName: "소속", valueGetter: params => this.getManagerValue(params.data, 4, ["NATION", "nation"]), width: 130 },
        {
          headerName: "마지막 로그인",
          valueGetter: params => this.getManagerValue(params.data, 5, ["LAST_LOGIN_DATE", "lastLoginDate"]),
          width: 170,
          valueFormatter: this.dateValueFormatter,
        },
        {
          headerName: "상태",
          valueGetter: params => this.getManagerValue(params.data, 6, ["IS_LOCKED", "isLocked"]),
          width: 110,
          cellRenderer: this.lockStateRenderer,
        },
        {
          headerName: "잠금 유형",
          valueGetter: params => this.getManagerValue(params.data, 7, ["LOCK_TYPE", "lockType"]),
          width: 130,
          cellRenderer: this.lockTypeRenderer,
        },
        {
          headerName: "실패 횟수",
          valueGetter: params => this.getManagerValue(params.data, 8, ["PWD_FAIL_CNT", "pwdFailCnt"]),
          width: 110,
        },
        {
          headerName: "잠금 일시",
          valueGetter: params => this.getManagerValue(params.data, 9, ["LOCK_DATE", "lockDate"]),
          width: 170,
          valueFormatter: this.dateValueFormatter,
        },
        {
          headerName: "해제 일시",
          valueGetter: params => this.getManagerValue(params.data, 10, ["LOCK_RELEASE_DATE", "lockReleaseDate"]),
          width: 170,
          valueFormatter: this.dateValueFormatter,
        },
        {
          headerName: "해제 관리자",
          valueGetter: params => this.getManagerValue(params.data, 11, ["LOCK_RELEASE_MGR_ID", "lockReleaseMgrId"]),
          width: 140,
        },
        {
          headerName: "잠금 해제",
          width: 130,
          sortable: false,
          cellRenderer: this.unlockRenderer,
        },
        {
          headerName: "비밀번호 초기화",
          width: 150,
          sortable: false,
          cellRenderer: this.initPwdRenderer,
        }
      ],
    }
  },
  computed: {
    isSuperAdmin() {
      return this.$store.getters['adminStore/isSuperAdmin'] === true;
    },
    loginId() {
      return this.$store.getters['adminStore/getLoginId'] || "";
    },
    paginationPages() {
      const pageCount = 10;
      const start = Math.floor((this.currentPage - 1) / pageCount) * pageCount + 1;
      const end = Math.min(start + pageCount - 1, this.totalPages);
      const pages = [];
      for(let page = start; page <= end; page += 1) pages.push(page);
      return pages;
    },
  },
  mounted() {
    this.applyRoleScope();
    this.selectManagerList();
  },
  methods: {
    applyRoleScope() {
      if(this.isSuperAdmin) return;
      this.search.mgrName = "";
      this.search.mgrId = this.loginId;
      this.search.lastLoginDate = "";
    },
    openManager(mgrNo) {
      const url = `/managerpopup?mgrNo=${mgrNo}`;
      const name = "관리자 수정";
      const style = "width=700,height=500,left=0,top=0";
      this.$open(url, name, style);
    },
    appendGuard(){
      const url = '/managerpopup';
      const name = "관리자 추가";
      const style = "width=650,height=500,left=0,top=0";
      this.$open(url, name, style);
    },
    telForm(data) {
      return utils.telForm(data, 1);
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.updatePaginationState();
      if(this.managerList.length === 0) this.gridApi.showNoRowsOverlay();
    },
    onPaginationChanged() {
      this.updatePaginationState();
    },
    updatePaginationState() {
      this.totalPages = this.totalRows === 0 ? 0 : Math.ceil(this.totalRows / this.paginationPageSize);
      if(this.totalPages > 0 && this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
      }
    },
    onPageSizeChange() {
      this.currentPage = 1;
      this.selectManagerList(false);
    },
    goToPage(page) {
      if(page < 1 || page > this.totalPages || page === this.currentPage) return;
      this.currentPage = page;
      this.selectManagerList(false);
    },
    noValueGetter(params) {
      return ((this.currentPage - 1) * this.paginationPageSize) + params.node.rowIndex + 1;
    },
    getManagerValue(row, index, keys) {
      if(Array.isArray(row)) return row[index];
      if(!row || typeof row !== "object") return "";
      const key = keys.find(item => row[item] !== undefined && row[item] !== null);
      return key ? row[key] : "";
    },
    getManagerNo(row) {
      return this.getManagerValue(row, 0, ["MGR_NO", "mgrNo"]);
    },
    getManagerId(row) {
      return this.getManagerValue(row, 2, ["MGR_ID", "mgrId"]);
    },
    toManagerRows(data) {
      if(Array.isArray(data)) return data;
      if(!data || typeof data !== "object") return [];
      const rowKeys = ["list", "rows", "items", "content", "managerList"];
      const rows = rowKeys.map(key => data[key]).find(Array.isArray);
      return rows || [];
    },
    managerTypeRenderer(params) {
      const statusMap = {
        'ROLE_SADMIN': '<span class="badge bg-success">SA</span>',
        'ROLE_ADMIN': '<span class="badge bg-secondary">A</span>',
      };
      return statusMap[params.value] || params.value || "";
    },
    managerIdRenderer(params) {
      if(utils.isEmpty(params.value)) return "";
      const link = document.createElement("a");
      link.href = "#";
      link.className = "text-primary";
      link.textContent = params.value;
      link.addEventListener("click", event => {
        event.preventDefault();
        this.openManager(this.getManagerNo(params.data));
      });
      return link;
    },
    dateValueFormatter(params) {
      return params.value ? utils.convertFromStrToDate(String(params.value)) : "-";
    },
    lockStateRenderer(params) {
      if(params.value === "Y") return '<span class="badge bg-danger">잠김</span>';
      return '<span class="badge bg-success">정상</span>';
    },
    lockTypeRenderer(params) {
      if(utils.isEmpty(params.value)) return "-";
      const lockType = String(params.value);
      if(lockType === "LOGIN_FAIL") return '<span class="badge bg-warning text-dark">로그인 잠금</span>';
      if(lockType === "INACTIVE_90DAYS" || lockType === "DORMANT") return '<span class="badge bg-danger">미접속 잠금</span>';
      return '<span class="badge bg-secondary">' + lockType + '</span>';
    },
    unlockRenderer(params) {
      const isLocked = this.getManagerValue(params.data, 6, ["IS_LOCKED", "isLocked"]) === "Y";
      if(!isLocked || !this.isSuperAdmin) return "";

      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn btn-sm btn-outline-primary";
      button.innerHTML = '<i class="bi bi-unlock"></i> 잠금해제';
      button.addEventListener("click", () => this.unlockManager(this.getManagerNo(params.data)));
      return button;
    },
    initPwdRenderer(params) {
      if(!this.isSuperAdmin) return "";
      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn btn-sm btn-outline-primary";
      button.innerHTML = '<i class="bi bi-unlock"></i> 초기화';
      button.addEventListener("click", () => this.initManagerPwd(this.getManagerNo(params.data)));
      return button;
    },
    async selectManagerList(resetPage = true) {
      this.applyRoleScope();
      if(resetPage) this.currentPage = 1;
      if(this.gridApi) this.gridApi.showLoadingOverlay();
      const param = {
        ...this.search,
        lastLoginDate: (this.search.lastLoginDate || "").replace(/-/g, ""),
        pageNum: this.currentPage,
        pageSize: this.paginationPageSize,
        pageStart: (this.currentPage - 1) * this.paginationPageSize,
      };
      try {
        const res = await api.selManagerListByAdmin(param);
        if(res.data.status === "SUCCESS") {
          const data = res.data.data || {};
          const rows = this.toManagerRows(data);
          let managerRows = rows.map(item => Array.isArray(item) ? item : [
            item.mgrNo ?? item.MGR_NO,                                 // 0: No
            item.mgrType ?? item.MGR_TYPE,                             // 1: 구분
            item.mgrId ?? item.MGR_ID,                                 // 2: 이메일(ID)
            item.mgrName ?? item.MGR_NAME,                             // 3: 이름
            item.nation ?? item.NATION,                                // 4: 소속
            item.lastLoginDate ?? item.LAST_LOGIN_DATE,                // 5: 마지막 로그인
            item.isLocked ?? item.IS_LOCKED,                           // 6: 상태(Y/N)
            item.lockType ?? item.LOCK_TYPE,                           // 7: 잠금 유형
            item.pwdFailCnt ?? item.PWD_FAIL_CNT,                      // 8: 실패 횟수
            item.lockDate ?? item.LOCK_DATE,                           // 9: 잠금 일시
            item.lockReleaseDate ?? item.LOCK_RELEASE_DATE,            // 10: 해제 일시
            item.lockReleaseMgrId ?? item.LOCK_RELEASE_MGR_ID,         // 11: 해제 관리자
            item.lockReason ?? item.LOCK_REASON,                       // 12: 잠금 사유
          ]);
          if(!this.isSuperAdmin) {
            managerRows = managerRows.filter(item => this.getManagerId(item) === this.loginId).slice(0, 1);
          }
          this.managerList = managerRows;
          this.totalRows = this.isSuperAdmin ? (data.totalCount || this.managerList.length) : this.managerList.length;
          this.$nextTick(() => {
            this.updatePaginationState();
            if(this.gridApi && this.managerList.length === 0) this.gridApi.showNoRowsOverlay();
            else if(this.gridApi) this.gridApi.hideOverlay();
          });
        }
      } catch (e) {
        this.handleScopeError(e);
      }
    },

    async unlockManager(mgrNo) {
      if (!window.app.$store.getters['adminStore/isSuperAdmin']) {
        alert("대표 관리자만 수행할 수 있습니다.");
        return;
      }

      if(confirm("잠금 해제 하시겠습니까?")) {
        const res = await api.unlockManager(mgrNo);
        if (res.data.status === "SUCCESS") {
          alert("잠금이 해제되었습니다.");
          this.selectManagerList();
        }
      }
    },

    async initManagerPwd(mgrNo) {
      if (!window.app.$store.getters['adminStore/isSuperAdmin']) {
        alert("대표 관리자만 수행할 수 있습니다.");
        return;
      }

      if(confirm("비밀번호를 초기화 하시겠습니까?")) {
        const res = await api.initManagerPwd(mgrNo);
        if (res.data.status === "SUCCESS") {
          alert("비밀번호가 초기화 되었습니다.")
        }
      }
    },

    async allList() {
      if(!this.isSuperAdmin) return;
      this.search.mgrId = ""
      this.search.mgrName = ""
      this.search.lastLoginDate = ""
      this.selectManagerList()
    },
    handleScopeError(e) {
      if(this.gridApi) this.gridApi.showNoRowsOverlay();
      const status = e?.response?.status;
      if(status === 403 || status === 401) {
        alert("관리 권한 범위 밖의 요청입니다.");
        return;
      }
      alert(e?.response?.data?.message || "조회 중 오류가 발생했습니다.");
    }
  },
  created() {
    // 팝업창에서 selectDeviceList 를 호출하기 위한 설정
    window.vueComponent = this;
    window.unlockManager = this.unlockManager;
    window.initManagerPwd = this.initManagerPwd;
  },
  unmounted() {
    delete window.unlockManager;
    delete window.initManagerPwd;
  }
}
</script>

<style scoped>
.common-grid {
  width: 100%;
  height: 560px;
}

.grid-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.grid-total-count {
  min-width: 90px;
  color: #495057;
  font-size: 14px;
}

.grid-pagination-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 12px;
}

.grid-pagination {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
}

.grid-pagination .btn {
  min-width: 36px;
}

.grid-page-size {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #495057;
  font-size: 14px;
}

.grid-page-size .form-select {
  width: 96px;
}
</style>
