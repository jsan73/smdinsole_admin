<template>
  <div class="m-4">
    <h5 class="pb-2">
      <i class="bi bi-caret-right-square"></i> 사용자 등록
    </h5>

    <div class="card">
      <div class="card-body pb-0">
        <table class="table table-sm table-bordered">
          <tbody>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col" width="28%">이메일</th>
            <td><input v-model="guard.email" type="text" class="form-control d-inline-flex" id="userEmail" name="userEmail">
              <br><span class="description-text">ex) aaa@kokasin.com</span>
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col">사용자명</th>
            <td><input v-model="guard.guardName" type="text" class="form-control d-inline-flex" id="userName" name="userName"></td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col">IMEI</th>
            <td><input type="text" v-model="deviceIMEI" class="form-control d-inline-flex" id="deviceID" name="deviceIMEI" readonly>
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col">소속 기관</th>
            <td>
              <select v-model="guard.orgCd" id="group" name="group" class="form-select d-inline-flex">
                <option value=""> - 선택 - </option>
                <option value="G001"> 개인 </option>
                <option value="G002">홀트복지재단</option>
                <option value="G003">성북장애인재단</option>
              </select>
            </td>
          </tr>

          <tr v-for="(phone, idx) in guard.phoneList">
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col">사용자 전화번호{{idx}}</th>
            <td>
              <select v-model="phone[0]" id="protectorPhone1" name="protectorPhone1" class="form-select d-inline-flex" style="width: 100px;">
                <option value="010">010</option>
                <option value="011">011</option>
                <option value="016">016</option>
                <option value="017">017</option>
                <option value="018">018</option>
                <option value="019">019</option>
              </select>
              -
              <input type="text" id="protectorPhone2" name="protectorPhone2" v-model="phone[1]" class="form-control d-inline-flex" style="width: 100px;" maxlength="4">
              -
              <input type="text" id="protectorPhone3" name="protectorPhone3" v-model="phone[2]" class="form-control d-inline-flex" style="width: 100px;" maxlength="4">
            </td>
          </tr>
<!--          <tr>-->
<!--            <th class="text-center align-middle bg-dark small" style="&#45;&#45;bs-bg-opacity: .05;" scope="col">사용자 전화번호1</th>-->
<!--            <td>-->
<!--              <select id="protectorPhone1" name="protectorPhone1" class="form-select d-inline-flex" style="width: 100px;">-->
<!--                <option value="true"> 010 </option>-->
<!--                <option value="false">011</option>-->
<!--                <option value="false">016</option>-->
<!--                <option value="false">017</option>-->
<!--                <option value="false">018</option>-->
<!--                <option value="false">019</option>-->
<!--              </select>-->
<!--              - -->
<!--              <input type="text" id="protectorPhone2" name="protectorPhone2" class="form-control d-inline-flex"-->
<!--                     style="width: 100px;" maxlength="4">-->
<!--              - -->
<!--              <input type="text" id="protectorPhone3" name="protectorPhone3" class="form-control d-inline-flex"-->
<!--                     style="width: 100px;" maxlength="4">-->
<!--            </td>-->
<!--          </tr>-->
<!--          <tr>-->
<!--            <th class="text-center align-middle bg-dark small" style="&#45;&#45;bs-bg-opacity: .05;" scope="col">사용자 전화번호2</th>-->
<!--            <td>-->
<!--              <select id="protectorPhone1" name="protectorPhone1" class="form-select d-inline-flex" style="width: 100px;">-->
<!--                <option value="true"> 010 </option>-->
<!--                <option value="false">011</option>-->
<!--                <option value="false">016</option>-->
<!--                <option value="false">017</option>-->
<!--                <option value="false">018</option>-->
<!--                <option value="false">019</option>-->
<!--              </select>-->
<!--              - -->
<!--              <input type="text" id="protectorPhone2" name="protectorPhone2" class="form-control d-inline-flex" style="width: 100px;" maxlength="4">-->
<!--              - -->
<!--              <input type="text" id="protectorPhone3" name="protectorPhone3" class="form-control d-inline-flex" style="width: 100px;" maxlength="4">-->
<!--            </td>-->
<!--          </tr>-->
<!--          <tr>-->
<!--            <th class="text-center align-middle bg-dark small" style="&#45;&#45;bs-bg-opacity: .05;" scope="col">사용자 전화번호3</th>-->
<!--            <td>-->
<!--              <select id="protectorPhone1" name="protectorPhone1" class="form-select d-inline-flex" style="width: 100px;">-->
<!--                <option value="true"> 010 </option>-->
<!--                <option value="false">011</option>-->
<!--                <option value="false">016</option>-->
<!--                <option value="false">017</option>-->
<!--                <option value="false">018</option>-->
<!--                <option value="false">019</option>-->
<!--              </select>-->
<!--              - -->
<!--              <input type="text" id="protectorPhone2" name="protectorPhone2" class="form-control d-inline-flex" style="width: 100px;" maxlength="4">-->
<!--              - -->
<!--              <input type="text" id="protectorPhone3" name="protectorPhone3" class="form-control d-inline-flex" style="width: 100px;" maxlength="4">-->
<!--            </td>-->
<!--          </tr>-->
<!--          <tr>-->
<!--            <th class="text-center align-middle bg-dark small" style="&#45;&#45;bs-bg-opacity: .05;" scope="col">사용자 전화번호4</th>-->
<!--            <td>-->
<!--              <select id="protectorPhone1" name="protectorPhone1" class="form-select d-inline-flex" style="width: 100px;">-->
<!--                <option value="true"> 010 </option>-->
<!--                <option value="false">011</option>-->
<!--                <option value="false">016</option>-->
<!--                <option value="false">017</option>-->
<!--                <option value="false">018</option>-->
<!--                <option value="false">019</option>-->
<!--              </select>-->
<!--              - -->
<!--              <input type="text" id="protectorPhone2" name="protectorPhone2" class="form-control d-inline-flex" style="width: 100px;" maxlength="4">-->
<!--              - -->
<!--              <input type="text" id="protectorPhone3" name="protectorPhone3" class="form-control d-inline-flex" style="width: 100px;" maxlength="4">-->
<!--            </td>-->
<!--          </tr>-->
          </tbody>
        </table>
      </div>
    </div>
    <p class="text-end">
      <button class="btn btn-primary mb-1 ms-1" onclick="javascript:deleteUser()">삭제</button>
      <button class="btn btn-primary mb-1 ms-1" onclick="javascript:modifyUser()">수정</button>
    </p>
  </div>
</template>

<script>
import api from '@/api/api';
import utils from "@/utils/utils";

export default {
  name: "GuardPopup",
  data() {
    return {
      guard: {
        email:'',
        guardName:'',
        orgCd:'',
        phoneList : []
      },
      deviceIMEI:'',
      popupState:"ins"
    }
  },
  created: function () {

  },
  mounted() {
    this.deviceIMEI = this.$route.query.device;


    if(utils.isNotEmpty(this.deviceIMEI )) {
      this.popupState = "upd"
      this.getGuardInfo(this.deviceIMEI);
    }else{
      // this.geolocate();
    }
  },
  methods: {
    async getGuardInfo(deviceIMEI) {


      let res = await api.selGuardPhoneList(deviceIMEI);
      let phoneList = res.data.data;

      for (let i = 0; i < 5; i++) {
        this.guard.phoneList.push(new Array(3));
        if(phoneList.length > i) {
          this.guard.phoneList[i] = utils.telForm(phoneList[i].guardPhone).split("-");
        }

        console.log("aaaaa ", this.guard.phoneList)
      }

      // for(let index = 0; index < phoneList.length(); index++) {
      //   // let guardPhone = utils.telForm(phone.guardPhone).split("-");
      //   // console.log(this.guard.phoneList)
      //   this.guard.phoneList[index] = utils.telForm(phoneList[index].guardPhone).split("-");
      //
      // }
    }

  }
}
</script>

<style scoped>

</style>