<template>
  <main class="container-fluid">
    <h4 class="my-4 ps-3">
      <i class="bi bi-calendar2-check"></i> 사용자 관리
      <small class="text-muted fs-6">사용자의 정보를 등록 및 수정 할 수 있습니다.</small>
    </h4>

    <section class="section dashboard">
      <div class="row">
        <div class="col-lg-12">
          <!-- 검색조건 -->
          <div class="card">
            <div class="card-body pb-0">
                <div class="row my-1">
                  <div class="col-4 d-flex">
                    <label for="UserName" class="col-form-label pe-4">사용자명</label>
                    <input v-model="search.guardName" name="textfield" type="text" id="UserName" class="form-control" style="width: 135px;">
                  </div>
                  <div class="col-6 d-flex">
                    <label for="" class="col-form-label pe-4">사용자 전화번호</label>
                    <input v-model="search.guardPhone" name="textfield" type="text" id="" class="form-control" style="width: 200px;">
                  </div>
                  <div class="col-2 text-end">
                    <button class="btn btn-secondary" @click="selectGuardList">조회</button>
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

              <!-- Table with stripped rows -->
              <table class="table table-borderless datatable " ref="datatable">

              </table>
              <!-- End Table with stripped rows -->
              <p  class="text-end">
                <button class="btn btn-primary mt-2 ms-1" onclick="javascript:allList()">전체목록</button>
<!--                <button class="btn btn-primary mt-2 ms-1" onclick="javascript:openPopUp_addUser()">사용자 등록</button>-->
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
        guardPhone:''
      },
      columns:[
        {select:0, render: function(data, cell, row) {
            return row.dataIndex + 1
          }
        },
        {select:1, render: function(data, cell, row) {
            let url = "/guardpopup?device=" + data;
            let name = "사용자 수정";
            let style = "width=600,height=450,left=0,top=0";
            let param = "'" + url + "','" + name + "','" + style + "'";
            let html = "<a class='text-primary' href=\"javascript:openPopup(" + param + ")\">" + data + "</a>";
            return html;
          }
        },
        {select:3, scope:'row', render: this.telForm},
        {select:4, scope:'row', render: this.telForm},
        {select:5, scope:'row', render: this.telForm},
        {select:6, scope:'row', render: this.telForm},
        {select:7, scope:'row', render: this.telForm},
      ],
      headings:["No", "IMEI", "사용자명", "이메일", "전화번호0", "전화번호1", "전화번호2", "전화번호3", "전화번호4"],
    }
  },
  mounted() {
    this.selectGuardList();
  },
  methods: {
    telForm(data) {
      return utils.telForm(data, 1);
    },
    async selectGuardList() {
      const param = this.search;
      console.log(param)
      const res = await api.selGuardList(param);
      if(res.data.status === "SUCCESS") {
        let dataList = res.data.data;

        this.datatable = this.$datatable(this.datatable, this.headings, dataList, this.columns)
      }
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