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
                <a href="#" @click.prevent="step = 'FIND_PWD'" style="font-size: 12px; color: #333;">비밀번호를 잊으셨나요?</a>
              </li>
            </ul>

            <ul v-else-if="step === 'MFA'" style="color: #333;">
              <li class="text-center mb-4">
                <h3 style="font-weight: bold; color: #333;">2단계 인증</h3>
                <p style="color: #333;">계정 보호를 위해 2단계 인증을 진행합니다.</p>
              </li>

              <li class="mt-4">
                <p style="color: #333;">인증 수단을 선택하여 인증을 진행해주세요.</p>
                <div class="mfa_options mt-3">
                  <div class="d-flex align-items-center mb-2">
                    <label class="d-flex align-items-center mb-0" style="color: #333; cursor: pointer;">
                      <input type="radio" v-model="mfaType" value="EMAIL" class="me-2"> 이메일
                    </label>
                    <span class="ms-auto" style="color: #333; font-weight: 600;">{{ maskedEmail }}</span>
                  </div>
                  <div class="d-flex align-items-center mb-3">
                    <label class="d-flex align-items-center mb-0" style="color: #333; cursor: pointer;">
                      <input type="radio" v-model="mfaType" value="PHONE" class="me-2"> 휴대폰
                    </label>
                    <span class="ms-auto" style="color: #333; font-weight: 600;">{{ maskedPhone }}</span>
                  </div>
                </div>
                <div class="text-center mt-3">
                  <button type="button" class="btn_white_luxury" @click="sendMfaCode">
                    {{ isMfaSent ? '인증번호 재발송' : '인증번호 발송' }}
                  </button>
                </div>
              </li>

              <li v-if="isMfaSent" class="mt-4">
                <div class="d-flex align-items-center mb-3">
                  <span class="me-3" style="white-space: nowrap; font-weight: bold; color: #333;">인증번호</span>
                  <div style="position: relative; flex-grow: 1;">
                    <input type="text" class="input_txt" v-model="mfaCode" style="padding-right: 60px; color: #333;">
                    <span style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: #ff5252; font-weight: bold;">{{ timerText }}</span>
                  </div>
                </div>
                <div class="login_fail" v-html="failMessage"></div>
                <button id="submit" class="btn mt-2" @click="verifyMfa" style="font-weight: bold;">인증 확인</button>
              </li>
            </ul>

            <ul v-else-if="step === 'FIND_PWD'">
              <li class="text-center mb-4"><h3 style="font-weight: bold; color: #333;">비밀번호 재설정</h3></li>
              <li class="login_te">ID (이메일)</li>
              <li class="login_bar"><input type="text" class="input_txt" v-model="findInfo.mgrId" placeholder="이메일 입력"></li>
              <li class="login_te">이름</li>
              <li class="login_bar"><input type="text" class="input_txt" v-model="findInfo.mgrName" placeholder="이름 입력"></li>
              <li class="text-center mt-4" v-if="findError">
                <p style="color: #333; font-weight: bold;">{{ findError }}</p>
              </li>
              <li><button id="submit" class="btn mt-4" @click="handleFindPwd">확인</button></li>
              <li class="text-center mt-2"><a href="#" @click.prevent="step = 'LOGIN'" style="font-size: 12px; color: #333;">로그인으로 돌아가기</a></li>
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
      step: 'LOGIN', loginId: '', password: '', failMessage: '',
      mfaType: 'EMAIL', mfaCode: '', isMfaSent: false,
      timer: 300, timerInterval: null,
      rawEmail: '', rawPhone: '',
      findInfo: { mgrId: '', mgrName: '', findYn: false }, findError: '',
      pwdChangeType : "N",

    }
  },
  computed: {
    maskedEmail() {
      if(!this.rawEmail) return '';
      const [id, domain] = this.rawEmail.split('@');
      return id.slice(0, -3) + '***@' + domain;
    },
    maskedPhone() {
      if(!this.rawPhone) return '';
      return this.rawPhone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3');
    },
    timerText() {
      const min = Math.floor(this.timer / 60);
      const sec = this.timer % 60;
      return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }
  },
  methods: {
    ...mapActions("adminStore", ["commitAdminInfo", "commitToken", "commitPwdChange",]),

    async handleLogin() {
      if (utils.isEmpty(this.loginId) || utils.isEmpty(this.password)) {
        alert("아이디와 비밀번호를 입력해주세요.");
        return;
      }
      try {
        const params = { loginId: this.loginId, password: this.password };
        const res = await api.login_step1(params);
        if (res.data.status === "SUCCESS") {
          this.rawEmail = res.data.data.manager.mgrEmail;
          this.rawPhone = res.data.data.manager.mgrPhone;
          if(res.data.data.status === "MFA") this.step = 'MFA';
        }
      } catch (e) { this.handleLoginError(e); }
    },

    async sendMfaCode() {
      try {
        const params = { loginId: this.loginId, mfaType: this.mfaType };
        const res = await api.login_step2(params);
        if (res.data.status === "SUCCESS") {
          alert(`${this.mfaType === 'EMAIL' ? '이메일' : '휴대폰'}으로 인증번호가 발송되었습니다.`);
          this.isMfaSent = true;
          this.startTimer();
        }
      } catch (e) { alert("인증번호 발송에 실패했습니다."); }
    },

    startTimer() {
      this.timer = 300;
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        if (this.timer > 0) this.timer--;
        else { clearInterval(this.timerInterval); this.isMfaSent = false; }
      }, 1000);
    },

    async verifyMfa() {
      try {
        const params = { loginId: this.loginId, mfaCode: this.mfaCode };
        if(this.findInfo.findYn) {
          const res = await api.login_verify_pwfind(params);
          if (res.data.status === "SUCCESS") {
            alert("인증되었습니다. 이메일(ID)로 임시 비밀번호가 발급되었습니다.");
            this.commitToken('');
            window.location.href = "/login"
          }
        }else {
          const res = await api.login_verify(params);
          if (res.data.status === "SUCCESS") {
            clearInterval(this.timerInterval);
            this.pwdChange = res.data.data.pwdChange;
            this.reqNewPwd = res.data.data.reqNewPwd;

            if (this.pwdChange === "Y") this.pwdChangeType = "PF"; // 비밀번호 변경 기간이 경과
            if (this.reqNewPwd === "Y") this.pwdChangeType = "NF"; // 비밀번호 초기화

            this.completeLogin(res.data.data.token);
            if (this.pwdChangeType === "PF" || this.pwdChangeType === "NF") {
              // this.commitPwdChange(this.pwdChange);
              this.$router.replace({
                name: 'PwdChange',
                params: {pwdChangeType: this.pwdChangeType, mgrId: this.loginId}
              });
            } else {
              // this.completeLogin(res.data.data.token);
              this.$router.replace("/device");
            }
          }
        }
      } catch (e) { this.handleLoginError(e); }
    },

    async handleFindPwd() {
      try {
        const res = await api.findAdminAccount(this.findInfo);
        if(res.data.status === "SUCCESS") {
          this.loginId = this.findInfo.mgrId;
          this.rawEmail = res.data.data.mgrId;
          this.rawPhone = res.data.data.mgrPhone;
          this.findInfo.findYn = true;
          this.step = 'MFA';
        }
      } catch (e) { this.findError = "해당하는 관리자 정보가 없습니다."; }
    },

    completeLogin(tokenData) {
      let payload = { adminId: this.loginId, autoLogin: "N", pwdChangeType: this.pwdChangeType };
      this.commitAdminInfo(payload);
      this.commitToken(tokenData);
      http.setToken(tokenData);
      // this.$router.replace("/device");
    },

    handleLoginError(e) {
      this.failMessage = e.response?.data?.message || "로그인 실패";
      const failcnt = e.response?.data?.data;
      if (failcnt >= 1) {
        this.failMessage += `<br> 5회 이상 실패 시 로그인 불가 (${failcnt}/5)`;
        if (failcnt === 5) alert("계정이 잠겼습니다.");
      }
      this.password = "";
    }
  },
  beforeDestroy() { if (this.timerInterval) clearInterval(this.timerInterval); }
}
</script>

<style scoped>
.input_txt { color: #333 !important; }
.login_te { color: #333 !important; font-weight: bold; }
.btn_white_luxury {
  background-color: #ffffff; color: #333; border: 1px solid #d1d9e6;
  padding: 8px 24px; border-radius: 4px; font-size: 14px; font-weight: 600;
}
</style>