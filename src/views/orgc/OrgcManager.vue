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
          <div class="card">
            <div class="card-body pb-0">
              <!--              <form>-->
              <div class="row my-1">
                <div class="col-3 d-flex">
                  <label for="deviceID" class="col-form-label pe-4">기관명</label>
                  <input v-model="search.orgcName" name="textfield" type="text" id="IMEI" class="form-control d-inline-flex" style="width: 180px;">
                </div>
                <div class="col-2 text-end">
                  <button class="btn btn-secondary" @click="selectOrgcList">조회</button>
                </div>
              </div>
              <!--              </form>-->
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
              <p class="text-end">
                <!--                <button class="btn btn-primary mt-2 ms-1" onclick="javascript:allList()">전체목록</button>-->
                <!--                <button class="btn btn-primary mt-2 ms-1" onclick="javascript:openPopUp_addcsvDevice()">기기 일괄 등록</button>-->
                <button class="btn btn-primary mt-2 ms-1" @click="addOrgc">기관 등록</button>
              </p>
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

export default {
  name: "OrgcManager",
  data() {
    return {
      datatable:'',
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
        orgcName:''
      },
      orgcList : [],
      columns:[
        {select:0, render: function(data, cell, row) {
            return row.dataIndex + 1
          }
        },
        {select:1, render: function(data, cell, row) {
          console.log(this.orgcList)
            let url = "/orgcpopup?orgc=" + data;
            let name = "기관 수정";
            let style = "width=650,height=480,left=0,top=0";
            let param = "'" + url + "','" + name + "','" + style + "'";
            let html = "<a class='text-primary' href=\"javascript:openPopup(" + param + ")\">" + data + "</a>";
            return html;
          }
        },
        {select:2, scope:'row'},
        {select:3, scope:'row'},
        {select:4, scope:'row', render: this.telForm},
        {select:5, scope:'row'},
      ],
      // dataList:[],
      headings:["No", "기관명", "기관주소", "담당자명", "전화번호", "이메일"],

    }
  },
  mounted() {

    this.selectOrgcList();



  },
  methods: {
    addOrgc() {
      this.$open(
          "/orgcpopup",
          "기관 등록",
          "width=650,height=480,left=0,top=0"
      );
    },
    telForm(data) {
      return utils.telForm(data, 1);
    },

    async selectOrgcList() {
      const param = this.search;
      const res = await api.selOrgcList(param);
      if(res.data.status === "SUCCESS") {
        let dataList = res.data.data;

        this.orgcList = dataList;
        console.log(1)

        this.datatable = this.$datatable(this.datatable, this.headings, dataList, this.columns)
      }

    },
  },
  created(){
    // 팝업창에서 selectOrgcList 를 호출하기 위한 설정
    window.vueComponent = this;
  }
}
</script>

<style scoped>

</style>