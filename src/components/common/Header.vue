<template>

  <header id="header" class="header fixed-top">
    <nav class="navbar navbar-expand-lg navbar-light bg-white">
      <div class="container-fluid">
        <a class="navbar-brand py-0 text-center" style="width:16% ; cursor:pointer" @click="goMenu('/ststs')"><img src="/static/images/ktkokasin_logo.png" alt="ktkokasin" /></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" ria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="nav nav-pills nav-fill me-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link" style="cursor:pointer" :class="[menuId=='Ststs'?'active':'']"  @click="goMenu('/ststs')" id="ststs">대시보드</a></li>
            <li class="nav-item"><a class="nav-link" style="cursor:pointer" :class="[menuId=='Guard'?'active':'']"  @click="goMenu('/guard')" id="user">사용자 관리</a></li>
            <li class="nav-item"><a class="nav-link" style="cursor:pointer" :class="[menuId=='Device'?'active':'']" @click="goMenu('/device')" id="device">기기 관리</a></li>
            <li class="nav-item"><a class="nav-link" style="cursor:pointer" :class="[menuId=='EventDevice'?'active':'']" @click="goMenu('/event')" id="device">이벤트 기기</a></li>
            <li class="nav-item"><a class="nav-link" style="cursor:pointer" :class="[menuId=='Orgc'?'active':'']" @click="goMenu('/orgc')" id="orgc">기관 관리</a></li>
            <li class="nav-item"><a class="nav-link" style="cursor:pointer" :class="[menuId=='Manager'?'active':'']" @click="goMenu('/manager')" id="manager">관리자 관리</a></li>
            <li class="nav-item"><a class="nav-link" style="cursor:pointer" :class="[menuId=='LocationLog'?'active':'']" @click="goMenu('/loclog')" id="loclog">위치정보 확인</a></li>
            <li class="nav-item"><a class="nav-link" style="cursor:pointer" :class="[menuId=='LoginLog'?'active':'']" @click="goMenu('/loginlog')" id="loginlog">접근 기록</a></li>
            <li class="nav-item"><a class="nav-link" style="cursor:pointer" :class="[menuId=='ChangeLog'?'active':'']" @click="goMenu('/changelog')" id="changelog">변경이력</a></li>

          </ul>
          <div class="tLogo_login">
            <button type="button" class="btn btn-secondary" @click="goLogout">
              <i class="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import {mapActions} from "vuex";
import api from "@/api/api";

export default {
  name: "CommonHeader",
  props:{
    title:String,
    logout:Boolean,
    menuId:String
  },
  methods: {
    ...mapActions("adminStore", {
      commitToken: "commitToken",
      logoutStore: "logout",
    }),

    //뒤로가기
    backHandler(){
      this.$router.go(-1);
    },
    goMenu(url) {
      this.$router.push(url).catch(() => {});
    },
    async goLogout() {
      try {
        await api.logout();
      } catch (e) {
        console.warn("logout failed", e?.response?.data?.message || e?.message || e);
      }
      this.logoutStore();
      this.commitToken('');
      window.location.href = "/login"
    }
  }
}
</script>

<style scoped>

</style>
