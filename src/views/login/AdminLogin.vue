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
              <li class="login_bar"><input type="text" class="input_txt" v-model.trim="loginId" :disabled="isLoginLoading"></li>
              <li class="login_te">Password</li>
              <li class="login_bar"><input type="password" class="input_txt" v-model="password" :disabled="isLoginLoading" @keyup.enter="handleLogin"></li>
              <li class="login_fail" v-html="failMessage"></li>
              <li><button id="submit" class="btn mt-4" :disabled="isLoginLoading" @click="handleLogin">{{ isLoginLoading ? '로그인 중...' : '로그인' }}</button></li>
              <li class="text-end mt-2">
                <a href="#" @click.prevent="goFindPwd" style="font-size: 12px; color: #333;">비밀번호를 잊으셨나요?</a>
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
                      <input type="radio" v-model="mfaType" value="EMAIL" class="me-2" :disabled="isMfaSending || isMfaVerifying"> 이메일
                    </label>
                    <span class="ms-auto" style="color: #333; font-weight: 600;">{{ maskedEmail }}</span>
                  </div>
                  <div class="d-flex align-items-center mb-3">
                    <label class="d-flex align-items-center mb-0" style="color: #333; cursor: pointer;">
                      <input type="radio" v-model="mfaType" value="PHONE" class="me-2" :disabled="isMfaSending || isMfaVerifying"> 휴대폰
                    </label>
                    <span class="ms-auto" style="color: #333; font-weight: 600;">{{ maskedPhone }}</span>
                  </div>
                </div>
                <div class="text-center mt-3">
                  <div v-if="mfaToastMessage" class="mfa_toast" role="status" aria-live="polite">
                    {{ mfaToastMessage }}
                  </div>
                  <button type="button" class="btn_white_luxury" :disabled="isMfaSending || isMfaVerifying" @click="sendMfaCode">
                    {{ isMfaSending ? '발송 중...' : (isMfaSent ? '인증번호 재발송' : '인증번호 발송') }}
                  </button>
                </div>
              </li>

              <li v-if="isMfaSent" class="mt-4">
                <div class="d-flex align-items-center mb-3">
                  <span class="me-3" style="white-space: nowrap; font-weight: bold; color: #333;">인증번호</span>
                  <div style="position: relative; flex-grow: 1;">
                    <input type="text" class="input_txt" v-model.trim="mfaCode" :disabled="isMfaVerifying" style="padding-right: 60px; color: #333;" @keyup.enter="verifyMfa">
                    <span style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: #ff5252; font-weight: bold;">{{ timerText }}</span>
                  </div>
                </div>
                <div class="login_fail" v-html="failMessage"></div>
                <button id="submit" class="btn mt-2" :disabled="isMfaVerifying" @click="verifyMfa" style="font-weight: bold;">{{ isMfaVerifying ? '확인 중...' : '인증 확인' }}</button>
              </li>
            </ul>

            <ul v-else-if="step === 'FIND_PWD'">
              <li class="text-center mb-4"><h3 style="font-weight: bold; color: #333;">비밀번호 재설정</h3></li>
              <li class="login_te">ID (이메일)</li>
              <li class="login_bar"><input type="text" class="input_txt" v-model.trim="findInfo.mgrId" :disabled="isFindPwdLoading" placeholder="이메일 입력"></li>
              <li class="login_te">이름</li>
              <li class="login_bar"><input type="text" class="input_txt" v-model.trim="findInfo.mgrName" :disabled="isFindPwdLoading" placeholder="이름 입력" @keyup.enter="handleFindPwd"></li>
              <li class="text-center mt-4" v-if="findError">
                <p style="color: #333; font-weight: bold;">{{ findError }}</p>
              </li>
              <li><button id="submit" class="btn mt-4" :disabled="isFindPwdLoading" @click="handleFindPwd">{{ isFindPwdLoading ? '확인 중...' : '확인' }}</button></li>
              <li class="text-center mt-2"><a href="#" @click.prevent="goLoginStep" style="font-size: 12px; color: #333;">로그인으로 돌아가기</a></li>
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
  name: "AdminLogin",
  data() {
    return {
      step: 'LOGIN', loginId: '', password: '', failMessage: '',
      mfaType: 'EMAIL', mfaCode: '', isMfaSent: false,
      timer: 180, timerInterval: null,
      mfaTimerSeconds: 180,
      mfaToastMessage: '',
      mfaToastTimer: null,
      loginChallengeId: '',
      resetChallengeId: '',
      rawEmail: '', rawPhone: '',
      findInfo: { mgrId: '', mgrName: '', findYn: false }, findError: '',
      pwdChangeType : "N",
      isLoginLoading: false,
      isMfaSending: false,
      isMfaVerifying: false,
      isFindPwdLoading: false,

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
    ...mapActions("adminStore", ["commitAdminInfo", "commitToken"]),

    async handleLogin() {
      if (this.isLoginLoading) return;
      if (utils.isEmpty(this.loginId) || utils.isEmpty(this.password)) {
        alert("아이디와 비밀번호를 입력해주세요.");
        return;
      }
      this.isLoginLoading = true;
      this.failMessage = "";
      try {
        const params = { loginId: this.loginId, password: this.password };
        const res = await api.login_step1(params);
        if (res.data.status === "SUCCESS") {
          const data = res.data.data || {};
          const manager = data.manager || {};
          this.loginChallengeId = data.loginChallengeId || data.challengeId || data.loginChallenge || "";
          this.rawEmail = data.maskedEmail || manager.mgrId || manager.MGR_ID || data.mgrId || data.MGR_ID || this.loginId;
          this.rawPhone = manager.maskedPhone || data.maskedPhone || manager.mgrPhone || manager.MGR_PHONE || data.mgrPhone || "";
          if(data.status === "MFA") {
            this.resetMfaState();
            this.step = 'MFA';
          } else {
            this.failMessage = "지원하지 않는 로그인 상태입니다.";
          }
        }
      } catch (e) { this.handleLoginError(e); }
      finally { this.isLoginLoading = false; }
    },

    async sendMfaCode() {
      if (this.isMfaSending || this.isMfaVerifying) return;
      this.isMfaSending = true;
      this.mfaCode = "";
      this.failMessage = "";
      try {
        const params = {
          loginId: this.loginId,
          mfaType: this.mfaType,
          purpose: this.findInfo.findYn ? 'PASSWORD_RESET' : 'LOGIN'
        };
        if (this.findInfo.findYn) {
          if (this.resetChallengeId) params.resetChallengeId = this.resetChallengeId;
        } else if (this.loginChallengeId) {
          params.loginChallengeId = this.loginChallengeId;
        }
        const res = await api.login_step2(params);
        if (res.data.status === "SUCCESS") {
          this.showMfaToast(this.mfaType === 'EMAIL' ? '이메일로 인증번호가 발송되었습니다.' : '휴대폰으로 인증번호가 발송되었습니다.');
          this.isMfaSent = true;
          this.startTimer();
        }
      } catch (e) { alert("인증번호 발송에 실패했습니다."); }
      finally { this.isMfaSending = false; }
    },

    startTimer() {
      this.timer = this.mfaTimerSeconds;
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        if (this.timer > 0) this.timer--;
        else {
          clearInterval(this.timerInterval);
          this.timerInterval = null;
          this.isMfaSent = false;
          this.mfaCode = "";
          this.failMessage = "인증 시간이 만료되었습니다. 인증번호를 다시 발송해주세요.";
        }
      }, 1000);
    },

    async verifyMfa() {
      if (this.isMfaVerifying) return;
      if (!this.isMfaSent) {
        this.failMessage = "인증번호를 먼저 발송해주세요.";
        return;
      }
      if (utils.isEmpty(this.mfaCode)) {
        this.failMessage = "인증번호를 입력해주세요.";
        return;
      }
      this.isMfaVerifying = true;
      this.failMessage = "";
      try {
        const params = { loginId: this.loginId, mfaCode: this.mfaCode, mfaType: this.mfaType };
        if(this.findInfo.findYn) {
          if (this.resetChallengeId) params.resetChallengeId = this.resetChallengeId;
          const res = await api.login_verify_pwfind(params);
          if (res.data.status === "SUCCESS") {
            const channel = this.mfaType === 'EMAIL' ? '이메일' : '휴대폰';
            alert(`인증되었습니다. ${channel}으로 임시 비밀번호가 발급되었습니다.`);
            this.commitToken('');
            window.location.href = "/login"
          }
        }else {
          if (this.loginChallengeId) params.loginChallengeId = this.loginChallengeId;
          const res = await api.login_verify(params);
          if (res.data.status === "SUCCESS") {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
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
      finally { this.isMfaVerifying = false; }
    },

    async handleFindPwd() {
      if (this.isFindPwdLoading) return;
      if (utils.isEmpty(this.findInfo.mgrId) || utils.isEmpty(this.findInfo.mgrName)) {
        this.findError = "이메일과 이름을 입력해주세요.";
        return;
      }
      this.isFindPwdLoading = true;
      this.findError = "";
      try {
        const res = await api.findAdminAccount(this.findInfo);
        if(res.data.status === "SUCCESS") {
          const data = res.data.data || {};
          const manager = data.manager || data;
          this.loginId = this.findInfo.mgrId;
          this.resetChallengeId = data.resetChallengeId || data.challengeId || data.resetChallenge || "";
          this.rawEmail = data.maskedEmail || manager.mgrId || manager.MGR_ID || this.findInfo.mgrId;
          this.rawPhone = manager.maskedPhone || data.maskedPhone || manager.mgrPhone || manager.MGR_PHONE || "";
          this.findInfo.findYn = true;
          this.resetMfaState();
          this.step = 'MFA';
        }
      } catch (e) { this.findError = "해당하는 관리자 정보가 없습니다."; }
      finally { this.isFindPwdLoading = false; }
    },

    completeLogin(tokenData) {
      let payload = { adminId: this.loginId, autoLogin: "N", pwdChangeType: this.pwdChangeType };
      this.commitAdminInfo(payload);
      this.commitToken(tokenData);
      http.setToken(tokenData);
      // this.$router.replace("/device");
    },

    handleLoginError(e) {
      this.failMessage = this.getLoginErrorMessage(e);
      const failcnt = this.getFailCount(e.response?.data?.data);
      if (failcnt >= 1) {
        this.failMessage += `<br>로그인 실패 횟수 (${failcnt}/5)`;
        if (failcnt >= 5) {
          const lockMessage = "계정이 30분간 잠겼습니다. 30분 후 다시 시도하거나 수퍼관리자에게 잠금 해제를 요청하세요.";
          this.failMessage += `<br>${lockMessage}`;
          alert(lockMessage);
        }
      }
      this.password = "";
    },
    getFailCount(data) {
      if (typeof data === "number") return data;
      if (!data || typeof data !== "object") return 0;
      return data.failcnt || data.failCnt || data.pwdFailCnt || data.PWD_FAIL_CNT || 0;
    },
    getLoginErrorMessage(e) {
      const message = e.response?.data?.message || "";
      const data = e.response?.data?.data || {};
      const lockType = data.lockType || data.LOCK_TYPE || "";
      const lockReason = data.lockReason || data.LOCK_REASON || "";
      const sourceText = `${message} ${lockType} ${lockReason}`;

      if (this.step === "MFA") return message || "인증번호가 일치하지 않거나 만료되었습니다.";
      if (/90|미접속|INACTIVE|DORMANT/.test(sourceText)) return message || "90일 이상 미접속으로 잠긴 계정입니다. 수퍼관리자에게 문의하세요.";
      if (/LOGIN_FAIL|FAIL|잠금|LOCK/.test(sourceText)) return message || "로그인 실패 횟수 초과로 잠긴 계정입니다.";

      return message || "로그인 실패";
    },
    clearMfaToast() {
      this.mfaToastMessage = "";
      if (this.mfaToastTimer) {
        clearTimeout(this.mfaToastTimer);
        this.mfaToastTimer = null;
      }
    },
    showMfaToast(message) {
      this.clearMfaToast();
      this.mfaToastMessage = message;
      this.mfaToastTimer = setTimeout(() => {
        this.mfaToastMessage = "";
        this.mfaToastTimer = null;
      }, 3000);
    },
    resetMfaState() {
      this.mfaCode = "";
      this.isMfaSent = false;
      this.failMessage = "";
      this.timer = this.mfaTimerSeconds;
      this.clearMfaToast();
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },
    goFindPwd() {
      this.failMessage = "";
      this.findError = "";
      this.resetMfaState();
      this.findInfo = { mgrId: '', mgrName: '', findYn: false };
      this.loginChallengeId = "";
      this.resetChallengeId = "";
      this.step = 'FIND_PWD';
    },
    goLoginStep() {
      this.failMessage = "";
      this.findError = "";
      this.resetMfaState();
      this.findInfo = { mgrId: '', mgrName: '', findYn: false };
      this.loginChallengeId = "";
      this.resetChallengeId = "";
      this.step = 'LOGIN';
    },
  },
  beforeDestroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.clearMfaToast();
  }
}
</script>

<style scoped>
.input_txt { color: #333 !important; }
.login_te { color: #333 !important; font-weight: bold; }
.btn_white_luxury {
  background-color: #ffffff; color: #333; border: 1px solid #d1d9e6;
  padding: 8px 24px; border-radius: 4px; font-size: 14px; font-weight: 600;
}
.mfa_toast {
  margin-bottom: 10px;
  padding: 9px 12px;
  border: 1px solid #cfe3d7;
  background: #f1fbf5;
  color: #23613a;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
}
</style>
