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
              <div class="row my-3 align-items-center">
                <div class="col d-flex flex-wrap gap-3">

                  <div class="d-flex align-items-center">
                    <label for="IMEI" class="fw-bold me-2" style="white-space: nowrap;">IMEI</label>
                    <input
                        v-model="search.deviceIMEI"
                        type="text"
                        id="IMEI"
                        class="form-control"
                        style="width: 180px;"
                        placeholder="IMEI 입력"
                        @keyup.enter="selectDeviceList"
                    >
                  </div>
                  <div class="d-flex align-items-center">
                    <label for="ICCID" class="fw-bold me-2" style="white-space: nowrap;">ICCID</label>
                    <input
                        v-model="search.iccId"
                        type="text"
                        id="ICCID"
                        class="form-control"
                        style="width: 180px;"
                        placeholder=""
                        @keyup.enter="selectDeviceList"
                    >
                  </div>
                  <div class="d-flex align-items-center">
                    <label for="phone" class="fw-bold me-2" style="white-space: nowrap;">사용자 전화번호0</label>
                    <input
                        v-model="search.guardPhone"
                        type="text"
                        id="phone"
                        class="form-control"
                        style="width: 160px;"
                        placeholder="번호 입력"
                        @keyup.enter="selectDeviceList"
                    >
                  </div>
                  <div class="d-flex align-items-center">
                    <label class="fw-bold me-2" style="white-space: nowrap;">만료일</label>
                    <div class="d-flex align-items-center gap-1">
                      <input v-model="search.expDateStart" type="date" class="form-control" style="width: 140px;" @change="selectDeviceList">
                      <span>~</span>
                      <input v-model="search.expDateEnd" type="date" class="form-control" style="width: 140px;" @change="selectDeviceList">
                    </div>
                  </div>

                  <div class="d-flex align-items-center">
                    <label class="fw-bold me-2" style="white-space: nowrap;">이심사용기한</label>
                    <div class="d-flex align-items-center gap-1">
                      <input v-model="search.esimExpDateStart" type="date" class="form-control" style="width: 140px;" @change="selectDeviceList">
                      <span>~</span>
                      <input v-model="search.esimExpDateEnd" type="date" class="form-control" style="width: 140px;" @change="selectDeviceList">
                    </div>
                  </div>
                  <div class="d-flex align-items-center">
                    <label for="group" class="fw-bold me-2" style="white-space: nowrap;">소속 기관</label>
                    <select
                        v-model="search.orgcNo"
                        id="group"
                        class="form-select"
                        style="width: 200px;"
                        @change="selectDeviceList"
                    >
                      <option value=""> - 선택 - </option>
                      <option v-for="(orgc, index) in orgcList" :key="index" :value="orgc.ORGC_NO">
                        {{orgc.ORGC_NAME}}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="col-auto ms-auto">
                  <button class="btn btn-secondary" @click="selectDeviceList">
                    <i class="bi bi-search"></i> 조회
                  </button>
                </div>

              </div>
            </div>
          </div>
          <!--/ 검색조건 -->
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
                <button class="btn btn-primary mt-2 ms-1" @click="downloadExcel">엑셀 다운</button>
                <button class="btn btn-primary mt-2 ms-1" @click="openExcelUpload">엑셀 업로드</button>
                <button class="btn btn-primary mt-2 ms-1" @click="addDevice">기기 등록</button>

              </p>
            </div>
          </div><!--// 목록 테이블 -->

        </div>
      </div>
    </section>

    <!-- 레이어 팝업 -->
    <div v-if="showPopup" class="popup-overlay" @click.self="closeExcelUpload">
      <div class="popup-content">
        <h3>엑셀 파일 업로드</h3>
        <input type="file" accept=".xls,.xlsx" @change="onFileChange" />
        <div class="btn-group">
          <button @click="uploadFile" :disabled="!selectedFile" class="upload-btn">업로드</button>
          <button @click="closeExcelUpload" class="cancel-btn">취소</button>
        </div>
      </div>
    </div>

  </main><!--// 컨텐츠 영역 -->
</template>

<script>
import api from '@/api/api';
import utils from "@/utils/utils";
import router from "@/router/router";

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
        iccId:'',
        guardPhone:'',
        orgcNo:'',
        // 만료일 기간
        expDateStart: '',
        expDateEnd: '',
        // 이심사용기한 기간
        esimExpDateStart: '',
        esimExpDateEnd: ''
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
            let style = "width=650,height=670,left=0,top=0";
            let param = "'" + url + "','" + name + "','" + style + "'";
            let html = "<a class='text-primary' href=\"javascript:openPopup(" + param + ")\">" + data + "</a>";
            return html;
          }
        },
        {select:2, scope:'row', render: this.telForm},
        {select:3, scope:'row'},
        {select:4, scope:'row', render: this.telForm},
        {select:5, scope:'row'},
        {select:6, scope:'row', render: this.dateForm},
        {select:7, scope:'row', render: this.dateForm},
        {select:8, scope:'row'},
        {select:9, scope:'row', render: this.lastSignal},
        {select:10, scope:'row'},
      ],
      // dataList:[],
      headings:["No", "IMEI", "기기 전화번호", "요금제", "사용자 전화번호0", "소속 기관", "만료일","이심사용기한", "사이즈", "마지막 신호", "위치전송횟수"],
      showPopup: false,
      selectedFile: null,
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
          "width=650,height=670,left=0,top=0"
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
      // console.log(data);
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


    downloadExcel() {
      const param = this.search;
      param.guardPhone = param.guardPhone.replaceAll("-","")
      api.downDeviceListExcel(param).then(res=>{
        let fileName = "기기리스트.xlsx"
        console.log(fileName)
        utils.fileDownload(res.data, fileName)
        // router.go(0)
      })


    },

    openExcelUpload() {
      this.showPopup = true;
      this.selectedFile = null;
    },
    closeExcelUpload() {
      this.showPopup = false;
      this.selectedFile = null;
    },
    onFileChange(e) {
      const file = e.target.files[0];
      this.selectedFile = file ? file : null;
    },
    uploadFile() {
      if (!this.selectedFile) {
        alert('엑셀 파일을 선택해주세요.');
        return;
      }
      const formData = new FormData();
      formData.append("file", this.selectedFile)
      api.uploadDeviceListExcel(formData).then(res=>{
          if(res.data.status === "SUCCESS") {
            // let row_count = res.data.data.rowNum;
            let resData = res.data.data;
            if(resData.checkValidation) {
              alert(`${res.data.data.rowNum}개 업로드 완료`);
              this.selectDeviceList();
            }else{
              alert(`${resData.rowNum} : ${resData.msg}`);
            }
          }
      })
      // 실제 업로드 로직 구현 부분
      // alert(`선택된 파일: ${this.selectedFile.name} 업로드 진행중...`);

      // 업로드 처리 후 팝업 닫기
      this.closeExcelUpload();
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
.upload-btn {
  background-color: #2979ff;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}
.upload-btn:disabled {
  background-color: #aacbff;
  cursor: not-allowed;
}
.upload-btn:hover:not(:disabled) {
  background-color: #0d47a1;
}
.cancel-btn {
  background-color: #ccc;
  border: none;
  padding: 10px 18px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
  font-size: 14px;
}
.cancel-btn:hover {
  background-color: #bbb;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.popup-content {
  background-color: white;
  padding: 20px 30px;
  border-radius: 8px;
  width: 420px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  text-align: center;
}

.btn-group {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>