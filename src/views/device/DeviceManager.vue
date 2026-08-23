<template>
  <main class="container-fluid">

    <h4 class="my-4 ps-3">
      <i class="bi bi-calendar2-check"></i> 기기 관리
      <small class="text-muted fs-6">기기 정보를 등록 및 수정 할 수 있습니다.</small>
      <span class="badge bg-secondary ms-2">기존 등록·엑셀 기능 LEGACY</span>
      <div class="text-end" v-if="isDev()">
        <button class="btn btn-primary mt-2 ms-1" @click="gogo()">기기 데이터 분석</button>
      </div>

    </h4>

    <section class="section dashboard">
      <div class="row">
        <div class="col-lg-12">
          <!-- 검색조건 -->
          <div class="card compact-search">
            <div class="card-body pb-0">
              <div class="row my-3 align-items-center">
                <div class="col d-flex flex-wrap gap-3">

                  <div class="d-flex align-items-center">
                    <label for="deviceKeyword" class="fw-bold me-2" style="white-space: nowrap;">통합 검색</label>
                    <input
                        v-model.trim="search.deviceKeyword"
                        type="text"
                        id="deviceKeyword"
                        class="form-control"
                        style="width: 240px;"
                        placeholder="IMEI / 시리얼 / Device Hash"
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
                        style="width: 128px;"
                        placeholder="번호 입력"
                        @keyup.enter="selectDeviceList"
                    >
                  </div>
                  <div class="d-flex align-items-center">
                    <label class="fw-bold me-2" style="white-space: nowrap;">만료일</label>
                    <div class="d-flex align-items-center gap-1">
                      <input v-model="search.expDateStart" type="date" class="form-control" style="width: 112px;" @change="scheduleDeviceList">
                      <span>~</span>
                      <input v-model="search.expDateEnd" type="date" class="form-control" style="width: 112px;" @change="scheduleDeviceList">
                    </div>
                  </div>

                  <div class="d-flex align-items-center">
                    <label class="fw-bold me-2" style="white-space: nowrap;">이심사용기한</label>
                    <div class="d-flex align-items-center gap-1">
                      <input v-model="search.esimExpDateStart" type="date" class="form-control" style="width: 112px;" @change="scheduleDeviceList">
                      <span>~</span>
                      <input v-model="search.esimExpDateEnd" type="date" class="form-control" style="width: 112px;" @change="scheduleDeviceList">
                    </div>
                  </div>
                  <div v-if="isSuperAdmin" class="d-flex align-items-center">
                    <label for="group" class="fw-bold me-2" style="white-space: nowrap;">소속 기관</label>
                    <select
                        v-model="search.orgcNo"
                        id="group"
                        class="form-select"
                        style="width: 160px;"
                        @change="scheduleDeviceList"
                    >
                      <option value=""> - 선택 - </option>
                      <option v-for="(orgc, index) in orgcList" :key="index" :value="orgc.ORGC_NO">
                        {{orgc.ORGC_NAME}}
                      </option>
                    </select>
                  </div>
                  <div class="d-flex align-items-center">
                    <label for="activeState" class="fw-bold me-2" style="white-space: nowrap;">상태</label>
                    <select
                        v-model="search.activeState"
                        id="activeState"
                        class="form-select"
                        style="width: 96px;"
                        @change="scheduleDeviceList"
                    >
                      <option value="">전체</option>
                      <option v-for="option in activeStateOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
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
                  :enableCellTextSelection="true"
                  rowSelection="multiple"
                  :suppressRowClickSelection="true"
                  :rowMultiSelectWithClick="true"
                  :isRowSelectable="isProtocolDeviceRow"
                  :pagination="false"
                  :paginationPageSize="paginationPageSize"
                  :suppressPaginationPanel="true"
                  :rowHeight="34"
                  :headerHeight="36"
                  :overlayNoRowsTemplate="overlayNoRowsTemplate"
                  :overlayLoadingTemplate="overlayLoadingTemplate"
                  @grid-ready="onGridReady"
                  @pagination-changed="onPaginationChanged"
                  @selection-changed="onSelectionChanged"
              />
              <div class="grid-pagination-footer">
                <div class="grid-pagination-balance" aria-hidden="true"></div>
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
                <div class="grid-pagination-actions">
                  <button v-if="hasAdminRole" class="btn btn-primary mt-2 ms-1" @click="popupFota">
                    펌웨어/FOTA 관리<span v-if="selectedDeviceCount > 0"> ({{ selectedDeviceCount }})</span>
                  </button>
                  <button class="btn btn-primary mt-2 ms-1" @click="downloadExcel">엑셀 다운</button>
                  <button v-if="isSuperAdmin" class="btn btn-primary mt-2 ms-1" @click="openExcelUpload">엑셀 업로드</button>
                  <button v-if="isSuperAdmin" class="btn btn-primary mt-2 ms-1" @click="addDevice">기기 등록</button>

                </div>
              </div>
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
      selectedDeviceCount: 0,
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
        deviceKeyword:'',
        iccId:'',
        guardPhone:'',
        orgcNo:'',
        // 만료일 기간
        expDateStart: '',
        expDateEnd: '',
        // 이심사용기한 기간
        esimExpDateStart: '',
        esimExpDateEnd: '',
        activeState: '',
      },
      orgcList:'',
      activeStateOptions: [
        { value: 'N', label: '미등록', className: 'bg-success' },
        { value: 'R', label: '대기', className: 'bg-info text-dark' },
        { value: 'P', label: '등록중', className: 'bg-warning text-dark' },
        { value: 'A', label: '사용중', className: 'bg-primary' },
        { value: 'L', label: '분실', className: 'bg-danger' },
        { value: 'E', label: '만료', className: 'bg-secondary' },
        { value: 'D', label: '폐기', className: 'bg-dark' },
      ],
      columnDefs: [
        {
          headerName: "No",
          valueGetter: this.noValueGetter,
          width: 88,
          sortable: false,
          checkboxSelection: true,
          headerCheckboxSelection: true,
        },
        {
          headerName: "IMEI",
          field: "DEVICE_IMEI",
          width: 150,
          cellRenderer: this.deviceLinkRenderer,
        },
        {
          headerName: "시리얼 번호",
          valueGetter: this.serialNumberValueGetter,
          width: 150,
        },
        {
          headerName: "Device Hash",
          valueGetter: this.deviceHashValueGetter,
          width: 150,
          cellRenderer: this.deviceHashLinkRenderer,
        },
        {
          headerName: "라이프사이클",
          valueGetter: this.deviceLifecycleValueGetter,
          width: 140,
          cellRenderer: this.deviceLifecycleRenderer,
        },
        {
          headerName: "기기 전화번호",
          field: "DEVICE_NUMBER",
          width: 131,
          valueFormatter: this.telValueFormatter,
        },
        { headerName: "요금제", field: "IOT_PLAN", width: 94 },
        {
          headerName: "사용자 전화번호0",
          field: "GUARD_PHONE",
          width: 140,
          valueFormatter: this.telValueFormatter,
        },
        { headerName: "소속 기관", field: "ORG_NAME", minWidth: 110, flex: 1 },
        {
          headerName: "만료일",
          field: "EXP_DATE",
          width: 110,
          valueFormatter: this.dateValueFormatter,
        },
        {
          headerName: "이심사용기한",
          field: "ESIM_EXP_DATE",
          width: 125,
          valueFormatter: this.dateValueFormatter,
        },
        { headerName: "사이즈", field: "DEVICE_SIZE", width: 80 },
        {
          headerName: "마지막 신호",
          field: "STATUS",
          width: 250,
          cellRenderer: this.lastSignalRenderer,
        },
        { headerName: "위치전송횟수", field: "LOC_CNT", width: 110 },
        {
          headerName: "상태",
          field: "ACTIVE_STATE",
          width: 95,
          cellRenderer: this.activeStateRenderer,
        },
        {
          headerName: "펌웨어",
          valueGetter: this.firmwareValueGetter,
          width: 105,
          cellRenderer: this.firmwareLinkRenderer,
        },
      ],
      showPopup: false,
      selectedFile: null,
    }
  },
  computed: {
    isSuperAdmin() {
      return this.$store.getters['adminStore/isSuperAdmin'] === true;
    },
    hasAdminRole() {
      return this.$store.getters['adminStore/hasAnyAdminRole'] === true;
    },
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
    if(this.isSuperAdmin) this.selectOrgcList();
    window.addEventListener("message", this.onLifecycleChanged);


  },
  beforeDestroy() {
    if(this._deviceFilterTimer) {
      clearTimeout(this._deviceFilterTimer);
      this._deviceFilterTimer = null;
    }
    this._listRequestSequence += 1;
    window.removeEventListener("message", this.onLifecycleChanged);
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
    scheduleDeviceList() {
      this._listRequestSequence += 1;
      if(this._deviceFilterTimer) clearTimeout(this._deviceFilterTimer);
      this._deviceFilterTimer = setTimeout(() => {
        this._deviceFilterTimer = null;
        this.selectDeviceList();
      }, 300);
    },
    applyRouteQuery() {
      const query = this.$route.query || {};
      ["expDateStart", "expDateEnd", "esimExpDateStart", "esimExpDateEnd", "activeState"].forEach(key => {
        if(query[key] !== undefined) this.search[key] = String(query[key] || "");
      });
    },
    addDevice() {
      if(!this.isSuperAdmin) {
        alert("대표 관리자만 수행할 수 있습니다.");
        return;
      }
      this.$open(
          "/devicepopup",
          "기기 등록",
          "width=620,height=650,left=0,top=0"
      );
    },
    popupFota() {
      if(!this.hasAdminRole) {
        alert("관리자만 수행할 수 있습니다.");
        return;
      }
      const deviceHashes = this.gridApi
          ? this.gridApi.getSelectedRows()
              .map(row => this.getDeviceValue(row, ["deviceHash", "DEVICE_HASH"]))
              .filter(Boolean)
          : [];
      const url = deviceHashes.length
          ? "/fotapopup?deviceHashes=" + encodeURIComponent(deviceHashes.join(","))
          : "/fotapopup";
      this.$open(url, "펌웨어/FOTA 관리", "width=820,height=740,left=0,top=0");
    },
    telForm(data) {
      return utils.telForm(data, 1);
    },
    dateForm(data) {
      return utils.convertFromStrToDate(data);
    },
    hasLastSignalValue(value) {
      return value !== null && value !== undefined && value !== "";
    },
    lastSignalParts(data) {
      const packed = this.getDeviceValue(data, ["STATUS"]);
      return typeof packed === "string" ? packed.split(",") : [];
    },
    lastSignalSource(sourceType, legacyStatus) {
      if(this.hasLastSignalValue(sourceType)) {
        const code = String(sourceType).toUpperCase();
        const sourceMap = {
          GPS: { code: "GPS", icon: "icon_GPS.svg" },
          WPS: { code: "WPS", icon: "icon_WiFi.svg" },
          CELL: { code: "CELL", icon: "icon_Cell.svg" },
          NONE: { code: "NONE", icon: "icon_none.svg" },
        };
        return sourceMap[code] || { code, icon: "icon_none.svg" };
      }

      const legacyMap = {
        "4": { code: "GPS", icon: "icon_GPS.svg" },
        "5": { code: "CELL", icon: "icon_Cell.svg" },
        "6": { code: "WPS", icon: "icon_WiFi.svg" },
        "7": { code: "NONE", icon: "icon_none.svg" },
      };
      return legacyMap[String(legacyStatus)] || { code: "NONE", icon: "icon_none.svg" };
    },
    lastSignalBatteryIcon(batteryPct, charging, legacyBattery) {
      if(charging === true) return "battery/Chg.svg";
      if(this.hasLastSignalValue(batteryPct)) {
        const percent = Number(batteryPct);
        if(percent >= 100) return "battery/Complete.svg";
        if(percent <= 10) return "battery/Warn.svg";
        if(percent <= 33) return "battery/1.svg";
        if(percent <= 66) return "battery/2.svg";
        return "battery/3.svg";
      }

      const legacyMap = {
        "0": "battery/Warn.svg",
        "1": "battery/1.svg",
        "2": "battery/2.svg",
        "3": "battery/3.svg",
        "4": "battery/Chg.svg",
        "5": "battery/Complete.svg",
      };
      return legacyMap[String(legacyBattery)] || "battery/0.svg";
    },
    booleanValue(value) {
      if(value === true || value === 1 || value === "1" || value === "true") return true;
      if(value === false || value === 0 || value === "0" || value === "false") return false;
      return null;
    },
    epochMilliseconds(value) {
      if(!this.hasLastSignalValue(value)) return null;
      const epoch = Number(value);
      if(!Number.isFinite(epoch)) return null;
      return epoch >= 1000000000000 ? epoch : epoch * 1000;
    },
    kstReportDateMilliseconds(value) {
      const reportDate = String(value || "");
      const matched = reportDate.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
      if(!matched) return null;
      return Date.UTC(
          Number(matched[1]),
          Number(matched[2]) - 1,
          Number(matched[3]),
          Number(matched[4]) - 9,
          Number(matched[5]),
          Number(matched[6])
      );
    },
    formatKstEpoch(epochMilliseconds) {
      if(!Number.isFinite(epochMilliseconds)) return "";
      const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
      }).formatToParts(new Date(epochMilliseconds)).reduce((result, part) => {
        result[part.type] = part.value;
        return result;
      }, {});
      return `${parts.year}/${parts.month}/${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
    },
    renderLastSignal(data) {
      const packed = this.lastSignalParts(data);
      const measuredAtEpoch = this.getDeviceValue(data, ["LAST_SIGNAL_MEASURED_AT_EPOCH"]);
      const reportDate = this.getDeviceValue(data, ["LAST_SIGNAL_REPORT_DATE"]);
      const sourceType = this.getDeviceValue(data, ["LAST_SIGNAL_SOURCE_TYPE"]);
      const batteryPct = this.getDeviceValue(data, ["LAST_SIGNAL_BATTERY_PCT"]);
      const batteryMv = this.getDeviceValue(data, ["LAST_SIGNAL_BATTERY_MV"]);
      const charging = this.booleanValue(this.getDeviceValue(data, ["LAST_SIGNAL_IS_CHARGING"]));
      const legacyStatusValue = this.getDeviceValue(data, ["LAST_SIGNAL_LEGACY_STATUS"]);
      const legacyBatteryValue = this.getDeviceValue(data, ["LAST_SIGNAL_LEGACY_BATTERY"]);
      const legacyStatus = this.hasLastSignalValue(legacyStatusValue) ? legacyStatusValue : packed[1];
      const legacyBattery = this.hasLastSignalValue(legacyBatteryValue) ? legacyBatteryValue : packed[2];
      const measuredAtMilliseconds = this.epochMilliseconds(measuredAtEpoch);
      const reportDateValue = reportDate || packed[0] || "";
      const epochMilliseconds = measuredAtMilliseconds
          ?? this.kstReportDateMilliseconds(reportDateValue);
      const displayDate = Number.isFinite(measuredAtMilliseconds)
          ? this.formatKstEpoch(measuredAtMilliseconds)
          : utils.convertFromStrToDate(reportDateValue);
      const source = this.lastSignalSource(sourceType, legacyStatus);
      const isInactive = Number.isFinite(epochMilliseconds)
          && Math.abs(Date.now() - epochMilliseconds) / (60 * 1000) > 90;
      const sourceIcon = isInactive ? "icon_none.svg" : source.icon;
      const batteryIcon = isInactive
          ? "battery/0.svg"
          : this.lastSignalBatteryIcon(batteryPct, charging, legacyBattery);
      const batteryDetails = [];
      if(this.hasLastSignalValue(batteryPct)) batteryDetails.push(`${batteryPct}%`);
      if(charging !== null) batteryDetails.push(charging ? "충전 중" : "미충전");
      if(this.hasLastSignalValue(batteryMv)) batteryDetails.push(`${batteryMv}mV`);
      if(batteryDetails.length === 0 && this.hasLastSignalValue(legacyBattery)) {
        batteryDetails.push(`배터리 상태 ${legacyBattery}`);
      }
      const batteryTitle = batteryDetails.length > 0
          ? ` title="${this.escapeHtml(batteryDetails.join(" / "))}"`
          : "";

      return this.escapeHtml(displayDate)
          + ' <img src="/static/images/' + sourceIcon + '" alt="' + this.escapeHtml(source.code)
          + '" title="' + this.escapeHtml(source.code) + '" width="42" height="20">'
          + ' <img src="/static/images/' + batteryIcon + '" alt="battery" width="30"' + batteryTitle + '>';
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
    onSelectionChanged() {
      this.selectedDeviceCount = this.gridApi ? this.gridApi.getSelectedRows().length : 0;
    },
    isProtocolDeviceRow(params) {
      return Boolean(this.getDeviceValue(params.data, ["deviceHash", "DEVICE_HASH"]));
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
    serialNumberValueGetter(params) {
      return this.getDeviceValue(params.data, ["SERIAL_NUMBER", "serialNumber"]);
    },
    deviceHashValueGetter(params) {
      return this.getDeviceValue(params.data, ["deviceHash", "DEVICE_HASH"]);
    },
    deviceLifecycleValueGetter(params) {
      return this.getDeviceValue(params.data, ["deviceLifecycle", "DEVICE_LIFECYCLE"]);
    },
    firmwareValueGetter(params) {
      return this.getDeviceValue(params.data, ["fwVersion", "FW_VERSION"]);
    },
    deviceLinkRenderer(params) {
      if(utils.isEmpty(params.value)) return "";
      return '<a class="text-primary" href="javascript:openPopup(\'/devicepopup?device=' + params.value + '\',\'기기 수정\',\'width=620,height=650,left=0,top=0\')">' + params.value + '</a>';
    },
    lastSignalRenderer(params) {
      const data = params.data || {};
      const hasLastSignal = [
        "STATUS",
        "LAST_SIGNAL_MEASURED_AT_EPOCH",
        "LAST_SIGNAL_REPORT_DATE",
        "LAST_SIGNAL_SOURCE_TYPE",
        "LAST_SIGNAL_BATTERY_PCT",
        "LAST_SIGNAL_BATTERY_MV",
        "LAST_SIGNAL_IS_CHARGING",
        "LAST_SIGNAL_LEGACY_STATUS",
        "LAST_SIGNAL_LEGACY_BATTERY",
      ].some(key => this.hasLastSignalValue(data[key]));
      return hasLastSignal ? this.renderLastSignal(data) : "";
    },
    activeStateRenderer(params) {
      const value = this.getDeviceValue(params.data, ["activeState", "ACTIVE_STATE"]) || params.value;
      const apiName = this.getDeviceValue(params.data, ["activeStateName", "ACTIVE_STATE_NAME"]);
      const statusMap = this.activeStateOptions.reduce((map, item) => {
        map[item.value] = { label: item.label, className: item.className };
        return map;
      }, {
        'V': { label: '등록중(구 인증완료)', className: 'bg-warning text-dark' },
      });
      const status = statusMap[value];
      const label = apiName || (status ? status.label : value);
      if(!label) return "";
      const className = status ? status.className : 'bg-secondary';
      return '<span class="badge ' + className + '">' + this.escapeHtml(label) + '</span>';
    },
    deviceLifecycleRenderer(params) {
      const lifecycle = this.getDeviceValue(params.data, ["deviceLifecycle", "DEVICE_LIFECYCLE"]);
      if(!lifecycle) return '<span class="badge bg-secondary">미적용(LEGACY)</span>';
      const badge = '<span class="badge bg-info text-dark">' + this.escapeHtml(lifecycle) + '</span>';
      const deviceHash = this.getDeviceValue(params.data, ["deviceHash", "DEVICE_HASH"]);
      if(!deviceHash) return badge;
      const url = "/devicelifecyclemanagepopup?deviceHash=" + encodeURIComponent(deviceHash);
      return '<a href="javascript:openPopup(\'' + url
          + '\',\'라이프사이클 관리\',\'width=690,height=700,left=0,top=0\')">' + badge + '</a>';
    },
    deviceHashLinkRenderer(params) {
      const deviceHash = this.getDeviceValue(params.data, ["deviceHash", "DEVICE_HASH"]);
      if(!deviceHash) return "";
      const deviceIMEI = this.getDeviceValue(params.data, ["deviceIMEI", "DEVICE_IMEI"]);
      const url = "/devicelifecyclepopup?deviceHash=" + encodeURIComponent(deviceHash)
          + "&deviceIMEI=" + encodeURIComponent(deviceIMEI || "");
      return '<a class="text-primary" href="javascript:openPopup(\'' + url
          + '\',\'기기 프로토콜 상세\',\'width=690,height=700,left=0,top=0\')">'
          + this.escapeHtml(deviceHash) + '</a>';
    },
    firmwareLinkRenderer(params) {
      const firmwareVersion = this.getDeviceValue(params.data, ["fwVersion", "FW_VERSION"]);
      const deviceHash = this.getDeviceValue(params.data, ["deviceHash", "DEVICE_HASH"]);
      if(!firmwareVersion || !deviceHash) return "";
      const url = "/fotapopup?deviceHashes=" + encodeURIComponent(deviceHash);
      return '<a class="text-primary" href="javascript:openPopup(\'' + url
          + '\',\'펌웨어/FOTA 관리\',\'width=820,height=740,left=0,top=0\')">'
          + this.escapeHtml(firmwareVersion) + '</a>';
    },
    onLifecycleChanged(event) {
      if(event?.origin !== window.location.origin || event?.data?.type !== "DEVICE_LIFECYCLE_CHANGED") return;
      this.selectDeviceList(false);
    },
    getDeviceValue(row, keys) {
      if(!row || typeof row !== "object") return "";
      const key = keys.find(item => row[item] !== undefined && row[item] !== null);
      return key ? row[key] : "";
    },
    escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }[char]));
    },
    toDeviceRows(data) {
      if(Array.isArray(data)) return data;
      if(!data || typeof data !== "object") return [];

      const rowKeys = ["list", "rows", "items", "content", "deviceList"];
      const rows = rowKeys.map(key => data[key]).find(Array.isArray);
      return rows || [];
    },
    async selectDeviceList(resetPage = true) {
      if(this._deviceFilterTimer) {
        clearTimeout(this._deviceFilterTimer);
        this._deviceFilterTimer = null;
      }
      const requestSequence = ++this._listRequestSequence;
      if(resetPage) this.currentPage = 1;
      if(this.gridApi) this.gridApi.showLoadingOverlay();
      const param = {
        ...this.search,
        guardPhone: (this.search.guardPhone || "").replace(/-/g, ""),
        pageNum: this.currentPage,
        pageSize: this.paginationPageSize,
        pageStart: (this.currentPage - 1) * this.paginationPageSize,
      };
      try {
        const res = await api.selDeviceList(param);
        if(requestSequence !== this._listRequestSequence) return;
        if(res.data.status === "SUCCESS") {
          const data = res.data.data || {};
          this.deviceList = this.toDeviceRows(data);
          this.selectedDeviceCount = 0;
          this.totalRows = data.totalCount || this.deviceList.length;
          this.$nextTick(() => {
            if(requestSequence !== this._listRequestSequence) return;
            this.updatePaginationState();
            if(this.gridApi && this.deviceList.length === 0) {
              this.gridApi.showNoRowsOverlay();
            } else if(this.gridApi) {
              this.gridApi.hideOverlay();
            }
          });
        }
      } catch (e) {
        if(requestSequence !== this._listRequestSequence) return;
        this.handleScopeError(e);
      }

    },


    downloadExcel() {
      const param = {
        ...this.search,
        guardPhone: (this.search.guardPhone || "").replaceAll("-",""),
      };
      api.downDeviceListExcel(param).then(res=>{
        let fileName = "기기리스트.xlsx"
        console.log(fileName)
        utils.fileDownload(res.data, fileName)
        // router.go(0)
      }).catch(this.handleScopeError)


    },

    openExcelUpload() {
      if(!this.isSuperAdmin) {
        alert("대표 관리자만 수행할 수 있습니다.");
        return;
      }
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
      if(!this.isSuperAdmin) {
        alert("대표 관리자만 수행할 수 있습니다.");
        return;
      }
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
      }).catch(this.handleScopeError)
      // 실제 업로드 로직 구현 부분
      // alert(`선택된 파일: ${this.selectedFile.name} 업로드 진행중...`);

      // 업로드 처리 후 팝업 닫기
      this.closeExcelUpload();
    },


    async selectOrgcList() {
      if(!this.isSuperAdmin) return;
      const param = {};
      try {
        const res = await api.selOrgcList(param);
        if(res.data.status === "SUCCESS") {
          this.orgcList = res.data.data;
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
      alert(e?.response?.data?.message || "처리 중 오류가 발생했습니다.");
    },
  },
  created(){
    // 팝업창에서 selectDeviceList 를 호출하기 위한 설정
    this._deviceFilterTimer = null;
    this._listRequestSequence = 0;
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
