<template>
  <div class="wrap">
    <div class="img_item row">
      <div class="col-6 text-center" style="padding-top: 120px;">
        <div><img src="static/images/kokasin_admin_logo.png" alt="ktkokasin" /></div>
      </div>

      <div class="col-6">
        <div id="login-box" class="login_form">
          <div class="login_area">

            <ul v-if="step === 'LOGIN'">
              <li class="login_te">ID</li>
              <li class="login_bar"><input type="text" class="input_txt" v-model="loginId"></li>
              <li class="login_te">Password</li>
              <li class="login_bar"><input type="password" class="input_txt" v-model="password" @keyup.enter="handleLogin"></li>
              <li class="login_fail" v-html="failMessage"></li>
              <li><button id="submit" class="btn mt-4" @click="handleLogin">로그인</button></li>
              <li class="text-end mt-2">
                <a href="#" @click.prevent="step = 'RESET_PWD'" style="font-size: 12px; color: #666;">비밀번호를 잊으셨나요?</a>
              </li>
            </ul>

            <ul v-else-if="step === 'MFA'" style="color: #000;">
              <li class="text-center mb-4">
                <h3 style="font-weight: bold; color: #000;">2단계 인증</h3>
                <p style="color: #000;">계정 보호를 위해 2단계 인증을 진행합니다.</p>
              </li>

              <li class="mt-4">
                <p style="color: #000;">인증 수단을 선택하여 인증을 진행해주세요.</p>

                <div class="mfa_options mt-3">
                  <div class="d-flex align-items-center mb-2">
                    <label class="d-flex align-items-center mb-0" style="color: #000; cursor: pointer;">
                      <input type="radio" v-model="mfaType" value="EMAIL" class="me-2"> 이메일
                    </label>
                    <span class="ms-auto" style="color: #000; font-weight: 500;">{{ maskedEmail }}</span>
                  </div>

                  <div class="d-flex align-items-center mb-3">
                    <label class="d-flex align-items-center mb-0" style="color: #000; cursor: pointer;">
                      <input type="radio" v-model="mfaType" value="PHONE" class="me-2"> 휴대폰
                    </label>
                    <span class="ms-auto" style="color: #000; font-weight: 500;">{{ maskedPhone }}</span>
                  </div>
                </div>

                <div class="text-center mt-3">
                  <button
                      type="button"
                      class="btn_white_luxury"
                      @click="sendMfaCode"
                  >
                    {{ isMfaSent ? '인증번호 재발송' : '인증번호 발송' }}
                  </button>
                </div>
              </li>

              <li v-if="isMfaSent" class="mt-4">
                <div class="d-flex align-items-center mb-3">
                  <span class="me-3" style="white-space: nowrap; font-weight: bold; color: #000;">인증번호</span>
                  <div style="position: relative; flex-grow: 1;">
                    <input type="text" class="input_txt" v-model="mfaCode" style="padding-right: 60px; color: #000;">
                    <span style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: #ff5252; font-weight: bold;">
          {{ timerText }}
        </span>
                  </div>

                </div>
                <div><li class="login_fail" v-html="failMessage"></li></div>
                <button id="submit" class="btn mt-2" @click="verifyMfa" style="font-weight: bold;">인증 확인</button>
              </li>
            </ul>



          </div>
        </div>
      </div>
    </div>
    <div class="login_copy">Copyright ⓒ SmartMedicalDevice Co., Ltd. All Rights Reserved.</div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import utils from "@/utils/utils";
import api from "@/api/api";
import http from "@/api/http";

export default {
  name: "Login",
  data() {
    return {
      step: 'LOGIN',
      loginId: '',
      password: '',
      failMessage: '',

      mfaType: 'EMAIL',
      mfaCode: '',
      isMfaSent: false,
      timer: 300,
      timerInterval: null,
      rawEmail: 'admin@example.com',
      rawPhone: '01012345678',
      pwdChange: 'N',

      newPassword: '',
      confirmPassword: ''
    }
  },
  computed: {
    maskedEmail() {
      if(!this.rawEmail) return '';
      if (this.rawEmail.indexOf('@') === -1) return this.rawEmail;
      const [id, domain] = this.rawEmail.split('@');
      return id.slice(0, -3) + '***@' + domain;
    },
    maskedPhone() {
      return this.rawPhone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3');
    },
    timerText() {
      const min = Math.floor(this.timer / 60);
      const sec = this.timer % 60;
      return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }
  },
  methods: {
    ...mapActions("adminStore", ["commitAdminInfo", "commitToken"]),

    async handleLogin() {
      if (utils.isEmpty(this.loginId) || utils.isEmpty(this.password)) {
        alert("아이디와 비밀번호를 입력해주세요.");
        return;
      }

      try {
        const params = { loginId: this.loginId, password: this.password };
        // 실제 API 호출 부분
        const res = await api.login_step1(params);

        if (res.data.status === "SUCCESS") {
          const data = res.data.data || {};
          const manager = data.manager || {};
          this.rawEmail = data.maskedEmail || manager.mgrId || manager.MGR_ID || data.mgrId || data.MGR_ID || this.loginId;
          this.rawPhone = manager.mgrPhone || manager.MGR_PHONE || data.mgrPhone || data.maskedPhone || "";

          if(res.data.data.status === "MFA")
            this.step = 'MFA';

        }
      } catch (e) {
        this.handleLoginError(e);
      }
    },

    async sendMfaCode() {
      const params = { loginId: this.loginId, mfaType: this.mfaType};
      const res = await api.login_step2(params);
      if (res.data.status === "SUCCESS") {
        alert(`${this.mfaType === 'EMAIL' ? '이메일' : '휴대폰'}으로 인증번호가 발송되었습니다.`);
        this.isMfaSent = true;
        this.timer = 300;
        if (this.timerInterval) clearInterval(this.timerInterval);

        this.timerInterval = setInterval(() => {
          if (this.timer > 0) this.timer--;
          else {
            clearInterval(this.timerInterval);
            alert("인증 시간이 만료되었습니다. 다시 시도해주세요.");
            this.isMfaSent = false;
          }
        }, 1000);
      }else{
        this.handleLoginError(e);
      }

    },

    async verifyMfa() {
      if (this.mfaCode.length < 6) {
        alert("인증번호 6자리를 입력해주세요.");
        return;
      }


      try {
        const params = {loginId: this.loginId, mfaCode: this.mfaCode};
        const res = await api.login_verify(params);
        if (res.data.status === "SUCCESS") {
          // 인증 성공 시 프로세스 완료
          clearInterval(this.timerInterval);

          this.pwdChange = res.data.data.pwdChange;

          if (this.pwdChange === "Y") {
            this.$router.replace({
              name: 'PwdChange',
              params: {
                forceChange: 'Y'
              }
            });
          } else {
            let tokenData = res.data.data.token;

            let payload = {adminId: this.loginId, autoLogin: "N"};
            this.commitAdminInfo(payload);
            this.commitToken(tokenData);
            http.setToken(tokenData);

            this.$router.replace("/device");
          }

        }
      }catch (e){
        this.handleLoginError(e);
      }
    },




    handleLoginError(e) {
      console.log(e);
      this.failMessage = e.response?.data?.message || "로그인 실패";
      let failcnt = e.response?.data?.data;
      if (failcnt >= 1) {
        this.failMessage += `<br> 5회 이상 실패 시 로그인 불가 (${failcnt}/5)`;
        if (failcnt === 5) alert("계정이 잠겼습니다.");
      }
      this.password = "";
    }
  },
  beforeDestroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }
}
</script>

<style scoped>
/* 고급스러운 화이트 버튼 스타일 */
.btn_white_luxury {
  background-color: #ffffff;
  color: #333333;
  border: 1px solid #d1d9e6;
  padding: 8px 24px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: all 0.2s ease;
  cursor: pointer;
  width: auto;
}

.btn_white_luxury:hover {
  background-color: #f8f9fa;
  border-color: #bcbcbc;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.btn_white_luxury:active {
  background-color: #f0f0f0;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
}

/* 기존 입력창 포커스 시 블랙 텍스트 유지 */
.input_txt {
  color: #000 !important;
}
</style>
