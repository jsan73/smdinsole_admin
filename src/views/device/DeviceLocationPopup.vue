<template>
  <div class="device-location-popup p-4">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <div>
        <h5 class="mb-1"><i class="bi bi-caret-right-square"></i> 기기 위치 기록</h5>
        <small class="text-muted">Device Hash: {{ deviceHash || "-" }}</small>
      </div>
      <button type="button" class="btn btn-outline-secondary btn-sm" :disabled="locationLoading" @click="loadLocations">새로고침</button>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body p-3">
        <form class="row g-2 align-items-end mb-3" @submit.prevent="searchLocations">
          <div class="col-md-4">
            <label for="locationStartDate" class="form-label mb-1">시작일</label>
            <input id="locationStartDate" v-model="locationStartDate" type="date" class="form-control form-control-sm">
          </div>
          <div class="col-md-4">
            <label for="locationEndDate" class="form-label mb-1">종료일</label>
            <input id="locationEndDate" v-model="locationEndDate" type="date" class="form-control form-control-sm">
          </div>
          <div class="col-md-4 d-flex align-items-center gap-2">
            <button type="submit" class="btn btn-primary btn-sm" :disabled="locationLoading">검색</button>
            <button type="button" class="btn btn-outline-secondary btn-sm" :disabled="locationLoading" @click="resetLocationSearch">기간 초기화</button>
          </div>
        </form>

        <div v-if="locationLoading" class="text-center text-muted py-4">
          <span class="spinner-border spinner-border-sm me-2"></span>위치 기록 조회 중...
        </div>
        <div v-else class="table-responsive unified-location-table-wrap">
          <table class="table table-sm table-striped table-bordered align-middle mb-0">
            <thead>
            <tr>
              <th>위치 번호</th>
              <th>순번</th>
              <th>측정 시각</th>
              <th>수신 시각</th>
              <th>Source</th>
              <th>배터리</th>
              <th>전압(mV)</th>
              <th>충전</th>
              <th>위도</th>
              <th>경도</th>
              <th>정확도</th>
              <th>Fix age</th>
              <th>처리상태</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="location in locationRows" :key="location.locationNo">
              <td>{{ displayValue(location.locationNo) }}</td>
              <td>{{ displayValue(location.recordIndex) }}</td>
              <td>{{ formatMeasuredAt(location) }}</td>
              <td>{{ formatDate(location.reportDate) }}</td>
              <td>{{ displayValue(location.sourceType) }}</td>
              <td>{{ nullableSuffix(location.batteryPct, "%") }}</td>
              <td>{{ displayValue(location.batteryMv) }}</td>
              <td>{{ booleanLabel(location.charging) }}</td>
              <td>{{ displayValue(location.lat) }}</td>
              <td>{{ displayValue(location.lng) }}</td>
              <td>{{ displayValue(location.accuracy) }}</td>
              <td>{{ nullableSuffix(location.fixAgeSec, "초") }}</td>
              <td>{{ processingStatusLabel(location.processingStatus) }}</td>
            </tr>
            <tr v-if="locationRows.length === 0">
              <td colspan="13" class="text-center text-muted py-3">조회된 위치 기록이 없습니다.</td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="location-grid-footer">
          <div class="location-total-count">총 {{ locationTotalRows }}건</div>
          <div v-if="locationTotalPages > 1" class="grid-pagination">
            <button type="button" class="btn btn-sm btn-outline-secondary" :disabled="locationPageNo === 1" @click="goToLocationPage(1)">처음</button>
            <button type="button" class="btn btn-sm btn-outline-secondary" :disabled="locationPageNo === 1" @click="goToLocationPage(locationPageNo - 1)">이전</button>
            <button v-for="page in locationPaginationPages" :key="page" type="button" class="btn btn-sm" :class="page === locationPageNo ? 'btn-primary' : 'btn-outline-secondary'" @click="goToLocationPage(page)">{{ page }}</button>
            <button type="button" class="btn btn-sm btn-outline-secondary" :disabled="locationPageNo === locationTotalPages" @click="goToLocationPage(locationPageNo + 1)">다음</button>
            <button type="button" class="btn btn-sm btn-outline-secondary" :disabled="locationPageNo === locationTotalPages" @click="goToLocationPage(locationTotalPages)">마지막</button>
          </div>
          <div v-else class="grid-pagination-placeholder" aria-hidden="true"></div>
          <div class="location-page-size">
            <label for="locationPageSize" class="form-label mb-0">페이지당</label>
            <select id="locationPageSize" v-model.number="locationPageSize" class="form-select form-select-sm page-size-select" @change="onLocationPageSizeChange">
              <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}개</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div v-if="errorPopup.visible" class="error-popup-overlay" @click.self="closeErrorPopup">
      <div class="error-popup card shadow">
        <div class="card-body">
          <h6 class="text-danger fw-bold"><i class="bi bi-exclamation-triangle"></i> 처리 오류</h6>
          <p class="mb-3">{{ errorPopup.message }}</p>
          <div class="text-end"><button type="button" class="btn btn-secondary btn-sm" @click="closeErrorPopup">확인</button></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/api";

export default {
  name: "DeviceLocationPopup",
  data() {
    return {
      deviceHash: "",
      deviceNo: null,
      locationStartDate: "",
      locationEndDate: "",
      locationPageNo: 1,
      locationPageSize: 20,
      pageSizeOptions: [10, 20, 50, 100],
      locationTotalRows: 0,
      locationRows: [],
      locationLoading: false,
      errorPopup: { visible: false, message: "" },
    };
  },
  computed: {
    locationTotalPages() {
      return this.locationTotalRows === 0 ? 0 : Math.ceil(this.locationTotalRows / this.locationPageSize);
    },
    locationPaginationPages() {
      const start = Math.floor((this.locationPageNo - 1) / 10) * 10 + 1;
      const end = Math.min(start + 9, this.locationTotalPages);
      const pages = [];
      for(let page = start; page <= end; page += 1) pages.push(page);
      return pages;
    },
  },
  mounted() {
    this.deviceHash = String(this.$route.query.deviceHash || "").trim();
    const deviceNo = Number(this.$route.query.deviceNo);
    this.deviceNo = Number.isSafeInteger(deviceNo) && deviceNo > 0 ? deviceNo : null;
    if(!this.deviceHash && !this.deviceNo) {
      this.showError("기기 식별 정보가 없어 위치 기록을 조회할 수 없습니다.");
      return;
    }
    this.loadLocations();
  },
  methods: {
    async loadLocations() {
      if(!this.deviceHash && !this.deviceNo) return;
      this.locationLoading = true;
      try {
        const startDate = this.toApiDate(this.locationStartDate, "시작일", "000000");
        const endDate = this.toApiDate(this.locationEndDate, "종료일", "235959");
        if(startDate && endDate && startDate > endDate) {
          throw new Error("시작일은 종료일보다 늦을 수 없습니다.");
        }
        const response = await api.getDeviceLocations({
          deviceHash: this.deviceHash,
          deviceNo: this.deviceNo || undefined,
          startDate,
          endDate,
          pageNo: this.locationPageNo,
          pageSize: this.locationPageSize,
        });
        if(response.data.status !== "SUCCESS") throw new Error(response.data.message || "위치 기록을 조회하지 못했습니다.");
        const data = response.data.data || {};
        this.locationRows = Array.isArray(data.items) ? data.items : [];
        this.locationTotalRows = Number(data.totalCount) || 0;
        this.locationPageNo = Number(data.pageNo) || this.locationPageNo;
        this.locationPageSize = Number(data.pageSize) || this.locationPageSize;
      } catch (error) {
        this.locationRows = [];
        this.locationTotalRows = 0;
        this.showApiError(error, "위치 기록을 조회하지 못했습니다.");
      } finally {
        this.locationLoading = false;
      }
    },
    searchLocations() {
      this.locationPageNo = 1;
      this.loadLocations();
    },
    resetLocationSearch() {
      this.locationStartDate = "";
      this.locationEndDate = "";
      this.locationPageNo = 1;
      this.loadLocations();
    },
    onLocationPageSizeChange() {
      this.locationPageNo = 1;
      this.loadLocations();
    },
    goToLocationPage(page) {
      if(page < 1 || page > this.locationTotalPages || page === this.locationPageNo) return;
      this.locationPageNo = page;
      this.loadLocations();
    },
    toApiDate(value, label, time) {
      const text = String(value || "").trim();
      if(!text) return undefined;
      const match = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if(!match) throw new Error(label + " 형식이 올바르지 않습니다.");
      const year = Number(match[1]);
      const month = Number(match[2]);
      const day = Number(match[3]);
      const date = new Date(year, month - 1, day);
      if(
        date.getFullYear() !== year
        || date.getMonth() !== month - 1
        || date.getDate() !== day
      ) {
        throw new Error(label + " 값이 올바르지 않습니다.");
      }
      return match[1] + match[2] + match[3] + time;
    },
    processingStatusLabel(value) {
      return {
        PROCESSED: "정상 처리",
        DUPLICATE: "중복",
        FAILED: "실패",
        NO_LOCATION: "위치 없음",
      }[value] || value || "-";
    },
    displayValue(value) {
      return value === null || value === undefined || value === "" ? "-" : value;
    },
    nullableSuffix(value, suffix) {
      return value === null || value === undefined || value === "" ? "-" : String(value) + suffix;
    },
    booleanLabel(value) {
      if(value === true || value === 1 || value === "Y" || value === "true") return "충전 중";
      if(value === false || value === 0 || value === "N" || value === "false") return "미충전";
      return "-";
    },
    formatMeasuredAt(location) {
      const measuredAt = this.formatEpoch(location.measuredAtEpoch);
      return measuredAt !== "-" ? measuredAt : this.formatDate(location.reportDate);
    },
    formatEpoch(value) {
      if(value === null || value === undefined || value === "") return "-";
      const number = Number(value);
      if(!Number.isFinite(number)) return "-";
      const milliseconds = number > 999999999999 ? number : number * 1000;
      return this.formatDateObject(new Date(milliseconds));
    },
    formatDate(value) {
      if(value === null || value === undefined || value === "") return "-";
      if(typeof value === "number") return this.formatEpoch(value);
      const text = String(value).trim();
      if(/^\d{10,13}$/.test(text)) return this.formatEpoch(text);
      if(/^\d{14}$/.test(text)) {
        return text.slice(0, 4) + "-" + text.slice(4, 6) + "-" + text.slice(6, 8)
            + " " + text.slice(8, 10) + ":" + text.slice(10, 12) + ":" + text.slice(12, 14);
      }
      const date = new Date(text);
      return Number.isNaN(date.getTime()) ? text : this.formatDateObject(date);
    },
    formatDateObject(date) {
      if(Number.isNaN(date.getTime())) return "-";
      const pad = value => String(value).padStart(2, "0");
      return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate())
          + " " + pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds());
    },
    showApiError(error, fallback) {
      const data = error?.response?.data;
      this.showError(data?.message || data?.data?.message || error?.message || fallback);
    },
    showError(message) {
      this.errorPopup = { visible: true, message };
    },
    closeErrorPopup() {
      this.errorPopup = { visible: false, message: "" };
    },
  },
};
</script>

<style scoped>
.device-location-popup {
  box-sizing: border-box;
  min-width: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f6f8fb;
}

.grid-pagination {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
}

.device-location-popup > .card {
  flex: 1 1 auto;
  min-height: 0;
}

.device-location-popup > .card > .card-body {
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.location-grid-footer {
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: minmax(130px, 1fr) auto minmax(130px, 1fr);
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.location-total-count {
  justify-self: start;
  white-space: nowrap;
}

.location-page-size {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.page-size-select {
  width: auto;
}

.unified-location-table-wrap {
  flex: 1 1 auto;
  min-height: 180px;
  overflow: auto;
}

.unified-location-table-wrap th,
.unified-location-table-wrap td {
  white-space: nowrap;
}

.unified-location-table-wrap th {
  background: rgba(33, 37, 41, .05);
}

@media (max-width: 767.98px) {
  .location-grid-footer {
    grid-template-columns: 1fr;
  }

  .location-total-count,
  .location-page-size {
    justify-self: center;
  }

  .grid-pagination {
    order: 3;
  }

  .grid-pagination-placeholder {
    display: none;
  }
}

.error-popup-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, .45);
}

.error-popup {
  width: 420px;
  max-width: calc(100vw - 40px);
}
</style>
