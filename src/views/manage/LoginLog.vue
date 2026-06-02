<template>
  <main class="container-fluid">

    <h4 class="my-4 ps-3">
      <i class="bi bi-calendar2-check"></i> 접근 기록

    </h4>

    <section class="section dashboard">
      <div class="row">
        <div class="col-lg-12">
          <!-- 검색조건 -->
          <div class="card">
            <div class="card-body pb-0">
              <div class="row my-3 align-items-center">
                <div class="col d-flex flex-wrap gap-3">
                  <div class="btn-group" role="group" aria-label="접근 기록 유형">
                    <button type="button" class="btn btn-sm" :class="activeTab === 'LOGIN' ? 'btn-primary' : 'btn-outline-secondary'" @click="changeTab('LOGIN')">로그인/로그아웃</button>
                    <button type="button" class="btn btn-sm" :class="activeTab === 'ACCESS' ? 'btn-primary' : 'btn-outline-secondary'" @click="changeTab('ACCESS')">API 접근</button>
                  </div>
                  <div v-if="activeTab === 'LOGIN'" class="d-flex align-items-center">
                    <label for="mgrId" class="fw-bold me-2" style="white-space: nowrap;">대상 계정</label>
                    <input v-model="loginSearch.mgrId" type="text" id="mgrId" class="form-control" style="width: 180px;" placeholder="계정 입력" :readonly="!isSuperAdmin" @keyup.enter="searchLog">
                  </div>
                  <div v-if="activeTab === 'LOGIN'" class="d-flex align-items-center">
                    <label for="eventType" class="fw-bold me-2" style="white-space: nowrap;">구분</label>
                    <select id="eventType" v-model="loginSearch.eventType" class="form-select" style="width: 120px;" @change="searchLog">
                      <option value="">전체</option>
                      <option value="LOGIN">로그인</option>
                      <option value="LOGOUT">로그아웃</option>
                    </select>
                  </div>
                  <div v-if="activeTab === 'ACCESS' && isSuperAdmin" class="d-flex align-items-center">
                    <label for="userType" class="fw-bold me-2" style="white-space: nowrap;">사용자 유형</label>
                    <select id="userType" v-model="accessSearch.adminRoleType" class="form-select" style="width: 130px;" @change="searchLog">
                      <option value="">전체</option>
                      <option value="ADMIN">일반관리자</option>
                      <option value="SADMIN">슈퍼관리자</option>
                    </select>
                  </div>
                  <div v-if="activeTab === 'ACCESS'" class="d-flex align-items-center">
                    <label for="userId" class="fw-bold me-2" style="white-space: nowrap;">사용자 ID</label>
                    <input v-model="accessSearch.userId" type="text" id="userId" class="form-control" style="width: 180px;" placeholder="사용자 ID" :readonly="!isSuperAdmin" @keyup.enter="searchLog">
                  </div>
                  <div v-if="activeTab === 'ACCESS'" class="d-flex align-items-center">
                    <label for="requestUri" class="fw-bold me-2" style="white-space: nowrap;">URI</label>
                    <input v-model="accessSearch.requestUri" type="text" id="requestUri" class="form-control" style="width: 240px;" placeholder="URI 입력" @keyup.enter="searchLog">
                  </div>
                  <div v-if="activeTab === 'ACCESS'" class="d-flex align-items-center">
                    <label for="successYn" class="fw-bold me-2" style="white-space: nowrap;">성공 여부</label>
                    <select id="successYn" v-model="accessSearch.successYn" class="form-select" style="width: 100px;" @change="searchLog">
                      <option value="">전체</option>
                      <option value="Y">Y</option>
                      <option value="N">N</option>
                    </select>
                  </div>
                  <div class="d-flex align-items-center">
                    <label class="fw-bold me-2" style="white-space: nowrap;">날짜선택</label>
                    <div class="d-flex align-items-center gap-1">
                      <input type="date" class="form-control" style="width: 150px;" v-model="startDate" @change="searchLog">
                      <span>~</span>
                      <input type="date" class="form-control" style="width: 150px;" v-model="endDate" @change="searchLog">
                    </div>
                  </div>
                </div>

                <div class="col-auto ms-auto">
                  <button class="btn btn-secondary" @click="searchLog">
                    <i class="bi bi-search"></i> 조회
                  </button>
                </div>
              </div>
            </div>
          </div><!--/ 검색조건 -->
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <!-- 목록 테이블 -->
          <div class="card dataTableStyle overflow-auto">
            <div class="card-body">
              <!-- <p>Add lightweight datatables to your project with using the <a href="https://github.com/fiduswriter/Simple-DataTables" target="_blank">Simple
                              DataTables</a> library. Just add <code>.datatable</code> class name to any table you wish to conver to a datatable</p> -->

              <div class="grid-toolbar">
                <div class="grid-total-count">총 {{ totalRows }}건</div>
                <div class="grid-page-size">
                  <label for="loginLogPageSize" class="form-label mb-0">페이지당</label>
                  <select id="loginLogPageSize" v-model.number="paginationPageSize" class="form-select form-select-sm" @change="onPageSizeChange">
                    <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}개</option>
                  </select>
                </div>
              </div>
              <ag-grid-vue
                  class="ag-theme-alpine common-grid"
                  :modules="gridModules"
                  :columnDefs="activeColumnDefs"
                  :rowData="logList"
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
                  @row-clicked="onRowClicked"
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
            </div>
          </div><!--// 목록 테이블 -->

        </div>
      </div>


    </section>

    <div v-if="accessDetailVisible" class="modal-backdrop-custom" @click.self="closeAccessDetail">
      <div class="modal-panel">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="mb-0">API 접근 기록 상세</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeAccessDetail"></button>
        </div>
        <table v-if="accessDetail" class="table table-sm">
          <tbody>
          <tr><th>Seq</th><td>{{ accessDetail.accessLogSeq }}</td><th>일시</th><td>{{ dateForm(accessDetail.regDate) }}</td></tr>
          <tr><th>사용자</th><td>{{ accessDetail.userType }} / {{ accessDetail.userId || '-' }}</td><th>IP</th><td>{{ accessDetail.clientIp || '-' }}</td></tr>
          <tr><th>Method</th><td>{{ accessDetail.httpMethod }}</td><th>Status</th><td>{{ accessDetail.statusCode }}</td></tr>
          <tr><th>URI</th><td colspan="3" class="text-break">{{ accessDetail.requestUri }}</td></tr>
          <tr><th>Query</th><td colspan="3" class="text-break">{{ accessDetail.queryString || '-' }}</td></tr>
          <tr><th>User-Agent</th><td colspan="3" class="text-break">{{ accessDetail.userAgent || '-' }}</td></tr>
          <tr><th>오류</th><td colspan="3" class="text-break">{{ accessDetail.errorMessage || '-' }}</td></tr>
          </tbody>
        </table>
        <h6 class="fw-bold">요청 데이터</h6>
        <pre class="payload-box">{{ formatJsonText(accessDetail && accessDetail.requestData) }}</pre>
      </div>
    </div>



  </main><!--// 컨텐츠 영역 -->
</template>

<script>
import api from '@/api/api';
import utils from "@/utils/utils";
import { AgGridVue } from "@ag-grid-community/vue";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-alpine.css";

export default {
  name: "LoginLog",
  components: {
    AgGridVue,
  },
  data() {
    return {
      gridApi: null,
      gridModules: [ClientSideRowModelModule],
      logList: [],
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
      activeTab: 'LOGIN',
      loginSearch: {
        mgrId:'',
        eventType:'',
        sdate:'',
        edate:''
      },
      accessSearch: {
        adminRoleType: '',
        userId: '',
        requestUri: '',
        successYn: '',
        statusCode: '',
        changeLogSeq: '',
      },
      startDate:'',
      endDate:'',

      loginColumnDefs:[
        { headerName: "No", valueGetter: this.noValueGetter, width: 80, sortable: false },
        { headerName: "일시", valueGetter: params => this.getLogValue(params.data, 3, ["REG_DATE", "regDate", "LOGIN_DATE", "loginDate"]), width: 170, valueFormatter: this.dateValueFormatter },
        { headerName: "계정", valueGetter: params => this.getLogValue(params.data, 1, ["MGR_ID", "mgrId"]), minWidth: 180 },
        { headerName: "구분", valueGetter: params => this.getLogValue(params.data, 4, ["EVENT_TYPE", "eventType"]), width: 120, cellRenderer: this.eventTypeRenderer },
        { headerName: "결과", valueGetter: params => this.getLogValue(params.data, 5, ["IS_SUCCESS", "isSuccess", "SUCCESS_YN", "successYn"]), width: 100, cellRenderer: this.successRenderer },
        { headerName: "실패 사유", valueGetter: params => this.getLogValue(params.data, 6, ["FAIL_REASON", "failReason"]), minWidth: 180, flex: 1 },
        { headerName: "IP", valueGetter: params => this.getLogValue(params.data, 2, ["MGR_IP", "mgrIp", "LOGIN_IP", "loginIp", "IP", "ip"]), minWidth: 140 },
        { headerName: "User-Agent", valueGetter: params => this.getLogValue(params.data, 7, ["USER_AGENT", "userAgent"]), minWidth: 220 },
      ],
      accessColumnDefs: [
        { headerName: "No", valueGetter: this.noValueGetter, width: 80, sortable: false },
        { headerName: "일시", field: "regDate", width: 170, valueFormatter: this.dateValueFormatter },
        { headerName: "사용자 유형", field: "userType", width: 120 },
        { headerName: "사용자 ID", field: "userId", width: 170 },
        { headerName: "Method", field: "httpMethod", width: 100 },
        { headerName: "URI", field: "requestUri", minWidth: 260, flex: 1, tooltipField: "requestUri" },
        { headerName: "Status", field: "statusCode", width: 100 },
        { headerName: "성공", field: "successYn", width: 90, cellRenderer: this.successRenderer },
        { headerName: "처리시간(ms)", field: "elapsedMs", width: 130 },
        { headerName: "IP", field: "clientIp", width: 140 },
        { headerName: "변경이력", field: "changeLogSeq", width: 120, cellRenderer: this.changeLogRenderer },
      ],
      accessDetailVisible: false,
      accessDetail: null,

    }
  },
  computed: {
    isSuperAdmin() {
      return this.$store.getters['adminStore/isSuperAdmin'] === true;
    },
    loginId() {
      return this.$store.getters['adminStore/getLoginId'] || "";
    },
    activeColumnDefs() {
      return this.activeTab === 'LOGIN' ? this.loginColumnDefs : this.accessColumnDefs;
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
    this.calcPeriod();
    this.applyRoleScope();
    this.searchLog();

  },
  methods: {
    calcPeriod() {
      let today = new Date();
      this.startDate = utils.getYmd10(today);
      this.endDate = utils.getYmd10(today);
    },
    changeTab(tab) {
      if(this.activeTab === tab) return;
      this.activeTab = tab;
      this.logList = [];
      this.currentPage = 1;
      this.applyRoleScope();
      this.searchLog();
    },
    applyRoleScope() {
      if(this.isSuperAdmin) return;
      this.loginSearch.mgrId = this.loginId;
      this.accessSearch.userId = this.loginId;
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.updatePaginationState();
      if(this.logList.length === 0) this.gridApi.showNoRowsOverlay();
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
      this.searchLog();
    },
    goToPage(page) {
      if(page < 1 || page > this.totalPages || page === this.currentPage) return;
      this.currentPage = page;
      this.searchLog();
    },
    noValueGetter(params) {
      return ((this.currentPage - 1) * this.paginationPageSize) + params.node.rowIndex + 1;
    },
    getLogValue(row, index, keys) {
      if(Array.isArray(row)) return row[index];
      if(!row || typeof row !== "object") return "";
      const key = keys.find(item => row[item] !== undefined && row[item] !== null);
      return key ? row[key] : "";
    },
    toLogRows(data) {
      if(Array.isArray(data)) return data;
      if(!data || typeof data !== "object") return [];
      const rowKeys = ["list", "rows", "items", "content", "logList"];
      const rows = rowKeys.map(key => data[key]).find(Array.isArray);
      return rows || [];
    },
    dateValueFormatter(params) {
      return this.dateForm(params.value);
    },
    dateForm(value) {
      return utils.isEmpty(value) ? "-" : utils.convertFromStrToDate(String(value));
    },
    successRenderer(params) {
      const value = params.value;
      if(value === "Y" || value === true || value === "SUCCESS") return '<span class="badge bg-success">성공</span>';
      if(value === "N" || value === false || value === "FAIL") return '<span class="badge bg-danger">실패</span>';
      return value || "-";
    },
    eventTypeRenderer(params) {
      if(params.value === "LOGIN") return '<span class="badge bg-primary">로그인</span>';
      if(params.value === "LOGOUT") return '<span class="badge bg-secondary">로그아웃</span>';
      return params.value || "-";
    },
    changeLogRenderer(params) {
      if(utils.isEmpty(params.value)) return "";
      const link = document.createElement("a");
      link.href = "#";
      link.className = "text-primary";
      link.textContent = params.value;
      link.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        this.$router.push(`/changelog?logSeq=${params.value}`);
      });
      return link;
    },
    buildParam() {
      this.applyRoleScope();
      const base = {
        sdate: this.startDate.replaceAll('-','') + "000000",
        edate: this.endDate.replaceAll('-','') + "999999",
        pageNum: this.currentPage,
        pageSize: this.paginationPageSize,
        pageStart: (this.currentPage - 1) * this.paginationPageSize,
        sortColumn: "",
        sortDirection: "",
      };
      return this.activeTab === 'LOGIN'
          ? { ...this.loginSearch, ...base }
          : { ...this.accessSearch, ...base };
    },
    async onRowClicked(params) {
      if(this.activeTab !== 'ACCESS' || !params.data?.accessLogSeq) return;
      try {
        const res = await api.getAccessLog(params.data.accessLogSeq);
        if(res.data.status === "SUCCESS") {
          this.accessDetail = res.data.data;
          this.accessDetailVisible = true;
        }
      } catch (e) {
        const status = e?.response?.status;
        if(status === 403 || status === 401) alert("관리 권한 범위 밖의 요청입니다.");
        else alert(e?.response?.data?.message || "상세 조회 중 오류가 발생했습니다.");
      }
    },
    closeAccessDetail() {
      this.accessDetailVisible = false;
      this.accessDetail = null;
    },
    formatJsonText(value) {
      if(utils.isEmpty(value)) return "-";
      try {
        return JSON.stringify(JSON.parse(value), null, 2);
      } catch (e) {
        return value;
      }
    },
    async searchLog() {
      this.applyRoleScope();
      if(this.gridApi) this.gridApi.showLoadingOverlay();
      try {
        const res = this.activeTab === 'LOGIN'
            ? await api.selLoginLog(this.buildParam())
            : await api.selAccessLogList(this.buildParam());
        if(res.data.status === "SUCCESS") {
          const data = res.data.data || {};
          this.logList = this.toLogRows(data);
          this.totalRows = data.totalCount || this.logList.length;
          this.$nextTick(() => {
            this.updatePaginationState();
            if(this.gridApi && this.logList.length === 0) this.gridApi.showNoRowsOverlay();
            else if(this.gridApi) this.gridApi.hideOverlay();
          });
        }
      } catch (e) {
        if(this.gridApi) this.gridApi.showNoRowsOverlay();
        const status = e?.response?.status;
        if(status === 403 || status === 401) alert("관리 권한 범위 밖의 요청입니다.");
        else alert(e?.response?.data?.message || "조회 중 오류가 발생했습니다.");
      }

    },

  },
  created(){
    // 팝업창에서 selectDeviceList 를 호출하기 위한 설정
    // window.vueComponent = this;
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

.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 24px;
}

.modal-panel {
  background: #fff;
  width: min(980px, 100%);
  max-height: 90vh;
  overflow: auto;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.payload-box {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 12px;
  max-height: 240px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 12px;
}
</style>
