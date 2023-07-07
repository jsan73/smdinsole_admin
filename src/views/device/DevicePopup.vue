<template>
  <div class="m-4">
    <h5 class="pb-2">
      <i class="bi bi-caret-right-square"></i> <div v-if="popupState=='ins'">기기 등록</div><div v-else>기기 수정</div>
    </h5>

    <div class="card">
      <div class="card-body pb-0">
        <table class="table table-sm table-bordered">
          <tbody>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col" width="28%">IMEI</th>
            <td><input type="text"  @input="clear" v-model="device.deviceIMEI" id="userName" name="userName" class="form-control d-inline-flex" style="width: 150px;" :readonly="popupState == 'upd'">
              &nbsp;<button v-if="popupState == 'ins'" type="button" class="btn btn-secondary btn-sm" @click="chkIMEI">일련번호 체크</button>
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;"scope="col">기기 전화번호</th>
            <td>
              <select id="protectorPhone1" v-model="dphone1" name="protectorPhone1" class="form-select d-inline-flex" style="width: 100px;">
                <option value="010">010</option>
                <option value="012">012</option>
                <option value="011">011</option>
                <option value="016">016</option>
                <option value="017">017</option>
                <option value="018">018</option>
                <option value="019">019</option>
              </select>
              -
              <input type="text" v-model="dphone2" id="protectorPhone2" name="protectorPhone2" class="form-control d-inline-flex" style="width: 100px;" maxlength="4">
              -
              <input type="text" v-model="dphone3" id="protectorPhone3" name="protectorPhone3" class="form-control d-inline-flex" style="width: 100px;" maxlength="4">
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col" width="28%">사용자 전화번호0</th>
            <td>
              <select id="protectorPhone1" v-model="gphone1" name="protectorPhone1" class="form-select d-inline-flex" style="width: 100px;">
                <option value="010">010</option>
                <option value="011">011</option>
                <option value="016">016</option>
                <option value="017">017</option>
                <option value="018">018</option>
                <option value="019">019</option>
              </select>
              -
              <input type="text" v-model="gphone2" id="protectorPhone2" name="protectorPhone2" class="form-control d-inline-flex" style="width: 100px;" maxlength="4">
              -
              <input type="text" v-model="gphone3" id="protectorPhone3" name="protectorPhone3" class="form-control d-inline-flex" style="width: 100px;" maxlength="4">
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col" width="28%">소속 기관</th>
            <td>
              <select id="protectorPhone1" v-model="device.orgcNo" name="protectorPhone1" class="form-select d-inline-flex">
                <option value=""> - 선택 - </option>
                <option v-for="(orgc, index) in orgcList" :key="index" :value="orgc.ORGC_NO">{{orgc.ORGC_NAME}}</option>

              </select>
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col">가입일</th>
            <td>
              <input type="date" v-model="regDate" class="form-control" style="width: 150px;">
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <p class="text-end">
      <button v-if="popupState == 'ins'" class="btn btn-primary mb-1 ms-1"  @click="regDevice">등록</button>
      <button v-if="popupState == 'upd'" class="btn btn-primary mb-1 ms-1" @click="delDevice">삭제</button>
      <button v-if="popupState == 'upd'" class="btn btn-primary mb-1 ms-1" @click="updDevice">수정</button>
    </p>
  </div>

</template>

<script>
import api from '@/api/api';
import utils from "@/utils/utils";

export default {
  name: "DeviceAdd",
  data() {
    return {
      device: {
        deviceNo:0,
        deviceIMEI:'',
        deviceNumber:'',
        guardPhone:'',
        memberDate:'',
        orgcNo:'',
        chkdevice:'',
        deviceCount:1
      },
      dphone1:'011',
      dphone2:'',
      dphone3:'',
      gphone1:'010',
      gphone2:'',
      gphone3:'',
      regDate:'',
      deviceIMEI:'',
      popupState:"ins",
      orgGuardPhone:'',

      orgcList:''
    }
  },
  mounted() {
    this.deviceIMEI = this.$route.query.device;
    if(utils.isNotEmpty(this.deviceIMEI )) {
      this.popupState = "upd"
      this.getDeviceInfo(this.deviceIMEI);
    }else{
      // this.geolocate();
    }
    this.selectOrgcList();
  },
  methods: {
    async getDeviceInfo(deviceIMEI) {

        let res = await api.getDeviceInfo(deviceIMEI);
        if(res.data.status === "SUCCESS") {
          this.device = res.data.data;
          console.log(this.device)
          if(utils.isNotEmpty(this.device.deviceNumber)) {
            const phone = utils.telForm(this.device.deviceNumber).split("-");
            this.dphone1 = phone[0];
            this.dphone2 = phone[1];
            this.dphone3 = phone[2];
          }
          if(utils.isNotEmpty(this.device.guardPhone)) {
            const phone = utils.telForm(this.device.guardPhone).split("-");
            this.gphone1 = phone[0];
            this.gphone2 = phone[1];
            this.gphone3 = phone[2];
            this.orgGuardPhone = this.gphone1 + this.gphone2 + this.gphone3;
            console.log(this.orgGuardPhone);
          }
          if(utils.isNotEmpty(this.device.memberDate)) {
            this.regDate = utils.dateForm(this.device.memberDate);
          }
        }
    },
    setDevice() {
      this.device.deviceNumber = this.dphone1 + this.dphone2 + this.dphone3;
      if(utils.isNotEmpty(this.gphone2) && utils.isNotEmpty(this.gphone3)) {
        this.device.guardPhone = this.gphone1 + this.gphone2 + this.gphone3;
      }

      this.device.memberDate = this.regDate.replace(/-/gi, "");
    },
    async insDevice() {
      this.setDevice();
      const res = await api.insDevice(this.device);
      if(res.data.status === "SUCCESS") {
          alert("추가 되었습니다.")
      }
    },
    updDevice() {
      this.setDevice();
      if(this.orgGuardPhone != this.device.guardPhone && this.device.deviceCount > 1) {
        if(!confirm("사용자 전화번호0 은 다른 기기에서도 사용중입니다.\n수정하시면 다른 기기 전화 번호도 변경 됩니다.")){
          return;
        }
      }
      api.updDevice(this.device).then(res => {
        if(res.data.status === "SUCCESS") {
          alert("수정 되었습니다.")
          window.opener.vueComponent.selectDeviceList();
          window.close();
        }
      });

    },
    delDevice() {
      if(confirm("삭제 하시겠습니까?")) {
        api.delDevice(this.deviceIMEI).then(res => {
          if(res.data.status === "SUCCESS") {
            alert("삭제 되었습니다.")
            window.opener.vueComponent.selectDeviceList();
            window.close();
          }
        });

      }
    },
    regDevice() {
      if(this.device.chkdevice === "") {
        alert("IMEI 체크를 먼저 진행해 주세요.");
        return;
      }

      if(this.device.chkdevice) {
        this.insDevice().then(() => {
          //opener.location.reload();
          window.opener.vueComponent.selectDeviceList();
          window.close();
        })
      }else{
        this.device.chkdevice = false;
        alert("IMEI 값이 이미 존재합니다.")
      }
    },
    chkIMEI() {
      if(this.device.deviceIMEI === "") {
        alert("IMEI값을 입력해 주세요");
        return;
      }
      api.getDeviceInfo(this.device.deviceIMEI).then(res => {
        if(res.data.status === "SUCCESS") {
          if(utils.isNotEmpty(res.data.data)) {
            this.device.chkdevice = false;
            alert("중복입니다.");
          }else{
            this.device.chkdevice = true;
            alert("사용 가능 합니다.");

          }
        }
      })
    },
    clear() {
      this.device.chkdevice = "";
    },
    async selectOrgcList() {
      const param = {};
      const res = await api.selOrgcList(param);
      if(res.data.status === "SUCCESS") {
        this.orgcList = res.data.data;
      }

    },
  }

}
</script>

<style scoped>

</style>