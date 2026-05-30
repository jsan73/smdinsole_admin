<template>
  <div class="wrap">
    <div class="img_item row">
      <div class="col-6 text-center" style="padding-top: 120px;">
        <div><img src="static/images/kokasin_admin_logo.png" alt="ktkokasin" /></div>
      </div>
      <div class="col-6">
        <div id="login-box" class="login_form">
          <div class="login_area">

            <div v-if="!isSuccess">
              <h3 style="color: #333; font-weight: bold; text-align: center; margin-bottom: 10px;">
                {{ pwdChangeType === 'PF' ? '관리자 비밀번호 변경' : '관리자 신규 비밀번호 설정' }}
              </h3>
              <p v-if="isForce === 'Y' && pwdChangeType === 'PF'" style="color: #333; text-align: center; margin-bottom: 30px;">
                개인정보 취급자는 6개월에 한 번씩 비밀번호를 변경해야 합니다.
              </p>



              <ul v-if="isForce === 'Y'">
                <li v-if="pwdChangeType === 'PF'" class="login_bar compact_li">
                  <input type="password" class="input_txt" v-model="cur_password" placeholder="현재 비밀번호 입력">
                </li>

                <li class="login_bar compact_li">
                  <input type="password" class="input_txt" v-model="password" placeholder="신규 비밀번호 입력">
                </li>

                <li class="password_hint">
                  (영문, 숫자, 특수문자 조합 8~16자 입력)
                </li>

                <li class="login_bar compact_li">
                  <input type="password" class="input_txt" v-model="password_confirm" placeholder="신규 비밀번호 확인">
                </li>

                <li class="compact_li">
                  <button id="submit" class="btn mt-3" @click="change_password">확인</button>
                </li>
              </ul>
            </div>

            <div v-else class="text-center py-5">
              <p style="color: #333; font-weight: bold; font-size: 16px; margin-bottom: 40px;">
                비밀번호가 성공적으로 변경되었습니다.
              </p>
              <button id="submit" class="btn" @click="goLogin">로그인하기</button>
            </div>

          </div>
        </div>
      </div>
    </div>
    <div class="login_copy">Copyright ⓒ SmartMedicalDevice Co., Ltd. All Rights Reserved.</div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import utils from "@/utils/utils";
import api from "@/api/api";
import store from "@/store";

export default {
  name: "LoginChgPwd",
  data() {
    return {
      loginId: '', cur_password: '', password: '', password_confirm: '',
      isForce: 'N', isSuccess: false, pwdChangeType: 'N'
    }
  },
  computed: {
    ...mapState("adminStore", ['adminInfo'])
  },
  methods: {
    ...mapActions("adminStore", ["commitAdminInfo","clearPwdChange", "commitToken"]),

    validatePassword(pw) {
      // 이미지에 명시된 영문, 숫자, 특수문자 조합 8~16자 규칙 적용
      const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
      return regex.test(pw);
    },

    async change_password() {
      if (this.pwdChangeType === 'PF' && utils.isEmpty(this.cur_password)) return alert("현재 비밀번호를 입력해 주세요.");
      if (utils.isEmpty(this.password)) return alert("비밀번호를 입력해 주세요.");
      if (!this.validatePassword(this.password)) return alert("비밀번호는 8~16자 이내의 영문, 숫자, 특수문자 조합이어야 합니다.");
      if (this.password !== this.password_confirm) return alert("비밀번호가 일치하지 않습니다.");

      try {
        const params = { mgrId: this.loginId, newPwd: this.password, pwdChangeType: this.pwdChangeType };
        if (this.pwdChangeType === 'PF') params.currentPwd = this.cur_password;
        const res = await api.updChangePwd(params);
        if (res.data.status === "SUCCESS") {
          this.isSuccess = true;
          this.clearPwdChange();
          this.commitToken('')
        }
      } catch (e) { alert(e.response?.data?.message || "변경 실패"); }
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
    goLogin() {
      window.location.href = "/login"
      // this.$router.replace("/");
    }
  },
  mounted() {
    this.loginId = this.adminInfo?.adminId || this.$route.params.mgrId;

    // vuex에서 값을 가져오지 못하기 때문에 파라메터로 값을 바인딩
    // session에 값을 저장 하는 이유는 새로고침으로 인한 값 상실을 보완하기 위함
    this.pwdChangeType = this.$route.params.pwdChangeType || store.getters['adminStore/getPwdChange'];
    if(this.pwdChangeType === 'PF' || this.pwdChangeType === 'NF') this.isForce = 'Y';
    // this.isForce = store.getters['adminStore/getPwdChange'];
    console.log("PwdChange mounted : ",this.pwdChangeType);
  }
}
</script>

<style scoped>
/* 1. li 간격 줄이기 */
.compact_li {
  margin-bottom: 8px !important; /* 기존 간격보다 좁게 조정 */
}

/* 2. 안내 문구를 윗 라인에 바짝 붙이기 */
.password_hint {
  list-style: none;
  font-size: 13px;
  color: #333; /* 요청하신 다크 그레이 */
  margin-top: -6px; /* 윗 라인 입력창에 바짝 붙도록 음수 마진 적용 */
  margin-bottom: 12px; /* 아래 입력창과의 최소 간격 */
  padding-left: 5px;
}

/* 3. 입력창 폰트 컬러 */
.input_txt {
  color: #333 !important;
}

/* 버튼 상단 마진 미세 조정 */
.btn.mt-4 {
  margin-top: 1.5rem !important; /* mt-4가 너무 멀면 mt-3 정도로 조정 권장 */
}
</style>
