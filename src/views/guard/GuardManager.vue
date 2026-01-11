<template>
  <main class="container-fluid">
    <h4 class="my-4 ps-3">
      <i class="bi bi-calendar2-check"></i> 사용자 관리
      <small class="text-muted fs-6">사용자의 정보를 등록 및 수정 할 수 있습니다.</small>
    </h4>

    <section class="section dashboard">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body pb-0">
              <div class="row my-1 align-items-center">

                <div class="col-auto d-flex align-items-center pe-4">
                  <label for="UserName" class="col-form-label flex-shrink-0 pe-2">사용자명</label>
                  <input v-model="search.guardName" type="text" id="UserName" class="form-control" style="width: 135px;">
                </div>

                <div class="col-auto d-flex align-items-center pe-4">
                  <label for="UserPhone" class="col-form-label flex-shrink-0 pe-2">사용자 전화번호</label>
                  <input v-model="search.guardPhone" type="text" id="UserPhone" class="form-control" style="width: 180px;">
                </div>

                <div class="col-auto d-flex align-items-center">
                  <label for="inputDate" class="col-form-label flex-shrink-0 pe-2">날짜선택</label>
                  <input v-model="search.lastLoginDate" type="date" id="inputDate" class="form-control" style="width: 150px;">
                </div>

                <div class="col-auto ms-auto">
                  <button class="btn btn-secondary" @click="selectGuardList">조회</button>
                </div>

              </div>
            </div>
          </div></div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <!-- 목록 테이블 -->
          <div class="card dataTableStyle overflow-auto">
            <div class="card-body">
              <!-- Table with stripped rows -->
              <table class="table table-borderless datatable " ref="datatable"></table>
              <!-- End Table with stripped rows -->
              <p class="text-end">
                <button class="btn btn-primary mt-2 ms-1" @click="appendGuard">사용자 등록</button>
                <button class="btn btn-primary mt-2 ms-1" @click="allList">전체목록</button>
              </p>
            </div>
          </div><!--// 목록 테이블 -->

        </div>
      </div>
    </section>

  </main><!--// 컨텐츠 영역 -->
</template>

<script>
import utils from "@/utils/utils";
import api from "@/api/api";

export default {
  name: "GuardManager",
  data() {
    return {
      datatable:'',
      search: {
        guardName:'',
        guardPhone:'',
        lastLoginDate:'',
      },
      columns:[
        {select:0, render: function(data, cell, row) {
            return row.dataIndex + 1
          }
        },
        {select:1, scope:'row', render: function (data, cell, row) {
            let guardNo = row.cells[0].data;
            return `<a href="#" onclick="handleRowClick(${guardNo})">${utils.telForm(data, 1)}</a>`;
          }},

        {select:2, scope:'row'},
        {select:3, scope:'row'},
        {select:4, scope:'row'},
        {select:5, scope:'row'},
        {select:6, scope:'row'},
        {select:7, scope:'row'}
      ],
      headings:["No", "전화번호(ID)", "사용자명", "이메일", "사용자 유형", "연결 기기 수", "마지막 접속일", "계정상태"],
    }
  },
  mounted() {
    this.selectGuardList();

    window.handleRowClick = (index) => {
      this.openGuard(index);
    };
  },
  methods: {
    openGuard(guardNo) {
      const url = `/guardPopup?guardNo=${guardNo}`;
      const name = "사용자 수정";
      const style = "width=650,height=500,left=0,top=0";
      this.$open(url, name, style);
    },
    appendGuard(){
      const url = '/guardPopup';
      const name = "사용자 추가";
      const style = "width=650,height=500,left=0,top=0";
      this.$open(url, name, style);
    },
    telForm(data) {
      return utils.telForm(data, 1);
    },
    async selectGuardList() {
      const param = this.search;
      param.guardPhone = param.guardPhone.replaceAll("-","")
      console.log(param)
      const res = await api.selGuardianListByAdmin(param);
      if(res.data.status === "SUCCESS") {
        let dataList = res.data.data;

        this.datatable = this.$datatable(this.datatable, this.headings, dataList, this.columns)
      }
    },

    async allList() {
      this.search.guardPhone = ""
      this.search.guardName = ""
      this.selectGuardList()
    }
  },
  created() {
    // 팝업창에서 selectDeviceList 를 호출하기 위한 설정
    window.vueComponent = this;
  }
}
</script>

<style scoped>

</style>