<template>
  <main class="container-fluid">
    <h4 class="my-4 ps-3">
      <i class="bi bi-journal-text"></i> 변경 이력
      <small class="text-muted fs-6">관리자 변경 로그를 조회하고 상세 내용을 확인할 수 있습니다.</small>
    </h4>

    <section class="section dashboard">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body pb-0">
              <div class="row my-3 align-items-center g-3">
                <div class="col-auto d-flex align-items-center">
                  <label class="fw-bold me-2 text-nowrap">기간</label>
                  <input v-model="startDate" type="date" class="form-control" style="width: 150px;">
                  <span class="px-2">~</span>
                  <input v-model="endDate" type="date" class="form-control" style="width: 150px;">
                </div>

                <div class="col-auto d-flex align-items-center">
                  <label class="fw-bold me-2 text-nowrap">사용자 유형</label>
                  <select v-model="search.userType" class="form-select" style="width: 140px;">
                    <option value="">전체</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="GUARD">GUARD</option>
                    <option value="ANONYMOUS">ANONYMOUS</option>
                  </select>
                </div>

                <div class="col-auto d-flex align-items-center">
                  <label class="fw-bold me-2 text-nowrap">사용자 ID</label>
                  <input v-model="search.userId" type="text" class="form-control" style="width: 180px;" @keyup.enter="searchList">
                </div>

                <div class="col-auto d-flex align-items-center">
                  <label class="fw-bold me-2 text-nowrap">변경 유형</label>
                  <select v-model="search.actionType" class="form-select" style="width: 130px;">
                    <option value="">전체</option>
                    <option value="INSERT">INSERT</option>
                    <option value="UPDATE">UPDATE</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>

                <div class="col-auto d-flex align-items-center">
                  <label class="fw-bold me-2 text-nowrap">대상 유형</label>
                  <select v-model="search.targetType" class="form-select" style="width: 150px;">
                    <option value="">전체</option>
                    <option value="DEVICE">DEVICE</option>
                    <option value="GUARDIAN">GUARDIAN</option>
                    <option value="FOTA">FOTA</option>
                    <option value="GUARD_INVITE">GUARD_INVITE</option>
                    <option value="MANAGER">MANAGER</option>
                  </select>
                </div>

                <div class="col-auto d-flex align-items-center">
                  <label class="fw-bold me-2 text-nowrap">성공 여부</label>
                  <select v-model="search.successYn" class="form-select" style="width: 100px;">
                    <option value="">전체</option>
                    <option value="Y">Y</option>
                    <option value="N">N</option>
                  </select>
                </div>

                <div class="col d-flex align-items-center">
                  <label class="fw-bold me-2 text-nowrap">URI</label>
                  <input v-model="search.requestUri" type="text" class="form-control" @keyup.enter="searchList">
                </div>

                <div class="col-auto ms-auto">
                  <button class="btn btn-secondary" @click="searchList">
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
          <div class="card dataTableStyle overflow-auto">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="text-muted">총 {{ totalCount }}건</div>
                <div class="d-flex align-items-center gap-2">
                  <label for="pageSize" class="mb-0">페이지당</label>
                  <select id="pageSize" v-model.number="paging.pageSize" class="form-select form-select-sm" style="width: 90px;" @change="changePageSize">
                    <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
                  </select>
                </div>
              </div>

              <ag-grid-vue
                  class="ag-theme-alpine change-log-grid"
                  :modules="gridModules"
                  :columnDefs="columnDefs"
                  :rowData="logList"
                  :defaultColDef="defaultColDef"
                  :suppressPaginationPanel="true"
                  :rowHeight="42"
                  :headerHeight="42"
                  :overlayNoRowsTemplate="overlayNoRowsTemplate"
                  :overlayLoadingTemplate="overlayLoadingTemplate"
                  @grid-ready="onGridReady"
                  @row-clicked="onRowClicked"
                  @sort-changed="onSortChanged"
              />

              <nav v-if="totalPages > 1" aria-label="변경 이력 페이지">
                <ul class="pagination justify-content-center mb-0">
                  <li class="page-item" :class="{ disabled: paging.pageNum === 1 }">
                    <button class="page-link" type="button" :disabled="paging.pageNum === 1" @click="goPage(1)">처음</button>
                  </li>
                  <li class="page-item" :class="{ disabled: paging.pageNum === 1 }">
                    <button class="page-link" type="button" :disabled="paging.pageNum === 1" @click="goPage(paging.pageNum - 1)">이전</button>
                  </li>
                  <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: page === paging.pageNum }">
                    <button class="page-link" type="button" @click="goPage(page)">{{ page }}</button>
                  </li>
                  <li class="page-item" :class="{ disabled: paging.pageNum === totalPages }">
                    <button class="page-link" type="button" :disabled="paging.pageNum === totalPages" @click="goPage(paging.pageNum + 1)">다음</button>
                  </li>
                  <li class="page-item" :class="{ disabled: paging.pageNum === totalPages }">
                    <button class="page-link" type="button" :disabled="paging.pageNum === totalPages" @click="goPage(totalPages)">마지막</button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div v-if="detailVisible" class="modal-backdrop-custom" @click.self="closeDetail">
      <div class="modal-panel">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="mb-0">변경 이력 상세</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeDetail"></button>
        </div>

        <div v-if="detail">
          <h6 class="fw-bold">기본 정보</h6>
          <table class="table table-sm">
            <tbody>
            <tr><th>Log Seq</th><td>{{ detail.logSeq }}</td><th>일시</th><td>{{ dateForm(detail.regDate) }}</td></tr>
            <tr><th>결과</th><td>{{ detail.successYn }}</td><th>오류</th><td>{{ detail.errorMessage || '-' }}</td></tr>
            <tr><th>사용자 유형</th><td>{{ detail.userType }}</td><th>사용자 ID</th><td>{{ detail.userId || '-' }}</td></tr>
            <tr><th>사용자 번호</th><td>{{ detail.userNo || '-' }}</td><th>IP</th><td>{{ detail.clientIp || '-' }}</td></tr>
            <tr><th>HTTP Method</th><td>{{ detail.httpMethod }}</td><th>대상</th><td>{{ detail.targetType }} / {{ detail.targetId }}</td></tr>
            <tr><th>URI</th><td colspan="3" class="text-break">{{ detail.requestUri }}</td></tr>
            <tr><th>Controller</th><td colspan="3" class="text-break">{{ detail.controllerName }}</td></tr>
            <tr><th>Method</th><td colspan="3">{{ detail.methodName }}</td></tr>
            <tr><th>User Agent</th><td colspan="3" class="text-break">{{ detail.userAgent || '-' }}</td></tr>
            </tbody>
          </table>

          <h6 class="fw-bold mt-3">요청 정보</h6>
          <pre class="payload-box">{{ formatJsonText(detail.requestData) }}</pre>

          <h6 class="fw-bold mt-3">변경 전</h6>
          <pre class="payload-box">{{ formatJsonText(detail.beforeData) }}</pre>

          <h6 class="fw-bold mt-3">변경 후</h6>
          <pre class="payload-box">{{ formatJsonText(detail.afterData) }}</pre>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import api from '@/api/api';
import utils from "@/utils/utils";
import { AgGridVue } from "@ag-grid-community/vue";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-alpine.css";

export default {
  name: "ChangeLog",
  components: {
    AgGridVue,
  },
  data() {
    return {
      gridApi: null,
      gridModules: [ClientSideRowModelModule],
      defaultColDef: {
        sortable: true,
        resizable: true,
        suppressMovable: true,
      },
      overlayNoRowsTemplate: '<span class="text-muted">조회된 데이터가 없습니다.</span>',
      overlayLoadingTemplate: '<div class="ag-overlay-loading-center" style="width: 220px;"><div class="mb-2 text-muted">조회 중...</div><div class="progress" style="height: 6px;"><div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%;"></div></div></div>',
      columnDefs: [
        {
          headerName: 'No',
          valueGetter: this.noValueGetter,
          width: 80,
          sortable: false,
        },
        {
          headerName: '일시',
          field: 'regDate',
          width: 150,
          valueFormatter: this.dateValueFormatter,
        },
        {
          headerName: '결과',
          field: 'successYn',
          width: 90,
          cellRenderer: this.successCellRenderer,
        },
        { headerName: '변경 유형', field: 'actionType', width: 120 },
        { headerName: '대상 유형', field: 'targetType', width: 130 },
        { headerName: '대상 ID', field: 'targetId', width: 110 },
        { headerName: '사용자 유형', field: 'userType', width: 120 },
        { headerName: '사용자 ID', field: 'userId', width: 160 },
        { headerName: 'Method', field: 'httpMethod', width: 100 },
        {
          headerName: 'URI',
          field: 'requestUri',
          minWidth: 260,
          flex: 1,
          tooltipField: 'requestUri',
        },
        { headerName: 'IP', field: 'clientIp', width: 130 },
        { headerName: '처리 메서드', field: 'methodName', width: 160 },
      ],
      search: {
        userType: '',
        userId: '',
        userNo: '',
        httpMethod: '',
        requestUri: '',
        actionType: '',
        targetType: '',
        targetId: '',
        successYn: '',
      },
      startDate: '',
      endDate: '',
      logList: [],
      totalCount: 0,
      pageSizeOptions: [10, 20, 50, 100],
      paging: {
        pageNum: 1,
        pageSize: 20,
      },
      sort: {
        column: '',
        direction: '',
      },
      detailVisible: false,
      detail: null,
    }
  },
  computed: {
    totalPages() {
      if(this.totalCount === 0) return 1;
      return Math.ceil(this.totalCount / this.paging.pageSize);
    },
    visiblePages() {
      const blockSize = 10;
      const start = Math.floor((this.paging.pageNum - 1) / blockSize) * blockSize + 1;
      const end = Math.min(start + blockSize - 1, this.totalPages);
      const pages = [];
      for(let page = start; page <= end; page++) {
        pages.push(page);
      }
      return pages;
    },
  },
  mounted() {
    this.initDates();
    this.selectChangeLogList();
    if(this.$route.query.logSeq) {
      this.openDetail(this.$route.query.logSeq);
    }
  },
  methods: {
    initDates() {
      const today = new Date();
      this.startDate = utils.getYmd10(today);
      this.endDate = utils.getYmd10(today);
    },
    buildParam() {
      return {
        ...this.search,
        userNo: this.search.userNo || null,
        startDate: this.startDate.replaceAll('-', '') + '000000',
        endDate: this.endDate.replaceAll('-', '') + '235959',
        pageNum: this.paging.pageNum,
        pageSize: this.paging.pageSize,
        pageStart: (this.paging.pageNum - 1) * this.paging.pageSize,
        sortColumn: this.sort.column,
        sortDirection: this.sort.direction,
      };
    },
    async selectChangeLogList(resetPage = false) {
      if(resetPage) {
        this.paging.pageNum = 1;
      }

      if(this.gridApi) this.gridApi.showLoadingOverlay();
      const res = await api.selChangeLogList(this.buildParam());
      if(res.data.status === "SUCCESS") {
        const data = res.data.data || {};
        this.logList = data.list || [];
        this.totalCount = data.totalCount || 0;
        this.$nextTick(() => {
          if(this.gridApi && this.logList.length === 0) {
            this.gridApi.showNoRowsOverlay();
          } else if(this.gridApi) {
            this.gridApi.hideOverlay();
          }
        });
      }
    },
    searchList() {
      this.selectChangeLogList(true);
    },
    goPage(pageNum) {
      if(pageNum < 1 || pageNum > this.totalPages || pageNum === this.paging.pageNum) return;
      this.paging.pageNum = pageNum;
      this.selectChangeLogList(false);
    },
    changePageSize() {
      this.selectChangeLogList(true);
    },
    onGridReady(params) {
      this.gridApi = params.api;
      if(this.logList.length === 0) {
        this.gridApi.showNoRowsOverlay();
      }
    },
    onRowClicked(params) {
      if(params.data && params.data.logSeq) {
        this.openDetail(params.data.logSeq);
      }
    },
    onSortChanged(params) {
      const sortColumn = params.columnApi.getColumnState().find(column => column.sort);
      if(sortColumn) {
        this.sort.column = sortColumn.colId;
        this.sort.direction = sortColumn.sort.toUpperCase();
      } else {
        this.sort.column = '';
        this.sort.direction = '';
      }
      this.selectChangeLogList(true);
    },
    async openDetail(logSeq) {
      const res = await api.getChangeLog(logSeq);
      if(res.data.status === "SUCCESS") {
        this.detail = res.data.data;
        this.detailVisible = true;
      }
    },
    closeDetail() {
      this.detailVisible = false;
      this.detail = null;
    },
    dateForm(data) {
      if(utils.isEmpty(data)) return "-";
      return utils.convertFromStrToDate(data);
    },
    successBadge(successYn) {
      if(successYn === "Y") return "badge bg-success";
      if(successYn === "N") return "badge bg-danger";
      return "badge bg-secondary";
    },
    noValueGetter(params) {
      return ((this.paging.pageNum - 1) * this.paging.pageSize) + params.node.rowIndex + 1;
    },
    dateValueFormatter(params) {
      return this.dateForm(params.value);
    },
    successCellRenderer(params) {
      const badgeClass = params.value === "Y" ? "badge bg-success" : params.value === "N" ? "badge bg-danger" : "badge bg-secondary";
      return '<span class="' + badgeClass + '">' + (params.value || '-') + '</span>';
    },
    formatJsonText(value) {
      if(utils.isEmpty(value)) return "-";
      try {
        return JSON.stringify(JSON.parse(value), null, 2);
      } catch (e) {
        return value;
      }
    },
  }
}
</script>

<style scoped>
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
  width: min(1120px, 100%);
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

.change-log-grid {
  width: 100%;
  height: 520px;
}

::v-deep .ag-row {
  cursor: pointer;
}
</style>
