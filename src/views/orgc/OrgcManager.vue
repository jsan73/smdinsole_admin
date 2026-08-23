<template>
  <main class="container-fluid">

    <h4 class="my-4 ps-3">
      <i class="bi bi-calendar2-check"></i> 기관 관리
      <small class="text-muted fs-6">기관의 정보를 등록 및 수정 할 수 있습니다.</small>
    </h4>

    <section class="section dashboard">
      <div class="row">
        <div class="col-lg-12">
          <!-- 검색조건 -->
          <div class="card compact-search">
            <div class="card-body pb-0">
              <div class="row my-3 align-items-center">
                <div class="col d-flex flex-wrap gap-3">
                  <div class="d-flex align-items-center">
                    <label for="orgcName" class="fw-bold me-2" style="white-space: nowrap;">기관명</label>
                    <input v-model="search.orgcName" type="text" id="orgcName" class="form-control" style="width: 180px;" placeholder="기관명 입력" @keyup.enter="selectOrgcList">
                  </div>
                </div>

                <div class="col-auto ms-auto">
                  <button class="btn btn-secondary" @click="selectOrgcList">
                    <i class="bi bi-search"></i> 조회
                  </button>
                </div>
              </div>
            </div>
          </div><!--/ 검색조건 -->
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <!-- 목록 테이블 -->
          <div class="card dataTableStyle overflow-auto">
            <div class="card-body">
              <!-- <p>Add lightweight datatables to your project with using the <a href="https://github.com/fiduswriter/Simple-DataTables" target="_blank">Simple
                              DataTables</a> library. Just add <code>.datatable</code> class name to any table you wish to conver to a datatable</p> -->

              <div class="grid-toolbar">
                <div class="grid-total-count">총 {{ totalRows }}건</div>
                <div class="grid-page-size">
                  <label for="orgcPageSize" class="form-label mb-0">페이지당</label>
                  <select id="orgcPageSize" v-model.number="paginationPageSize" class="form-select form-select-sm" @change="onPageSizeChange">
                    <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}개</option>
                  </select>
                </div>
              </div>
              <ag-grid-vue
                  class="ag-theme-alpine common-grid"
                  :modules="gridModules"
                  :columnDefs="columnDefs"
                  :rowData="orgcList"
                  :defaultColDef="defaultColDef"
                  :enableCellTextSelection="true"
                  :pagination="false"
                  :paginationPageSize="paginationPageSize"
                  :suppressPaginationPanel="true"
                  :rowHeight="34"
                  :headerHeight="36"
                  :overlayNoRowsTemplate="overlayNoRowsTemplate"
                  :overlayLoadingTemplate="overlayLoadingTemplate"
                  @grid-ready="onGridReady"
                  @pagination-changed="onPaginationChanged"
              />
              <div class="grid-pagination-footer">
                <div class="grid-pagination-balance" aria-hidden="true"></div>
                <div class="grid-pagination-wrap">
                  <div v-if="totalPages > 1" class="grid-pagination">
                    <button type="button" class="btn btn-sm btn-outline-secondary" :disabled="currentPage === 1" @click="goToPage(1)">처음</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">이전</button>
                    <button v-for="page in paginationPages" :key="page" type="button" class="btn btn-sm" :class="page === currentPage ? 'btn-primary' : 'btn-outline-secondary'" @click="goToPage(page)">{{ page }}</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">다음</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary" :disabled="currentPage === totalPages" @click="goToPage(totalPages)">마지막</button>
                  </div>
                </div>
                <div class="grid-pagination-actions">
                  <button class="btn btn-primary mt-2 ms-1" @click="addOrgc">기관 등록</button>
                </div>
              </div>
            </div>
          </div><!--// 목록 테이블 -->

        </div>
      </div>


    </section>



  </main><!--// 컨텐츠 영역 -->
</template>

<script>

import api from '@/api/api';
import utils from "@/utils/utils";
import { AgGridVue } from "@ag-grid-community/vue";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-alpine.css";

export default {
  name: "OrgcManager",
  components: {
    AgGridVue,
  },
  data() {
    return {
      gridApi: null,
      gridModules: [ClientSideRowModelModule],
      paginationPageSize: 20,
      pageSizeOptions: [10, 20, 50, 100],
      currentPage: 1,
      totalPages: 0,
      totalRows: 0,
      defaultColDef: {
        sortable: true,
        resizable: true,
        suppressMovable: true,
      },
      overlayNoRowsTemplate: '<span class="text-muted">조회된 데이터가 없습니다.</span>',
      overlayLoadingTemplate: '<div class="ag-overlay-loading-center" style="width: 220px;"><div class="mb-2 text-muted">조회 중...</div><div class="progress" style="height: 6px;"><div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%;"></div></div></div>',
      // data: {
      //   deviceIMEI:'',
      //   deviceNumber:'',
      //   guardPhone:'',
      //   orgNm:'',
      //   memberDate:'',
      //   expDate:'',
      //   lastSignal:'',
      //   locCnt:0
      // },
      search: {
        orgcName:'',
        dbState:'A'
      },
      orgcList : [],
      columnDefs:[
        {
          headerName: "No",
          valueGetter: this.noValueGetter,
          width: 80,
          sortable: false,
        },
        {
          headerName: "기관명",
          valueGetter: params => this.getOrgcValue(params.data, 1, ["ORGC_NAME", "orgcName"]),
          minWidth: 180,
          cellRenderer: this.orgcNameRenderer,
        },
        { headerName: "기관주소", valueGetter: params => this.getOrgcValue(params.data, 2, ["ORGC_ADDR", "orgcAddr", "ADDR", "addr"]), minWidth: 220, flex: 1 },
        { headerName: "담당자명", valueGetter: params => this.getOrgcValue(params.data, 3, ["MANAGER_NAME", "managerName", "CHARGER_NAME", "chargerName"]), width: 130 },
        { headerName: "전화번호", valueGetter: params => this.getOrgcValue(params.data, 4, ["TEL_NO", "telNo", "PHONE", "phone"]), width: 150, valueFormatter: this.telValueFormatter },
        { headerName: "이메일", valueGetter: params => this.getOrgcValue(params.data, 5, ["EMAIL", "email"]), minWidth: 180 },
      ],

    }
  },
  computed: {
    isSuperAdmin() {
      return this.$store.getters['adminStore/isSuperAdmin'] === true;
    },
    paginationPages() {
      const pageCount = 10;
      const start = Math.floor((this.currentPage - 1) / pageCount) * pageCount + 1;
      const end = Math.min(start + pageCount - 1, this.totalPages);
      const pages = [];
      for(let page = start; page <= end; page += 1) pages.push(page);
      return pages;
    },
  },
  mounted() {
    if(!this.isSuperAdmin) {
      alert("대표 관리자만 수행할 수 있습니다.");
      this.$router.replace("/device").catch(() => {});
      return;
    }
    this.selectOrgcList();



  },
  methods: {
    addOrgc() {
      if(!this.isSuperAdmin) {
        alert("대표 관리자만 수행할 수 있습니다.");
        return;
      }
      this.$open(
          "/orgcpopup",
          "기관 등록",
          "width=590,height=430,left=0,top=0"
      );
    },
    telForm(data) {
      return utils.telForm(data, 1);
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.updatePaginationState();
      if(this.orgcList.length === 0) this.gridApi.showNoRowsOverlay();
    },
    onPaginationChanged() {
      this.updatePaginationState();
    },
    updatePaginationState() {
      this.totalPages = this.totalRows === 0 ? 0 : Math.ceil(this.totalRows / this.paginationPageSize);
      if(this.totalPages > 0 && this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
      }
    },
    onPageSizeChange() {
      this.currentPage = 1;
      this.selectOrgcList(false);
    },
    goToPage(page) {
      if(page < 1 || page > this.totalPages || page === this.currentPage) return;
      this.currentPage = page;
      this.selectOrgcList(false);
    },
    noValueGetter(params) {
      return ((this.currentPage - 1) * this.paginationPageSize) + params.node.rowIndex + 1;
    },
    getOrgcValue(row, index, keys) {
      if(Array.isArray(row)) return row[index];
      if(!row || typeof row !== "object") return "";
      const key = keys.find(item => row[item] !== undefined && row[item] !== null);
      return key ? row[key] : "";
    },
    getOrgcNo(row) {
      if(Array.isArray(row)) {
        const orgc = String(row[1] || "").split(",");
        return orgc[0] || row[0];
      }
      return this.getOrgcValue(row, 0, ["ORGC_NO", "orgcNo"]);
    },
    toOrgcRows(data) {
      if(Array.isArray(data)) return data;
      if(!data || typeof data !== "object") return [];
      const rowKeys = ["list", "rows", "items", "content", "orgcList"];
      const rows = rowKeys.map(key => data[key]).find(Array.isArray);
      return rows || [];
    },
    telValueFormatter(params) {
      return this.telForm(params.value);
    },
    orgcNameRenderer(params) {
      const name = params.value;
      if(utils.isEmpty(name)) return "";
      const link = document.createElement("a");
      link.href = "#";
      link.className = "text-primary";
      link.textContent = String(name).includes(",") ? String(name).split(",")[1] : name;
      link.addEventListener("click", event => {
        event.preventDefault();
        this.$open("/orgcpopup?orgcNo=" + this.getOrgcNo(params.data), "기관 수정", "width=590,height=430,left=0,top=0");
      });
      return link;
    },

    async selectOrgcList(resetPage = true) {
      if(!this.isSuperAdmin) return;
      if(resetPage) this.currentPage = 1;
      if(this.gridApi) this.gridApi.showLoadingOverlay();
      const param = {
        ...this.search,
        pageNum: this.currentPage,
        pageSize: this.paginationPageSize,
        pageStart: (this.currentPage - 1) * this.paginationPageSize,
      };
      try {
        const res = await api.selOrgcList(param);
        if(res.data.status === "SUCCESS") {
          const data = res.data.data || {};
          this.orgcList = this.toOrgcRows(data);
          this.totalRows = data.totalCount || this.orgcList.length;
          this.$nextTick(() => {
            this.updatePaginationState();
            if(this.gridApi && this.orgcList.length === 0) this.gridApi.showNoRowsOverlay();
            else if(this.gridApi) this.gridApi.hideOverlay();
          });
        }
      } catch (e) {
        this.handleScopeError(e);
      }

    },
    handleScopeError(e) {
      if(this.gridApi) this.gridApi.showNoRowsOverlay();
      const status = e?.response?.status;
      if(status === 403 || status === 401) {
        alert("대표 관리자만 수행할 수 있습니다.");
        return;
      }
      alert(e?.response?.data?.message || "조회 중 오류가 발생했습니다.");
    },
  },
  created(){
    // 팝업창에서 selectOrgcList 를 호출하기 위한 설정
    window.vueComponent = this;
  }
}
</script>

<style scoped>
.common-grid {
  width: 100%;
  height: 560px;
}

.grid-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.grid-total-count {
  min-width: 90px;
  color: #495057;
  font-size: 14px;
}

.grid-pagination-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 12px;
}

.grid-pagination {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
}

.grid-pagination .btn {
  min-width: 36px;
}

.grid-page-size {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #495057;
  font-size: 14px;
}

.grid-page-size .form-select {
  width: 96px;
}
</style>
