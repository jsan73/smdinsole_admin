<template>
  <div class="m-4">
    <h5 class="pb-2">
      <i class="bi bi-caret-right-square"></i> 기기 등록
    </h5>

    <div class="card">
      <div class="card-body pb-0">
        <table class="table table-sm table-bordered">
          <tbody>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col" width="28%">IMEI</th>
            <td><input type="text" v-model="device.deviceIMEI" id="userName" name="userName" class="form-control d-inline-flex" style="width: 150px;">
              &nbsp;<button type="button" class="btn btn-secondary btn-sm">일련번호 체크</button>
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;"scope="col">기기 전화번호</th>
            <td>
              <select id="protectorPhone1" v-model="dphone1" name="protectorPhone1" class="form-select d-inline-flex" style="width: 100px;">
                <option value="010"> 010 </option>
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
              <select id="protectorPhone1" v-model="device.orgCd" name="protectorPhone1" class="form-select d-inline-flex">
                <option value=""> - 선택 - </option>
                <option value="G001"> 개인 </option>
                <option value="G002">홀트복지재단</option>
                <option value="G003">성북장애인재단</option>
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
      <button class="btn btn-primary mb-1 ms-1" @click="regDevice">등록</button>
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
        deviceIMEI:'12345678',
        deviceNumber:'',
        guardPhone:'',
        memberDate:'',
        orgCd:''
      },
      dphone1:'011',
      dphone2:'1111',
      dphone3:'2222',
      gphone1:'010',
      gphone2:'3333',
      gphone3:'4444',
      regDate:''
    }
  },
  methods: {
    async insDevice() {
      this.device.deviceNumber = this.dphone1 + this.dphone2 + this.dphone3;
      if(utils.isNotEmpty(this.gphone2) && utils.isNotEmpty(this.gphone3)) {
        this.device.guardPhone = this.gphone1 + this.gphone2 + this.gphone3;
      }

      this.device.memberDate = this.regDate.replace(/-/gi, "");
      const res = await api.insDevice(this.device);
      if(res.data.status === "SUCCESS") {
          alert("추가 되었습니다.")
      }
    },
    regDevice() {
      this.insDevice().then(() => {
        opener.location.reload();
        window.close();
      })

    }
  }


}
</script>

<style scoped>

</style>