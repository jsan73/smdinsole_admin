<template>
  <main class="container-fluid">

    <h4 class="my-4 ps-3">
      <i class="bi bi-calendar2-check"></i> 기기 관리
      <small class="text-muted fs-6">기기 정보를 등록 및 수정 할 수 있습니다.</small>

      <div class="text-end" v-if="isDev()">
        <button class="btn btn-primary mt-2 ms-1" @click="gogo()">기기 데이터 분석</button>
      </div>

    </h4>

    <section class="section dashboard">
      <div class="row">
        <div class="col-lg-12">
          <!-- 검색조건 -->
          <div class="card">
            <div class="card-body pb-0">
<!--              <form>-->
                <div class="row my-1">
                  <div class="col-2 d-flex">
                    <label for="deviceID" class="col-form-label pe-4">IMEI</label>
                    <input v-model="search.deviceIMEI" name="textfield" type="text" id="IMEI" class="form-control d-inline-flex" style="width: 180px;">
                  </div>
                  <div class="col-2 d-flex">
                    <label for="deviceID" class="col-form-label pe-4">ICCID</label>
                    <input v-model="search.iccId" name="textfield" type="text" id="ICCID" class="form-control d-inline-flex" style="width: 280px;">
                  </div>
                  <div class="col-3 d-flex">
                    <label for="Set" class="col-form-label pe-4">사용자 전화번호0</label>
                    <input v-model="search.guardPhone" name="textfield" type="text" id="phone" class="form-control d-inline-flex" style="width: 180px;">
                    <!-- <select id="isAssign" class="form-select d-inline-flex" style="width: 120px;">
                        <option value=""> - 전체 - </option>
                        <option value="true">할당</option>
                        <option value="false">미할당</option>
                    </select> -->
                  </div>
                  <div class="col-3 d-flex">
                    <label for="deviceID" class="col-form-label pe-4">소속 기관</label>
                    <select v-model="search.orgcNo" id="group" name="group" class="form-select d-inline-flex" style="width: 70%;">
                      <option value=""> - 선택 - </option>
                      <option v-for="(orgc, index) in orgcList" :key="index" :value="orgc.ORGC_NO">{{orgc.ORGC_NAME}}</option>
                    </select>
                  </div>
                  <div class="col-2 text-end">
                    <button class="btn btn-secondary" @click="selectDeviceList">조회</button>
                  </div>
                </div>
<!--              </form>-->
            </div>
          </div><!--/ 검색조건 -->
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <!-- 목록 테이블 -->
          <div class="card dataTableStyle overflow-auto">
            <div class="card-body">
              <!-- <p>Add lightweight datatables to your project with using the <a href="https://github.com/fiduswriter/Simple-DataTables" target="_blank">Simple
                              DataTables</a> library. Just add <code>.datatable</code> class name to any table you wish to conver to a datatable</p> -->

              <!-- Table with stripped rows -->
              <table class="table table-borderless datatable " ref="datatable"></table>
              <!-- End Table with stripped rows -->
              <p class="text-end">
<!--                <button class="btn btn-primary mt-2 ms-1" onclick="javascript:allList()">전체목록</button>-->
<!--                <button class="btn btn-primary mt-2 ms-1" onclick="javascript:openPopUp_addcsvDevice()">기기 일괄 등록</button>-->
                <button class="btn btn-primary mt-2 ms-1" @click="popupFota">Fota view</button>
                <button class="btn btn-primary mt-2 ms-1" @click="addDevice">기기 등록</button>
              </p>
            </div>
          </div><!--// 목록 테이블 -->

        </div>
      </div>


    </section>



  </main><!--// 컨텐츠 영역 -->
</template>

<script>
import api from '@/api/api';
import utils from "@/utils/utils";

export default {
  name: "DeviceManager",
  data() {
    return {
      datatable:'',
      // data: {
      //   deviceIMEI:'',
      //   deviceNumber:'',
      //   guardPhone:'',
      //   orgNm:'',
      //   memberDate:'',
      //   expDate:'',
      //   lastSignal:'',
      //   locCnt:0
      // },
      search: {
        deviceIMEI:'',
        guardPhone:'',
        orgcNo:''
      },
      orgcList:'',
      columns:[
        {select:0, render: function(data, cell, row) {
            return row.dataIndex + 1
          }
        },
        {select:1, render: function(data, cell, row) {
            let url = "/devicepopup?device=" + data;
            let name = "기기 수정";
            let style = "width=650,height=580,left=0,top=0";
            let param = "'" + url + "','" + name + "','" + style + "'";
            let html = "<a class='text-primary' href=\"javascript:openPopup(" + param + ")\">" + data + "</a>";
            return html;
          }
        },
        {select:2, scope:'row', render: this.telForm},
        {select:3, scope:'row'},
        {select:4, scope:'row'},
        {select:5, scope:'row', render: this.telForm},
        {select:6, scope:'row'},
        {select:7, scope:'row', render: this.dateForm},
        {select:8, scope:'row', render: this.dateForm},
        {select:9, scope:'row', render: this.lastSignal},
        {select:10, scope:'row'},
      ],
      // dataList:[],
      headings:["No", "IMEI", "기기 전화번호", "ICCID", "요금제", "사용자 전화번호0", "소속 기관", "가입일", "만료일", "마지막 신호", "위치전송횟수"],

    }
  },
  mounted() {

    this.selectDeviceList();
    this.selectOrgcList();


  },
  methods: {
    isDev() {
      console.log("process.env.VUE_APP_MODE",process.env.VUE_APP_MODE)
      if(process.env.VUE_APP_MODE === "dev" || process.env.VUE_APP_MODE === "local") {
        return true;
      }
      return false;
    },
    gogo() {
      this.$router.push('/devicelog')
    },
    addDevice() {
      this.$open(
          "/devicepopup",
          "기기 등록",
          "width=650,height=580,left=0,top=0"
      );
    },
    popupFota() {
      this.$open(
          "/fotapopup",
          "Fota view",
          "width=650,height=430,left=0,top=0"
      );
    },
    telForm(data) {
      return utils.telForm(data, 1);
    },
    dateForm(data) {
      return utils.convertFromStrToDate(data);
    },
    lastSignal(data) {
      console.log(data);
      const signal = data.split(',')
      //console.log(signal[2]);
      var reportDate = signal[0];

      //(GPS:4, CELL:5, WIFI:6)
      var cell = "icon_none.svg";
      if(signal[1] !== undefined) {
        switch (signal[1]) {
          case '4':
            cell = "icon_GPS.svg";
            break;
          case '5':
            cell = "icon_Cell.svg";
            break;
          case '6':
            cell = "icon_WiFi.svg";
            break;
        }
      }
      var battery = "battery/0.svg";
      switch (signal[2]) {
        case '0':
          battery = "battery/Warn.svg";
          break;
        case '1':
        case '2':
        case '3':
          battery = "battery/" + signal[2] + ".svg";
          break;
        case '4':
          // 충전중
          battery = "battery/Chg.svg";
          break;
        case '5':
          // 충전완료
          battery = "battery/Complete.svg";
          break;
      }
      let date1 = utils.convertFromStrToDate(reportDate)
      let date2 = new Date()
      const diff = utils.getTimeDiff(date1, date2);
      if(diff > 90) {
        cell = "icon_none.svg";
        battery = "battery/0.svg"
      }

      return utils.convertFromStrToDate(reportDate) + ' <img src="/static/images/' + cell + '" alt="none" width="42" height="20">' +  ' <img src="/static/images/' + battery + '" alt="battery_charge" width="30">';
    },
    async selectDeviceList() {
      const param = this.search;
      param.guardPhone = param.guardPhone.replaceAll("-","")
      const res = await api.selDeviceList(param);
      if(res.data.status === "SUCCESS") {
        let dataList = res.data.data;

        this.datatable = this.$datatable(this.datatable, this.headings, dataList, this.columns)
      }

    },
    async selectOrgcList() {
      const param = {};
      const res = await api.selOrgcList(param);
      if(res.data.status === "SUCCESS") {
        this.orgcList = res.data.data;
      }

    },
  },
  created(){
    // 팝업창에서 selectDeviceList 를 호출하기 위한 설정
    window.vueComponent = this;
  }
}

</script>

<style scoped>

</style>