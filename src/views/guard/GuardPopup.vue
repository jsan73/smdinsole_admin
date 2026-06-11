<template>
  <div class="container-fluid p-3 position-relative">
    <div
        v-if="noticeToast.visible"
        class="notice-toast"
        :class="'notice-toast-' + noticeToast.type"
        role="status"
    >
      {{ noticeToast.message }}
    </div>

    <h5 class="pb-2 fw-bold">
      <i class="bi bi-caret-right-square"></i> 사용자 {{ isUpdateMode ? '수정' : '추가' }}
    </h5>

    <div class="card mb-3">
      <div class="card-body p-0">
        <table class="table table-sm table-bordered mb-0 align-middle">
          <colgroup><col style="width: 30%"><col style="width: 70%"></colgroup>
          <tbody>
          <tr>
            <th class="text-center bg-light small py-2">전화번호(ID)</th>
            <td>
              <input
                  type="text"
                  v-model="guard.guardPhone"
                  @change="guard.guardPhone = utils.telForm(guard.guardPhone.replace(/[^0-9]/g, ''))"
                  class="form-control form-control-sm"
                  maxlength="13"
              >
            </td>
          </tr>
          <tr>
            <th class="text-center bg-light small py-2">사용자명</th>
            <td><input type="text" v-model="guard.guardName" class="form-control form-control-sm w-50"></td>
          </tr>
          <tr>
            <th class="text-center bg-light small py-2">이메일</th>
            <td><input type="email" v-model="guard.email" class="form-control form-control-sm"></td>
          </tr>
          <tr v-if="isUpdateMode">
            <th class="text-center bg-light small py-2">마지막 접속일</th>
            <td class="small ps-2">{{ guard.lastLoginDate || '-' }}</td>
          </tr>
          <tr>
            <th class="text-center bg-warning small py-2" style="--bs-bg-opacity: .2;">계정상태</th>
            <td>
              <select
                  v-model="guard.accountState"
                  class="form-select form-select-sm"
                  :disabled="isAccountStateReadonly"
              >
                <option v-for="option in accountStateOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <div v-if="accountStateReadonlyMessage" class="form-text small">
                {{ accountStateReadonlyMessage }}
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-1">
      <span class="fw-bold small">연결 기기 목록</span>
      <button class="btn btn-sm btn-secondary py-0" @click="openAddDevice" :disabled="!isUpdateMode && !isRegistered">+추가</button>
    </div>

    <div class="table-responsive" style="max-height: 150px;">
      <table class="table table-sm table-bordered text-center align-middle small">
        <thead class="bg-light">
        <tr>
          <th>NO</th><th>IMEI</th><th>서비스 만료일</th><th>알림 설정</th><th>사용자 유형</th><th>비고</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, idx) in deviceList" :key="idx">
          <td>{{ idx + 1 }}</td>
          <td>{{ item.deviceIMEI }}</td>
          <td>{{ utils.dateForm(item.expDate) }}</td>
          <td>
            <select
                v-model="item.notiCd"
                class="form-select form-select-sm"
                :disabled="item.noticeSaving"
                @change="handleNoticeChange(item)"
            >
              <option value="">설정</option>
              <option value="NC00">내일 아침 9시까지 알림 해제</option>
              <option value="NC03">3시간 알림 해제</option>
              <option value="NC06">6시간 알림 해제</option>
              <option value="NC12">12시간 알림 해제</option>
              <option value="NC99">다음 설정시까지 알림 해제</option>
            </select>
          </td>
          <td>
            <select v-model="item.userType" class="form-select form-select-sm" @change="handleUserTypeChange($event, item)">
              <option value="1">대표</option>
              <option value="2">추가</option>
            </select>
          </td>
          <td>
            <button v-if="item.userType == '2'" class="btn btn-info btn-sm text-white py-0 px-1" style="font-size: 11px;" @click="revokePermission(item)">권한 해제</button>
          </td>
        </tr>
        <tr v-if="deviceList.length === 0">
          <td colspan="6" class="py-3 text-muted">연결된 기기가 없습니다.</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="text-center mt-3">
      <template v-if="isUpdateMode">
        <button class="btn btn-outline-secondary btn-sm px-4 mx-1" @click="updateGuard">수정</button>
      </template>
      <template v-else>
        <button class="btn btn-primary btn-sm px-4 mx-1" @click="registerGuard">등록</button>
        <button class="btn btn-outline-secondary btn-sm px-4 mx-1" @click="closePopup">취소</button>
      </template>
    </div>

    <div v-if="showTransferLayer" class="position-absolute top-50 start-50 translate-middle bg-white border border-dark p-3 shadow" style="width: 450px; z-index: 1050;">
      <div class="d-flex justify-content-between mb-2">
        <h6 class="fw-bold">대표 사용자 이전</h6>
        <button type="button" class="btn-close btn-sm" @click="cancelTransfer"></button>
      </div>
      <p class="small">이 기기(IMEI: {{ transferForm.selectedDeviceIMEI }})의 대표 권한을 이전하시겠습니까?</p>
      <div class="input-group input-group-sm mb-3 border">
        <span class="input-group-text bg-light border-0">전화번호(ID)</span>
        <input type="text" class="form-control border-0" v-model="transferForm.searchPhone" placeholder="이전할 대상 번호 입력">
        <button class="btn btn-info text-white" @click="searchGuardForTransfer">조회</button>
      </div>
      <div v-if="transferForm.searchResult" class="border-top border-bottom py-2 d-flex align-items-center">
        <input type="checkbox" class="form-check-input ms-2 me-3" style="width:20px; height:20px;" @change="executeTransfer">
        <span class="small">ID : {{ transferForm.searchResult.guardPhone }} ({{ transferForm.searchResult.guardName }})</span>
      </div>
    </div>

    <div v-if="showAddDeviceLayer" class="position-absolute top-50 start-50 translate-middle bg-white border border-dark p-3 shadow" style="width: 450px; z-index: 1050;">
      <div class="d-flex justify-content-between mb-3">
        <h6 class="fw-bold">기기 추가</h6>
        <button type="button" class="btn-close btn-sm" @click="showAddDeviceLayer = false"></button>
      </div>
      <div class="input-group input-group-sm mb-3 border">
        <span class="input-group-text bg-light border-0">IMEI</span>
        <input type="text" class="form-control border-0" v-model="addDeviceForm.searchIMEI" placeholder="추가할 IMEI 입력">
        <button class="btn btn-info text-white" @click="searchDeviceForAdd">조회</button>
      </div>
      <div v-if="addDeviceForm.searchResult" class="border-top border-bottom py-2 d-flex align-items-center">
        <input type="checkbox" class="form-check-input ms-2 me-3" style="width:20px; height:20px;" @change="executeAddDevice">
        <span class="small">
          IMEI : {{ addDeviceForm.searchResult.deviceIMEI }} &nbsp;&nbsp;
          사용자 유형 : <b>{{ addDeviceForm.searchResult.userTypeNm }}</b>
        </span>
      </div>
    </div>

    <div v-if="showTransferLayer || showAddDeviceLayer" class="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-25" style="z-index: 1040;"></div>
  </div>
</template>

<script>
import api from '@/api/api';
import utils from "@/utils/utils";

export default {
  name: "GuardPopup",
  data() {
    return {
      isUpdateMode: false,
      isRegistered: false,
      guardNo: null,
      utils: utils,
      guard: { guardPhone: '', guardName: '', email: '', lastLoginDate: null, accountState: 'N', maketingAgreeYn: 'Y' },
      deviceList: [],

      // 레이어 표시 여부
      showTransferLayer: false,
      showAddDeviceLayer: false,

      // 대표 이전 레이어 전용 데이터
      transferForm: {
        searchPhone: '',
        searchResult: null,
        selectedDeviceNo: null,
        selectedDeviceIMEI: '',
        selectedItem: null,
        previousUserType: ''
      },

      // 기기 추가 레이어 전용 데이터
      addDeviceForm: {
        searchIMEI: '',
        searchResult: null
      },

      originalPhone: '',
      originalAccountState: 'N',
      guardAccountStateOptions: [
        { value: 'N', label: '정상' },
        { value: 'H', label: '휴면' },
        { value: 'S', label: '정지' },
        { value: 'P', label: '탈퇴' },
      ],
      isEmailValid: true,
      noticeToast: {
        visible: false,
        message: '',
        type: 'success',
        timer: null
      },
    }
  },
  computed: {
    currentAccountState() {
      return this.guard.accountState || 'N';
    },
    accountStateOptions() {
      if(!this.isUpdateMode) {
        return this.guardAccountStateOptions.filter(option => option.value === 'N');
      }

      if(this.originalAccountState === 'N') {
        return this.guardAccountStateOptions.filter(option => ['N', 'S'].includes(option.value));
      }

      if(this.originalAccountState === 'S') {
        return this.guardAccountStateOptions.filter(option => ['S', 'N'].includes(option.value));
      }

      if(this.originalAccountState === 'H') {
        return [
          { value: 'H', label: '휴면' },
          { value: 'N', label: '정상' },
        ];
      }

      return this.guardAccountStateOptions.filter(option => option.value === this.currentAccountState);
    },
    isAccountStateReadonly() {
      return this.isUpdateMode && this.originalAccountState === 'P';
    },
    accountStateReadonlyMessage() {
      if(this.originalAccountState === 'P') return '탈퇴 상태는 관리자 화면에서 복구할 수 없습니다.';
      if(this.originalAccountState === 'H') return '휴면 계정은 정상으로 해제할 수 있습니다.';
      return '';
    },
  },
  mounted() {
    const queryNo = this.$route.query.guardNo;
    if (queryNo) {
      this.guardNo = queryNo;
      this.isUpdateMode = true;
      this.fetchData();
    }
  },
  methods: {
    getRawPhone(phone) {
      return (phone || '').replace(/[^0-9]/g, "");
    },

    async checkDuplicate(param) {
      const checkRes = await api.checkGuardPhone(param.guardPhone);
      if (checkRes.data.data === 1) {
        alert("이미 존재하거나 중복된 전화번호입니다.");
        return true;
      }
      return false;
    },

    async checkEmail() {
      const email = this.guard.email;
      if (!email || email.trim() === '') {
        this.isEmailValid = true;
        return true;
      }
      if (!utils.validateEmail(email)) {
        alert("올바른 이메일 형식이 아닙니다.");
        this.isEmailValid = false;
        return false;
      }
      this.isEmailValid = true;
      return true;
    },

    async fetchData() {
      try {
        const resGuard = await api.getGuardianInfo(this.guardNo);
        if (resGuard.data.status === "SUCCESS") {
          const data = resGuard.data.data;
          const formatted = this.utils.telForm(this.getRawPhone(data.guardPhone));
          data.guardPhone = formatted;
          data.accountState = data.accountState || data.ACCOUNT_STATE || 'N';
          this.guard = data;
          this.originalPhone = formatted;
          this.originalAccountState = data.accountState;
        }

        const resDevice = await api.selDeviceListByAdmin(this.guardNo);
        if (resDevice.data.status === "SUCCESS") {
          this.deviceList = resDevice.data.data.map(item => ({
            ...item,
            notiCd: item.notiCd === null ? "" : item.notiCd,
            prevNotiCd: item.notiCd === null ? "" : item.notiCd,
            noticeSaving: false
          }));
        }
      } catch (e) { this.handleScopeError(e); }
    },

    getNoticeOption(notiCd) {
      const optionMap = {
        NC00: 0,
        NC03: 3,
        NC06: 6,
        NC12: 12,
        NC99: 99,
      };
      return optionMap[notiCd] !== undefined ? optionMap[notiCd] : 100;
    },

    showNoticeToast(message, type = 'success') {
      if (this.noticeToast.timer) {
        clearTimeout(this.noticeToast.timer);
      }
      this.noticeToast.message = message;
      this.noticeToast.type = type;
      this.noticeToast.visible = true;
      this.noticeToast.timer = setTimeout(() => {
        this.noticeToast.visible = false;
        this.noticeToast.timer = null;
      }, 2000);
    },

    async handleNoticeChange(item) {
      const prevNotiCd = item.prevNotiCd || "";
      const currentNotiCd = item.notiCd || "";
      const option = this.getNoticeOption(currentNotiCd);

      item.noticeSaving = true;
      try {
        const res = await api.setAdminDeviceNotice(option, {
          deviceNo: item.deviceNo,
          guardNo: this.guardNo || this.guard.guardNo || 0,
          notiCd: currentNotiCd,
          rsvSms: null
        });

        if (res.data.status === "SUCCESS") {
          item.prevNotiCd = currentNotiCd;
          this.showNoticeToast("알림 설정이 변경되었습니다.");
        } else {
          item.notiCd = prevNotiCd;
          alert(res.data.message || "알림 설정 변경에 실패했습니다.");
        }
      } catch (e) {
        item.notiCd = prevNotiCd;
        const message = e.response && e.response.data && e.response.data.message
            ? e.response.data.message
            : "알림 설정 변경에 실패했습니다.";
        this.handleScopeError(e, message);
      } finally {
        item.noticeSaving = false;
      }
    },

    async registerGuard() {
      const param = { ...this.guard, guardPhone: this.getRawPhone(this.guard.guardPhone) };
      if (await this.checkDuplicate(param)) return;
      if (!await this.checkEmail()) return;
      try {
        const res = await api.insGuardianByAdmin(param);
        if (res.data.status === "SUCCESS") {
          alert("등록되었습니다.");
          window.opener.vueComponent.selectGuardList();
          this.isRegistered = true;
        }
      } catch (e) {
        this.handleScopeError(e);
      }
    },

    async updateGuard() {
      const param = { ...this.guard, guardPhone: this.getRawPhone(this.guard.guardPhone) };
      const isPhoneChanged = this.getRawPhone(this.guard.guardPhone) !== this.getRawPhone(this.originalPhone);

      if (isPhoneChanged && await this.checkDuplicate(param)) return;
      if(!await this.checkEmail()) return;
      if(!this.isAllowedAccountStateChange(this.originalAccountState, param.accountState)) {
        alert("계정상태는 정상↔정지 또는 휴면→정상 전환만 가능합니다.");
        this.guard.accountState = this.originalAccountState;
        return;
      }

      try {
        const res = await api.updGuardianByAdmin(param);
        if (res.data.status === "SUCCESS") {
          alert("수정 되었습니다.");
          window.opener.vueComponent.selectGuardList();
          this.originalPhone = this.guard.guardPhone;
          this.originalAccountState = this.guard.accountState || 'N';
        }
      } catch (e) {
        this.handleScopeError(e);
      }
    },

    isAllowedAccountStateChange(fromState, toState) {
      if(fromState === toState) return true;
      return (fromState === 'N' && toState === 'S') || (fromState === 'S' && toState === 'N') || (fromState === 'H' && toState === 'N');
    },

    // --- 대표 이전 관련 로직 ---
    handleUserTypeChange(event, item) {
      const selectedType = event.target.value; // '1': 대표, '2': 추가

      // 레이어 초기화 및 기기 정보 저장
      this.transferForm.selectedDeviceNo = item.deviceNo;
      this.transferForm.selectedDeviceIMEI = item.deviceIMEI;
      this.transferForm.selectedItem = item;
      this.transferForm.previousUserType = selectedType === '1' ? '2' : '1';
      this.transferForm.searchResult = null;
      this.showTransferLayer = true;

      if (selectedType === '1') {
        // [추가 -> 대표] 현재 사용자의 번호를 자동으로 입력하고 즉시 조회
        this.transferForm.searchPhone = this.guard.guardPhone;
        this.searchGuardForTransfer();
      } else {
        // [대표 -> 추가] 검색창을 비워서 다른 사람을 대표로 지정할 수 있게 함
        this.transferForm.searchPhone = '';
      }
    },

    cancelTransfer() {
      if (this.transferForm.selectedItem && this.transferForm.previousUserType) {
        this.transferForm.selectedItem.userType = this.transferForm.previousUserType;
      }
      this.resetTransferForm();
    },

    resetTransferForm() {
      this.showTransferLayer = false;
      this.transferForm.searchPhone = '';
      this.transferForm.searchResult = null;
      this.transferForm.selectedDeviceNo = null;
      this.transferForm.selectedDeviceIMEI = '';
      this.transferForm.selectedItem = null;
      this.transferForm.previousUserType = '';
    },

    async searchGuardForTransfer() {
      const phone = this.getRawPhone(this.transferForm.searchPhone);
      if (!phone) return alert("조회할 전화번호를 입력하세요.");

      // 요청 바디 구성 (deviceNo와 guardPhone)
      const requestBody = {
        deviceNo: this.transferForm.selectedDeviceNo,
        guardPhone: phone
      };

      try {
        const res = await api.getMasterGuardianSearch(requestBody);
        if (res.data.status === "SUCCESS") {
          this.transferForm.searchResult = res.data.data;
        } else {
          alert("조회된 사용자가 없거나 대표 권한을 부여할 수 없는 사용자입니다.");
          this.transferForm.searchResult = null;
        }
      } catch (e) {
        this.handleScopeError(e, "조회 중 오류가 발생했습니다.");
      }
    },

    async executeTransfer() {
      if (!this.transferForm.searchResult) return;

      if (!confirm("대표 권한을 이전하시겠습니까?")) {
        this.cancelTransfer();
        return;
      }

      try {
        const requestBody = {
          deviceNo: this.transferForm.selectedDeviceNo,
          masterGuardNo: this.transferForm.searchResult.guardNo // 조회된 대상의 번호
        };

        // 대표 권한 이전 API (프로젝트 상황에 맞는 API 호출)
        const res = await api.chageMasterGuardByAdmin(requestBody);

        if (res.data.status === "SUCCESS") {
          alert("대표 권한 설정이 변경되었습니다.");
          this.resetTransferForm();
          this.fetchData(); // 기기 목록 새로고침
        } else {
          alert(res.data.message || "설정 변경에 실패했습니다.");
          this.cancelTransfer();
        }
      } catch (e) {
        this.handleScopeError(e);
        this.cancelTransfer();
      }
    },

    // --- 기기 추가 관련 로직 ---
    openAddDevice() {
      this.addDeviceForm.searchIMEI = '';
      this.addDeviceForm.searchResult = null;
      this.showAddDeviceLayer = true;
    },

    async searchDeviceForAdd() {
      if (!this.addDeviceForm.searchIMEI) return alert("IMEI를 입력하세요.");

      try {
        const res = await api.getDeviceInsSearch(this.addDeviceForm.searchIMEI);

        if (res.data.status === "SUCCESS" && res.data.data.length > 0) {
          const deviceRows = res.data.data;

          // 1. 중복 체크: 현재 사용자(guard.guardNo)가 이미 이 기기에 연결되어 있는지 확인
          const isAlreadyConnected = deviceRows.some(row => row.guardNo === this.guard.guardNo);
          if (isAlreadyConnected) {
            alert("이미 이 사용자에게 연결된 기기입니다.");
            this.addDeviceForm.searchResult = null;
            return;
          }

          // 2. 사용자 유형 판별 로직 수정
          // 전체 로우 중 masterGuardNo가 0이 아닌 로우가 하나라도 있는지 확인 (기존 대표 존재 여부)
          const existingMaster = deviceRows.find(row => row.masterGuardNo !== 0);

          let userType, userTypeNm, masterGuardNo;

          if (existingMaster) {
            // 이미 대표가 있는 경우 -> '추가' 유형
            userType = '2';
            userTypeNm = '추가';
            masterGuardNo = existingMaster.masterGuardNo; // 기존 대표의 번호를 할당
          } else {
            // 모든 masterGuardNo가 0인 경우 -> '대표' 유형 가능
            userType = '1';
            userTypeNm = '대표';
            masterGuardNo = 0; // 나중에 executeAddDevice에서 현재 사용자의 guardNo로 덮어씌움
          }

          // 3. 결과 데이터 저장 (첫 번째 row의 기본 정보 + 판별된 유형 정보)
          this.addDeviceForm.searchResult = {
            ...deviceRows[0], // deviceNo, deviceIMEI 등 공통 정보 활용
            userType: userType,
            userTypeNm: userTypeNm,
            masterGuardNo: masterGuardNo
          };

          console.log('판별된 기기 상태:', this.addDeviceForm.searchResult);
        } else {
          alert("조회된 기기가 없거나 추가할 수 없는 상태입니다.");
          this.addDeviceForm.searchResult = null;
        }
      } catch (e) {
        this.handleScopeError(e, "조회 중 오류가 발생했습니다.");
      }
    },

    async executeAddDevice() {
      if (!this.addDeviceForm.searchResult) return;

      if (confirm("기기를 추가하시겠습니까?")) {
        try {
          const result = this.addDeviceForm.searchResult;
          const currentGuardNo = this.guard.guardNo;

          const requestBody = {
            deviceNo: result.deviceNo,
            guardNo: currentGuardNo,
            // 유형이 대표('1')이면 자신의 번호를, 추가('2')이면 조회된 기존 대표 번호를 사용
            masterGuardNo: result.userType === '1' ? currentGuardNo : result.masterGuardNo
          };

          const res = await api.insDeviceGuardByAdmin(requestBody);

          if (res.data.status === "SUCCESS") {
            alert("기기가 추가되었습니다.");
            this.showAddDeviceLayer = false;
            this.fetchData();
          } else {
            alert(res.data.message || "추가 실패");
          }
        } catch (e) {
          this.handleScopeError(e);
        }
      }
    },

    async revokePermission(item) {
      // item: deviceList의 각 로우 객체 (deviceNo 포함)
      if (confirm("해당 기기에 대한 권한을 해제하시겠습니까?")) {
        try {
          // API 요구사항에 맞춰 파라미터 구성
          const requestBody = {
            guardNo: this.guard.guardNo,   // 현재 편집 중인 사용자 번호
            deviceNo: item.deviceNo       // 선택한 기기의 번호
          };

          const res = await api.delDeviceGuardianByAdmin(requestBody);

          if (res.data.status === "SUCCESS") {
            alert("권한이 해제되었습니다.");
            this.fetchData(); // 삭제 후 목록 새로고침
          } else {
            alert(res.data.message || "권한 해제에 실패했습니다.");
          }
        } catch (e) {
          this.handleScopeError(e, "서버 통신 중 오류가 발생했습니다.");
        }
      }
    },

    closePopup() { window.close(); },
    handleScopeError(e, fallbackMessage = "처리 중 오류가 발생했습니다.") {
      const status = e?.response?.status;
      if(status === 403 || status === 401) {
        alert("관리 권한 범위 밖의 요청입니다.");
        return;
      }
      alert(e?.response?.data?.message || fallbackMessage);
    },
  }
}
</script>

<style scoped>
.translate-middle { transform: translate(-50%, -50%) !important; }

.notice-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1060;
  min-width: 220px;
  max-width: 320px;
  padding: 10px 14px;
  border-radius: 4px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
  font-size: 13px;
  font-weight: 600;
  text-align: center;
}

.notice-toast-success {
  color: #0f5132;
  background: #d1e7dd;
  border: 1px solid #badbcc;
}
</style>
