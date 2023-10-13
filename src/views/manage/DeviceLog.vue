<template>
  <main class="container-fluid">

    <h4 class="my-4 ps-3">
      <i class="bi bi-calendar2-check"></i> 관리자 접근 기록 확인

    </h4>

    <section class="section dashboard">
      <div class="row">
        <div class="col-lg-12">
          <!-- 검색조건 -->
          <div class="card">
            <div class="card-body pb-0">
              <!--              <form>-->
              <div class="row my-1">
                <div class="col-3 d-flex">
                  <label for="deviceID" class="col-form-label pe-4">대상 계정</label>
                  <input v-model="search.deviceCode" name="textfield" type="text" id="IMEI" class="form-control d-inline-flex" style="width: 180px;">
                </div>
                <div class="col-4 d-flex">

                </div>
                <div class="col-2 text-end">
                  <button class="btn btn-secondary" @click="searchLog()">조회</button>
                </div>
              </div>
              <!--              </form>-->
            </div>
          </div><!--/ 검색조건 -->
        </div>
      </div>

      <div class="row">
        <div class=col>
          aaa
        </div>
        <div class=col>
          <div class="row">
            <div class="card">
              <v-chart :option="option1" style="min-height: 300px;" class="echart" />
<!--              <v-chart :option="option1" style="min-height: 300px;" class="echart" />-->
<!--              <v-chart :option="option1" style="min-height: 300px;" class="echart" />-->
            </div>
          </div>
          <div class="row">
            2
          </div>
          <div class="row">
            3
          </div>
        </div>
      </div>


    </section>



  </main><!--// 컨텐츠 영역 -->
</template>

<script>
import api from '@/api/api';
import utils from "@/utils/utils";
import io from 'socket.io-client'

export default {
  name: "DeviceLog",
  data() {
    return {
      datatable:'',
      search: {
        deviceCode:'',
        insoleNum:'',
        idx:0
      },
      idx:0,
      option1: {
        title:{text:"ACC"},
        tooltip:{trigger: 'axis'},
        elements: {
          point:{
            pointStyle:'cross'
          },
        },

        // pointBorderColor:'rgba(0, 0, 0, 0.1)',
        legend: {
          data: ['X', 'Y', 'Z']
        },
        xAxis: {
          type: 'value',
          name:'Iteration'
        },
        yAxis:{
          type:'value',
          name:'value'
        },
        series: [
          {
            name: 'X',
            type: 'line',
            showSymbol: false,
            data: []
          },
          {
            name: 'Y',
            type: 'line',
            showSymbol: false,
            data: []
          },
          {
            name: 'Z',
            type: 'line',
            showSymbol: false,
            data: []
          }
        ]
      }


    }
  },
  mounted() {
    this.get_message();
    // this.searchLog();

  },
  methods: {
    calcPeriod() {
      let today = new Date();
      this.startDate = utils.getYmd10(today);
      this.endDate = utils.getYmd10(today);
    },
    async searchLog() {
      this.search.sdate = this.startDate.replaceAll('-','') + "000000"
      this.search.edate = this.endDate.replaceAll('-','') + "999999"
      const param = this.search;
      const res = await api.selLoginLog(param);
      if(res.data.status === "SUCCESS") {
        let dataList = res.data.data;

        this.datatable = this.$datatable(this.datatable, this.headings, dataList, this.columns)
      }

    },
    async get_message() {
      console.log("get_messate")
      const param = {
        "protocolId":2, "idx":1
      }
      const res = await api.selDeviceLog(param);
      if(res.data.status === "SUCCESS") {
        let dataList = res.data.data;

        const data = dataList.map(item => Object.values(item))

        data.forEach(function (val) {

          this.option1.series[0].data.push([this.idx, val[3]])
          this.option1.series[1].data.push([this.idx, val[4]])
          this.option1.series[2].data.push([this.idx, val[5]])
          this.idx++;
        }.bind(this))
        console.log(this.option1.series[0].data)
      }
    }

  },
  created(){
    // 팝업창에서 selectDeviceList 를 호출하기 위한 설정
    // window.vueComponent = this;


    // setInterval(() => {
    //   this.get_message()
    // }, 1000)
  }
}

</script>

<style scoped>

</style>