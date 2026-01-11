<template>
  <div class="container-fluid p-3 position-relative">
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
              <select v-model="guard.accountState" class="form-select form-select-sm">
                <option value="N">정상</option>
                <option value="H">휴면</option>
                <option value="S">정지(제재)</option>
                <option value="D">탈퇴</option>
              </select>
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
            <select v-model="item.notiCd" class="form-select form-select-sm">
              <option value="">설정</option>
              <option value="NC03">3시간 알림 해제</option>
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
        <button class="btn btn-outline-secondary btn-sm px-4 mx-1" @click="deleteGuard">삭제</button>
      </template>
      <template v-else>
        <button class="btn btn-primary btn-sm px-4 mx-1" @click="registerGuard">등록</button>
        <button class="btn btn-outline-secondary btn-sm px-4 mx-1" @click="closePopup">취소</button>
      </template>
    </div>

    <div v-if="showTransferLayer" class="position-absolute top-50 start-50 translate-middle bg-white border border-dark p-3 shadow" style="width: 450px; z-index: 1050;">
      <div class="d-flex justify-content-between mb-2">
        <h6 class="fw-bold">대표 사용자 이전</h6>
        <button type="button" class="btn-close btn-sm" @click="showTransferLayer = false"></button>
      </div>
      <p class="small">이 기기(ID: {{selectedDevice.deviceIMEI}})의 대표 권한을 이전하시겠습니까?</p>
      <div class="input-group input-group-sm mb-3 border">
        <span class="input-group-text bg-light border-0">전화번호(ID)</span>
        <input type="text" class="form-control border-0" v-model="searchKey">
        <button class="btn btn-info text-white" @click="searchGuardForTransfer">조회</button>
      </div>
      <div v-if="searchResult" class="border-top border-bottom py-2 d-flex align-items-center">
        <input type="checkbox" class="form-check-input ms-2 me-3" style="width:20px; height:20px;" @change="executeTransfer">
        <span class="small">ID : {{ searchResult.guardPhone }}</span>
      </div>
    </div>

    <div v-if="showAddDeviceLayer" class="position-absolute top-50 start-50 translate-middle bg-white border border-dark p-3 shadow" style="width: 450px; z-index: 1050;">
      <div class="d-flex justify-content-between mb-3">
        <h6 class="fw-bold">기기 추가</h6>
        <button type="button" class="btn-close btn-sm" @click="showAddDeviceLayer = false"></button>
      </div>
      <div class="input-group input-group-sm mb-3 border">
        <span class="input-group-text bg-light border-0">IMEI</span>
        <input type="text" class="form-control border-0" v-model="searchKey">
        <button class="btn btn-info text-white" @click="searchDeviceForAdd">조회</button>
      </div>
      <div v-if="searchResult" class="border-top border-bottom py-2 d-flex align-items-center">
        <input type="checkbox" class="form-check-input ms-2 me-3" style="width:20px; height:20px;" @change="executeAddDevice">
        <span class="small">IMEI : {{ searchResult.deviceIMEI }} &nbsp;&nbsp; 사용자 유형 : 대표</span>
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
      isRegistered: false, // 등록 직후 추가 버튼 활성화용
      guardNo: null,
      utils: utils,
      guard: {
        guardPhone: '',
        guardName: '',
        email: '',
        lastLoginDate: null,
        accountState: 'N'
      },
      deviceList: [],
      // 레이어 관련
      showTransferLayer: false,
      showAddDeviceLayer: false,
      searchKey: '',
      searchResult: null,
      selectedDevice: {}
    }
  },
  mounted() {
    this.guardNo = this.$route.query.guardNo;
    if (utils.isNotEmpty(this.guardNo)) {
      console.log(this.guardNo)
      this.isUpdateMode = true;
      this.fetchData();
    }
  },
  methods: {
    async fetchData() {
      try {
        // 1. 사용자 정보 조회
        const resGuard = await api.getGuardianInfo(this.guardNo);
        if (resGuard.data.status === "SUCCESS") {
          const data = resGuard.data.data;
          // 수신된 데이터를 포맷팅하여 저장
          data.guardPhone = utils.telForm(data.guardPhone);
          this.guard = data;
        } else {
          alert("사용자 정보를 불러오는데 실패했습니다.");
        }

        // 2. 기기 목록 조회
        const resDevice = await api.selDeviceListByAdmin(this.guardNo);
        if (resDevice.data.status === "SUCCESS") {
          this.deviceList = resDevice.data.data;
        }
      } catch (e) {
        console.error(e);
      }
    },
    async registerGuard() {
      // regGuard API 호출 로직
      const res = await api.insGuardianByAdmin(this.guard);
      if(res.data.status === "SUCCESS") {
        alert("등록되었습니다. 이제 기기를 추가할 수 있습니다.");
        this.isRegistered = true;
        // 등록 후 guardNo를 받아와서 수정 모드로 전환하거나 상태 유지
      }
    },

    async updateGuard() {

    },
    async deleteGuard(){

    },

    handleUserTypeChange(event, item) {
      if (event.target.value === '1') { // 대표로 변경 시
        this.selectedDevice = item;
        this.searchKey = '';
        this.searchResult = null;
        this.showTransferLayer = true;
      }
    },
    openAddDevice() {
      this.searchKey = '';
      this.searchResult = null;
      this.showAddDeviceLayer = true;
    },
    // 레이어 조회 1: 대표 이전용 사용자 조회
    async searchGuardForTransfer() {
      const res = await api.getMasterGuardianSearch(this.searchKey); // 휴대폰 번호로 조회
      if(res.data.status === "SUCCESS") {
        this.searchResult = res.data.data;
      }
    },
    // 레이어 조회 2: 기기 추가용 IMEI 조회
    async searchDeviceForAdd() {
      const res = await api.getDeviceInsSearch(this.searchKey);
      if(res.data.status === "SUCCESS") {
        this.searchResult = res.data.data;
      }
    },
    executeTransfer() {
      if(confirm("대표 권한을 이전하시겠습니까?")) {
        // 이전 API 호출 로직...
        this.showTransferLayer = false;
        this.fetchData();
      }
    },
    executeAddDevice() {
      if(confirm("기기를 추가하시겠습니까?")) {
        // 추가 API 호출 로직...
        this.showAddDeviceLayer = false;
        this.fetchData();
      }
    },
    revokePermission(item) {
      if(confirm("권한을 해제하시겠습니까?")) {
        // 해제 로직
      }
    },
    closePopup() {
      window.close();
    }
  }
}
</script>

<style scoped>
.translate-middle { transform: translate(-50%, -50%) !important; }
</style>