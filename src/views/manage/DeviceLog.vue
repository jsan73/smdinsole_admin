<template>
  <main class="container-fluid">

    <h4 class="my-4 ps-3">
      <i class="bi bi-calendar2-check"></i> 관리자 접근 기록 확인
    </h4>
    <section class="section dashboard">
      <div class="row">
        <div class=col>
          <div class="card" style="width: 800px;">
            <div class="card-body pb-0">
              <div class="d-flex justify-content-start" >
                <div class="d-flex justify-content-start" style="width: 250px;">
                  <div class="col">
                    <label for="deviceID" class="col-form-label pe-4">ID</label>
                    <input v-model="deviceCode" name="textfield" type="text" id="IMEI" class="form-control d-inline-flex" style="width: 180px;">
                  </div>
                </div>
                <div class="col" style="width: 200px;">
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
                  <div class="p-2 bd-highlight"><button v-if="!incoming && counter == 60" class="btn btn-outline-secondary" style="width: 100px;height: 50px" @click="start()">Start</button></div>
                  <div class="p-2 bd-highlight"><button v-if="!incoming && counter == 0" class="btn btn-outline-secondary" style="width: 100px;height: 50px" @click="reset()">Reset</button></div>

                  <div class="p-2 bd-highlight" style="width: 100px;"><button v-if="!incoming && counter == 0" class="btn btn-outline-secondary" style="width: 100px;height: 30px" @click="save()">Save</button></div>
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
        <div class=col>
          <div class="row">
            <div class="card">
              <v-chart :option="option1" style="min-height: 250px; width: 100%" class="echart" />
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
import router from "@/router/router";

export default {
  name: "DeviceLog",
  data() {
    return {
      idx:0,
      deviceLogSeq:0,
      next_seq:0,
      rawData:'',
      counter:60,
      interval: '',
      incoming:false,
      insole:0,
      devicePhoneNumber:['01229834851'],
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
    // this.get_message();
    // this.searchLog();

  },
  methods: {

    countdown() {
      if(this.counter === 0) {
        clearInterval(this.interval);
        this.incoming = false
      }else{
        this.counter--
        this.get_message()
      }
    },
    async start() {
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
        // this.incoming = true
        this.interval = setInterval(this.countdown, 1000);
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
          // this.counter--
          if(this.next_seq === 0) this.incoming = true

          this.next_seq = data[data.length - 1][0]

        }
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