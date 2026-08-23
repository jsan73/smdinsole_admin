<template>
  <div class="device-protocol-popup p-4">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h5 class="mb-0"><i class="bi bi-caret-right-square"></i> 기기 프로토콜 상세</h5>
      <button type="button" class="btn btn-outline-secondary btn-sm" :disabled="loading" @click="loadDetail">새로고침</button>
    </div>

    <div v-if="loading" class="text-center text-muted py-5">
      <span class="spinner-border spinner-border-sm me-2"></span>조회 중...
    </div>

    <template v-else>
      <div class="card border-0 shadow-sm mb-3">
        <div class="card-body p-3">
          <h6 class="fw-bold mb-3">기기 정보</h6>
          <table class="table table-sm table-bordered align-middle mb-0">
            <tbody>
            <tr><th>IMEI</th><td>{{ identityValue(["deviceIMEI", "DEVICE_IMEI"]) || '-' }}</td></tr>
            <tr><th>ICCID</th><td>{{ identityValue(["iccId", "ICC_ID"]) || '-' }}</td></tr>
            <tr><th>SERIAL</th><td>{{ identityValue(["serialNumber", "SERIAL_NUMBER"]) || '-' }}</td></tr>
            <tr><th>Device Hash</th><td>{{ protocol.deviceHash || '-' }}</td></tr>
            <tr>
              <th>위치 기록</th>
              <td>
                <button type="button" class="btn btn-outline-primary btn-sm" :disabled="!deviceNoValue" @click="openLocationRecordPopup">전체 위치 기록</button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card border-0 shadow-sm mb-3">
        <div class="card-body p-3">
          <h6 class="fw-bold mb-2">Target FOTA</h6>
          <table class="table table-sm table-bordered align-middle mb-0">
            <tbody>
            <tr>
              <th>Target 버전</th>
              <td>{{ protocol.targetFirmwareVersion || '미설정' }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card border-0 shadow-sm">
        <div class="card-body p-3">
          <h6 class="fw-bold mb-3">최근 Diagnostics</h6>
          <table v-if="latestDiagnosticRecord.diagnosticNo" class="table table-sm table-bordered align-middle mb-0">
            <tbody>
            <tr>
              <th>재부팅 사유</th>
              <td>{{ diagnosticReasonLabel(latestDiagnosticRecord.lastRebootReason) }}</td>
            </tr>
            <tr>
              <th>배터리 전압</th>
              <td>{{ valueWithUnit(latestDiagnosticRecord.batteryMv, "mV") }}</td>
            </tr>
            <tr>
              <th>모뎀 접속 실패 횟수</th>
              <td>{{ displayValue(latestDiagnosticRecord.modemAttachFailCount) }}</td>
            </tr>
            <tr>
              <th>진단 펌웨어</th>
              <td>{{ displayValue(latestDiagnosticRecord.fwVersion) }}</td>
            </tr>
            <tr>
              <th>수신 시각</th>
              <td>{{ formatDate(latestDiagnosticRecord.receivedAt) }}</td>
            </tr>
            </tbody>
          </table>
          <div v-else class="alert alert-secondary py-2 mb-0">진단 수신 이력이 없습니다.</div>
        </div>
      </div>
    </template>

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
import utils from "@/utils/utils";

export default {
  name: "DeviceLifecyclePopup",
  data() {
    return {
      deviceHash: "",
      deviceIMEI: "",
      identity: {},
      protocol: {},
      loading: false,
      errorPopup: { visible: false, message: "" },
    };
  },
  computed: {
    deviceNoValue() {
      return this.identityValue(["deviceNo", "DEVICE_NO"]);
    },
    latestDiagnosticRecord() {
      const record = this.protocol.latestDiagnostic;
      return record && typeof record === "object" ? record : {};
    },
  },
  mounted() {
    this.deviceHash = String(this.$route.query.deviceHash || "").trim();
    this.deviceIMEI = String(this.$route.query.deviceIMEI || "").trim();
    if(!this.deviceHash) {
      this.showError("Device hash가 없어 프로토콜을 조회할 수 없습니다.");
      return;
    }
    this.loadDetail();
  },
  methods: {
    async loadDetail() {
      this.loading = true;
      try {
        const protocolResponse = await api.getDeviceProtocol(this.deviceHash);
        if(protocolResponse.data.status !== "SUCCESS") {
          throw new Error(protocolResponse.data.message || "프로토콜 정보를 조회하지 못했습니다.");
        }
        this.protocol = protocolResponse.data.data || {};

        if(this.deviceIMEI) {
          const identityResponse = await api.getDeviceInfo(this.deviceIMEI);
          if(identityResponse.data.status === "SUCCESS") {
            this.identity = identityResponse.data.data || {};
          }
        }
      } catch (error) {
        this.showApiError(error, "프로토콜 정보를 조회하지 못했습니다.");
      } finally {
        this.loading = false;
      }
    },
    openLocationRecordPopup() {
      if(!this.deviceNoValue) return;
      const params = new URLSearchParams({
        deviceNo: String(this.deviceNoValue),
        deviceHash: this.deviceHash,
      });
      this.$open("/devicelocationpopup?" + params.toString(), "기기 위치 기록", "width=1060,height=800,left=0,top=0");
    },
    displayValue(value) {
      return value === null || value === undefined || value === "" ? "-" : value;
    },
    valueWithUnit(value, unit) {
      return value === null || value === undefined || value === "" ? "-" : value + " " + unit;
    },
    diagnosticReasonLabel(value) {
      const labels = {
        WATCHDOG_TIMEOUT: "Watchdog 시간 초과",
        HARDFAULT: "HardFault",
        POWER_ON: "전원 인가",
        POWER_FAIL: "전원 장애",
        SOFTWARE_RESET: "소프트웨어 재시작",
        BROWNOUT: "저전압",
      };
      if(!value) return "-";
      return labels[value] ? labels[value] + " (" + value + ")" : value;
    },
    identityValue(keys) {
      const key = keys.find(item => this.identity[item] !== undefined && this.identity[item] !== null);
      return key ? this.identity[key] : "";
    },
    formatDate(value) {
      return utils.isEmpty(value) ? "-" : utils.convertFromStrToDate(value);
    },
    showApiError(error, fallback) {
      const responseData = error?.response?.data;
      this.showError(
          responseData?.message
          || responseData?.data?.message
          || error?.message
          || fallback
      );
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
.device-protocol-popup {
  min-width: 640px;
}

th {
  width: 180px;
  background: rgba(33, 37, 41, .05);
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
