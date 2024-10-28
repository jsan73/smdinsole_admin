<template>
  <div class="m-4">
    <h5 class="pb-2">
      <i class="bi bi-caret-right-square"></i> {{popupTitle}}
    </h5>

    <div class="card">
      <div class="card-body pb-0">
        <table class="table table-sm table-bordered">
          <tbody>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col" width="28%">기관명</th>
            <td>
              <input type="text"  v-model="orgc.orgcName" id="orgcName" name="orgcName" class="form-control d-inline-flex">
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;"scope="col">기관주소</th>
            <td><input type="text" v-model="orgc.orgcAddr" class="form-control d-inline-flex" id="orgcAddr" name="orgcAddr" >
<!--              <button type="button" class="btn btn-secondary btn-sm">주소검색</button>-->
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col" width="28%">담당자명</th>
            <td>
              <input type="text" v-model="orgc.managerName" id="managerName" name="managerName" class="form-control d-inline-flex">
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col" width="28%">전화번호</th>
            <td>
              <input type="text" v-model="orgc.managerPhone" id="managerPhone" name="managerPhone" class="form-control d-inline-flex" maxlength="13">
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col">이메일</th>
            <td>
              <input type="text" v-model="orgc.managerEmail" id="managerEmail" name="managerEmail" class="form-control d-inline-flex">
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <p class="text-end">
      <button v-if="popupState == 'ins'" class="btn btn-primary mb-1 ms-1"  @click="addOrgc">등록</button>
      <button v-if="popupState == 'upd'" class="btn btn-primary mb-1 ms-1" @click="delOrgc">삭제</button>
      <button v-if="popupState == 'upd'" class="btn btn-primary mb-1 ms-1" @click="updOrgc">수정</button>
    </p>
  </div>

</template>

<script>
import api from '@/api/api';
import utils from "@/utils/utils";

export default {
  name: "OrgcPopup",
  data() {
    return {
      orgc: {
        orgcNo:0,
        orgcName:'',
        orgcAddr:'',
        managerName:'',
        managerPhone:'',
        managerEmail:'',
      },
      orgcNo:'',
      popupState:"ins",
      popupTitle:"기관 등록"
    }
  },
  mounted() {
    this.orgcNo = this.$route.query.orgcNo;
    if(utils.isNotEmpty(this.orgcNo )) {
      this.popupState = "upd"
      this.getOrgcInfo(this.orgcNo);
      this.popupTitle = '기기 수정'
    }
  },
  methods: {
    async getOrgcInfo(orgcNo) {

      let res = await api.getOrgcInfo(orgcNo);
      if(res.data.status === "SUCCESS") {
        this.orgc = res.data.data;
        this.orgc.managerPhone = utils.telForm(this.orgc.managerPhone, 1)
      }
    },

    async insOrgc() {
      if(utils.isNotEmpty(this.orgc.managerPhone) && !utils.telValidChk(this.orgc.managerPhone)) {
        alert("사용자 전화번호를 다시 확인해 주세요.")
        return;
      }
      this.orgc.managerPhone = this.orgc.managerPhone.replaceAll("-","")
      const res = await api.insOrgc(this.orgc);
      if(res.data.status === "SUCCESS") {
        alert("추가 되었습니다.")
      }
    },
    updOrgc() {
      if(utils.isNotEmpty(this.orgc.managerPhone) && !utils.telValidChk(this.orgc.managerPhone)) {
        alert("사용자 전화번호를 다시 확인해 주세요.")
        return;
      }
      this.orgc.managerPhone = this.orgc.managerPhone.replaceAll("-","")
      api.updOrgc(this.orgc).then(res => {
        if(res.data.status === "SUCCESS") {
          alert("수정 되었습니다.")
          window.opener.vueComponent.selectOrgcList();
          window.close();
        }
      });

    },
    delOrgc() {
      if(confirm("삭제 하시겠습니까?")) {
        api.delOrgc(this.orgcNo).then(res => {
          if(res.data.status === "SUCCESS") {
            alert("삭제 되었습니다.")
            window.opener.vueComponent.selectOrgcList();
            window.close();
          }
        });

      }
    },
    addOrgc() {

      this.insOrgc().then(() => {
        //opener.location.reload();
        window.opener.vueComponent.selectOrgcList();
        window.close();
      })

    },

  }
}
</script>

<style scoped>

</style>