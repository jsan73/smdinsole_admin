<template>
  <div class="device-popup p-4">
    <div class="popup-header">
      <h5 class="mb-0">
        <i class="bi bi-caret-right-square"></i> {{popupTitle}}
      </h5>
      <span v-if="popupState == 'upd'" class="badge" :class="deviceActiveStateBadgeClass">{{ deviceActiveStateLabel }}</span>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body p-3">
        <table class="table table-sm table-bordered align-middle mb-0 device-form-table popup-form-table">
          <tbody>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col" width="28%">IMEI</th>
            <td><input type="text"  @input="clear" v-model="device.deviceIMEI" id="userName" name="userName" class="form-control d-inline-flex" style="width: 180px;" :readonly="popupState == 'upd' && !isReplaceMode">
              &nbsp;<button v-if="popupState == 'ins'" type="button" class="btn btn-secondary btn-sm" @click="chkIMEI">일련번호 체크</button>
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col" width="28%">시리얼 번호</th>
            <td>
              <div class="serial-input-row">
                <input
                    type="text"
                    v-model="device.serialNumber"
                    @input="clearSerialNumber"
                    class="form-control d-inline-flex"
                    style="width: 180px;"
                    maxlength="14"
                    :readonly="popupState == 'upd' || isReplaceMode"
                ><button v-if="popupState == 'ins'" type="button" class="btn btn-secondary btn-sm" @click="chkSerialNumber">시리얼 번호 체크</button>
              </div>
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col" width="28%">ICCID</th>
            <td>
              <input type="text"  v-model="device.iccId" id="iccID" name="iccID" class="form-control d-inline-flex" style="width: 250px;" >&nbsp;
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col" width="28%">가입요금제</th>
            <td>
              <input type="text" v-model="device.iotPlan" id="iotPlan" name="iotPlan" class="form-control d-inline-flex" style="width: 250px;" maxlength="20" :readonly="isReplaceMode">&nbsp;
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col">기기 전화번호</th>
            <td>
              <select id="protectorPhone1" v-model="dphone1" name="protectorPhone1" class="form-select d-inline-flex" style="width: 100px;" :disabled="isReplaceMode">
                <option value="010">010</option>
                <option value="012">012</option>
                <option value="011">011</option>
                <option value="016">016</option>
                <option value="017">017</option>
                <option value="018">018</option>
                <option value="019">019</option>
              </select>
              -
              <input type="text" v-model="dphone2" id="protectorPhone2" name="protectorPhone2" class="form-control d-inline-flex" style="width: 100px;" maxlength="4" :readonly="isReplaceMode">
              -
              <input type="text" v-model="dphone3" id="protectorPhone3" name="protectorPhone3" class="form-control d-inline-flex" style="width: 100px;" maxlength="4" :readonly="isReplaceMode">
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col" width="28%">사용자 전화번호0</th>
            <td>
              <select id="protectorPhone1" v-model="gphone1" name="protectorPhone1" class="form-select d-inline-flex" style="width: 100px;" :disabled="isReplaceMode">
                <option value="010">010</option>
                <option value="011">011</option>
                <option value="016">016</option>
                <option value="017">017</option>
                <option value="018">018</option>
                <option value="019">019</option>
              </select>
              -
              <input type="text" v-model="gphone2" id="protectorPhone2" name="protectorPhone2" class="form-control d-inline-flex" style="width: 100px;" maxlength="4" :readonly="isReplaceMode">
              -
              <input type="text" v-model="gphone3" id="protectorPhone3" name="protectorPhone3" class="form-control d-inline-flex" style="width: 100px;" maxlength="4" :readonly="isReplaceMode">
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col" width="28%">소속 기관</th>
            <td>
              <select id="protectorPhone1" v-model="device.orgcNo" name="protectorPhone1" class="form-select d-inline-flex" :disabled="isReplaceMode">
                <option :value="0"> - 선택 - </option>
                <option v-for="(orgc, index) in orgcList" :key="index" :value="orgc.ORGC_NO">{{orgc.ORGC_NAME}}</option>

              </select>
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col">개통일</th>
            <td>
              <input type="date" v-model="memberDate" class="form-control date-input" :readonly="isReplaceMode">
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col">만료일</th>
            <td>
              <input type="date" v-model="expDate" class="form-control date-input" :readonly="isReplaceMode">
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col">이심 사용기한</th>
            <td>
              <input type="date" v-model="esimExpDate" class="form-control" style="width: 150px;" :readonly="isReplaceMode">
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col" width="28%">기기 사이즈</th>
            <td>
              <select id="deviceSize"
                      v-model="device.deviceSize"
                      name="deviceSize"
                      class="form-select d-inline-flex"
                      style="width: 120px;"
                      :disabled="isReplaceMode">
                <option v-for="size in sizes"
                        :key="size.value"
                        :value="size.value">
                  {{ size.label }}
                </option>
              </select> mm
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="popup-actions">
      <template v-if="isReplaceMode">
        <div></div>
        <div class="action-right">
          <button class="btn btn-outline-secondary btn-sm" @click="cancelReplaceMode">취소</button>
          <button class="btn btn-primary btn-sm" @click="replaceDevice">등록</button>
        </div>
      </template>
      <template v-else>
        <div class="action-left">
          <button v-if="popupState == 'upd'" class="btn btn-info text-white btn-sm" @click="startReplaceMode" :disabled="!canReplaceDevice">기기 교체(이관)</button>
          <button v-if="popupState == 'upd'" class="btn btn-warning btn-sm" @click="lostDevice" :disabled="deviceActiveStateValue === 'L'">분실</button>
          <button v-if="popupState == 'upd' && deviceActiveStateValue === 'L'" class="btn btn-warning btn-sm" @click="releaseLostDevice" :disabled="!canReleaseLostDevice">분실 해제</button>
          <button v-if="popupState == 'upd'" class="btn btn-dark btn-sm" @click="disposeDevice">폐기</button>
        </div>
        <div class="action-right">
          <button v-if="popupState == 'ins'" class="btn btn-primary btn-sm"  @click="regDevice">등록</button>
          <button v-if="popupState == 'upd'" class="btn btn-outline-danger btn-sm" @click="delDevice">삭제</button>
          <button v-if="popupState == 'upd'" class="btn btn-primary btn-sm" @click="updDevice">수정</button>
        </div>
      </template>
    </div>
    <div v-if="errorPopup.visible" class="error-popup-overlay" @click.self="closeErrorPopup">
      <div class="error-popup card shadow">
        <div class="card-body">
          <h6 class="text-danger fw-bold"><i class="bi bi-exclamation-triangle"></i> 처리 오류</h6>
          <p class="mb-3">{{ errorPopup.message }}</p>
          <div class="text-end">
            <button type="button" class="btn btn-secondary btn-sm" @click="closeErrorPopup">확인</button>
          </div>
        </div>
      </div>
    </div>
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
        serialNumber:'',
        iccId:'',
        iotPlan:'',
        deviceNumber:'',
        guardPhone:'',
        memberDate:'',
        orgcNo:0,
        chkdevice:'',
        deviceCount:1,
        esimExpDate:'',
        deviceSize: 0,
      },
      dphone1:'011',
      dphone2:'',
      dphone3:'',
      gphone1:'010',
      gphone2:'',
      gphone3:'',
      memberDate:'',
      expDate:'',
      deviceIMEI:'',
      popupState:"ins",
      orgGuardPhone:'',
      esimExpDate:'',
      orgcList:'',
      popupTitle: '기기 등록',
      originalDevice: null,
      isReplaceMode: false,
      serialChecked: false,
      errorPopup: { visible: false, message: "" },
      sizes: [
        { value: 0, label: '선택 안함' },
        { value: 230, label: '230' },
        { value: 235, label: '235' },
        { value: 240, label: '240' },
        { value: 245, label: '245' },
        { value: 250, label: '250' },
        { value: 255, label: '255' },
        { value: 260, label: '260' },
        { value: 265, label: '265' },
        { value: 270, label: '270' },
        { value: 275, label: '275' },
      ]
    }
  },
  computed: {
    isSuperAdmin() {
      return this.$store.getters['adminStore/isSuperAdmin'] === true;
    },
    deviceActiveStateValue() {
      return this.getDeviceValue(this.device, ["activeState", "ACTIVE_STATE"]);
    },
    deviceActiveStateLabel() {
      const apiName = this.getDeviceValue(this.device, ["activeStateName", "ACTIVE_STATE_NAME"]);
      if(apiName) return apiName;
      return this.getDeviceActiveStateLabel(this.deviceActiveStateValue);
    },
    deviceActiveStateBadgeClass() {
      const status = this.getDeviceActiveState(this.deviceActiveStateValue);
      return status ? status.className : "bg-secondary";
    },
    linkedGuardCount() {
      const value = this.getDeviceValue(this.device, ["deviceCount", "guardCount", "DEVICE_COUNT", "GUARD_COUNT"]);
      const count = Number(value);
      return Number.isNaN(count) ? 0 : count;
    },
    deviceNoValue() {
      return this.getDeviceValue(this.device, ["deviceNo", "DEVICE_NO"]);
    },
    canDeleteDevice() {
      return this.linkedGuardCount === 0;
    },
    canReplaceDevice() {
      return this.linkedGuardCount > 0 && !['D', 'L'].includes(this.deviceActiveStateValue);
    },
    canLostDevice() {
      return this.deviceActiveStateValue === 'A';
    },
    canReleaseLostDevice() {
      return this.deviceActiveStateValue === 'L';
    },
    canDisposeDevice() {
      return this.linkedGuardCount === 0 && this.deviceActiveStateValue !== 'D';
    },
  },
  watch:{
    memberDate() {
      // console.log(this.selectAddr2)
      // console.log(this.regDate)
      // console.log(utils.getYmd10(utils.addYear(this.regDate, 2)));
      // this.expDate = utils.getYmd10(utils.addYear(this.regDate, 2));
      this.expDate = utils.getYmd10(utils.addDays(utils.addYear(this.memberDate, 2), -1));
    }

  },
  mounted() {
    this.deviceIMEI = this.$route.query.device;
    if(utils.isNotEmpty(this.deviceIMEI )) {
      this.popupState = "upd"
      this.getDeviceInfo(this.deviceIMEI);
      this.popupTitle = '기기 수정'
    }else{
      if(!this.isSuperAdmin) {
        alert("대표 관리자만 수행할 수 있습니다.");
        window.close();
        return;
      }
      // this.geolocate();
    }
    if(this.isSuperAdmin) this.selectOrgcList();
  },
  methods: {
    async getDeviceInfo(deviceIMEI) {
      try {
        let res = await api.getDeviceInfo(deviceIMEI);
        if(res.data.status === "SUCCESS") {
          this.applyDeviceData(res.data.data);
        }
      } catch (e) {
        this.handleScopeError(e);
      }
    },
    applyDeviceData(data) {
      this.device = {
        ...data,
        serialNumber: data.serialNumber || data.SERIAL_NUMBER || '',
        orgcNo: data.orgcNo || data.ORGC_NO || 0,
        deviceSize: data.deviceSize || data.DEVICE_SIZE || 0,
      };
      console.log(this.device)
      this.dphone1 = '011';
      this.dphone2 = '';
      this.dphone3 = '';
      this.gphone1 = '010';
      this.gphone2 = '';
      this.gphone3 = '';
      this.memberDate = '';
      this.expDate = '';
      this.esimExpDate = '';
      this.serialChecked = false;

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
        this.memberDate = utils.dateForm(this.device.memberDate);
        this.expDate = utils.dateForm(this.device.expDate);
      }
      if(utils.isNotEmpty(this.device.esimExpDate)) {
        this.esimExpDate = utils.dateForm(this.device.esimExpDate);
      }
    },
    setDevice() {
      // this.device.deviceNumber = this.dphone1 + this.dphone2 + this.dphone3;
      if(utils.isNotEmpty(this.dphone2) && utils.isNotEmpty(this.dphone3)) {
        this.device.deviceNumber = this.dphone1 + this.dphone2 + this.dphone3;
      }else{
        this.device.deviceNumber = "";
      }


      if(utils.isNotEmpty(this.gphone2) && utils.isNotEmpty(this.gphone3)) {
        this.device.guardPhone = this.gphone1 + this.gphone2 + this.gphone3;
      }else{
        this.device.guardPhone = "";
      }

      this.device.memberDate = String(this.memberDate || "").replace(/-/gi, "");
      this.device.expDate = String(this.expDate || "").replace(/-/gi, "");
      this.device.esimExpDate = String(this.esimExpDate || "").replace(/-/gi, "");
      this.device.serialNumber = String(this.device.serialNumber || "").trim();
    },

    async insDevice() {
      if(!this.isSuperAdmin) {
        alert("대표 관리자만 수행할 수 있습니다.");
        return false;
      }


      try {
        const res = await api.insDevice(this.toDeviceSaveParam());
        if(res.data.status === "SUCCESS") {
            alert("추가 되었습니다.")
            return true;
        }
      } catch (e) {
        this.handleScopeError(e);
      }
      return false;
    },
    updDevice() {
      this.setDevice();
      if(utils.isNotEmpty(this.device.deviceNumber) && !utils.telValidChk(this.device.deviceNumber)) {
        alert("기기 전화번호를 다시 확인해 주세요.")
        return;
      }
      if(utils.isNotEmpty(this.device.guardPhone) && !utils.telValidChk(this.device.guardPhone)) {
        alert("사용자 전화번호를 다시 확인해 주세요.")
        return;
      }
      // if(this.orgGuardPhone != this.device.guardPhone && this.device.deviceCount > 1) {
      //   if(!confirm("사용자 전화번호0 은 다른 기기에서도 사용중입니다.\n수정하시면 다른 기기 전화 번호도 변경 됩니다.")){
      //     return;
      //   }
      // }
      if(confirm("정보를 수정 하시겠습니까?")) {
        api.updDevice(this.toDeviceSaveParam()).then(res => {
          if (res.data.status === "SUCCESS") {
            alert("수정 되었습니다.")
            window.opener.vueComponent.selectDeviceList();
            window.close();
          }
        }).catch(this.handleScopeError);
      }
    },
    delDevice() {
      if(this.deviceActiveStateValue === 'D') {
        alert("폐기 상태 기기는 삭제할 수 없습니다.");
        return;
      }
      if(this.deviceActiveStateValue !== 'N') {
        alert("미등록 상태의 기기만 삭제할 수 있습니다.");
        return;
      }
      if(this.linkedGuardCount > 0) {
        alert("연결된 사용자가 있는 기기는 삭제할 수 없습니다.");
        return;
      }
      if(confirm("오등록 기기를 실제 삭제하시겠습니까? 관련 설정 데이터도 함께 삭제됩니다.")) {
        api.delDevice(this.deviceIMEI).then(res => {
          if(res.data.status === "SUCCESS") {
            alert("삭제 되었습니다.")
            window.opener.vueComponent.selectDeviceList();
            window.close();
          }
        }).catch(this.handleScopeError);

      }
    },
    regDevice() {
      if(!this.isSuperAdmin) {
        alert("대표 관리자만 수행할 수 있습니다.");
        return;
      }
      this.setDevice();
      if(utils.isEmpty(this.device.serialNumber)) {
        alert("시리얼 번호를 입력해 주세요.");
        return;
      }
      if(!this.serialChecked) {
        alert("시리얼 번호 중복 체크를 먼저 진행해 주세요.");
        return;
      }
      if(this.device.chkdevice === "") {
        alert("IMEI 체크를 먼저 진행해 주세요.");
        return;
      }
      if(utils.isNotEmpty(this.device.deviceNumber) && !utils.telValidChk(this.device.deviceNumber)) {
        alert("기기 전화번호를 다시 확인해 주세요.")
        return;
      }
      if(utils.isNotEmpty(this.device.guardPhone) && !utils.telValidChk(this.device.guardPhone)) {
        alert("사용자 전화번호를 다시 확인해 주세요.")
        return;
      }
      if(this.device.chkdevice) {
        this.insDevice().then(success => {
          if(!success) return;
          //opener.location.reload();
          window.opener.vueComponent.selectDeviceList();
          window.close();
        })
      }else{
        this.device.chkdevice = false;
        alert("IMEI 값이 이미 존재합니다.")
      }
    },
    startReplaceMode() {
      if(!this.canReplaceDevice) return;
      this.originalDevice = {
        device: { ...this.device },
        dphone1: this.dphone1,
        dphone2: this.dphone2,
        dphone3: this.dphone3,
        gphone1: this.gphone1,
        gphone2: this.gphone2,
        gphone3: this.gphone3,
        memberDate: this.memberDate,
        expDate: this.expDate,
        esimExpDate: this.esimExpDate,
        popupTitle: this.popupTitle,
      };
      this.isReplaceMode = true;
      this.popupTitle = '기기 교체(이관)';
      this.device.deviceIMEI = '';
      this.device.iccId = '';
      this.device.chkdevice = '';
    },
    cancelReplaceMode() {
      if(!this.originalDevice) return;
      this.device = { ...this.originalDevice.device };
      this.dphone1 = this.originalDevice.dphone1;
      this.dphone2 = this.originalDevice.dphone2;
      this.dphone3 = this.originalDevice.dphone3;
      this.gphone1 = this.originalDevice.gphone1;
      this.gphone2 = this.originalDevice.gphone2;
      this.gphone3 = this.originalDevice.gphone3;
      this.memberDate = this.originalDevice.memberDate;
      this.expDate = this.originalDevice.expDate;
      this.esimExpDate = this.originalDevice.esimExpDate;
      this.popupTitle = this.originalDevice.popupTitle;
      this.originalDevice = null;
      this.isReplaceMode = false;
    },
    replaceDevice() {
      if(!this.originalDevice) return;
      const newDeviceIMEI = this.device.deviceIMEI;
      const newIccId = this.device.iccId;
      if(utils.isEmpty(newDeviceIMEI)) {
        alert("IMEI값을 입력해 주세요");
        return;
      }
      if(utils.isEmpty(newIccId)) {
        alert("ICCID를 입력해 주세요.");
        return;
      }
      if(confirm("기기 교체를 등록하시겠습니까?")) {
        api.replaceDevice({
          deviceNo: this.getDeviceValue(this.originalDevice.device, ["deviceNo", "DEVICE_NO"]),
          newDeviceIMEI,
          newIccId,
          reason: 'A/S 교체',
        }).then(res => {
          if(res.data.status === "SUCCESS") {
            alert("기기 교체가 완료되었습니다.");
            window.opener.vueComponent.selectDeviceList();
            window.close();
          }
        }).catch(this.handleScopeError);
      }
    },
    lostDevice() {
      if(this.deviceActiveStateValue === 'L') {
        alert("이미 분실 상태입니다.");
        return;
      }
      if(this.deviceActiveStateValue === 'D') {
        alert("폐기된 기기는 분실 처리할 수 없습니다.");
        return;
      }
      if(this.deviceActiveStateValue !== 'A') {
        alert("사용중 상태의 기기만 분실 처리할 수 있습니다.");
        return;
      }
      if(confirm("분실 처리하시겠습니까? 연결된 모든 사용자에게 알림이 발송됩니다.")) {
        this.runDeviceAction(api.lostDevice, { deviceNo: this.deviceNoValue }, "분실 처리되었습니다.");
      }
    },
    releaseLostDevice() {
      if(!this.canReleaseLostDevice) return;
      if(confirm("분실 해제하시겠습니까?")) {
        this.runDeviceAction(api.releaseLostDevice, { deviceNo: this.deviceNoValue }, "분실 해제되었습니다.");
      }
    },
    disposeDevice() {
      if(this.linkedGuardCount > 0) {
        alert("사용자가 연결된 기기는 폐기할 수 없습니다. 먼저 사용자 연결을 해제해 주세요.");
        return;
      }
      if(this.deviceActiveStateValue === 'D') {
        alert("이미 폐기된 기기입니다.");
        return;
      }
      if(!confirm("폐기 처리하시겠습니까? 폐기된 기기는 재사용할 수 없습니다.")) return;
      const reason = window.prompt("폐기 사유를 입력하세요.", "관리자 폐기");
      if(reason === null) return;
      this.runDeviceAction(api.disposeDevice, { deviceNo: this.deviceNoValue, reason }, "폐기 처리되었습니다.");
    },
    runDeviceAction(action, param, successMessage) {
      action(param).then(async res => {
        if(res.data.status === "SUCCESS") {
          alert(successMessage);
          await this.getDeviceInfo(this.device.deviceIMEI || this.deviceIMEI);
          window.opener.vueComponent.selectDeviceList();
        }
      }).catch(this.handleScopeError);
    },
    clearSerialNumber() {
      this.serialChecked = false;
    },
    getDeviceRows(data) {
      if(Array.isArray(data)) return data;
      if(!data || typeof data !== "object") return [];
      const rowKeys = ["list", "rows", "items", "content", "deviceList"];
      const rows = rowKeys.map(key => data[key]).find(Array.isArray);
      return rows || [];
    },
    async chkSerialNumber() {
      if(!this.isSuperAdmin) {
        alert("대표 관리자만 수행할 수 있습니다.");
        return;
      }
      const serialNumber = String(this.device.serialNumber || "").trim();
      this.device.serialNumber = serialNumber;
      if(utils.isEmpty(serialNumber)) {
        alert("시리얼 번호를 입력해 주세요.");
        return;
      }
      try {
        const res = await api.checkDeviceSerialNumber({ serialNumber });
        if(res.data.status === "SUCCESS") {
          const data = res.data.data;
          const available = data && typeof data.available === "boolean"
              ? data.available
              : this.getDeviceRows(data).length === 0 && Number(data && data.totalCount ? data.totalCount : 0) === 0;
          this.serialChecked = available;
          alert(available ? "사용 가능한 시리얼 번호입니다." : "이미 등록된 시리얼 번호입니다.");
        }
      } catch (e) {
        this.serialChecked = false;
        this.handleScopeError(e);
      }
    },
    chkIMEI() {
      if(!this.isSuperAdmin) {
        alert("대표 관리자만 수행할 수 있습니다.");
        return;
      }
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
      }).catch(this.handleScopeError)
    },
    clear() {
      this.device.chkdevice = "";
    },
    getDeviceActiveState(value) {
      const statusMap = {
        N: { label: "미등록", className: "bg-success" },
        R: { label: "대기", className: "bg-info text-dark" },
        P: { label: "등록중", className: "bg-warning text-dark" },
        A: { label: "사용중", className: "bg-primary" },
        L: { label: "분실", className: "bg-danger" },
        E: { label: "만료", className: "bg-secondary" },
        D: { label: "폐기", className: "bg-dark" },
        V: { label: "등록중(구 인증완료)", className: "bg-warning text-dark" },
      };
      return statusMap[value] || null;
    },
    getDeviceActiveStateLabel(value) {
      const status = this.getDeviceActiveState(value);
      return status ? status.label : (value || "");
    },
    getDeviceValue(row, keys) {
      if(!row || typeof row !== "object") return "";
      const key = keys.find(item => row[item] !== undefined && row[item] !== null);
      return key ? row[key] : "";
    },
    toDeviceSaveParam() {
      const param = { ...this.device };
      param.orgcNo = param.orgcNo === "" || param.orgcNo === null || param.orgcNo === undefined ? 0 : param.orgcNo;
      param.deviceSize = param.deviceSize === "" || param.deviceSize === null || param.deviceSize === undefined ? 0 : param.deviceSize;
      param.serialNumber = this.getDeviceValue(param, ["serialNumber", "SERIAL_NUMBER"]);
      if(this.popupState == "upd") {
        delete param.serialNumber;
      }
      [
        "activeState",
        "activeStateName",
        "ACTIVE_STATE",
        "ACTIVE_STATE_NAME",
        "active_state",
        "active_state_name",
        "SERIAL_NUMBER",
        "serialChecked",
      ].forEach(key => {
        delete param[key];
      });
      return param;
    },
    async selectOrgcList() {
      const param = {};
      try {
        const res = await api.selOrgcList(param);
        if(res.data.status === "SUCCESS") {
          this.orgcList = res.data.data;

          for(let i = 0; i < this.orgcList.length; i++ ){
            this.orgcList[i].ORGC_NAME = this.orgcList[i].ORGC_NAME.split(",")[1];
          }
        }
      } catch (e) {
        this.handleScopeError(e);
      }

    },
    showApiError(error, fallback) {
      const data = error?.response?.data;
      this.showError(data?.message || data?.data?.message || error?.message || fallback);
    },
    showError(message) {
      this.errorPopup = { visible: true, message };
    },
    closeErrorPopup() {
      this.errorPopup = { visible: false, message: "" };
    },
    handleScopeError(e) {
      const status = e?.response?.status;
      if(status === 403 || status === 401) {
        alert("관리 권한 범위 밖의 요청입니다.");
        return;
      }
      alert(e?.response?.data?.message || "처리 중 오류가 발생했습니다.");
    },
  }

}
</script>

<style scoped>
.device-popup {
  min-height: 100%;
  background: #f6f8fb;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid #dfe5ee;
}

.popup-header h5 {
  color: #263238;
  font-weight: 700;
}

.device-form-table th {
  width: 28%;
  color: #334155;
  font-weight: 700;
}

.device-form-table td {
  background: #fff;
}

.device-form-table .form-control,
.device-form-table .form-select {
  min-height: 32px;
}

.date-input {
  width: 150px;
}

.popup-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
}

.action-left,
.action-right {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.action-right {
  justify-content: flex-end;
  margin-left: auto;
}
.error-popup-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, .45);
}

.error-popup {
  width: 420px;
  max-width: calc(100vw - 40px);
}

.serial-input-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

@media (max-width: 560px) {
  .popup-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .action-left,
  .action-right {
    justify-content: flex-start;
    margin-left: 0;
  }
}
</style>
