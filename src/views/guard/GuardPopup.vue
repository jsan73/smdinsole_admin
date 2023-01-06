<template>
  <div class="m-4">
    <h5 class="pb-2">
      <i class="bi bi-caret-right-square"></i> 사용자 수정
    </h5>

    <div class="card">
      <div class="card-body pb-0">
        <table class="table table-sm table-bordered">
          <tbody>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col">IMEI</th>
            <td><input type="text" v-model="deviceIMEI" class="form-control d-inline-flex" id="deviceID" name="deviceIMEI" readonly>
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col">사용자명</th>
            <td><input v-model="guard.guardName" type="text" class="form-control d-inline-flex" id="userName" name="userName" readonly></td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col" width="28%">이메일</th>
            <td><input v-model="guard.email" type="text" class="form-control d-inline-flex" id="userEmail" name="userEmail">
              <br><span class="description-text">ex) aaa@kokasin.com</span>
            </td>
          </tr>

<!--          <tr>-->
<!--            <th class="text-center align-middle bg-dark small" style="&#45;&#45;bs-bg-opacity: .05;" scope="col">소속 기관</th>-->
<!--            <td>-->
<!--              <select v-model="guard.orgCd" id="group" name="group" class="form-select d-inline-flex" readonly>-->
<!--                <option value=""> - 선택 - </option>-->
<!--                <option value="G001"> 개인 </option>-->
<!--                <option value="G002">홀트복지재단</option>-->
<!--                <option value="G003">성북장애인재단</option>-->
<!--              </select>-->
<!--            </td>-->
<!--          </tr>-->

          <tr v-for="(phone, idx) in guard.phoneList">

            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col">사용자 전화번호{{idx}}</th>
            <td>
              <select v-model="phone.phone[0]" id="protectorPhone1" name="protectorPhone1" class="form-select d-inline-flex" style="width: 100px;">
                <option value="010">010</option>
                <option value="011">011</option>
                <option value="016">016</option>
                <option value="017">017</option>
                <option value="018">018</option>
                <option value="019">019</option>
              </select>
              -
              <input type="text" id="protectorPhone2" name="protectorPhone2" v-model="phone.phone[1]" class="form-control d-inline-flex" style="width: 100px;" maxlength="4">
              -
              <input type="text" id="protectorPhone3" name="protectorPhone3" v-model="phone.phone[2]" class="form-control d-inline-flex" style="width: 100px;" maxlength="4">
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
<!--      <button class="btn btn-primary mb-1 ms-1" onclick="javascript:deleteUser()">삭제</button>-->
      <button class="btn btn-primary mb-1 ms-1" @click="updateGuard">수정</button>
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
        phoneList : [],
        status:'N'    // I, U, D, N
      },
      orgGuard: {
        email:'',
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
      this.initPhoneList();
    }
  },
  methods: {
    initPhoneList() {
      for (let i = 0; i < 5; i++) {
        this.guard.phoneList.push({"guardNo": "0", "status":"N", "phone":new Array(3)});
        this.orgGuard.phoneList.push({"guardNo": "0", "phone":new Array(3)});
      }
    },
    async getGuardInfo(deviceIMEI) {

      let res = await api.selGuardPhoneList(deviceIMEI);
      let phoneList = res.data.data;
      this.initPhoneList();


      for(let index = 0; index < phoneList.length; index++) {
        // let guardPhone = utils.telForm(phone.guardPhone).split("-");
        // console.log(this.guard.phoneList)
        this.guard.phoneList[index] = {"guardNo": phoneList[index].guardNo, "phone": utils.telForm(phoneList[index].guardPhone).split("-")};
        this.orgGuard.phoneList[index] = {"guardNo": phoneList[index].guardNo, "phone": utils.telForm(phoneList[index].guardPhone).split("-")};

        if(index == 0) {
          this.guard.guardName = phoneList[index].guardName;
          this.guard.email = phoneList[index].email;
          this.orgGuard.email = phoneList[index].email;
        }

      }
    },
    updateGuard() {
      var reqGuard = {
            email:'',
            phoneList : [],
            masterGuardNo : 0,
            status:'N'    // I, U, D, N
          }
      reqGuard.masterGuardNo = this.guard.phoneList[0].guardNo;

      for(let idx = 0; idx < this.orgGuard.phoneList.length; idx++) {

        if(this.guard.phoneList[idx].phone.toString() == this.orgGuard.phoneList[idx].phone.toString()) {
          this.guard.phoneList[idx].status = 'N'
        }else{
          let phone1 = this.guard.phoneList[idx].phone[0];
          let phone2 = this.guard.phoneList[idx].phone[1];
          let phone3 = this.guard.phoneList[idx].phone[2];
          if(utils.isNotEmpty(phone1) && utils.isNotEmpty(phone2) && utils.isNotEmpty(phone3)) {
            let phoneNumber = phone1 + phone2 + phone3;
            let status = "N";

            if (this.guard.phoneList[idx].guardNo == "0") status = "I"; // this.guard.phoneList[idx].status = "I"
            else status = "U"; // this.guard.phoneList[idx].status = "U"

            reqGuard.phoneList.push({"guardNo" : this.guard.phoneList[idx].guardNo, "phoneNumber": phoneNumber, "status":status});
          }else{
            if(utils.isEmpty(phone2) && utils.isEmpty(phone3)) {
              if(this.guard.phoneList[idx].guardNo != "0") {
                reqGuard.phoneList.push({"guardNo" : this.guard.phoneList[idx].guardNo, "phoneNumber": "", "status":"D"});
              }
            }
          }
        }
      }
      if(this.orgGuard.email != this.guard.email) {
        reqGuard.status = "U"
        reqGuard.email = this.guard.email;
      }

      //let params = reqGuard;
      api.updGuard(reqGuard).then(res => {
        if(res.data.status === "SUCCESS") {

        }
      })
      console.log(this.guard);
    }

  }
}
</script>

<style scoped>

</style>