<template>
  <main class="container-fluid">

    <h4 class="my-4 ps-3">
      <i class="bi bi-calendar2-check"></i> 사물위치정보 수집사실 확인자료

    </h4>

    <section class="section dashboard">
      <div class="row">
        <div class="col-lg-12">
          <!-- 검색조건 -->
          <div class="card">
            <div class="card-body pb-0">
              <div class="row my-3 align-items-center">
                <div class="col d-flex flex-wrap gap-3">
                  <div class="d-flex align-items-center">
                    <label for="IMEI" class="fw-bold me-2" style="white-space: nowrap;">대상 IMEI</label>
                    <input v-model="search.deviceIMEI" type="text" id="IMEI" class="form-control" style="width: 180px;" placeholder="IMEI 입력" @keyup.enter="searchLog">
                  </div>
                  <div class="d-flex align-items-center">
                    <label for="reqService" class="fw-bold me-2" style="white-space: nowrap;">요청 서비스</label>
                    <input v-model="search.reqService" type="text" id="reqService" class="form-control" style="width: 180px;" placeholder="서비스 입력" @keyup.enter="searchLog">
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
                  <label for="locationLogPageSize" class="form-label mb-0">페이지당</label>
                  <select id="locationLogPageSize" v-model.number="paginationPageSize" class="form-select form-select-sm" @change="onPageSizeChange">
                    <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}개</option>
                  </select>
                </div>
              </div>
              <ag-grid-vue
                  class="ag-theme-alpine common-grid"
                  :modules="gridModules"
                  :columnDefs="columnDefs"
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
  name: "LocationLog",
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
      search: {
        deviceIMEI:'',
        reqService:'',
        sdate:'',
        edate:''
      },
      startDate:'',
      endDate:'',

      columnDefs:[
        { headerName: "No", valueGetter: this.noValueGetter, width: 80, sortable: false },
        { headerName: "대상 기기", valueGetter: params => this.getLogValue(params.data, 1, ["DEVICE_IMEI", "deviceIMEI"]), minWidth: 150 },
        { headerName: "요청 서비스", valueGetter: params => this.getLogValue(params.data, 2, ["REQ_SERVICE", "reqService"]), minWidth: 140 },
        { headerName: "요청자", valueGetter: params => this.getLogValue(params.data, 3, ["REQ_USER", "reqUser", "REQUESTER", "requester"]), minWidth: 120 },
        { headerName: "수집 방법", valueGetter: params => this.getLogValue(params.data, 4, ["COLLECT_METHOD", "collectMethod"]), minWidth: 120 },
        { headerName: "수집 요청 시간", valueGetter: params => this.getLogValue(params.data, 5, ["REQ_DATE", "reqDate", "START_DATE", "startDate"]), width: 170, valueFormatter: this.dateValueFormatter },
        { headerName: "수집 종료 시간", valueGetter: params => this.getLogValue(params.data, 6, ["END_DATE", "endDate"]), width: 170, valueFormatter: this.dateValueFormatter },
      ],

    }
  },
  computed: {
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
    this.searchLog();

  },
  methods: {
    calcPeriod() {
      let today = new Date();
      this.startDate = utils.getYmd10(today);
      this.endDate = utils.getYmd10(today);
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
      this.searchLog(false);
    },
    goToPage(page) {
      if(page < 1 || page > this.totalPages || page === this.currentPage) return;
      this.currentPage = page;
      this.searchLog(false);
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
      return utils.isEmpty(params.value) ? "" : utils.convertFromStrToDate(String(params.value));
    },
    async searchLog(resetPage = true) {
      if(resetPage) this.currentPage = 1;
      if(this.gridApi) this.gridApi.showLoadingOverlay();
      const param = {
        ...this.search,
        sdate: this.startDate.replaceAll('-','') + "000000",
        edate: this.endDate.replaceAll('-','') + "999999",
        pageNum: this.currentPage,
        pageSize: this.paginationPageSize,
        pageStart: (this.currentPage - 1) * this.paginationPageSize,
      };
      try {
        const res = await api.selLocationLog(param);
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
        this.handleScopeError(e);
      }

    },
    handleScopeError(e) {
      if(this.gridApi) this.gridApi.showNoRowsOverlay();
      const status = e?.response?.status;
      if(status === 403 || status === 401) {
        alert("관리 권한 범위 밖의 요청입니다.");
        return;
      }
      alert(e?.response?.data?.message || "조회 중 오류가 발생했습니다.");
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
</style>
