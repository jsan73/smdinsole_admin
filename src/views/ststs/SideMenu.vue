<template>
  <aside id="sidebar" class="sidebar">
    <ul class="sidebar-nav" id="sidebar-nav">
      <li class="nav-item">
        <a class="nav-link" data-bs-target="#local-nav" data-bs-toggle="collapse" href="#" @click.prevent="selectMenuRoot">
          <i class="bi bi-menu-button-wide"></i><span>지역별 (전체 {{ totalCount }}대)</span><i class="bi bi-chevron-down ms-auto"></i>
        </a>

        <ul id="local-nav" class="sidebar-nav collapse ps-3 show" data-bs-parent="#sidebar-nav">
          <li v-if="isUsCountry && showStateSelect" class="nav-item px-2 pb-2">
            <label for="stateSelect" class="form-label small mb-1">State 선택</label>
            <select id="stateSelect" v-model="selectedStateAddrCode" class="form-select form-select-sm" @change="onStateChange">
              <option v-for="state in stateOptions" :key="state.addrCode" :value="state.addrCode">
                {{ state.addrName }}
              </option>
            </select>
          </li>

          <template v-if="isUsCountry">
            <li v-if="usRootNode" class="nav-item">
              <a
                  href="#"
                  class="nav-link"
                  :class="{ active: isRootSelected }"
                  @click.prevent="selectNode(usRootNode)"
              >
                <i class="bi bi-circle"></i><span>{{ usRootNode.addrName }} 전체</span>
              </a>
            </li>
            <addr-tree-node
                v-for="node in usTreeNodes"
                :key="node.addrCode"
                :node="node"
                :selected="selectedArea"
                :level="1"
                @select="selectNode"
            />
          </template>

          <template v-else>
            <addr-tree-node
                v-for="node in krTreeNodes"
                :key="node.addrCode"
                :node="node"
                :selected="selectedArea"
                :level="1"
                @select="selectNode"
            />
          </template>
        </ul>
      </li>
    </ul>
  </aside>
</template>

<script>
import api from '@/api/api';
import AddrTreeNode from "@/views/ststs/AddrTreeNode";

export default {
  name: "SideMenu",
  components: {
    AddrTreeNode,
  },
  props: {
    totalCount: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      addrTree: [],
      countryCode: "KR",
      manageCity: "",
      selectedStateAddrCode: "",
      selectedArea: {
        countryCode: "KR",
        stateAddrCode: "",
        countyAddrCode: "",
        cityAddrCode: "",
        stateName: "",
        countyName: "",
        cityName: "",
        displayName: "",
        addr1: "",
        addr2: "",
      },
      orgcList: "",
    }
  },
  computed: {
    isUsCountry() {
      return this.countryCode === "US";
    },
    normalTree() {
      return Array.isArray(this.addrTree) ? this.addrTree : [];
    },
    stateOptions() {
      const roots = this.unwrapCountryRoots(this.normalTree);
      return roots.filter(node => this.normalLevel(node.addrLevel) === "STATE");
    },
    showStateSelect() {
      return this.isUsCountry && !this.manageCity && this.stateOptions.length > 0;
    },
    selectedStateNode() {
      if(!this.selectedStateAddrCode) return this.stateOptions[0] || null;
      return this.stateOptions.find(state => state.addrCode === this.selectedStateAddrCode) || null;
    },
    usRootNode() {
      if(!this.isUsCountry) return null;
      const roots = this.unwrapCountryRoots(this.normalTree);
      if(this.selectedStateNode) return this.selectedStateNode;
      if(roots.length === 1) return roots[0];
      return null;
    },
    usTreeNodes() {
      if(!this.isUsCountry) return [];
      if(this.selectedStateNode) return this.selectedStateNode.children || [];
      const roots = this.unwrapCountryRoots(this.normalTree);
      if(roots.length === 1) return roots[0].children || [];
      return roots;
    },
    krTreeNodes() {
      return this.normalTree;
    },
    isRootSelected() {
      if(!this.usRootNode) return false;
      const level = this.normalLevel(this.usRootNode.addrLevel);
      if(level === "STATE") return this.selectedArea.stateAddrCode === this.usRootNode.addrCode && !this.selectedArea.countyAddrCode && !this.selectedArea.cityAddrCode;
      if(level === "COUNTY") return this.selectedArea.countyAddrCode === this.usRootNode.addrCode && !this.selectedArea.cityAddrCode;
      return false;
    },
  },
  methods: {
    async selAddrList() {
      const loginContext = this.getLoginContext();
      const countryCode = loginContext.countryCode;
      this.countryCode = countryCode;
      this.manageCity = loginContext.manageCity;
      this.selectedArea.countryCode = countryCode;

      try {
        const param = { countryCode };
        if(loginContext.manageCity) param.rootAddrCode = loginContext.manageCity;
        const res = await api.selAddrTree(param);
        if(res.data.status === "SUCCESS") {
          this.addrTree = this.toTreeRows(res.data.data, countryCode);
          this.initDefaultSelection();
          return;
        }
      } catch (e) {
        if(countryCode !== "KR") console.error(e);
      }

      if(countryCode === "KR") {
        const res = await api.selAddrList();
        if(res.data.status === "SUCCESS") {
          this.addrTree = this.toLegacyKrTree(res.data.data);
          this.initDefaultSelection();
        }
      }
    },
    getLoginContext() {
      const token = window.app?.$store?.getters?.['adminStore/getToken'] || "";
      const payload = this.decodeToken(token);
      const countryValues = ["countryCode", "COUNTRY_CODE", "nation", "NATION"].map(key => payload[key]).filter(value => value !== undefined && value !== null);
      const manageCity = this.getClaimValue(payload, ["manageCity", "MANAGE_CITY", "rootAddrCode", "ROOT_ADDR_CODE"]);
      return {
        countryCode: countryValues.some(value => String(value).toUpperCase().indexOf("US") === 0) ? "US" : "KR",
        manageCity: manageCity || "",
      };
    },
    decodeToken(token) {
      if(!token || token.split(".").length < 2) return {};
      try {
        const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(decodeURIComponent(escape(window.atob(base64))));
      } catch (e) {
        return {};
      }
    },
    getClaimValue(payload, keys) {
      const key = keys.find(item => payload[item] !== undefined && payload[item] !== null);
      return key ? payload[key] : "";
    },
    unwrapCountryRoots(rows) {
      if(rows.length === 1 && this.normalLevel(rows[0].addrLevel) === "COUNTRY") return rows[0].children || [];
      return rows;
    },
    normalLevel(level) {
      return String(level || "").toUpperCase();
    },
    toTreeRows(data, countryCode) {
      const rows = this.toArray(data);
      return this.sortByAddrCode(rows.map(row => this.normalizeNode(row, countryCode, "")));
    },
    toLegacyKrTree(data) {
      const states = this.buildLegacyKrNodes(this.collectLegacyKrRows(data));
      return [{
        addrCode: "KR",
        addrName: "대한민국",
        addrLevel: "COUNTRY",
        countryCode: "KR",
        stateCode: "",
        children: states,
      }];
    },
    collectLegacyKrRows(data, parentAddrCode = "", rows = []) {
      if(Array.isArray(data)) {
        data.forEach(item => this.collectLegacyKrRows(item, parentAddrCode, rows));
        return rows;
      }
      if(!data || typeof data !== "object") return rows;

      const childKeys = ["resultMap", "list", "rows", "items", "content", "addrList", "children"];
      const childValues = childKeys.map(key => data[key]).filter(value => value && typeof value === "object");
      const directAddrCode = this.getValue(data, ["addrCode", "ADDR_CODE"]);
      const nestedStateCode = childValues.length > 0 ? this.getValue(data, ["paddrCode", "PADDR_CODE"]) : "";
      const addrCode = directAddrCode || nestedStateCode;
      const explicitParentCode = directAddrCode ? this.getValue(data, ["paddrCode", "PADDR_CODE"]) : "";
      const addrName = this.getValue(data, ["addrName", "ADDR_NAME", "addr1", "ADDR1", "addr2", "ADDR2"]);

      if(addrCode || addrName) {
        rows.push({
          addrCode,
          parentAddrCode: explicitParentCode || parentAddrCode,
          addrName,
        });
      }

      const nextParentAddrCode = addrCode || parentAddrCode;
      if(childValues.length > 0) {
        childValues.forEach(value => this.collectLegacyKrRows(value, nextParentAddrCode, rows));
        return rows;
      }

      Object.keys(data).forEach(key => {
        const value = data[key];
        if(value && typeof value === "object") this.collectLegacyKrRows(value, nextParentAddrCode, rows);
      });
      return rows;
    },
    buildLegacyKrNodes(rows) {
      const nodeMap = {};
      const parentMap = {};

      rows.forEach(item => {
        const addrCode = item.addrCode;
        if(!addrCode || addrCode === "KR") return;
        if(!nodeMap[addrCode]) {
          nodeMap[addrCode] = {
            addrCode,
            addrName: item.addrName,
            addrLevel: "STATE",
            countryCode: "KR",
            stateCode: "",
            children: [],
          };
        } else if(!nodeMap[addrCode].addrName && item.addrName) {
          nodeMap[addrCode].addrName = item.addrName;
        }

        if(item.parentAddrCode && item.parentAddrCode !== addrCode && !parentMap[addrCode]) {
          parentMap[addrCode] = item.parentAddrCode;
        }
      });

      const states = [];
      Object.keys(nodeMap).forEach(addrCode => {
        const node = nodeMap[addrCode];
        const parentCode = parentMap[addrCode];
        if(parentCode && parentCode !== "KR" && nodeMap[parentCode]) {
          nodeMap[parentCode].children.push(node);
        } else {
          states.push(node);
        }
      });

      const applyLevel = (nodes, level) => {
        this.sortByAddrCode(nodes).forEach(node => {
          node.addrLevel = level;
          applyLevel(node.children, "CITY");
        });
      };
      applyLevel(states, "STATE");
      return this.sortByAddrCode(states);
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
        children: this.sortByAddrCode(this.toArray(row.children || row.addrList).map(child => this.normalizeNode(child, nodeCountry, level))),
      };
    },
    inferLevel(parentLevel) {
      const level = this.normalLevel(parentLevel);
      if(level === "COUNTRY") return "STATE";
      if(level === "STATE") return this.isUsCountry ? "COUNTY" : "CITY";
      if(level === "COUNTY") return "CITY";
      return "COUNTRY";
    },
    toArray(data) {
      if(Array.isArray(data)) return data;
      if(!data || typeof data !== "object") return [];
      const rowKeys = ["resultMap", "list", "rows", "items", "content", "addrList", "children"];
      const rows = rowKeys.map(key => data[key]).find(Array.isArray);
      return rows || [];
    },
    getValue(row, keys) {
      if(!row || typeof row !== "object") return "";
      const key = keys.find(item => row[item] !== undefined && row[item] !== null);
      return key ? row[key] : "";
    },
    sortByAddrCode(rows) {
      return rows.sort((left, right) => String(left.addrCode || "").localeCompare(String(right.addrCode || ""), undefined, {
        numeric: true,
        sensitivity: "base",
      }));
    },
    initDefaultSelection() {
      if(this.isUsCountry) {
        if(this.stateOptions.length > 0) {
          this.selectedStateAddrCode = this.stateOptions[0].addrCode;
          this.selectNode(this.stateOptions[0]);
        } else if(this.usRootNode) {
          this.selectNode(this.usRootNode);
        } else {
          this.emitSelection();
        }
        return;
      }
      this.selectAll();
    },
    onStateChange() {
      if(this.selectedStateNode) this.selectNode(this.selectedStateNode);
    },
    selectMenuRoot() {
      if(this.isUsCountry && this.usRootNode) {
        this.selectNode(this.usRootNode);
        return;
      }
      this.selectAll();
    },
    selectAll() {
      this.selectedArea = {
        countryCode: this.countryCode,
        stateAddrCode: "",
        countyAddrCode: "",
        cityAddrCode: "",
        stateName: "",
        countyName: "",
        cityName: "",
        displayName: "",
        addr1: "",
        addr2: "",
      };
      this.emitSelection();
    },
    selectNode(node) {
      const level = this.normalLevel(node.addrLevel);
      const selection = {
        countryCode: node.countryCode || this.countryCode,
        stateAddrCode: "",
        countyAddrCode: "",
        cityAddrCode: "",
        stateName: "",
        countyName: "",
        cityName: "",
        displayName: "",
        addr1: "",
        addr2: "",
      };

      if(level === "COUNTRY") {
        selection.displayName = node.addrName;
      } else if(level === "STATE") {
        selection.stateAddrCode = node.addrCode;
        selection.stateName = node.addrName;
        selection.displayName = node.addrName;
        selection.addr1 = node.addrCode;
      } else if(level === "COUNTY") {
        const state = this.findParentNode(node.addrCode, "STATE");
        selection.stateAddrCode = state?.addrCode || this.selectedStateAddrCode || "";
        selection.stateName = state?.addrName || "";
        selection.countyAddrCode = node.addrCode;
        selection.countyName = node.addrName;
        selection.displayName = [selection.stateName, node.addrName].filter(Boolean).join(" ");
        selection.addr1 = selection.stateAddrCode;
        selection.addr2 = node.addrCode;
      } else {
        const county = this.findParentNode(node.addrCode, "COUNTY");
        const state = county ? this.findParentNode(county.addrCode, "STATE") : this.findParentNode(node.addrCode, "STATE");
        selection.stateAddrCode = state?.addrCode || this.selectedStateAddrCode || "";
        selection.stateName = state?.addrName || "";
        selection.countyAddrCode = county?.addrCode || "";
        selection.countyName = county?.addrName || "";
        selection.cityAddrCode = node.addrCode;
        selection.cityName = node.addrName;
        selection.displayName = [selection.stateName, selection.countyName, node.addrName].filter(Boolean).join(" ");
        selection.addr1 = selection.stateAddrCode || selection.countyAddrCode;
        selection.addr2 = node.addrCode;
      }

      this.selectedArea = selection;
      this.emitSelection();
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
      walk(this.normalTree, null);
      return found;
    },
    emitSelection() {
      this.$emit("chooseArea", { ...this.selectedArea });
    },
    async selectOrgcList() {
      const param = {};
      const res = await api.selOrgcList(param);
      if(res.data.status === "SUCCESS") {
        this.orgcList = res.data.data;
      }
    },
  },
  created() {
    this.selAddrList();
    this.selectOrgcList();
  }
}
</script>

<style scoped>
.form-select-sm {
  font-size: 13px;
}
</style>
