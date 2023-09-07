<template>
  <div>
  <div class="wrap ">
    <div class="img_item row">
      <div class="col-6 text-center" style="padding-top: 120px;">
        <div><img src="static/images/kokasin_admin_logo.png" alt="ktkokasin" /></div>
      </div>
      <div class="col-6">

          <div id="login-box">
            <div class="login_form">
              <div class="login_area">
                <ul>
                  <li class="login_te">ID</li>
                  <li class="login_bar">
                    <input type="text" class="input_txt" id="id" name="id" v-model="loginId">
                  </li>
                  <li class="login_te">Password</li>
                  <li class="login_bar">
                    <input type="password" class="input_txt" id="password" name="password" v-model="password" @keyup.enter="login">
                  </li>
                  <li class="login_radio">
                    <label>
                      <input type="radio" name="logintype" value="admin" checked class="form-check-input"> 담당자
                    </label>
                    <!-- <label>
                                    <input type="radio" name="logintype" value="organization" class="form-check-input ms-5"> 기관 관리자
                                </label> -->
                  </li>
                  <li class="login_fail" v-html="failMessage"></li>
                  <li><button id="submit" class="btn mt-4" @click="login">로그인</button></li>
                </ul>
              </div>
            </div>
          </div>

      </div>

    </div>
  </div>
  <div class="login_copy">
    Copyright ⓒ SmartMedicalDevice Co., Ltd. All Rights Reserved.
  </div>
  </div>

</template>

<script>
import {mapActions} from "vuex";
import utils from "@/utils/utils";
import api from "@/api/api";
import http from "@/api/http";


export default {
  name: "Login",
  data() {
    return {
      loginId:'',
      password:'',
      failMessage:''
    }
  },
  methods: {
    ...mapActions("adminStore", ["commitAdminInfo", "commitToken"]),

    login() {
      // let payload = {adminId: this.loginId, autoLogin: "N"};
      // this.commitAdminInfo(payload);
      if(utils.isEmpty(this.loginId)) {
        alert("아이디를 입력해 주세요.");
        return;
      }
      if(utils.isEmpty(this.password)) {
        alert("비밀번호를 입력해 주세요.");
        return;
      }
      const params = {loginId: this.loginId, password: this.password};

      api.login(params).then(res => {
        if(res.data.status === "SUCCESS") {
          let tokenData = res.data.data.token;
          let pwdChange = res.data.data.pwdChange;

          let payload = {adminId: this.loginId, autoLogin: "N", pwdChange: pwdChange};
          this.commitAdminInfo(payload);
          this.commitToken(tokenData);
          http.setToken(tokenData);
          if(pwdChange === "Y") {
            this.$router.replace("/pwdchange");
          }else {
            this.$router.replace("/device");
          }
        }
      }).catch(e => {
        // 로그인 실패
        this.failMessage = e.response.data.message
        let failcnt = e.response.data.data
        if(failcnt >= 1) {
          this.failMessage += "<br> 5회 이상 실패 시 임시 번호가 발급 됩니다."
          this.failMessage += "- (" + failcnt + ")회 실패"
        }
        this.password = ""
        //alert(e.response.data.message);
      });
    },
  }
}
</script>

<style scoped>

</style>