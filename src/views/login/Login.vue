<template>
  <div>
  <div class="wrap ">
    <div class="img_item row">
      <div class="col-6 text-center" style="padding-top: 120px;">
        <div><img src="static/images/ktkokasin_logoB.png" alt="ktkokasin" /></div>
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
                    <input type="password" class="input_txt" id="password" name="password" v-model="password">
                  </li>
                  <li class="login_radio">
                    <label>
                      <input type="radio" name="logintype" value="admin" checked class="form-check-input"> 담당자
                    </label>
                    <!-- <label>
                                    <input type="radio" name="logintype" value="organization" class="form-check-input ms-5"> 기관 관리자
                                </label> -->
                  </li>
                  <li><button id="submit" class="btn mt-4" @click="login">로그인</button></li>
                </ul>
              </div>
            </div>
          </div>

      </div>

    </div>
  </div>
  <div class="login_copy">
    Copyright ⓒ SmartMedicalDevice Co., Ltd. All Rights Reserved.<!-- 　 |　 Phone : 070-7525-2100　Email : sales@smd21.com -->
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
      password:''
    }
  },
  methods: {
    ...mapActions("adminStore", ["commitAdminInfo", "commitToken"]),

    login() {
      if(utils.isEmpty(this.loginId)) {
        alert("핸드폰 번호를 입력해 주세요.");
        return;
      }
      if(utils.isEmpty(this.password)) {
        alert("비밀 번호를 입력해 주세요.");
        return;
      }
      const params = {loginId: this.loginId, password: this.password};

      api.login(params).then(res => {
        if(res.data.status === "SUCCESS") {
          let tokenData = res.data.data;


          let payload = {adminId: this.loginId, autoLogin: "N"};
          this.commitAdminInfo(payload);
          this.commitToken(tokenData);
          http.setToken(tokenData);
          this.$router.replace("/device");
        }
      }).catch(e => {
        // 로그인 실패
        alert(e.response.data.message);
      });
    },
  }
}
</script>

<style scoped>

</style>