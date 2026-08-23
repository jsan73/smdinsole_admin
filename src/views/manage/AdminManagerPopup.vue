<template>
  <div class="container-fluid p-3 position-relative">
    <h5 class="pb-2 fw-bold">
      <i class="bi bi-caret-right-square"></i> 관리자 {{ isUpdateMode ? '수정' : '추가' }}
    </h5>

    <div class="card mb-3">
      <div class="card-body p-0">
        <table class="table table-sm table-bordered mb-0 align-middle popup-form-table">
          <colgroup><col style="width: 30%"><col style="width: 70%"></colgroup>
          <tbody>
          <tr>
            <th class="text-center bg-light small py-2">권한</th>
            <td>
              <select v-model="manager.mgrType" class="form-select form-select-sm" :disabled="!canEditRoleScope">
                <option value="ROLE_ADMIN">관리자</option>
                <option value="ROLE_SADMIN">최고 관리자</option>
              </select>
            </td>
          </tr>
          <tr>
            <th class="text-center bg-light small py-2">소속 국가</th>
            <td>
              <select v-model="manager.nation" class="form-select form-select-sm" :disabled="!canEditRoleScope">
                <option value="KR">KR</option>
                <option value="US">US</option>
              </select>
            </td>
          </tr>
          <tr>
            <th class="text-center bg-light small py-2">이름</th>
            <td><input type="text" v-model="manager.mgrName" class="form-control form-control-sm w-50"></td>
          </tr>
          <tr>
            <th class="text-center bg-light small py-2">이메일(ID)</th>
            <td>
              <input
                  type="text"
                  v-model="manager.mgrId"
                  class="form-control form-control-sm"
                  maxlength="50"
              >
            </td>
          </tr>

          <tr>
            <th class="text-center bg-light small py-2">연락처</th>
            <td>
              <input
                  type="text"
                  v-model="manager.mgrPhone"

                  class="form-control form-control-sm"
                  maxlength="13"
              >
            </td>
          </tr>
          <tr>
            <th class="text-center bg-light small py-2">관리 도(시) 영역 설정</th>
            <td class="small ps-2">
              <div class="d-flex flex-wrap align-items-center gap-2">
                <select
                    v-model="selectedManageState"
                    class="form-select form-select-sm manage-select"
                    :disabled="isAddrLoading || !canEditRoleScope"
                    @change="onManageStateChange"
                >
                  <option :value="manageCountryCode">{{ manageCountryCode }} 전체</option>
                  <option v-for="state in manageStateOptions" :key="state.addrCode" :value="state.addrCode">
                    {{ state.addrName }}
                  </option>
                </select>
                <select
                    v-model="selectedManageSub"
                    class="form-select form-select-sm manage-select"
                    :disabled="isAddrLoading || !canEditRoleScope || !selectedManageState || selectedManageState === manageCountryCode || manageSubOptions.length === 0"
                    @change="onManageSubChange"
                >
                  <option value="">{{ manageCountryCode === 'US' ? 'County 전체' : '시/군/구 전체' }}</option>
                  <option v-for="sub in manageSubOptions" :key="sub.addrCode" :value="sub.addrCode">
                    {{ sub.addrName }}
                  </option>
                </select>
                <span class="text-muted">{{ selectedManageName }}</span>
              </div>
            </td>
          </tr>

          </tbody>
        </table>
      </div>
    </div>

    <div class="text-center mt-3">
      <template v-if="isUpdateMode">
        <button class="btn btn-outline-secondary btn-sm px-4 mx-1" @click="updateManager">수정</button>
        <button v-if="isSuperAdmin" class="btn btn-outline-secondary btn-sm px-4 mx-1" @click="deleteManager">삭제</button>
      </template>
      <template v-else>
        <button v-if="isSuperAdmin" class="btn btn-primary btn-sm px-4 mx-1" @click="registerManager">등록</button>
        <button class="btn btn-outline-secondary btn-sm px-4 mx-1" @click="closePopup">취소</button>
      </template>
    </div>

  </div>
</template>

<script>
import api from '@/api/api';
import utils from "@/utils/utils";

export default {
  name: "AdminManagerPopup",
  data() {
    return {
      manager : {
        mgrNo: '',
        mgrType: 'ROLE_ADMIN',
        nation: 'KR',
        mgrName: '',
        mgrPhone: '',
        mgrId: '',
        manageCity: '',
        islocked: 'N'
      },
      isUpdateMode: false,
      isRegistered: false,
      mgrNo: null,
      utils: utils,
      guard: { guardPhone: '', guardName: '', email: '', lastLoginDate: null, accountState: 'N', maketingAgreeYn: 'Y' },
      deviceList: [],
      addrTree: [],
      selectedManageState: '',
      selectedManageSub: '',
      isAddrLoading: false,
      isApplyingManager: false,

      originalMgrId: '',
      originalManager: {},
      isEmailValid: true,
    }
  },
  computed: {
    isSuperAdmin() {
      return this.$store.getters['adminStore/isSuperAdmin'] === true;
    },
    loginId() {
      return this.$store.getters['adminStore/getLoginId'] || "";
    },
    canEditRoleScope() {
      return this.isSuperAdmin;
    },
    manageCountryCode() {
      const nation = String(this.manager.nation || "").toUpperCase();
      return nation.indexOf("US") === 0 ? "US" : "KR";
    },
    manageStateOptions() {
      const rows = this.unwrapCountryRoots(this.addrTree);
      return rows.filter(row => this.normalLevel(row.addrLevel) === "STATE");
    },
    selectedManageStateNode() {
      return this.manageStateOptions.find(state => state.addrCode === this.selectedManageState) || null;
    },
    manageSubOptions() {
      if(!this.selectedManageStateNode) return [];
      const children = Array.isArray(this.selectedManageStateNode.children) ? this.selectedManageStateNode.children : [];
      if(this.manageCountryCode === "US") return children.filter(child => this.normalLevel(child.addrLevel) === "COUNTY");
      return children;
    },
    selectedManageName() {
      if(!this.manager.manageCity || this.manager.manageCity === this.manageCountryCode) return this.manageCountryCode + " 전체";
      const sub = this.manageSubOptions.find(item => item.addrCode === this.selectedManageSub);
      if(sub) return sub.addrName;
      const state = this.selectedManageStateNode;
      return state ? state.addrName : this.manager.manageCity;
    },
  },
  watch: {
    "manager.nation"(newValue, oldValue) {
      if(newValue === oldValue) return;
      if(this.isApplyingManager) return;
      if(String(newValue).toUpperCase().indexOf("US") === 0) this.manager.nation = "US";
      this.manager.manageCity = "";
      this.selectedManageState = "";
      this.selectedManageSub = "";
      this.loadManageAddrTree();
    },
  },
  mounted() {
    const queryNo = this.$route.query.mgrNo;
    if (queryNo) {
      this.mgrNo = queryNo;
      this.isUpdateMode = true;
      this.fetchData();
    } else {
      if(!this.isSuperAdmin) {
        alert("대표 관리자만 수행할 수 있습니다.");
        this.closePopup();
        return;
      }
      this.loadManageAddrTree();
    }
  },
  methods: {

    async checkDuplicate(param) {
      const checkRes = await api.checkManagerId(param.mgrId);
      if (checkRes.data.data >= 1) {
        alert("중복된 이메일(ID)입니다.");
        return true;
      }
      return false;
    },

    async checkEmail() {
      const email = this.manager.mgrId;
      if (!email || email.trim() === '') {
        alert("ID(이메일)을 입력해 주세요.");
        return false;
      }
      if (!utils.validateEmail(email)) {
        alert("올바른 이메일 형식이 아닙니다.");
        this.isEmailValid = false;
        return false;
      }
      this.isEmailValid = true;
      return true;
    },

    async fetchData() {
      try {
        const manager = await api.getManagerByAdmin(this.mgrNo);
        if (manager.data.status === "SUCCESS") {
          const data = manager.data.data;
          this.isApplyingManager = true;
          this.manager = {
            ...this.manager,
            mgrNo: data.mgrNo ?? data.MGR_NO ?? '',
            mgrType: data.mgrType ?? data.MGR_TYPE ?? 'ROLE_ADMIN',
            nation: this.normalizeNation(data.nation ?? data.NATION ?? 'KR'),
            mgrName: data.mgrName ?? data.MGR_NAME ?? '',
            mgrPhone: data.mgrPhone ?? data.MGR_PHONE ?? '',
            mgrId: data.mgrId ?? data.MGR_ID ?? '',
            manageCity: data.manageCity ?? data.MANAGE_CITY ?? '',
            islocked: data.islocked ?? data.isLocked ?? data.IS_LOCKED ?? 'N',
          };
          this.originalManager = { ...this.manager };
          if(!this.isSuperAdmin && this.manager.mgrId !== this.loginId) {
            alert("관리 권한 범위 밖의 요청입니다.");
            this.closePopup();
            return;
          }
          try {
            await this.loadManageAddrTree();
            this.applyManageCitySelection();
          } finally {
            this.isApplyingManager = false;
          }
          this.originalMgrId = this.manager.mgrId;
        }

      } catch (e) { console.error(e); }
    },

    async registerManager() {
      if(!this.isSuperAdmin) {
        alert("대표 관리자만 수행할 수 있습니다.");
        return;
      }
      const param = { ...this.manager};
      if(!this.validateManageCity()) return;
      if (await this.checkDuplicate(param)) return;
      if (!await this.checkEmail()) return;
      try {
        const res = await api.registerManagerByAdmin(param);
        if (res.data.status === "SUCCESS") {
          alert("등록되었습니다.");
          window.opener.vueComponent.selectManagerList();
          this.isRegistered = true;
          this.closePopup();
        } else {
          alert("등록에 실패했습니다.");
        }
      } catch (e) {
        alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      }
    },

    async updateManager() {
      // 1. 이메일 형식 유효성 검사부터 수행
      if (!await this.checkEmail()) return;

      const param = { ...this.manager };
      if(!this.isSuperAdmin) {
        param.mgrType = this.originalManager.mgrType;
        param.nation = this.originalManager.nation;
        param.manageCity = this.originalManager.manageCity;
      } else if(!this.validateManageCity()) return;

      if (this.manager.mgrId !== this.originalMgrId) {
        if (await this.checkDuplicate(param)) return;
      }

      try {
        const res = await api.updMangerByAdmin(param);
        if (res.data.status === "SUCCESS") {
          if(res.data.data == 1) {
            alert("수정 되었습니다.");
            // 부모 창 리스트 갱신
            if (window.opener && window.opener.vueComponent) {
              window.opener.vueComponent.selectManagerList();
            }
            this.originalMgrId = this.manager.mgrId;
            this.closePopup();
          }else{
            alert("수정 실패");
          }

        }
      } catch (e) {
        alert("수정 중 오류가 발생했습니다.");
      }
    },

    async deleteManager() {
      if(!this.isSuperAdmin) {
        alert("대표 관리자만 수행할 수 있습니다.");
        return;
      }
      if (confirm("삭제하시겠습니까?")) {
        const res = await api.delManagerByAdmin(this.mgrNo);
        if (res.data.status === "SUCCESS") {
          alert("삭제 되었습니다.");
          window.opener.vueComponent.selectManagerList();
          this.closePopup();
        } else {
          alert("삭제에 실패했습니다.");
        }
      }
    },

    async loadManageAddrTree() {
      this.isAddrLoading = true;
      try {
        const countryCode = this.manageCountryCode;
        const res = await api.selAddrTree({ countryCode });
        if(res.data.status === "SUCCESS") {
          this.addrTree = this.toTreeRows(res.data.data, countryCode);
          this.applyManageCitySelection();
          return;
        }
      } catch (e) {
        if(this.manageCountryCode !== "KR") console.error(e);
      } finally {
        this.isAddrLoading = false;
      }

      if(this.manageCountryCode === "KR") {
        const res = await api.selAddrList();
        if(res.data.status === "SUCCESS") {
          this.addrTree = this.toLegacyKrTree(res.data.data);
          this.applyManageCitySelection();
        }
      }
    },
    normalizeNation(nation) {
      return String(nation || "").toUpperCase().indexOf("US") === 0 ? "US" : "KR";
    },
    onManageStateChange() {
      this.selectedManageSub = "";
      if(this.selectedManageState === this.manageCountryCode) {
        this.manager.manageCity = this.manageCountryCode;
        return;
      }
      this.manager.manageCity = this.selectedManageState;
    },
    onManageSubChange() {
      this.manager.manageCity = this.selectedManageSub || this.selectedManageState;
    },
    applyManageCitySelection() {
      const manageCity = this.manager.manageCity || "";
      this.selectedManageState = "";
      this.selectedManageSub = "";
      if(!manageCity) return;
      if(manageCity === this.manageCountryCode) {
        this.selectedManageState = this.manageCountryCode;
        return;
      }

      const state = this.manageStateOptions.find(item => item.addrCode === manageCity);
      if(state) {
        this.selectedManageState = state.addrCode;
        return;
      }

      const parent = this.findParentNode(manageCity, this.manageCountryCode === "US" ? "STATE" : "STATE");
      if(parent) {
        this.selectedManageState = parent.addrCode;
        this.selectedManageSub = manageCity;
      }
    },
    toTreeRows(data, countryCode) {
      const rows = this.toArray(data);
      return rows.map(row => this.normalizeNode(row, countryCode, ""));
    },
    toLegacyKrTree(data) {
      const states = this.toArray(data).map(state => {
        const stateCode = this.getValue(state, ["addrCode", "ADDR_CODE", "paddrCode", "PADDR_CODE"]);
        return {
          addrCode: stateCode,
          addrName: this.getValue(state, ["addrName", "ADDR_NAME", "addr1", "ADDR1"]),
          addrLevel: "STATE",
          countryCode: "KR",
          stateCode: "",
          children: this.toArray(state.addrList || state.children).map(city => ({
            addrCode: this.getValue(city, ["addrCode", "ADDR_CODE"]),
            addrName: this.getValue(city, ["addrName", "ADDR_NAME", "addr2", "ADDR2"]),
            addrLevel: "CITY",
            countryCode: "KR",
            stateCode: "",
            children: [],
          })),
        };
      });
      return [{
        addrCode: "KR",
        addrName: "대한민국",
        addrLevel: "COUNTRY",
        countryCode: "KR",
        stateCode: "",
        children: states,
      }];
    },
    normalizeNode(row, countryCode, parentLevel) {
      const level = this.getValue(row, ["addrLevel", "ADDR_LEVEL"]) || this.inferLevel(parentLevel);
      const nodeCountry = this.getValue(row, ["countryCode", "COUNTRY_CODE"]) || countryCode;
      return {
        addrCode: this.getValue(row, ["addrCode", "ADDR_CODE", "paddrCode", "PADDR_CODE"]),
        addrName: this.getValue(row, ["addrName", "ADDR_NAME", "addr1", "ADDR1", "addr2", "ADDR2"]),
        addrLevel: level,
        countryCode: nodeCountry,
        stateCode: this.getValue(row, ["stateCode", "STATE_CODE"]),
        children: this.toArray(row.children || row.addrList).map(child => this.normalizeNode(child, nodeCountry, level)),
      };
    },
    inferLevel(parentLevel) {
      const level = this.normalLevel(parentLevel);
      if(level === "COUNTRY") return "STATE";
      if(level === "STATE") return this.manageCountryCode === "US" ? "COUNTY" : "CITY";
      if(level === "COUNTY") return "CITY";
      return "COUNTRY";
    },
    unwrapCountryRoots(rows) {
      if(rows.length === 1 && this.normalLevel(rows[0].addrLevel) === "COUNTRY") return rows[0].children || [];
      return rows;
    },
    normalLevel(level) {
      return String(level || "").toUpperCase();
    },
    findParentNode(addrCode, parentLevel) {
      let found = null;
      const walk = (nodes, parent) => {
        nodes.forEach(node => {
          if(found) return;
          if(node.addrCode === addrCode && parent && this.normalLevel(parent.addrLevel) === parentLevel) {
            found = parent;
            return;
          }
          walk(node.children || [], node);
        });
      };
      walk(this.addrTree, null);
      return found;
    },
    toArray(data) {
      if(Array.isArray(data)) return data;
      if(!data || typeof data !== "object") return [];
      const rowKeys = ["list", "rows", "items", "content", "addrList", "children"];
      const rows = rowKeys.map(key => data[key]).find(Array.isArray);
      return rows || [];
    },
    getValue(row, keys) {
      if(!row || typeof row !== "object") return "";
      const key = keys.find(item => row[item] !== undefined && row[item] !== null);
      return key ? row[key] : "";
    },
    validateManageCity() {
      if(this.manager.mgrType === "ROLE_ADMIN" && utils.isEmpty(this.manager.manageCity)) {
        alert("일반관리자는 관리 도(시) 영역을 선택해 주세요.");
        return false;
      }
      return true;
    },


    closePopup() { window.close(); },
  }
}
</script>

<style scoped>
.translate-middle { transform: translate(-50%, -50%) !important; }
.manage-select { width: 180px; }
</style>
