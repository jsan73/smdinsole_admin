<template>
  <main class="container-fluid">

    <h4 class="my-4 ps-3">
      <i class="bi bi-calendar2-check"></i> 관리자 접근 기록 확인
    </h4>
    <section class="section dashboard">
      <div class="row">
        <div class=col>
          <div class="card">
            <div class="card-body pb-0">
              <div class="d-flex justify-content-start">
                <div class="d-flex justify-content-start" style="width: 250px;">
                  <label for="deviceID" class="col-form-label pe-4">ID</label>
                  <input v-model="search.deviceCode" name="textfield" type="text" id="IMEI" class="form-control d-inline-flex" style="width: 180px;">
                </div>
                <div class="d-flex justify-content-start" style="width: 400px;">
                  <div class="form-check col-form-label" style="width: 100px;">
                    <input class="form-check-input" type="radio" name="insole" id="insole1" v-model="insole" value="1">
                    <label class="form-check-label" for="insole1">
                      insole1
                    </label>
                  </div>
                  <div class="form-check col-form-label" style="width: 100px;">
                    <input class="form-check-input" type="radio" name="insole" id="insole2" v-model="insole" value="7">
                    <label class="form-check-label" for="insole2">
                      insole2
                    </label>
                  </div>
                  <div class="form-check col-form-label" style="width: 100px;">
                    <input class="form-check-input" type="radio" name="insole" id="insole3" v-model="insole" value="30" >
                    <label class="form-check-label" for="insole3">
                      insole3
                    </label>
                  </div>
                </div>
                <div class="d-flex justify-content-between" style="width: 200px;">
                  <div><button class="btn btn-outline-secondary" @click="start()">시작</button></div>
                  <div><button class="btn btn-outline-secondary" @click="reset()">리셋</button></div>
                  <div><button class="btn btn-outline-secondary" @click="save()">저장</button></div>
                </div>
              </div>
            </div>
          </div><!--/ 검색조건 -->
          <div>
            <div class="editable" contenteditable="true">
              {{rawData}}
            </div>
          </div>
        </div>
        <div class=col>
          <div class="row">
            <div class="card">
              <v-chart :option="option1" style="min-height: 250px;" class="echart" />
              <v-chart :option="option2" style="min-height: 250px;" class="echart" />
              <v-chart :option="option3" style="min-height: 250px;" class="echart" />
            </div>
          </div>

        </div>
      </div>


    </section>



  </main><!--// 컨텐츠 영역 -->
</template>

<script>
import api from '@/api/api';
import utils from "@/utils/utils";

export default {
  name: "DeviceLog",
  data() {
    return {
      datatable:'',
      search: {
        deviceCode:'',
        insoleNum:'',
        idx:0,
        next:0,
        insole:0
      },
      idx:0,
      rawData:'',
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
      },
      option2: {
        title:{text:"GYR"},
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
      },
      option3: {
        title:{text:"MAG"},
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
    this.get_message(0);
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
    async get_message(next_idx) {
      console.log("get_messate")
      const param = {
        "protocolId":2, "idx":next_idx
      }
      const res = await api.selDeviceLog(param);
      if(res.data.status === "SUCCESS") {
        let dataList = res.data.data;

        const data = dataList.map(item => Object.values(item))
        console.log(data)

        this.next = data[data.length - 1][1]
        data.forEach(function (val) {
          let displayVal = [val[1]]
          for(var i=3; i < 12; i++) {
            displayVal.push(val[i])
          }
          this.rawData = (displayVal.join()).concat('\n').concat(this.rawData)
          this.option1.series[0].data.push([this.idx, val[3]])
          this.option1.series[1].data.push([this.idx, val[4]])
          this.option1.series[2].data.push([this.idx, val[5]])

          this.option2.series[0].data.push([this.idx, val[6]])
          this.option2.series[1].data.push([this.idx, val[7]])
          this.option2.series[2].data.push([this.idx, val[8]])

          this.option3.series[0].data.push([this.idx, val[9]])
          this.option3.series[1].data.push([this.idx, val[10]])
          this.option3.series[2].data.push([this.idx, val[11]])


          this.idx++;
        }.bind(this))

      }
    }

  },
  created(){
    // 팝업창에서 selectDeviceList 를 호출하기 위한 설정
    // window.vueComponent = this;


    // setInterval(() => {
    //   if(this.next > 0) {
    //     this.get_message(this.next)
    //   }
    // }, 1000)
  }
}

</script>

<style scoped>
div.editable {
  width: 100%;
  height: 650px;
  border: 1px solid #000000;
  background-color: #1a1e21;
  color: #3dd5f3;
  overflow-y: auto;
}
</style>