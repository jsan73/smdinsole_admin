<template>
  <li class="nav-item">
    <a
        class="nav-link collapsed"
        :class="{ active: isActive && !hasChildren }"
        :data-bs-target="hasChildren ? '#' + collapseId + '-nav' : null"
        :data-bs-toggle="hasChildren ? 'collapse' : null"
        href="#"
        @click.prevent="selectNode"
    >
      <i :class="hasChildren ? 'bi bi-dash-circle' : 'bi bi-circle'"></i><span>{{ node.addrName }}</span><i v-if="hasChildren" class="bi bi-chevron-down ms-auto"></i>
    </a>
    <ul v-if="hasChildren" :id="collapseId + '-nav'" class="nav-content collapse">
      <li>
        <a href="#" :class="{ active: allActive }" @click.prevent="selectNode">
          <i class="bi bi-circle"></i><span>전체</span>
        </a>
      </li>
      <addr-tree-node
          v-for="child in children"
          :key="child.addrCode"
          :node="child"
          :selected="selected"
          :level="level + 1"
          @select="$emit('select', $event)"
      />
    </ul>
  </li>
</template>

<script>
export default {
  name: "AddrTreeNode",
  props: {
    node: { type: Object, required: true },
    selected: { type: Object, required: true },
    level: { type: Number, default: 1 },
  },
  computed: {
    children() {
      return Array.isArray(this.node.children) ? this.node.children : [];
    },
    hasChildren() {
      return this.children.length > 0;
    },
    collapseId() {
      return "addr-node-" + String(this.node.addrCode || this.node.addrName || "").replace(/[^a-zA-Z0-9_-]/g, "");
    },
    isActive() {
      const level = this.normalLevel(this.node.addrLevel);
      if(level === "COUNTRY") return this.selected.countryCode === this.node.countryCode && !this.selected.stateAddrCode;
      if(level === "STATE") return this.selected.stateAddrCode === this.node.addrCode && !this.selected.countyAddrCode && !this.selected.cityAddrCode;
      if(level === "COUNTY") return this.selected.countyAddrCode === this.node.addrCode && !this.selected.cityAddrCode;
      return this.selected.cityAddrCode === this.node.addrCode;
    },
    allActive() {
      return this.isActive && this.hasChildren;
    },
  },
  methods: {
    normalLevel(level) {
      return String(level || "").toUpperCase();
    },
    selectNode() {
      this.$emit("select", this.node);
    },
  },
}
</script>
