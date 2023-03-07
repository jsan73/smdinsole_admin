<template>
  <aside id="sidebar" class="sidebar">
    <ul class="sidebar-nav" id="sidebar-nav">

      <li class="nav-item">
        <a class="nav-link" data-bs-target="#local-nav" data-bs-toggle="collapse" href="#" @click="click1('')">
          <i class="bi bi-menu-button-wide"></i><span>지역별 (전체 {{ totalCount }}대)</span><i class="bi bi-chevron-down ms-auto"></i>
        </a>

        <ul id="local-nav" class="sidebar-nav collapse ps-3 show" data-bs-parent="#sidebar-nav">
          <li class="nav-item" v-for="(addr, idx1) in addrList">
<!--            class"nav-link collapsed : 열기 버튼 활성화-->
<!--            class"nav-link  : 닫기 버튼 활성화-->
            <a class="nav-link collapsed" :data-bs-target="'#sublocal' + idx1 + '-nav'" data-bs-toggle="collapse" href="#" @click="click1(addr.paddrCode, addr.addr1)">
              <i class="bi bi-dash-circle"></i><span>{{addr.addr1}}</span><i class="bi bi-chevron-down ms-auto"></i>
            </a>

            <ul :id="'sublocal' + idx1 + '-nav'" class="nav-content collapse" data-bs-parent="#local-nav" v-for="(sub, idx2) in addr.addrList">
              <li><a href="#" v-if="idx2==0" :class="{'active':(selectAddr2 == '')}" @click="click2('',addr.addr1)"><i class="bi bi-circle"></i><span>전체</span></a></li>
              <li><a href="#" :class="{'active':(selectAddr2 == sub.addrCode)}" @click="click2(sub.addrCode, sub.addr2)"><i class="bi bi-circle"></i><span>{{ sub.addr2 }}</span></a></li>
            </ul>
          </li>


        </ul>
      </li><!-- End local Nav -->

      <li class="nav-item">
        <a class="nav-link collapsed" data-bs-target="#center-nav" data-bs-toggle="collapse" href="#">
          <i class="bi bi-card-list"></i><span>기관별 (전체 00대)</span><i class="bi bi-chevron-down ms-auto"></i>
        </a>
        <ul id="center-nav" class="nav-content collapse " data-bs-parent="#sidebar-nav">
          <li><a href="#"><i class="bi bi-circle"></i><span>개인</span></a></li>
          <li><a href="#"><i class="bi bi-circle"></i><span>인천부평구</span></a></li>
          <li><a href=""><i class="bi bi-circle"></i><span>강화군</span></a></li>
          <li><a href=""><i class="bi bi-circle"></i><span>충주시</span></a></li>
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
      selectAddr2:'',
      selectAddrName1:'',
      selectAddrName2:'',
    }
  },
  props:{
    totalCount:0
  },
  watch:{
    selectAddr1() {
      // console.log(this.selectAddr2)
      this.$emit("chooseArea", this.selectAddr1, this.selectAddr2, this.selectAddrName1, this.selectAddrName2);
    },
    selectAddr2() {
      // console.log(this.selectAddr2)
      this.$emit("chooseArea", this.selectAddr1, this.selectAddr2, this.selectAddrName1, this.selectAddrName2);
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
    click1(pAddrCode, addrName){
      this.selectAddr1 = pAddrCode;
      this.selectAddrName1 = addrName;
      this.selectAddr2 = ''

      console.log(this.selectAddr1, this.selectAddr2, addrName)
    },
    click2(addrCode, addrName) {
      this.selectAddr2 = addrCode;
      this.selectAddrName2 = addrName;
    }
  },
  created() {
    this.selAddrList();
  }
}
</script>

<style scoped>

</style>