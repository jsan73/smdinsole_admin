<template>
  <aside id="sidebar" class="sidebar">
    <ul class="sidebar-nav" id="sidebar-nav">

      <li class="nav-item">
        <a class="nav-link" data-bs-target="#local-nav" data-bs-toggle="collapse" href="#">
          <i class="bi bi-menu-button-wide"></i><span>지역별 (전체 00대)</span><i class="bi bi-chevron-down ms-auto"></i>
        </a>

        <ul id="local-nav" class="sidebar-nav collapse ps-3 show" data-bs-parent="#sidebar-nav">
          <li class="nav-item" v-for="(addr, idx1) in addrList">
<!--            class"nav-link collapsed : 열기 버튼 활성화-->
<!--            class"nav-link  : 닫기 버튼 활성화-->
            <a class="nav-link collapsed" :data-bs-target="'#sublocal' + idx1 + '-nav'" data-bs-toggle="collapse" href="#" @click="click1(addr.paddrCode)">
              <i class="bi bi-dash-circle"></i><span>{{addr.addr1}}</span><i class="bi bi-chevron-down ms-auto"></i>
            </a>

            <ul :id="'sublocal' + idx1 + '-nav'" class="nav-content collapse" data-bs-parent="#local-nav" v-for="(sub, idx2) in addr.addrList">
              <li><a href="#" v-if="idx2==0" :class="{'active':(selectAddr2 == '')}" @click="selectAddr2 = ''"><i class="bi bi-circle"></i><span>전체</span></a></li>
              <li><a href="#" :class="{'active':(selectAddr2 == sub.addrCode)}" @click="selectAddr2 = sub.addrCode"><i class="bi bi-circle"></i><span>{{ sub.addr2 }}</span></a></li>
            </ul>
          </li>


        </ul>
      </li><!-- End local Nav -->

      <li class="nav-item">
        <a class="nav-link collapsed" data-bs-target="#center-nav" data-bs-toggle="collapse" href="#">
          <i class="bi bi-card-list"></i><span>기관별 (전체 00대)</span><i class="bi bi-chevron-down ms-auto"></i>
        </a>
        <ul id="center-nav" class="nav-content collapse " data-bs-parent="#sidebar-nav">
          <li><a href="#"><i class="bi bi-circle"></i><span>홀트복지재단</span></a></li>
          <li><a href=""><i class="bi bi-circle"></i><span>노인재단</span></a></li>
          <li><a href=""><i class="bi bi-circle"></i><span>경기장애인재단</span></a></li>
        </ul>
      </li><!-- End center Nav -->



    </ul>
  </aside>
</template>

<script>
import api from '@/api/api';

export default {
  name: "SideMenu",
  data() {
    return {
      addrList:[],
      selectAddr1:'',
      selectAddr2:''
    }
  },
  watch:{
    selectAddr2() {
      // console.log(this.selectAddr2)
      this.$emit("chooseArea", this.selectAddr1, this.selectAddr2);
    }
  },
  methods: {
    selAddrList() {
      api.selAddrList().then(res => {
        if(res.data.status === "SUCCESS") {
          this.addrList = res.data.data;
        }
      })
    },
    click1(pAddrCode){
      this.selectAddr1 = pAddrCode;
      this.selectAddr2 = ''
    },
    click2(addrCode) {
      this.selectAddr2 = pAddrCode;
    }
  },
  created() {
    this.selAddrList();
  }
}
</script>

<style scoped>

</style>