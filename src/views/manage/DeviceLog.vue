<template>
  <main class="container-fluid">

    <h4 class="my-4 ps-3">
      <i class="bi bi-calendar2-check"></i> 기기 데이터 분석
    </h4>
    <section class="section dashboard">
      <div class="flex-container">
        <div class="flex-item-none">
          <div class="card" style="width: 800px;">
            <div class="card-body pb-0">
              <div class="d-flex justify-content-start" >
                <div class="col" style="width: 250px;">
                  <div class="d-flex">
                    <label for="deviceID" class="col-form-label pe-4">ID</label>
                    <input v-model="deviceCode" name="textfield" type="text" id="IMEI" class="form-control d-inline-flex" style="width: 180px;">
                  </div>
                  <div class="d-flex" style="padding-top: 10px">
                    <label class="col-form-label pe-4">대기 Time(초)</label>
                    <input class="form-control d-inline-flex" type="text" name="wait_sec" id="wait_sec" v-model="counter_wait" value="10" style="width: 96px;">

                  </div>
                </div>
                <div class="col" style="width: 200px; padding-left: 10px">
                  <div class="d-flex" style="width: 100px;">
                    <input class="form-check-input" type="radio" name="insole" id="insole1" v-model="insole" value="0">
                    <label class="form-check-label" for="insole1">
                      insole1
                    </label>
                  </div>
                  <div class="d-flex" style="width: 100px;">
                    <input class="form-check-input" type="radio" name="insole" id="insole2" v-model="insole" value="1">
                    <label class="form-check-label" for="insole2">
                      insole2
                    </label>
                  </div>
                  <div class="d-flex" style="width: 100px;">
                    <input class="form-check-input" type="radio" name="insole" id="insole3" v-model="insole" value="2" >
                    <label class="form-check-label" for="insole3">
                      insole3
                    </label>
                  </div>

                </div>
                <div class="d-flex flex-column bd-highlight mb-3" style="width: 200px;">
                  <div class="p-2 bd-highlight" v-if="log_status === 0"><button class="btn btn-outline-secondary" style="width: 100px;height: 50px" @click="start()">Start</button></div>
                  <div class="p-2 bd-highlight" v-if="log_status === 1"><button class="btn btn-outline-secondary" style="width: 100px;height: 50px" @click="stop()">Stop</button></div>
                  <div class="p-2 bd-highlight" v-if="log_status === 3"><button  class="btn btn-outline-secondary" style="width: 100px;height: 50px" @click="reset()">Reset</button></div>
                  <div class="p-2 bd-highlight" v-if="log_status === 3"><button class="btn btn-outline-secondary" style="width: 100px;height: 50px" @click="save()">Save</button></div>
                </div>
                <div class="d-flex flex-column bd-highlight mb-3" style="width: 200px;">
                  <div class="p-2 bd-highlight" >Count down</div>
                  <div class="p-2 bd-highlight counter" contenteditable="false" >{{counter}}</div>

                </div>

              </div>
            </div>
          </div><!--/ 검색조건 -->
          <div>
            <div class="editable" contenteditable="false">
              {{rawData}}
            </div>
          </div>
        </div>
        <div class="flex-item">
<!--          <div class="row">-->
            <div class="card">
              <v-chart :option="option1" style="min-height: 250px; width: 100%" class="echart" />
              <v-chart :option="option2" style="min-height: 250px;" class="echart" />
              <v-chart :option="option3" style="min-height: 250px;" class="echart" />
            </div>
<!--          </div>-->

        </div>
      </div>


    </section>



  </main><!--// 컨텐츠 영역 -->
</template>

<script>
import api from '@/api/api';
import utils from "@/utils/utils";
import router from "@/router/router";

export default {
  name: "DeviceLog",
  data() {
    return {
      idx:0,
      deviceLogSeq:0,
      next_seq:0,
      rawData:'',
      log_status:0,   // 0: 초기, 1: 진행중, 2: Stop, 3: Finish
      counter:60,
      counter_wait:15,
      counter_wait_init:15,
      interval: '',
      interval_wait: '',
      incoming:'',
      no_data_count:0,
      insole:0,
      devicePhoneNumber:['01229834851','01229834813','01229834786'],
      deviceCode:'',
      devicePtlSeq:0,
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
          name:'Count',
          min:0,
          max:2000,
          interval:100
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
            data: [],
            // lineStyle: {
            //   width:0.5,
            //
            // },
            // itemStyle: {
            //   color: '#555555'
            // },
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
          name:'Count',
          min:0,
          max:2000,
          interval:100
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
          name:'Count',
          min:0,
          max:2000,
          interval:100
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
    // this.get_message();
    // this.searchLog();

  },
  watch : {
    incoming() {
      console.log(this.incoming)
      if(!this.incoming && this.log_status !== 0) {
        clearInterval(this.interval)
        clearInterval(this.interval_wait)
        this.log_status = 3
      }
    },
    no_data_count(count) {
      if(count === 3) {
        this.interval_wait = setInterval(this.countdown_wait, 1000);
      }
    }
  },
  methods: {

    countdown() {
      // if(this.counter === 0) {
      //   clearInterval(this.interval);
      // }else{
      //   this.counter--
      //   this.get_message()
      // }

      if(this.log_status === 1 && this.counter > 0) this.counter--
      this.get_message()
    },
    countdown_test() {
      if(this.log_status === 1 && this.counter > 0) this.counter--

    },
    // data 인입이 없을 경우 quit 처리
    countdown_wait() {
      if(this.counter_wait === 0) {
        this.incoming = false
        // this.log_status = 3
      }else{
        this.counter_wait--
      }
    },

    start_test() {
      this.counter = 60
      this.log_status = 1
      this.interval = setInterval(this.countdown_test, 1000);
      this.incoming = true
    },
    async start() {
      this.counter_wait_init = this.counter_wait
      if(utils.isEmpty(this.deviceCode)) {
        alert("Code 정보를 입력 하세요")
        return false;
      }
      let param = {
        "deviceCode":this.deviceCode,
        "devicePhoneNumber":this.devicePhoneNumber[this.insole],
        "insoleNum":this.insole
      }

      const res = await api.insDevicePtl(param);
      if(res.data.status === "SUCCESS") {
         this.devicePtlSeq = res.data.data;
        console.log(this.devicePtlSeq)
        this.counter = 60

        this.log_status = 1
        // 문자 전송 후 딜레이 타임
        setTimeout(() => this.interval = setInterval(this.countdown, 1000), 2000);
      }

    },
    save() {
      let param = {"devicePtlSeq": this.devicePtlSeq}

      api.saveDeviceLog(param).then(res => {
        let fileName = this.deviceCode + ".csv"
        console.log(fileName)
        utils.fileDownload(res.data, fileName)
        router.go(0)
      })


    },
    async reset(){
      let param = {"devicePtlSeq": this.devicePtlSeq}
      await api.resetDeviceLog(param)
      router.go(0)
    },
    stop_test(){
      this.log_status = 2
      this.interval_wait = setInterval(this.countdown_wait, 1000);
    },
    async stop() {
      let param = {
        "devicePhoneNumber":this.devicePhoneNumber[this.insole],
      }

      const res = await api.stopDevicePtl(param);
      if(res.data.status === "SUCCESS") {
        this.log_status = 2
        this.interval_wait = setInterval(this.countdown_wait, 1000);
      }
    },

    async get_message() {
      if(this.devicePtlSeq === 0) return;
      const param = {
        "devicePtlSeq":this.devicePtlSeq, "deviceLogSeq":this.next_seq
      }
      const res = await api.selDeviceLog(param);
      if(res.data.status === "SUCCESS") {
        let dataList = res.data.data;

        const data = dataList.map(item => Object.values(item))

        if(data.length > 0) {
          this.no_data_count = 0
          if(this.interval_wait) {
            clearInterval(this.interval_wait)
            // 대기시간 초기화
            this.counter_wait = this.counter_wait_init
          }

          // this.counter--
          if(this.next_seq === 0) this.incoming = true

          this.next_seq = data[data.length - 1][0]

        }else{
          this.no_data_count++
          // if(this.interval_wait) {
          //   clearInterval(this.interval_wait)
          //   this.counter_wait = this.counter_wait_init
          // }
          // this.interval_wait = setInterval(this.countdown_wait, 1000);
        }
        data.forEach(function (val) {
          let displayVal = [val[1]]
          for(var i=3; i < 12; i++) {
            displayVal.push(val[i])
          }
          if(val[2] !== "quit") {
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
            console.log(this.idx)
          }else{
            this.incoming = false
          }



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
  width: 800px;
  height: 650px;
  border: 1px solid #000000;
  background-color: #1a1e21;
  color: #3dd5f3;
  overflow-y: auto;
}
div.counter {
  width: 150px;
  height: 60px;
  border: 1px solid #000000;
  background-color: #ffc107;
  color: #000000;
  font-size: 20pt;
  text-align: center;
  //overflow-y: auto;
}
</style>