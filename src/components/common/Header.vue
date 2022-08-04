<template>
  <header id="header">
    <nav class="navbar navbar-expand-lg navbar-light bg-white">
      <div class="container-fluid">
        <a class="navbar-brand py-0 text-center" style="width:16% ;" href="#"><img src="/static/images/ktkokasin_logo.png" alt="ktkokasin" /></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" ria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="nav nav-pills nav-fill me-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link" href="admin_dashboard.html" id="dashboard">대시보드</a></li>
            <li class="nav-item"><a class="nav-link" href="admin_user.html" id="user">사용자 관리</a></li>
            <li class="nav-item"><a class="nav-link active" href="admin_device.html" id="device">기기 관리</a></li>
            <li class="nav-item"><a class="nav-link" href="admin_group.html" id="group">기관 관리</a></li>
          </ul>
          <div class="tLogo_login">
            <button type="button" class="btn btn-secondary">
              <i class="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: "Header",
  props:{
    title:String,
    logout:false
  },
  methods: {
    //뒤로가기
    backHandler(){
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>

</style>