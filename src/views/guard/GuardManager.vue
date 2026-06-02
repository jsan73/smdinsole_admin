<template>
  <main class="container-fluid">
    <h4 class="my-4 ps-3">
      <i class="bi bi-calendar2-check"></i> 사용자 관리
      <small class="text-muted fs-6">사용자의 정보를 등록 및 수정 할 수 있습니다.</small>
    </h4>

    <section class="section dashboard">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body pb-0">
              <div class="row my-3 align-items-center">
                <div class="col d-flex flex-wrap gap-3">
                  <div class="d-flex align-items-center">
                    <label for="UserName" class="fw-bold me-2" style="white-space: nowrap;">사용자명</label>
                    <input v-model="search.guardName" type="text" id="UserName" class="form-control" style="width: 150px;" placeholder="사용자명 입력" @keyup.enter="selectGuardList">
                  </div>

                  <div class="d-flex align-items-center">
                    <label for="UserPhone" class="fw-bold me-2" style="white-space: nowrap;">사용자 전화번호</label>
                    <input v-model="search.guardPhone" type="text" id="UserPhone" class="form-control" style="width: 180px;" placeholder="번호 입력" @keyup.enter="selectGuardList">
                  </div>

                  <div class="d-flex align-items-center">
                    <label for="inputDate" class="fw-bold me-2" style="white-space: nowrap;">날짜선택</label>
                    <input v-model="search.lastLoginDate" type="date" id="inputDate" class="form-control" style="width: 150px;" @change="selectGuardList">
                  </div>
                </div>

                <div class="col-auto ms-auto">
                  <button class="btn btn-secondary" @click="selectGuardList">
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
                  <label for="guardPageSize" class="form-label mb-0">페이지당</label>
                  <select
                      id="guardPageSize"
                      v-model.number="paginationPageSize"
                      class="form-select form-select-sm"
                      @change="onPageSizeChange"
                  >
                    <option v-for="size in pageSizeOptions" :key="size" :value="size">
                      {{ size }}개
                    </option>
                  </select>
                </div>
              </div>
              <ag-grid-vue
                  class="ag-theme-alpine guard-grid"
                  :modules="gridModules"
                  :columnDefs="columnDefs"
                  :rowData="guardList"
                  :defaultColDef="defaultColDef"
                  :enableCellTextSelection="true"
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
                  <button
                      type="button"
                      class="btn btn-sm btn-outline-secondary"
                      :disabled="currentPage === 1"
                      @click="goToPage(1)"
                  >
                    처음
                  </button>
                  <button
                      type="button"
                      class="btn btn-sm btn-outline-secondary"
                      :disabled="currentPage === 1"
                      @click="goToPage(currentPage - 1)"
                  >
                    이전
                  </button>
                  <button
                      v-for="page in paginationPages"
                      :key="page"
                      type="button"
                      class="btn btn-sm"
                      :class="page === currentPage ? 'btn-primary' : 'btn-outline-secondary'"
                      @click="goToPage(page)"
                  >
                    {{ page }}
                  </button>
                  <button
                      type="button"
                      class="btn btn-sm btn-outline-secondary"
                      :disabled="currentPage === totalPages"
                      @click="goToPage(currentPage + 1)"
                  >
                    다음
                  </button>
                  <button
                      type="button"
                      class="btn btn-sm btn-outline-secondary"
                      :disabled="currentPage === totalPages"
                      @click="goToPage(totalPages)"
                  >
                    마지막
                  </button>
                </div>
              </div>
              <p class="text-end">
                <button class="btn btn-primary mt-2 ms-1" @click="appendGuard">사용자 등록</button>
                <button class="btn btn-primary mt-2 ms-1" @click="allList">전체목록</button>
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
  name: "GuardManager",
  components: {
    AgGridVue,
  },
  data() {
    return {
      gridApi: null,
      gridModules: [ClientSideRowModelModule],
      guardList: [],
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
        guardName:'',
        guardPhone:'',
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
          headerName: "전화번호(ID)",
          valueGetter: params => this.getGuardValue(params.data, 1, ["GUARD_PHONE", "guardPhone"]),
          minWidth: 150,
          cellRenderer: this.guardPhoneRenderer,
        },
        {
          headerName: "사용자명",
          valueGetter: params => this.getGuardValue(params.data, 2, ["GUARD_NAME", "guardName"]),
          minWidth: 130,
        },
        {
          headerName: "이메일",
          valueGetter: params => this.getGuardValue(params.data, 3, ["EMAIL", "email"]),
          minWidth: 180,
          flex: 1,
        },
        {
          headerName: "사용자 유형",
          valueGetter: params => this.getGuardValue(params.data, 4, ["GUARD_TYPE", "guardType", "USER_TYPE", "userType"]),
          width: 130,
          valueFormatter: this.guardTypeFormatter,
        },
        {
          headerName: "연결 기기 수",
          valueGetter: params => this.getGuardValue(params.data, 5, ["DEVICE_COUNT", "deviceCount", "DEVICE_CNT", "deviceCnt"]),
          width: 130,
        },
        {
          headerName: "마지막 접속일",
          valueGetter: params => this.getGuardValue(params.data, 6, ["LAST_LOGIN_DATE", "lastLoginDate"]),
          width: 150,
          valueFormatter: this.dateValueFormatter,
        },
        {
          headerName: "계정상태",
          valueGetter: params => this.getGuardValue(params.data, 7, ["ACCOUNT_STATE", "accountState"]),
          width: 120,
          cellRenderer: this.accountStateRenderer,
        },
      ],
    }
  },
  computed: {
    paginationPages() {
      const pageCount = 10;
      const start = Math.floor((this.currentPage - 1) / pageCount) * pageCount + 1;
      const end = Math.min(start + pageCount - 1, this.totalPages);
      const pages = [];

      for(let page = start; page <= end; page += 1) {
        pages.push(page);
      }

      return pages;
    },
  },
  mounted() {
    this.selectGuardList();
  },
  methods: {
    openGuard(guardNo) {
      const url = `/guardPopup?guardNo=${guardNo}`;
      const name = "사용자 수정";
      const style = "width=700,height=500,left=0,top=0";
      this.$open(url, name, style);
    },
    appendGuard(){
      const url = '/guardPopup';
      const name = "사용자 추가";
      const style = "width=650,height=500,left=0,top=0";
      this.$open(url, name, style);
    },
    telForm(data) {
      return utils.telForm(data, 1);
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.updatePaginationState();
      if(this.guardList.length === 0) {
        this.gridApi.showNoRowsOverlay();
      }
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
      this.selectGuardList(false);
    },
    goToPage(page) {
      if(page < 1 || page > this.totalPages || page === this.currentPage) return;
      this.currentPage = page;
      this.selectGuardList(false);
    },
    noValueGetter(params) {
      return ((this.currentPage - 1) * this.paginationPageSize) + params.node.rowIndex + 1;
    },
    getGuardValue(row, index, keys) {
      if(Array.isArray(row)) return row[index];
      if(!row || typeof row !== "object") return "";

      const key = keys.find(item => row[item] !== undefined && row[item] !== null);
      return key ? row[key] : "";
    },
    toGuardRows(data) {
      if(Array.isArray(data)) return data;
      if(!data || typeof data !== "object") return [];

      const rowKeys = ["list", "rows", "items", "content", "guardList"];
      const rows = rowKeys.map(key => data[key]).find(Array.isArray);
      return rows || [];
    },
    guardPhoneRenderer(params) {
      const phone = params.value;
      if(utils.isEmpty(phone)) return "";

      const guardNo = this.getGuardValue(params.data, 0, ["GUARD_NO", "guardNo"]);
      const link = document.createElement("a");
      link.href = "#";
      link.className = "text-primary";
      link.textContent = this.telForm(phone) || phone;
      link.addEventListener("click", event => {
        event.preventDefault();
        this.openGuard(guardNo);
      });
      return link;
    },
    guardTypeFormatter(params) {
      if(utils.isEmpty(params.value)) return "-";

      const types = Array.isArray(params.value) ? params.value.map(String) : String(params.value).split(",");
      const result = [];
      if(types.includes("1")) result.push("대표");
      if(types.includes("2")) result.push("추가");
      return result.join(", ") || params.value;
    },
    dateValueFormatter(params) {
      if(utils.isEmpty(params.value)) return "-";
      const value = String(params.value);
      return value.length === 8 ? utils.dateForm(value) : utils.convertFromStrToDate(value);
    },
    accountStateRenderer(params) {
      const statusMap = {
        'N': '<span class="badge bg-success">정상</span>',
        'H': '<span class="badge bg-secondary">휴면</span>',
        'S': '<span class="badge bg-danger">정지(제재)</span>',
        'D': '<span class="badge bg-dark">탈퇴</span>',
      };
      return statusMap[params.value] || params.value || "";
    },
    async selectGuardList(resetPage = true) {
      if(resetPage) this.currentPage = 1;
      if(this.gridApi) this.gridApi.showLoadingOverlay();
      const param = {
        ...this.search,
        guardPhone: (this.search.guardPhone || "").replace(/-/g, ""),
        lastLoginDate: (this.search.lastLoginDate || "").replace(/-/g, ""),
        pageNum: this.currentPage,
        pageSize: this.paginationPageSize,
        pageStart: (this.currentPage - 1) * this.paginationPageSize,
      };
      try {
        const res = await api.selGuardianListByAdmin(param);
        if(res.data.status === "SUCCESS") {
          const data = res.data.data || {};
          this.guardList = this.toGuardRows(data);
          this.totalRows = data.totalCount || this.guardList.length;
          this.$nextTick(() => {
            this.updatePaginationState();
            if(this.gridApi && this.guardList.length === 0) {
              this.gridApi.showNoRowsOverlay();
            } else if(this.gridApi) {
              this.gridApi.hideOverlay();
            }
          });
        }
      } catch (e) {
        this.handleScopeError(e);
      }
    },

    async allList() {
      this.search.guardPhone = ""
      this.search.guardName = ""
      this.search.lastLoginDate = ""
      this.selectGuardList()
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
  }
}
</script>

<style scoped>
.guard-grid {
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
