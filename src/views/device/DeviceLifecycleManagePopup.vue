<template>
  <div class="device-lifecycle-manage-popup p-4">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h5 class="mb-0"><i class="bi bi-caret-right-square"></i> 라이프사이클 관리</h5>
      <button type="button" class="btn btn-outline-secondary btn-sm" :disabled="loading" @click="loadDetail">새로고침</button>
    </div>

    <div v-if="loading" class="text-center text-muted py-5">
      <span class="spinner-border spinner-border-sm me-2"></span>조회 중...
    </div>

    <template v-else>
      <div class="card border-0 shadow-sm mb-3">
        <div class="card-body p-3">
          <h6 class="fw-bold mb-3">현재 라이프사이클</h6>
          <table class="table table-sm table-bordered align-middle mb-0">
            <tbody>
            <tr><th>Device Hash</th><td>{{ displayValue(protocol.deviceHash || deviceHash) }}</td></tr>
            <tr>
              <th>현재 lifecycle</th>
              <td><span class="badge bg-info text-dark">{{ displayValue(protocol.deviceLifecycle) }}</span></td>
            </tr>
            <tr><th>변경일</th><td>{{ formatDate(protocol.lifecycleUpdatedAt) }}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card border-0 shadow-sm mb-3">
        <div class="card-body p-3">
          <h6 class="fw-bold mb-3">라이프사이클 변경</h6>
          <div v-if="allowedTargets.length === 0" class="alert alert-secondary py-2 mb-0">
            현재 상태에서는 관리자가 변경할 수 있는 라이프사이클이 없습니다.
          </div>
          <template v-else>
            <div class="row g-2 align-items-start">
              <div class="col-sm-4">
                <label for="targetLifecycle" class="form-label">변경 상태</label>
                <select id="targetLifecycle" v-model="targetLifecycle" class="form-select">
                  <option value="">- 선택 -</option>
                  <option v-for="target in allowedTargets" :key="target" :value="target">{{ target }}</option>
                </select>
              </div>
              <div class="col-sm-8">
                <label for="lifecycleReason" class="form-label">변경 사유 <span class="text-muted">(선택)</span></label>
                <input
                    id="lifecycleReason"
                    v-model="reason"
                    type="text"
                    class="form-control"
                    maxlength="500"
                    placeholder="변경 사유를 입력해주세요."
                >
                <small class="text-muted d-block text-end mt-1">{{ reason.length }} / 500</small>
              </div>
            </div>
            <div class="text-end mt-2">
              <button
                  type="button"
                  class="btn btn-primary btn-sm"
                  :disabled="changing || !targetLifecycle"
                  @click="changeLifecycle"
              >{{ changing ? '변경 중...' : '라이프사이클 변경' }}</button>
            </div>
          </template>
        </div>
      </div>

      <div class="card border-0 shadow-sm">
        <div class="card-body p-3">
          <h6 class="fw-bold mb-3">변경 이력</h6>
          <div class="table-responsive">
            <table class="table table-sm table-bordered align-middle mb-0 lifecycle-history-table">
              <thead>
              <tr>
                <th>이전 상태</th>
                <th>이후 상태</th>
                <th>주체</th>
                <th>사유</th>
                <th>일시</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in history" :key="item.historyNo">
                <td>{{ displayValue(item.previousLifecycle) }}</td>
                <td>{{ displayValue(item.currentLifecycle) }}</td>
                <td>{{ actorLabel(item) }}</td>
                <td class="reason-cell">{{ item.reason || '-' }}</td>
                <td>{{ formatDate(item.changedAt) }}</td>
              </tr>
              <tr v-if="history.length === 0">
                <td colspan="5" class="text-center text-muted py-3">변경 이력이 없습니다.</td>
              </tr>
              </tbody>
            </table>
          </div>
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

const ADMIN_TRANSITIONS = {
  AS_MODE: ["READY", "INACTIVE"],
  READY: ["ACTIVE", "INACTIVE"],
  ACTIVE: ["AS_MODE", "INACTIVE"],
};

export default {
  name: "DeviceLifecycleManagePopup",
  data() {
    return {
      deviceHash: "",
      protocol: {},
      targetLifecycle: "",
      reason: "",
      loading: false,
      changing: false,
      errorPopup: { visible: false, message: "" },
    };
  },
  computed: {
    allowedTargets() {
      return ADMIN_TRANSITIONS[this.protocol.deviceLifecycle] || [];
    },
    history() {
      return Array.isArray(this.protocol.history) ? this.protocol.history : [];
    },
  },
  mounted() {
    this.deviceHash = String(this.$route.query.deviceHash || "").trim();
    if(!this.deviceHash) {
      this.showError("Device hash가 없어 라이프사이클을 조회할 수 없습니다.");
      return;
    }
    this.loadDetail();
  },
  methods: {
    async loadDetail() {
      this.loading = true;
      try {
        const response = await api.getDeviceProtocol(this.deviceHash);
        if(response.data.status !== "SUCCESS") {
          throw new Error(response.data.message || "라이프사이클 정보를 조회하지 못했습니다.");
        }
        this.protocol = response.data.data || {};
        this.targetLifecycle = "";
        this.reason = "";
      } catch (error) {
        this.showApiError(error, "라이프사이클 정보를 조회하지 못했습니다.");
      } finally {
        this.loading = false;
      }
    },
    async changeLifecycle() {
      if(!this.allowedTargets.includes(this.targetLifecycle)) {
        this.showError("현재 상태에서 허용된 라이프사이클을 선택해주세요.");
        return;
      }
      const currentLifecycle = this.protocol.deviceLifecycle;
      const targetLifecycle = this.targetLifecycle;
      if(!window.confirm(`${currentLifecycle} → ${targetLifecycle}로 변경하시겠습니까?\n변경 후 단말 동작에 즉시 반영됩니다.`)) return;

      this.changing = true;
      try {
        const response = await api.changeDeviceLifecycle({
          deviceHash: this.deviceHash,
          targetLifecycle: this.targetLifecycle,
          reason: this.reason.trim(),
        });
        if(response.data.status !== "SUCCESS") {
          throw new Error(response.data.message || "라이프사이클을 변경하지 못했습니다.");
        }
        await this.loadDetail();
        if(window.opener && !window.opener.closed) {
          window.opener.postMessage({
            type: "DEVICE_LIFECYCLE_CHANGED",
            deviceHash: this.deviceHash,
          }, window.location.origin);
        }
      } catch (error) {
        this.showApiError(error, "라이프사이클을 변경하지 못했습니다.");
      } finally {
        this.changing = false;
      }
    },
    displayValue(value) {
      return value === null || value === undefined || value === "" ? "-" : value;
    },
    actorLabel(item) {
      const actor = item.actorType || "-";
      return item.actorId ? `${actor} (${item.actorId})` : actor;
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
.device-lifecycle-manage-popup {
  min-width: 640px;
}

th {
  width: 180px;
  background: rgba(33, 37, 41, .05);
}

.lifecycle-history-table th {
  width: auto;
  white-space: nowrap;
}

.reason-cell {
  min-width: 160px;
  white-space: pre-wrap;
  word-break: break-all;
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
