<template>
  <main class="container-fluid">

    <h4 class="my-4 ps-3">
      <i class="bi bi-calendar2-check"></i> 기기 관리
      <small class="text-muted fs-6">기기 정보를 등록 및 수정 할 수 있습니다.</small>
    </h4>

    <section class="section dashboard">
      <div class="row">
        <div class="col-lg-12">
          <!-- 검색조건 -->
          <div class="card">
            <div class="card-body pb-0">
              <form>
                <div class="row my-1">
                  <div class="col-3 d-flex">
                    <label for="deviceID" class="col-form-label pe-4">IMEI</label>
                    <input name="textfield" type="text" id="IMEI" class="form-control d-inline-flex" style="width: 180px;">
                  </div>
                  <div class="col-4 d-flex">
                    <label for="Set" class="col-form-label pe-4">사용자 전화번호0</label>
                    <input name="textfield" type="text" id="phone" class="form-control d-inline-flex" style="width: 180px;">
                    <!-- <select id="isAssign" class="form-select d-inline-flex" style="width: 120px;">
                        <option value=""> - 전체 - </option>
                        <option value="true">할당</option>
                        <option value="false">미할당</option>
                    </select> -->
                  </div>
                  <div class="col-3 d-flex">
                    <label for="deviceID" class="col-form-label pe-4">소속 기관</label>
                    <select id="group" name="group" class="form-select d-inline-flex" style="width: 70%;">
                      <option value=""> - 선택 -</option>
                      <option value="true"> 개인 </option>
                      <option value="false">홀트복지재단</option>
                      <option value="false">성북장애인재단</option>
                    </select>
                  </div>
                  <div class="col-2 text-end">
                    <button class="btn btn-secondary" onclick="javascript:search()">조회</button>
                  </div>
                </div>
              </form>
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
              <table class="table table-borderless datatable " ref="datatable">

              </table>
              <!-- End Table with stripped rows -->
              <p class="text-end">
                <button class="btn btn-primary mt-2 ms-1" onclick="javascript:allList()">전체목록</button>
                <button class="btn btn-primary mt-2 ms-1" onclick="javascript:openPopUp_addcsvDevice()">기기 일괄 등록</button>
                <button class="btn btn-primary mt-2 ms-1" onclick="javascript:openPopUp_addDevice()">기기 등록</button>
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
      datatable:Object,
      data: {
        deviceIMEI:'',
        deviceNumber:'',
        guardPhone:'',
        orgNm:'',
        memberDate:'',
        expDate:'',
        lastSignal:'',
        locCnt:0
      },
      columns:[
        {select:0, render: function(data, cell, row) {
            return row.dataIndex + 1
          }
        },
        {select:1, render: function(data, cell, row) {
            var html = "<a class='text-primary' href=\"javascript:openPopUp_addDevice('" + data + "')\">" + data + "</a>";
            return html;
          }
        },
        {select:2, scope:'row', render: this.telForm},
        {select:3, scope:'row', render: this.telForm},
        // {select:4, scope:'row'},
        {select:5, scope:'row', render: this.dateForm},
        {select:6, scope:'row', render: this.dateForm},
        {select:7, scope:'row', render: this.lastSignal},
        {select:8, scope:'row'},
      ],
      dataList:[],
      headings:["No", "IMEI", "기기 전화번호", "사용자 전화번호0", "소속 기관", "가입일", "만료일", "마지막 신호", "위치전송횟수"],

    }
  },
  mounted() {

    this.selectDeviceList();



  },
  methods: {

    telForm(data) {
      return utils.telForm(data, 1);
    },
    dateForm(data) {
      return utils.convertFromStrToDate(data);
    },
    lastSignal(data) {
      const signal = data.split(',')
      var reportDate = signal[0];

      //(GPS:4, CELL:5, SAVE-WIFI:6,없음:7)
      var cell = "icon_none.svg";
      switch (signal[1]) {
        case 4:
          cell = "icon_GPS.svg";
          break;
        case 5:
          cell = "icon_Cell.svg";
          break;
        case 6:
          cell = "icon_WIFI.svg";
          break;
      }

      var battery = "battery/0.svg";
      switch (signal[2]) {
        case 0:
          battery = "battery/Warn.svg";
          break;
        case 1:
        case 2:
        case 3:
          battery = "battery/" + signal[2] + ".svg";
          break;
        case 4:
          // 충전중
          battery = "battery/Chg.svg";
          break;
        case 5:
          // 충전완료
          battery = "battery/Complete.svg";
          break;
      }

      return reportDate + ' <img src="/static/images/' + cell + '" alt="none" width="42" height="20">' +  ' <img src="/static/images/' + battery + '" alt="battery_charge" width="30">';
    },
    async selectDeviceList() {
      const tables = this.$refs.datatable
      if(tables) {
        const param = {}
        const res = await api.selDeviceList(param);
        if(res.data.status === "SUCCESS") {
          this.dataList = res.data.data;

          const data = this.dataList.map(item => Object.values(item))

          console.log(data);
          this.dataList ={"headings": this.headings, "data": data}
          console.log(this.dataList)
          this.datatable = new window.simpleDatatables.DataTable(tables, {
            data: this.dataList,
            columns: this.columns
          });
        }
        // const data = [
        //   ["6",
        //   "123456789012345",
        //   "0103335552",
        //   "0103335552",
        //   "성북장애인재단",
        //   "2021-04-23",
        //   "2021-04-23",
        //   "2021-04-23 12:00",
        //   "202"],
        //   ["7",
        //     "123456789012345",
        //     "0103335552",
        //     "0103335552",
        //     "성북장애인재단",
        //     "2021-04-23",
        //     "2021-04-23",
        //     "2021-04-23 12:00",
        //     "202"]
        // ]
        //this.dataList.put("headings", this.headings);


      }
    }
  },
  created(){

  }
}

</script>

<style scoped>

</style>