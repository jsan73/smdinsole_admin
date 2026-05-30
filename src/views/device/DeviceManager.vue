<template>
  <main class="container-fluid">

    <h4 class="my-4 ps-3">
      <i class="bi bi-calendar2-check"></i> 기기 관리
      <small class="text-muted fs-6">기기 정보를 등록 및 수정 할 수 있습니다.</small>
      <div class="text-end" v-if="isDev()">
        <button class="btn btn-primary mt-2 ms-1" @click="gogo()">기기 데이터 분석</button>
      </div>

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
                    <input
                        v-model="search.deviceIMEI"
                        type="text"
                        id="IMEI"
                        class="form-control"
                        style="width: 180px;"
                        placeholder="IMEI 입력"
                        @keyup.enter="selectDeviceList"
                    >
                  </div>
<!--                  <div class="d-flex align-items-center">-->
<!--                    <label for="ICCID" class="fw-bold me-2" style="white-space: nowrap;">ICCID</label>-->
<!--                    <input-->
<!--                        v-model="search.iccId"-->
<!--                        type="text"-->
<!--                        id="ICCID"-->
<!--                        class="form-control"-->
<!--                        style="width: 180px;"-->
<!--                        placeholder=""-->
<!--                        @keyup.enter="selectDeviceList"-->
<!--                    >-->
<!--                  </div>-->
                  <div class="d-flex align-items-center">
                    <label for="phone" class="fw-bold me-2" style="white-space: nowrap;">사용자 전화번호0</label>
                    <input
                        v-model="search.guardPhone"
                        type="text"
                        id="phone"
                        class="form-control"
                        style="width: 160px;"
                        placeholder="번호 입력"
                        @keyup.enter="selectDeviceList"
                    >
                  </div>
                  <div class="d-flex align-items-center">
                    <label class="fw-bold me-2" style="white-space: nowrap;">만료일</label>
                    <div class="d-flex align-items-center gap-1">
                      <input v-model="search.expDateStart" type="date" class="form-control" style="width: 140px;" @change="selectDeviceList">
                      <span>~</span>
                      <input v-model="search.expDateEnd" type="date" class="form-control" style="width: 140px;" @change="selectDeviceList">
                    </div>
                  </div>

                  <div class="d-flex align-items-center">
                    <label class="fw-bold me-2" style="white-space: nowrap;">이심사용기한</label>
                    <div class="d-flex align-items-center gap-1">
                      <input v-model="search.esimExpDateStart" type="date" class="form-control" style="width: 140px;" @change="selectDeviceList">
                      <span>~</span>
                      <input v-model="search.esimExpDateEnd" type="date" class="form-control" style="width: 140px;" @change="selectDeviceList">
                    </div>
                  </div>
                  <div class="d-flex align-items-center">
                    <label for="group" class="fw-bold me-2" style="white-space: nowrap;">소속 기관</label>
                    <select
                        v-model="search.orgcNo"
                        id="group"
                        class="form-select"
                        style="width: 200px;"
                        @change="selectDeviceList"
                    >
                      <option value=""> - 선택 - </option>
                      <option v-for="(orgc, index) in orgcList" :key="index" :value="orgc.ORGC_NO">
                        {{orgc.ORGC_NAME}}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="col-auto ms-auto">
                  <button class="btn btn-secondary" @click="selectDeviceList">
                    <i class="bi bi-search"></i> 조회
                  </button>
                </div>

              </div>
            </div>
          </div>
          <!--/ 검색조건 -->
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
                  <label for="devicePageSize" class="form-label mb-0">페이지당</label>
                  <select
                      id="devicePageSize"
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
                  class="ag-theme-alpine device-grid"
                  :modules="gridModules"
                  :columnDefs="columnDefs"
                  :rowData="deviceList"
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
                <button class="btn btn-primary mt-2 ms-1" @click="popupFota">Fota view</button>
                <button class="btn btn-primary mt-2 ms-1" @click="downloadExcel">엑셀 다운</button>
                <button class="btn btn-primary mt-2 ms-1" @click="openExcelUpload">엑셀 업로드</button>
                <button class="btn btn-primary mt-2 ms-1" @click="addDevice">기기 등록</button>

              </p>
            </div>
          </div><!--// 목록 테이블 -->

        </div>
      </div>
    </section>

    <!-- 레이어 팝업 -->
    <div v-if="showPopup" class="popup-overlay" @click.self="closeExcelUpload">
      <div class="popup-content">
        <h3>엑셀 파일 업로드</h3>
        <input type="file" accept=".xls,.xlsx" @change="onFileChange" />
        <div class="btn-group">
          <button @click="uploadFile" :disabled="!selectedFile" class="upload-btn">업로드</button>
          <button @click="closeExcelUpload" class="cancel-btn">취소</button>
        </div>
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
  name: "DeviceManager",
  components: {
    AgGridVue,
  },
  data() {
    return {
      gridApi: null,
      gridModules: [ClientSideRowModelModule],
      deviceList: [],
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
      // data: {
      //   deviceIMEI:'',
      //   deviceNumber:'',
      //   guardPhone:'',
      //   orgNm:'',
      //   memberDate:'',
      //   expDate:'',
      //   lastSignal:'',
      //   locCnt:0
      // },
      search: {
        deviceIMEI:'',
        iccId:'',
        guardPhone:'',
        orgcNo:'',
        // 만료일 기간
        expDateStart: '',
        expDateEnd: '',
        // 이심사용기한 기간
        esimExpDateStart: '',
        esimExpDateEnd: ''
      },
      orgcList:'',
      columnDefs: [
        {
          headerName: "No",
          valueGetter: this.noValueGetter,
          width: 80,
          sortable: false,
        },
        {
          headerName: "IMEI",
          field: "DEVICE_IMEI",
          minWidth: 160,
          cellRenderer: this.deviceLinkRenderer,
        },
        {
          headerName: "기기 전화번호",
          field: "DEVICE_NUMBER",
          width: 150,
          valueFormatter: this.telValueFormatter,
        },
        { headerName: "요금제", field: "IOT_PLAN", width: 120 },
        {
          headerName: "사용자 전화번호0",
          field: "GUARD_PHONE",
          width: 160,
          valueFormatter: this.telValueFormatter,
        },
        { headerName: "소속 기관", field: "ORG_NAME", minWidth: 160, flex: 1 },
        {
          headerName: "만료일",
          field: "EXP_DATE",
          width: 130,
          valueFormatter: this.dateValueFormatter,
        },
        {
          headerName: "이심사용기한",
          field: "ESIM_EXP_DATE",
          width: 140,
          valueFormatter: this.dateValueFormatter,
        },
        { headerName: "사이즈", field: "DEVICE_SIZE", width: 100 },
        {
          headerName: "마지막 신호",
          field: "STATUS",
          width: 220,
          cellRenderer: this.lastSignalRenderer,
        },
        { headerName: "위치전송횟수", field: "LOC_CNT", width: 130 },
        {
          headerName: "상태",
          field: "ACTIVE_STATE",
          width: 110,
          cellRenderer: this.activeStateRenderer,
        },
      ],
      showPopup: false,
      selectedFile: null,
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

    this.applyRouteQuery();
    this.selectDeviceList();
    this.selectOrgcList();


  },
  watch: {
    "$route.query"() {
      this.applyRouteQuery();
      this.selectDeviceList();
    },
  },
  methods: {
    isDev() {
      console.log("process.env.VUE_APP_MODE",process.env.VUE_APP_MODE)
      if(process.env.VUE_APP_MODE === "dev" || process.env.VUE_APP_MODE === "local") {
        return true;
      }
      return false;
    },
    gogo() {
      this.$router.push('/devicelog')
    },
    applyRouteQuery() {
      const query = this.$route.query || {};
      ["expDateStart", "expDateEnd", "esimExpDateStart", "esimExpDateEnd"].forEach(key => {
        if(query[key] !== undefined) this.search[key] = String(query[key] || "");
      });
    },
    addDevice() {
      this.$open(
          "/devicepopup",
          "기기 등록",
          "width=650,height=670,left=0,top=0"
      );
    },
    popupFota() {
      this.$open(
          "/fotapopup",
          "Fota view",
          "width=650,height=430,left=0,top=0"
      );
    },
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
      if(this.deviceList.length === 0) {
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
      this.selectDeviceList(false);
    },
    goToPage(page) {
      if(page < 1 || page > this.totalPages || page === this.currentPage) return;
      this.currentPage = page;
      this.selectDeviceList(false);
    },
    noValueGetter(params) {
      return ((this.currentPage - 1) * this.paginationPageSize) + params.node.rowIndex + 1;
    },
    telValueFormatter(params) {
      return this.telForm(params.value);
    },
    dateValueFormatter(params) {
      return utils.isEmpty(params.value) ? "" : this.dateForm(params.value);
    },
    deviceLinkRenderer(params) {
      if(utils.isEmpty(params.value)) return "";
      return '<a class="text-primary" href="javascript:openPopup(\'/devicepopup?device=' + params.value + '\',\'기기 수정\',\'width=650,height=670,left=0,top=0\')">' + params.value + '</a>';
    },
    lastSignalRenderer(params) {
      return utils.isEmpty(params.value) ? "" : this.lastSignal(params.value);
    },
    activeStateRenderer(params) {
      const statusMap = {
        'N': '<span class="badge bg-success">미등록</span>',
        'V': '<span class="badge bg-secondary">인증완료</span>',
        'A': '<span class="badge bg-secondary">개통완료</span>',
        'E': '<span class="badge bg-secondary">만료</span>',
      };
      return statusMap[params.value] || params.value || "";
    },
    toDeviceRows(data) {
      if(Array.isArray(data)) return data;
      if(!data || typeof data !== "object") return [];

      const rowKeys = ["list", "rows", "items", "content", "deviceList"];
      const rows = rowKeys.map(key => data[key]).find(Array.isArray);
      return rows || [];
    },
    async selectDeviceList(resetPage = true) {
      if(resetPage) this.currentPage = 1;
      if(this.gridApi) this.gridApi.showLoadingOverlay();
      const param = {
        ...this.search,
        guardPhone: (this.search.guardPhone || "").replace(/-/g, ""),
        pageNum: this.currentPage,
        pageSize: this.paginationPageSize,
        pageStart: (this.currentPage - 1) * this.paginationPageSize,
      };
      const res = await api.selDeviceList(param);
      if(res.data.status === "SUCCESS") {
        const data = res.data.data || {};
        this.deviceList = this.toDeviceRows(data);
        this.totalRows = data.totalCount || this.deviceList.length;
        this.$nextTick(() => {
          this.updatePaginationState();
          if(this.gridApi && this.deviceList.length === 0) {
            this.gridApi.showNoRowsOverlay();
          } else if(this.gridApi) {
            this.gridApi.hideOverlay();
          }
        });
      }

    },


    downloadExcel() {
      const param = this.search;
      param.guardPhone = param.guardPhone.replaceAll("-","")
      api.downDeviceListExcel(param).then(res=>{
        let fileName = "기기리스트.xlsx"
        console.log(fileName)
        utils.fileDownload(res.data, fileName)
        // router.go(0)
      })


    },

    openExcelUpload() {
      this.showPopup = true;
      this.selectedFile = null;
    },
    closeExcelUpload() {
      this.showPopup = false;
      this.selectedFile = null;
    },
    onFileChange(e) {
      const file = e.target.files[0];
      this.selectedFile = file ? file : null;
    },
    uploadFile() {
      if (!this.selectedFile) {
        alert('엑셀 파일을 선택해주세요.');
        return;
      }
      const formData = new FormData();
      formData.append("file", this.selectedFile)
      api.uploadDeviceListExcel(formData).then(res=>{
          if(res.data.status === "SUCCESS") {
            // let row_count = res.data.data.rowNum;
            let resData = res.data.data;
            if(resData.checkValidation) {
              alert(`${res.data.data.rowNum}개 업로드 완료`);
              this.selectDeviceList();
            }else{
              alert(`${resData.rowNum} : ${resData.msg}`);
            }
          }
      })
      // 실제 업로드 로직 구현 부분
      // alert(`선택된 파일: ${this.selectedFile.name} 업로드 진행중...`);

      // 업로드 처리 후 팝업 닫기
      this.closeExcelUpload();
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
.upload-btn {
  background-color: #2979ff;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}
.upload-btn:disabled {
  background-color: #aacbff;
  cursor: not-allowed;
}
.upload-btn:hover:not(:disabled) {
  background-color: #0d47a1;
}
.cancel-btn {
  background-color: #ccc;
  border: none;
  padding: 10px 18px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
  font-size: 14px;
}
.cancel-btn:hover {
  background-color: #bbb;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.popup-content {
  background-color: white;
  padding: 20px 30px;
  border-radius: 8px;
  width: 420px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  text-align: center;
}

.btn-group {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.device-grid {
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

.grid-pagination-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 12px;
}

.grid-total-count {
  min-width: 90px;
  color: #495057;
  font-size: 14px;
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
