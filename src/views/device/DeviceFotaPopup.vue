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
              <input type="file" @change="setFile"  class="form-control d-inline-flex" style="width: 99%;"><br>
              <p class="text-end">파일명 : {{fota.fotaFile}}</p>
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col" width="28%">Build no</th>
            <td>
              <input type="text"  v-model="fota.buildNo"  class="form-control d-inline-flex" style="width: 99%;" >
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col" width="28%">IMEI</th>
            <td><input type="text"  v-model="fota.deviceIMEI"  class="form-control d-inline-flex" style="width: 99%;"></td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col" width="28%">DATE</th>
            <td>
              <input type="text"  v-model="fota.buildDate"  class="form-control d-inline-flex" style="width: 99%;"></td>
          </tr>

          </tbody>
        </table>
      </div>
    </div>
    <p class="text-end">
      <button class="btn btn-primary mb-1 ms-1"  @click="regDeviceFota">적용</button>
      <button class="btn btn-primary mb-1 ms-1" @click="delDeviceFota">삭제</button>
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
      uploadFile:'',
      fota: {
        fotaFile:'',
        buildNo:'',
        deviceIMEI:'',
        buildDate:'',
      },
    }
  },

  mounted() {
    this.getDeviceFotaInfo()

  },
  methods: {
    setFile(event) {
      this.uploadFile = event.target.files[0];
    },
    async getDeviceFotaInfo() {

        let res = await api.getDeviceFotaInfo();
        if(res.data.status === "SUCCESS") {
          if(res.data.data !== null)
            this.fota = res.data.data;

        }
    },

    async regDeviceFota() {
      console.log(this.uploadFile)
      if(utils.isEmpty(this.uploadFile)) {
        alert("FOTA 파일은 필수 항목 입니다.");
        return;
      }
      // if(utils.isEmpty(this.fota.deviceIMEI)) {
      //   alert("IMEI는 필수 항목 입니다.");
      //   return;
      // }
      const formData = new FormData();
      formData.append("fotaModel", JSON.stringify(this.fota));
      formData.append("file", this.uploadFile)

      const res = await api.regDeviceFota(formData);
      if(res.data.status === "SUCCESS") {
          alert("적용 되었습니다.")
          this.getDeviceFotaInfo();
      }
    },

    delDeviceFota() {
      if(confirm("삭제 하시겠습니까?")) {
        api.delDeviceFota().then(res => {
          if(res.data.status === "SUCCESS") {
            alert("삭제 되었습니다.")
            this.getDeviceFotaInfo();
          }
        });

      }
    },

  }

}
</script>

<style scoped>

</style>