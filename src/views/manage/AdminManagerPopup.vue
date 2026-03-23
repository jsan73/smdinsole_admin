<template>
  <div class="container-fluid p-3 position-relative">
    <h5 class="pb-2 fw-bold">
      <i class="bi bi-caret-right-square"></i> 관리자 {{ isUpdateMode ? '수정' : '추가' }}
    </h5>

    <div class="card mb-3">
      <div class="card-body p-0">
        <table class="table table-sm table-bordered mb-0 align-middle">
          <colgroup><col style="width: 30%"><col style="width: 70%"></colgroup>
          <tbody>
          <tr>
            <th class="text-center bg-light small py-2">권한</th>
            <td>
              <select v-model="manager.mgrType" class="form-select form-select-sm">
                <option value="ROLE_SADMIN">최고 관리자</option>
                <option value="ROLE_ADMIN">관리자</option>
              </select>
            </td>
          </tr>
          <tr>
            <th class="text-center bg-light small py-2">소속 국가</th>
            <td>
              <select v-model="manager.nation" class="form-select form-select-sm">
                <option value="KR">KR</option>
                <option value="US_CA">US_CA</option>
              </select>
            </td>
          </tr>
          <tr>
            <th class="text-center bg-light small py-2">이름</th>
            <td><input type="text" v-model="manager.mgrName" class="form-control form-control-sm w-50"></td>
          </tr>
          <tr>
            <th class="text-center bg-light small py-2">이메일(ID)</th>
            <td>
              <input
                  type="text"
                  v-model="manager.mgrId"
                  class="form-control form-control-sm"
                  maxlength="20"
              >
            </td>
          </tr>

          <tr>
            <th class="text-center bg-light small py-2">연락처</th>
            <td>
              <input
                  type="text"
                  v-model="manager.mgrPhone"
                  @change="manager.mgrPhone = utils.telForm(gmanager.mgrPhone.replace(/[^0-9]/g, ''))"
                  class="form-control form-control-sm"
                  maxlength="13"
              >
            </td>
          </tr>
          <tr v-if="isUpdateMode">
            <th class="text-center bg-light small py-2">관리 도(시) 영역 설정</th>
            <td class="small ps-2"></td>
          </tr>
          <tr>
            <th class="text-center bg-warning small py-2" style="--bs-bg-opacity: .2;">계정상태</th>
            <td>
              <select v-model="manager.mgrState" class="form-select form-select-sm">
                <option value="N">잠금</option>
                <option value="H">해제</option>
                <option value="H">정지</option>
              </select>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
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

  </div>
</template>

<script>
import api from '@/api/api';
import utils from "@/utils/utils";

export default {
  name: "AdminManagerPopup",
  data() {
    return {
      manager : {
        mgrType: 'A',
        nation: 'KR',
        mgrName: '',
        mgrPhone: '',
        mgrId: '',
        mgrState: 'A',
        manageCity: '',
      },
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
        selectedDeviceIMEI: ''
      },

      originalPhone: '',
      isEmailValid: true,
    }
  },
  mounted() {
    const queryNo = this.$route.query.mgrNo;
    if (queryNo) {
      this.mgrNo = queryNo;
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
        const resGuard = await api.getManagerByAdmin(this.mgrNo);
        if (resGuard.data.status === "SUCCESS") {
          // const data = resGuard.data.data;
          // const formatted = this.utils.telForm(this.getRawPhone(data.guardPhone));
          // data.guardPhone = formatted;
          // this.guard = data;
          // this.originalPhone = formatted;
        }

      } catch (e) { console.error(e); }
    },

    async registerGuard() {
      // const param = { ...this.guard, guardPhone: this.getRawPhone(this.guard.guardPhone) };
      // if (await this.checkDuplicate(param)) return;
      // if (!await this.checkEmail()) return;
      // const res = await api.insGuardianByAdmin(param);
      // if (res.data.status === "SUCCESS") {
      //   alert("등록되었습니다.");
      //   window.opener.vueComponent.selectGuardList();
      //   this.isRegistered = true;
      // }
    },

    async updateGuard() {
      // const param = { ...this.guard, guardPhone: this.getRawPhone(this.guard.guardPhone) };
      // const isPhoneChanged = this.getRawPhone(this.guard.guardPhone) !== this.getRawPhone(this.originalPhone);
      //
      // if (isPhoneChanged && await this.checkDuplicate(param)) return;
      // if(!await this.checkEmail()) return;
      //
      // const res = await api.updGuardianByAdmin(param);
      // if (res.data.status === "SUCCESS") {
      //   alert("수정 되었습니다.");
      //   window.opener.vueComponent.selectGuardList();
      //   this.originalPhone = this.guard.guardPhone;
      // }
    },








    deleteGuard() {
      if (confirm("삭제하시겠습니까?")) { /* 삭제 API 호출 */ }
    },

    closePopup() { window.close(); },
  }
}
</script>

<style scoped>
.translate-middle { transform: translate(-50%, -50%) !important; }
</style>