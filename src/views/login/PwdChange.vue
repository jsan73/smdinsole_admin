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
                    <input type="text" class="input_txt" id="id" name="id" v-model="loginId" readonly>
                  </li>
                  <li class="login_te">Password</li>
                  <li class="login_bar">
                    <input type="password" class="input_txt" id="password" name="password" v-model="password" >
                  </li>
                  <li class="login_te">Password 확인</li>
                  <li class="login_bar">
                    <input type="password" class="input_txt" id="password_confirm" name="password_confirm" v-model="password_confirm" >
                  </li>

                  <li class="login_radio">
<!--                    <label>-->
<!--                      <input type="radio" name="logintype" value="admin" checked class="form-check-input"> 담당자-->
<!--                    </label>-->
                    <!-- <label>
                                    <input type="radio" name="logintype" value="organization" class="form-check-input ms-5"> 기관 관리자
                                </label> -->
                  </li>
                  <li><button id="submit" class="btn mt-4" @click="change_password">비밀번호 변경</button></li>
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
import {mapActions, mapState} from "vuex";
import utils from "@/utils/utils";
import api from "@/api/api";
import http from "@/api/http";
import adminStore from "@/store/adminStore";


export default {
  name: "LoginChgPwd",
  data() {
    return {
      loginId:'',
      password:'',
      password_confirm:''
    }
  },
  computed: {
    ...mapState("adminStore", ['adminInfo'])
  },
  methods: {
    ...mapActions("adminStore", ["commitAdminInfo"]),

    change_password() {
      if(utils.isEmpty(this.password)) {
        alert("비밀번호를 입력해 주세요.");
        return;
      }
      if(utils.isEmpty(this.password_confirm)) {
        alert("비밀번호 확인을 입력해 주세요.");
        return;
      }
      if(this.password !== this.password_confirm) {
        alert("비밀번호가 다릅니다.");
        return;
      }

      const params = {mgrId: this.loginId, mgrPwd: this.password};

      api.updChangePwd(params).then(res => {
        if(res.data.status === "SUCCESS") {
          let payload = {adminId: this.loginId, autoLogin: "N", pwdChange: "N"};
          this.commitAdminInfo(payload);
          this.$router.replace("/device");
        }
      }).catch(e => {
        // 변경 실패
        alert(e.response.data.message);
      });
    },
  },
  mounted() {
    this.loginId = this.adminInfo.adminId
  }
}
</script>

<style scoped>

</style>