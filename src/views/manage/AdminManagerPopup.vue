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
                <option value="ROLE_ADMIN">관리자</option>
                <option value="ROLE_SADMIN">최고 관리자</option>
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

                  class="form-control form-control-sm"
                  maxlength="13"
              >
            </td>
          </tr>
          <tr>
            <th class="text-center bg-light small py-2">관리 도(시) 영역 설정</th>
            <td class="small ps-2"></td>
          </tr>

          </tbody>
        </table>
      </div>
    </div>

    <div class="text-center mt-3">
      <template v-if="isUpdateMode">
        <button class="btn btn-outline-secondary btn-sm px-4 mx-1" @click="updateManager">수정</button>
        <button class="btn btn-outline-secondary btn-sm px-4 mx-1" @click="deleteManager">삭제</button>
      </template>
      <template v-else>
        <button class="btn btn-primary btn-sm px-4 mx-1" @click="registerManager">등록</button>
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
        mgrNo: '',
        mgrType: 'ROLE_ADMIN',
        nation: 'KR',
        mgrName: '',
        mgrPhone: '',
        mgrId: '',
        manageCity: '',
        islocked: 'N'
      },
      isUpdateMode: false,
      isRegistered: false,
      mgrNo: null,
      utils: utils,
      guard: { guardPhone: '', guardName: '', email: '', lastLoginDate: null, accountState: 'N', maketingAgreeYn: 'Y' },
      deviceList: [],

      originalMgrId: '', // 추가: 수정 전 ID 비교용
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

    async checkDuplicate(param) {
      const checkRes = await api.checkManagerId(param.mgrId);
      if (checkRes.data.data >= 1) {
        alert("중복된 이메일(ID)입니다.");
        return true;
      }
      return false;
    },

    async checkEmail() {
      const email = this.manager.mgrId;
      if (!email || email.trim() === '') {
        alert("ID(이메일)을 입력해 주세요.");
        return false;
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
        const manager = await api.getManagerByAdmin(this.mgrNo);
        if (manager.data.status === "SUCCESS") {
          const data = manager.data.data;
          this.manager = data;
          // 수정 모드일 때 비교를 위해 원본 ID 저장
          this.originalMgrId = data.MGR_ID || data.mgrId;
        }

      } catch (e) { console.error(e); }
    },

    async registerManager() {
      const param = { ...this.manager};
      if (await this.checkDuplicate(param)) return;
      if (!await this.checkEmail()) return;
      try {
        const res = await api.registerManagerByAdmin(param);
        if (res.data.status === "SUCCESS") {
          alert("등록되었습니다.");
          window.opener.vueComponent.selectManagerList();
          this.isRegistered = true;
          this.closePopup();
        } else {
          alert("등록에 실패했습니다.");
        }
      } catch (e) {
        alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      }
    },

    async updateManager() {
      // 1. 이메일 형식 유효성 검사부터 수행
      if (!await this.checkEmail()) return;

      const param = { ...this.manager };

      // 2. ID 변경 여부 확인 (수정 모드 전용 로직)
      // 입력된 ID와 처음에 불러온 원본 ID가 다를 경우에만 중복 체크 실행
      if (this.manager.mgrId !== this.originalMgrId) {
        if (await this.checkDuplicate(param)) return;
      }

      try {
        const res = await api.updMangerByAdmin(param);
        if (res.data.status === "SUCCESS") {
          if(res.data.data == 1) {
            alert("수정 되었습니다.");
            // 부모 창 리스트 갱신
            if (window.opener && window.opener.vueComponent) {
              window.opener.vueComponent.selectManagerList();
            }
            this.originalMgrId = this.manager.mgrId; // 수정 후 현재 ID를 다시 원본으로 갱신
            this.closePopup();
          }else{
            alert("수정 실패");
          }

        }
      } catch (e) {
        alert("수정 중 오류가 발생했습니다.");
      }
    },

    async deleteManager() {
      if (confirm("삭제하시겠습니까?")) {
        const res = await api.delManagerByAdmin(this.mgrNo);
        if (res.data.status === "SUCCESS") {
          alert("삭제 되었습니다.");
          window.opener.vueComponent.selectGuardList();
          this.closePopup();
        } else {
          alert("삭제에 실패했습니다.");
        }
      }
    },


    closePopup() { window.close(); },
  }
}
</script>

<style scoped>
.translate-middle { transform: translate(-50%, -50%) !important; }
</style>