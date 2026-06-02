<template>
  <main class="container-fluid">

    <h4 class="my-4 ps-3">
      <i class="bi bi-calendar2-check"></i> 이벤트 기기
      <small class="text-muted fs-6">이상 이동, 안심존 이탈, 이상 전송이 발생된 기기 리스트 입니다.</small>

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
                    <label for="IMEI" class="fw-bold me-2" style="white-space: nowrap;">IMEI</label>
                    <input v-model="search.deviceIMEI" type="text" id="IMEI" class="form-control" style="width: 180px;" placeholder="IMEI 입력" @keyup.enter="selectEventDeviceList">
                  </div>
                  <div class="d-flex align-items-center">
                    <label for="ICCID" class="fw-bold me-2" style="white-space: nowrap;">ICCID</label>
                    <input v-model="search.iccId" type="text" id="ICCID" class="form-control" style="width: 220px;" placeholder="ICCID 입력" @keyup.enter="selectEventDeviceList">
                  </div>

                  <div class="d-flex align-items-center">
                    <label for="group" class="fw-bold me-2" style="white-space: nowrap;">소속 기관</label>
                    <select v-model="search.orgcNo" id="group" class="form-select" style="width: 200px;" @change="selectEventDeviceList">
                      <option value=""> - 선택 - </option>
                      <option v-for="(orgc, index) in orgcList" :key="index" :value="orgc.ORGC_NO">{{orgc.ORGC_NAME}}</option>
                    </select>
                  </div>
                </div>

                <div class="col-auto ms-auto">
                  <button class="btn btn-secondary" @click="selectEventDeviceList">
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
                  <label for="eventDevicePageSize" class="form-label mb-0">페이지당</label>
                  <select
                      id="eventDevicePageSize"
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
                  class="ag-theme-alpine event-device-grid"
                  :modules="gridModules"
                  :columnDefs="columnDefs"
                  :rowData="eventDeviceList"
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
<!--                <button class="btn btn-primary mt-2 ms-1" onclick="javascript:allList()">전체목록</button>-->
<!--                <button class="btn btn-primary mt-2 ms-1" onclick="javascript:openPopUp_addcsvDevice()">기기 일괄 등록</button>-->
<!--                <button class="btn btn-primary mt-2 ms-1" @click="addDevice">기기 등록</button>-->
              </p>
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
  name: "EventDeviceManager",
  components: {
    AgGridVue,
  },
  data() {
    return {
      gridApi: null,
      gridModules: [ClientSideRowModelModule],
      eventDeviceList: [],
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
        iccId:'',
        orgcNo:''
      },
      orgcList:'',
      columnDefs:[
        {
          headerName: "No",
          valueGetter: this.noValueGetter,
          width: 80,
          sortable: false,
        },
        {
          headerName: "IMEI",
          valueGetter: params => this.getEventDeviceValue(params.data, 1, ["DEVICE_IMEI", "deviceIMEI"]),
          minWidth: 160,
          cellRenderer: this.deviceLinkRenderer,
        },
        {
          headerName: "안심존 이탈",
          valueGetter: params => this.getEventDeviceValue(params.data, 2, ["DANGER_YN", "dangerYn", "SAFE_ZONE_EXIT", "safeZoneExit"]),
          width: 130,
        },
        {
          headerName: "이상 이동",
          valueGetter: params => this.getEventDeviceValue(params.data, 3, ["OUT_DISTANCE_YN", "outDistanceYn", "ABNORMAL_MOVE", "abnormalMove"]),
          width: 120,
        },
        {
          headerName: "이상 전송",
          valueGetter: params => this.getEventDeviceValue(params.data, 4, ["NEAR_SIGNAL_YN", "nearSignalYn", "ABNORMAL_SEND", "abnormalSend"]),
          width: 120,
        },
        {
          headerName: "기기 전화번호",
          valueGetter: params => this.getEventDeviceValue(params.data, 5, ["DEVICE_NUMBER", "deviceNumber"]),
          width: 150,
          valueFormatter: this.telValueFormatter,
        },
        {
          headerName: "ICCID",
          valueGetter: params => this.getEventDeviceValue(params.data, 6, ["ICC_ID", "iccId"]),
          minWidth: 160,
        },
        {
          headerName: "소속 기관",
          valueGetter: params => this.getEventDeviceValue(params.data, 7, ["ORG_NAME", "orgName"]),
          minWidth: 160,
          flex: 1,
        },
        {
          headerName: "가입일",
          valueGetter: params => this.getEventDeviceValue(params.data, 8, ["MEMBER_DATE", "memberDate"]),
          width: 130,
          valueFormatter: this.dateValueFormatter,
        },
        {
          headerName: "만료일",
          valueGetter: params => this.getEventDeviceValue(params.data, 9, ["EXP_DATE", "expDate"]),
          width: 130,
          valueFormatter: this.dateValueFormatter,
        },
        {
          headerName: "마지막 신호",
          valueGetter: params => this.getEventDeviceValue(params.data, 10, ["STATUS", "status"]),
          width: 220,
          cellRenderer: this.lastSignalRenderer,
        },
        {
          headerName: "위치전송횟수",
          valueGetter: params => this.getEventDeviceValue(params.data, 11, ["LOC_CNT", "locCnt"]),
          width: 130,
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

    this.selectEventDeviceList();
    this.selectOrgcList();


  },
  methods: {

    telForm(data) {
      return utils.telForm(data, 1);
    },
    dateForm(data) {
      return utils.convertFromStrToDate(data);
    },
    lastSignal(data) {
      // console.log(data);
      const signal = data.split(',')
      //console.log(signal[2]);
      var reportDate = signal[0];

      //(GPS:4, CELL:5, WIFI:6)
      var cell = "icon_none.svg";
      if(signal[1] !== undefined) {
        switch (signal[1]) {
          case '4':
            cell = "icon_GPS.svg";
            break;
          case '5':
            cell = "icon_Cell.svg";
            break;
          case '6':
            cell = "icon_WiFi.svg";
            break;
        }
      }
      var battery = "battery/0.svg";
      switch (signal[2]) {
        case '0':
          battery = "battery/Warn.svg";
          break;
        case '1':
        case '2':
        case '3':
          battery = "battery/" + signal[2] + ".svg";
          break;
        case '4':
          // 충전중
          battery = "battery/Chg.svg";
          break;
        case '5':
          // 충전완료
          battery = "battery/Complete.svg";
          break;
      }
      let date1 = utils.convertFromStrToDate(reportDate)
      let date2 = new Date()
      const diff = utils.getTimeDiff(date1, date2);
      if(diff > 90) {
        cell = "icon_none.svg";
        battery = "battery/0.svg"
      }

      return utils.convertFromStrToDate(reportDate) + ' <img src="/static/images/' + cell + '" alt="none" width="42" height="20">' +  ' <img src="/static/images/' + battery + '" alt="battery_charge" width="30">';
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.updatePaginationState();
      if(this.eventDeviceList.length === 0) {
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
      this.selectEventDeviceList(false);
    },
    goToPage(page) {
      if(page < 1 || page > this.totalPages || page === this.currentPage) return;
      this.currentPage = page;
      this.selectEventDeviceList(false);
    },
    noValueGetter(params) {
      return ((this.currentPage - 1) * this.paginationPageSize) + params.node.rowIndex + 1;
    },
    getEventDeviceValue(row, index, keys) {
      if(Array.isArray(row)) return row[index];
      if(!row || typeof row !== "object") return "";

      const key = keys.find(item => row[item] !== undefined && row[item] !== null);
      return key ? row[key] : "";
    },
    toEventDeviceRows(data) {
      if(Array.isArray(data)) return data;
      if(!data || typeof data !== "object") return [];

      const rowKeys = ["list", "rows", "items", "content", "eventDeviceList", "deviceList"];
      const rows = rowKeys.map(key => data[key]).find(Array.isArray);
      return rows || [];
    },
    telValueFormatter(params) {
      return this.telForm(params.value);
    },
    dateValueFormatter(params) {
      return utils.isEmpty(params.value) ? "" : this.dateForm(params.value);
    },
    deviceLinkRenderer(params) {
      if(utils.isEmpty(params.value)) return "";

      const link = document.createElement("a");
      link.href = "#";
      link.className = "text-primary";
      link.textContent = params.value;
      link.addEventListener("click", event => {
        event.preventDefault();
        this.$open(
            "/eventpopup?device=" + params.value,
            "기기 이벤트 리스트",
            "width=1000,height=580,left=0,top=0"
        );
      });
      return link;
    },
    lastSignalRenderer(params) {
      return utils.isEmpty(params.value) ? "" : this.lastSignal(params.value);
    },
    async selectEventDeviceList(resetPage = true) {
      if(resetPage) this.currentPage = 1;
      if(this.gridApi) this.gridApi.showLoadingOverlay();
      const param = {
        ...this.search,
        pageNum: this.currentPage,
        pageSize: this.paginationPageSize,
        pageStart: (this.currentPage - 1) * this.paginationPageSize,
      };
      const res = await api.selEventDeviceList(param);
      if(res.data.status === "SUCCESS") {
        const data = res.data.data || {};
        this.eventDeviceList = this.toEventDeviceRows(data);
        this.totalRows = data.totalCount || this.eventDeviceList.length;
        this.$nextTick(() => {
          this.updatePaginationState();
          if(this.gridApi && this.eventDeviceList.length === 0) {
            this.gridApi.showNoRowsOverlay();
          } else if(this.gridApi) {
            this.gridApi.hideOverlay();
          }
        });
      }

    },
    async selectOrgcList() {
      const param = {};
      const res = await api.selOrgcList(param);
      if(res.data.status === "SUCCESS") {
        this.orgcList = res.data.data;
      }

    },
  },
  created(){
    // 팝업창에서 selectDeviceList 를 호출하기 위한 설정
    window.vueComponent = this;
  }
}

</script>

<style scoped>
.event-device-grid {
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
