<template>
  <main class="container-fluid">

    <h4 class="my-4 ps-3">
      <i class="bi bi-calendar2-check"></i> 사물위치정보 수집사실 확인자료

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
                  <label for="deviceID" class="col-form-label pe-4">대상 IMEI</label>
                  <input v-model="search.deviceIMEI" name="textfield" type="text" id="IMEI" class="form-control d-inline-flex" style="width: 180px;">
                </div>
                <div class="col-3 d-flex">
                  <label for="Set" class="col-form-label pe-4">요청 서비스</label>
                  <input v-model="search.reqService" name="textfield" type="text" id="reqService" class="form-control d-inline-flex" style="width: 180px;">
                </div>
                <div class="col-4 d-flex">
<!--                  <div class="d-flex">-->
                    <label for="inputDate" class="col-form-label pe-3">날짜선택</label>
                    <input type="date" class="form-control" style="width: 150px;" v-model="startDate">
                    <span class="col-form-label px-2"> ~ </span>
                    <input type="date" class="form-control" style="width: 150px;" v-model="endDate">
<!--                  </div>-->
                </div>
                <div class="col-2 text-end">
                  <button class="btn btn-secondary" @click="searchLog()">조회</button>
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
  name: "LocationLog",
  data() {
    return {
      datatable:'',
      search: {
        deviceIMEI:'',
        reqService:'',
        sdate:'',
        edate:''
      },
      startDate:'',
      endDate:'',

      columns:[
        {select:0, render: function(data, cell, row) {
            return row.dataIndex + 1
          }
        },
        {select:1, scope:'row'},
        {select:2, scope:'row'},
        {select:3, scope:'row'},
        {select:4, scope:'row', render: this.dateForm},
        {select:5, scope:'row', render: this.dateForm},
      ],
      // dataList:[],
      headings:["No", "대상 기기", "요청 서비스", "요청자", "수집 방법", "수집 요청 시간", "수집 종료 시간"],

    }
  },
  mounted() {
    this.calcPeriod();
    this.searchLog();

  },
  methods: {
    calcPeriod() {
      let today = new Date();
      this.startDate = utils.getYmd10(today);
      this.endDate = utils.getYmd10(today);
    },
    async searchLog() {
      this.search.sdate = this.startDate.replaceAll('-','') + "000000"
      this.search.edate = this.endDate.replaceAll('-','') + "999999"
      const param = this.search;
      const res = await api.selLocationLog(param);
      if(res.data.status === "SUCCESS") {
        let dataList = res.data.data;

        this.datatable = this.$datatable(this.datatable, this.headings, dataList, this.columns)
      }

    },

  },
  created(){
    // 팝업창에서 selectDeviceList 를 호출하기 위한 설정
    // window.vueComponent = this;
  }
}

</script>

<style scoped>

</style>