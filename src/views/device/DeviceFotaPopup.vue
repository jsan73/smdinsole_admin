<template>
  <div class="m-4">
    <h5 class="pb-2">
      <i class="bi bi-caret-right-square"></i> FOTA view</h5>

    <div class="card">
      <div class="card-body pb-0">
        <table class="table table-sm table-bordered">
          <tbody>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col" width="28%">FOTA 파일</th>
            <td>
              <input type="text"  v-model="fota.filename"  class="form-control d-inline-flex" style="width: 250px;" >&nbsp;
              <button type="button" class="btn btn-secondary btn-sm" @click="chkIMEI">파일 업로드</button>
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col" width="28%">Build no</th>
            <td>
              <input type="text"  v-model="fota.buildNo"  class="form-control d-inline-flex" style="width: 250px;" >&nbsp;
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col" width="28%">IMEI</th>
            <td><input type="text"  v-model="fota.deviceIMEI"  class="form-control d-inline-flex" style="width: 180px;" :readonly="popupState == 'upd'">
              &nbsp;
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col" width="28%">DATE</th>
            <td>
              <input type="text"  v-model="fota.date"  class="form-control d-inline-flex" style="width: 250px;" >&nbsp;
            </td>
          </tr>

          </tbody>
        </table>
      </div>
    </div>
    <p class="text-end">
      <button class="btn btn-primary mb-1 ms-1"  @click="regDevice">적용</button>
      <button class="btn btn-primary mb-1 ms-1" @click="delDevice">삭제</button>
    </p>
  </div>

</template>

<script>
import api from '@/api/api';
import utils from "@/utils/utils";

export default {
  name: "DeviceFotaPopup",
  data() {
    return {
      fota: {
        filename:'',
        buildNo:0,
        deviceIMEI:'',
        date:'',
      },
    }
  },

  mounted() {

    this.selectOrgcList();
  },
  methods: {
    async getDeviceFotaInfo() {

        let res = await api.getDeviceInfo(deviceIMEI);
        if(res.data.status === "SUCCESS") {
          this.device = res.data.data;

        }
    },

    async setDeviceFotaInfo() {


      const res = await api.insDevice(this.device);
      if(res.data.status === "SUCCESS") {
          alert("추가 되었습니다.")
      }
    },

    delDeviceFota() {
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

  }

}
</script>

<style scoped>

</style>