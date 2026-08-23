<template>
  <div class="firmware-popup p-4">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h5 class="mb-0"><i class="bi bi-caret-right-square"></i> 펌웨어/FOTA 관리</h5>
      <button type="button" class="btn btn-outline-secondary btn-sm" :disabled="loading" @click="loadFirmwareList">새로고침</button>
    </div>

    <div v-if="isSuperAdmin" class="card border-0 shadow-sm mb-3">
      <div class="card-body p-3">
        <h6 class="fw-bold mb-2">펌웨어 등록</h6>
        <div class="d-flex gap-2 align-items-center">
          <input ref="firmwareFile" type="file" class="form-control" @change="setFile">
          <button type="button" class="btn btn-primary text-nowrap" :disabled="uploading || !uploadFile" @click="uploadFirmware">
            {{ uploading ? '업로드 중...' : '업로드' }}
          </button>
        </div>
        <small class="text-muted">버전은 펌웨어 내부 @@FWVER 표식에서 서버가 자동 추출합니다.</small>
      </div>
    </div>

    <div class="card border-0 shadow-sm mb-3">
      <div class="card-body p-3">
        <div class="d-flex align-items-center justify-content-between gap-2 mb-2">
          <h6 class="fw-bold mb-0">펌웨어 Catalog</h6>
          <div class="input-group input-group-sm firmware-search">
            <input v-model.trim="searchKeyword" type="text" class="form-control" placeholder="버전 또는 파일명" @keyup.enter="searchFirmware">
            <button type="button" class="btn btn-outline-secondary" @click="searchFirmware">조회</button>
          </div>
        </div>
        <div v-if="loading" class="text-center text-muted py-4">조회 중...</div>
        <div v-else class="table-responsive">
          <table class="table table-sm table-bordered align-middle mb-2">
            <thead>
            <tr>
              <th class="select-column">선택</th>
              <th>버전</th>
              <th>원본 파일명</th>
              <th>크기</th>
              <th>등록일</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in firmwareItems" :key="item.firmwareNo" :class="{ 'table-primary': selectedVersion === item.version }" @click="selectedVersion = item.version">
              <td class="text-center"><input v-model="selectedVersion" type="radio" :value="item.version" aria-label="펌웨어 선택"></td>
              <td>{{ item.version }}</td>
              <td>{{ item.originalFileName }}</td>
              <td>{{ formatFileSize(item.fileSize) }}</td>
              <td>{{ formatDate(item.regDate) }}</td>
            </tr>
            <tr v-if="firmwareItems.length === 0">
              <td colspan="5" class="text-center text-muted py-3">등록된 펌웨어가 없습니다.</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="d-flex align-items-center justify-content-between">
          <small class="text-muted">총 {{ totalCount }}건</small>
          <div class="btn-group btn-group-sm" role="group" aria-label="펌웨어 목록 페이지">
            <button type="button" class="btn btn-outline-secondary" :disabled="pageNo <= 1" @click="goToPage(pageNo - 1)">이전</button>
            <span class="btn btn-outline-secondary disabled">{{ pageNo }} / {{ totalPages }}</span>
            <button type="button" class="btn btn-outline-secondary" :disabled="pageNo >= totalPages" @click="goToPage(pageNo + 1)">다음</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="hasAdminRole" class="card border-0 shadow-sm">
      <div class="card-body p-3">
        <h6 class="fw-bold mb-2">기기별 FOTA Target</h6>
        <div v-if="deviceHashes.length === 0" class="alert alert-secondary py-2 mb-0">
          기기관리에서 대상 기기를 선택해주세요.
        </div>
        <template v-else>
          <p class="mb-2">선택 버전: <strong>{{ selectedVersion || '-' }}</strong></p>
          <p class="small text-muted">대상 기기: {{ deviceHashes.length }}대</p>
          <div class="d-flex flex-wrap gap-2">
            <button type="button" class="btn btn-primary btn-sm" :disabled="targeting || !selectedVersion" @click="setSelectedTargets">선택 {{ deviceHashes.length }}대 설정</button>
            <button type="button" class="btn btn-outline-secondary btn-sm" :disabled="targeting" @click="clearSelectedTargets">선택 {{ deviceHashes.length }}대 해제</button>
          </div>
          <small class="text-muted d-block mt-2">기기 적용 완료 여부는 서버가 판단하지 않으며, Target은 관리자가 해제할 때까지 유지됩니다.</small>
        </template>
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
  name: "DeviceFotaPopup",
  data() {
    return {
      uploadFile: null,
      uploading: false,
      loading: false,
      targeting: false,
      firmwareItems: [],
      selectedVersion: "",
      searchKeyword: "",
      pageNo: 1,
      pageSize: 20,
      totalCount: 0,
      deviceHashes: [],
      errorPopup: { visible: false, message: "" },
    };
  },
  computed: {
    isSuperAdmin() {
      return this.$store.getters["adminStore/isSuperAdmin"] === true;
    },
    hasAdminRole() {
      return this.$store.getters["adminStore/hasAnyAdminRole"] === true;
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.totalCount / this.pageSize));
    },
  },
  mounted() {
    if(!this.hasAdminRole) {
      this.showError("관리자만 수행할 수 있습니다.");
      return;
    }
    this.deviceHashes = String(this.$route.query.deviceHashes || "")
        .split(",")
        .map(value => value.trim())
        .filter(Boolean);
    this.loadFirmwareList();
  },
  methods: {
    setFile(event) {
      this.uploadFile = event.target.files && event.target.files[0] ? event.target.files[0] : null;
    },
    async loadFirmwareList() {
      this.loading = true;
      try {
        const response = await api.getDeviceFirmwareList({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          searchKeyword: this.searchKeyword,
        });
        this.requireSuccess(response, "펌웨어 목록을 조회하지 못했습니다.");
        const data = response.data.data || {};
        this.firmwareItems = Array.isArray(data.items) ? data.items : [];
        this.totalCount = Number(data.totalCount) || 0;
        this.pageNo = Number(data.pageNo) || this.pageNo;
        this.pageSize = Number(data.pageSize) || this.pageSize;
        if(this.selectedVersion && !this.firmwareItems.some(item => item.version === this.selectedVersion)) {
          this.selectedVersion = "";
        }
      } catch (error) {
        this.showApiError(error, "펌웨어 목록을 조회하지 못했습니다.");
      } finally {
        this.loading = false;
      }
    },
    searchFirmware() {
      this.pageNo = 1;
      this.loadFirmwareList();
    },
    goToPage(page) {
      if(page < 1 || page > this.totalPages || page === this.pageNo) return;
      this.pageNo = page;
      this.loadFirmwareList();
    },
    async uploadFirmware() {
      if(!this.isSuperAdmin || !this.uploadFile) return;
      const formData = new FormData();
      formData.append("file", this.uploadFile);
      this.uploading = true;
      try {
        const response = await api.uploadDeviceFirmware(formData);
        this.requireSuccess(response, "펌웨어를 업로드하지 못했습니다.");
        alert("펌웨어가 등록되었습니다.");
        this.uploadFile = null;
        if(this.$refs.firmwareFile) this.$refs.firmwareFile.value = "";
        this.pageNo = 1;
        await this.loadFirmwareList();
      } catch (error) {
        this.showApiError(error, "펌웨어를 업로드하지 못했습니다.");
      } finally {
        this.uploading = false;
      }
    },
    async setSelectedTargets() {
      if(!this.deviceHashes.length || !this.selectedVersion) return;
      const action = this.deviceHashes.length === 1
          ? () => api.setDeviceFirmwareTarget({
            deviceHash: this.deviceHashes[0],
            targetVersion: this.selectedVersion,
          })
          : () => api.setDeviceFirmwareTargetBulk({
            deviceHashes: this.deviceHashes,
            targetVersion: this.selectedVersion,
          });
      await this.runTargetAction(action, "선택 기기의 FOTA Target을 설정했습니다.");
    },
    async clearSelectedTargets() {
      if(!this.deviceHashes.length || !confirm("선택 기기의 FOTA Target을 해제하시겠습니까?")) return;
      await this.runTargetAction(
          () => api.clearDeviceFirmwareTarget({ deviceHashes: this.deviceHashes }),
          "선택 기기의 FOTA Target을 해제했습니다."
      );
    },
    async runTargetAction(action, successMessage) {
      this.targeting = true;
      try {
        const response = await action();
        this.requireSuccess(response, "FOTA Target을 변경하지 못했습니다.");
        alert(successMessage);
        if(window.opener && !window.opener.closed) {
          window.opener.postMessage({ type: "DEVICE_FIRMWARE_TARGET_CHANGED" }, window.location.origin);
        }
      } catch (error) {
        this.showApiError(error, "FOTA Target을 변경하지 못했습니다.");
      } finally {
        this.targeting = false;
      }
    },
    requireSuccess(response, fallback) {
      if(response?.data?.status !== "SUCCESS") {
        throw new Error(response?.data?.error?.message || response?.data?.message || fallback);
      }
    },
    formatFileSize(value) {
      const bytes = Number(value);
      if(!Number.isFinite(bytes)) return "-";
      if(bytes < 1024) return bytes + " B";
      if(bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
      return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    },
    formatDate(value) {
      const text = String(value || "").trim();
      if(!/^\d{14}$/.test(text)) return text || "-";
      return text.slice(0, 4) + "-" + text.slice(4, 6) + "-" + text.slice(6, 8)
          + " " + text.slice(8, 10) + ":" + text.slice(10, 12) + ":" + text.slice(12, 14);
    },
    showApiError(error, fallback) {
      const data = error?.response?.data;
      this.showError(data?.error?.message || data?.message || data?.data?.message || error?.message || fallback);
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
.firmware-popup {
  min-width: 720px;
  background: #f6f8fb;
}

.firmware-search {
  width: 280px;
}

.select-column {
  width: 54px;
  text-align: center;
}

tbody tr {
  cursor: pointer;
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
  width: min(420px, calc(100vw - 32px));
}
</style>
