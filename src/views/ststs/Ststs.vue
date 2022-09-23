<template>
  <div>
    <SideMenu></SideMenu>
  <main id="main" class="">
    <div class="pagetitle">
      <h4>경보발생 통계</h4>
      <small class="text-muted fs-6">서울특별시</small>

    </div><!-- End Page Title -->

    <section class="section dashboard">
      <!-- 검색조건 -->
      <div class="row">
        <div class="col-lg-12">

          <div class="card">
            <div class="card-body pb-0">
              <form>
                <div class="row my-1">
                  <div class="col-4">
                    <div class="d-flex ">
                      <legend class="col-form-label pe-3">기간</legend>
                      <div class="form-check col-form-label">
                        <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="option1" checked>
                        <label class="form-check-label" for="gridRadios1">
                          일간
                        </label>
                      </div>
                      <div class="form-check col-form-label">
                        <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios2" value="option2">
                        <label class="form-check-label" for="gridRadios2">
                          주간
                        </label>
                      </div>
                      <div class="form-check col-form-label">
                        <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios" value="option" >
                        <label class="form-check-label" for="gridRadios3">
                          월간
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="col-6 ">
                    <div class="d-flex">
                      <label for="inputDate" class="col-form-label pe-3">날짜선택</label>
                      <input type="date" class="form-control" style="width: 150px;">
                      <span class="col-form-label px-2"> ~ </span>
                      <input type="date" class="form-control" style="width: 150px;">
                    </div>
                  </div>
                  <div class="col-2 text-end">
                    <button class="btn btn-secondary" onclick="javascript:search()">조회</button>
                  </div>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div><!--// 검색조건 -->


      <div class="row">
        <div class="col-xxl-12 col-xl-12">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">경보발생 <span>(125건)</span></h5>

              <!-- Bar Chart -->
<!--              <div id="barChart" style="min-height: 400px;" class="echart"></div>-->
              <v-chart :option="acid" style="min-height: 400px;" class="echart" />
<!--              <script>-->
<!--                document.addEventListener("DOMContentLoaded", () => {-->
<!--                  echarts.init(document.querySelector("#barChart")).setOption({-->
<!--                    xAxis: {-->
<!--                      type: 'category',-->
<!--                      data: ['종로구']-->
<!--                    },-->
<!--                    yAxis: {-->
<!--                      type: 'value'-->
<!--                    },-->
<!--                    series: [{-->
<!--                      data: [86],-->
<!--                      type: 'bar'-->
<!--                    }]-->
<!--                  });-->
<!--                });-->
<!--              </script>-->
              <!-- End Bar Chart -->
            </div>
          </div>
        </div>
        <!-- // 경보발생 -->


        <!-- 발생유형 -->
        <div class="col-xxl-4 col-xl-12">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">발생유형 <span>(125건)</span></h5>

              <!-- Bar Chart -->
<!--              <div id="barChart1" style="min-height: 400px;" class="echart"></div>-->
              <v-chart :option="acidType" style="min-height: 400px;" class="echart" />
<!--              <script>-->
<!--                document.addEventListener("DOMContentLoaded", () => {-->
<!--                  echarts.init(document.querySelector("#barChart1")).setOption({-->
<!--                    xAxis: {-->
<!--                      type: 'category',-->
<!--                      data: ['안심존이탈', '낙상', '베터리방전', '현재위치찾기']-->
<!--                    },-->
<!--                    yAxis: {-->
<!--                      type: 'value'-->
<!--                    },-->
<!--                    series: [{-->
<!--                      data: [120, 4, 20, 55],-->
<!--                      type: 'bar'-->
<!--                    }]-->
<!--                  });-->
<!--                });-->
<!--              </script>-->
              <!-- End Bar Chart -->
            </div>
          </div>
        </div><!-- / 발생유형 -->

        <!-- 발생시간대별 건수 -->
        <div class="col-xxl-4 col-xl-12">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">발생시간대별 건수 <span>(125건)</span></h5>
              <!-- Bar Chart -->
              <div id="barChart2" style="min-height: 400px;" class="echart"></div>

<!--              <script>-->
<!--                document.addEventListener("DOMContentLoaded", () => {-->
<!--                  echarts.init(document.querySelector("#barChart2")).setOption({-->
<!--                    xAxis: {-->
<!--                      type: 'category',-->
<!--                      data: ['0', '', '', '3', '', '', '6', '', '', '9', '', '', '12', '', '', '15', '', '', '18', '', '',  '21', '', '']-->
<!--                    },-->
<!--                    yAxis: {-->
<!--                      type: 'value'-->
<!--                    },-->
<!--                    series: [{-->
<!--                      data: [43, 2, 1, 5, 2, 0, 3, 2, 0, 0, 1, 0, 0, 0, 0, 2, 0, 3, 2, 0, 10, 1, 0, 2],-->
<!--                      type: 'bar'-->
<!--                    }]-->
<!--                  });-->
<!--                });-->
<!--              </script>-->
              <!-- End Bar Chart -->
            </div>
          </div>
        </div><!-- / 발생시간대별 건수 -->

      </div>
    </section>

    <section class="section dashboard">
      <div class="row">
        <div class="col-lg-12">

          <div class="card dataTableStyle overflow-auto">
            <div class="card-body">
              <!-- <p>Add lightweight datatables to your project with using the <a href="https://github.com/fiduswriter/Simple-DataTables" target="_blank">Simple
                      DataTables</a> library. Just add <code>.datatable</code> class name to any table you wish to conver to a datatable</p> -->

              <!-- Table with stripped rows -->
              <table class="table table-borderless datatable " ref="datatable" />
<!--              <table class="table table-borderless datatable ">-->
<!--                <thead>-->
<!--                <tr>-->
<!--                  <th scope="col" style="width: 15%;">구분</th>-->
<!--                  <th scope="col" style="width: 13%;">기기대수</th>-->
<!--                  <th scope="col" style="width: 12%;">경보발생수</th>-->
<!--                  <th scope="col" style="width: 12%;">안심존이탈</th>-->
<!--                  <th scope="col" style="width: 12%;">낙 상</th>-->
<!--                  <th scope="col" style="width: 12%;">배터리방전</th>-->
<!--                  <th scope="col" style="width: 12%;">현재위치찾기</th>-->
<!--                </tr>-->
<!--                </thead>-->
<!--                <tbody>-->
<!--                <tr>-->
<!--                  <th scope="row">종로구</th>-->
<!--                  <td>10</td>-->
<!--                  <td>0</td>-->
<!--                  <td>0</td>-->
<!--                  <td>0</td>-->
<!--                  <td>0</td>-->
<!--                  <td>28</td>-->
<!--                </tr>-->

<!--                </tbody>-->
<!--              </table>-->
              <!-- End Table with stripped rows -->
            </div>
          </div>

        </div>
      </div>
    </section>

  </main><!-- // 컨텐츠 영역 -->
  </div>
</template>

<script>
import SideMenu from "@/views/ststs/SideMenu";
import api from '@/api/api';
import utils from "@/utils/utils";

export default {
  name: "Ststs",
  components: {
    SideMenu,
  },
  data() {
    return {
      acid : {
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [],
          type: 'bar'
        }]
      },
      acidType : {
        xAxis: {
          type: 'category',
          data: ['안심존이탈','베터리방전','현재위치찾기']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [],
          type: 'bar'
        }]
      },
      acidTime : {
        xAxis: {
          type: 'category',
          data: ['0', '', '', '3', '', '', '6', '', '', '9', '', '', '12', '', '', '15', '', '', '18', '', '',  '21', '', '']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [],
          type: 'bar'
        }]
      },
      datatable:'',
      columns:[
        {select:0, hidden:true},
        {select:[1,2,3,4,5,6], scope:'row'},
        // {select:2, scope:'row'},
        // {select:3, scope:'row'},
        // {select:4, scope:'row'},
        // {select:5, scope:'row'},
        // {select:6, scope:'row'},
      ],
      gridHeadings:["code", "구분", "기기대수", "경보발생수", "안심존이탈", "배터리방전","현재위치찾기"]
    }
  },
  mounted() {
    this.selStatAcid();
  },
  methods: {
    selStatAcid() {
      api.selStatAcid().then(res => {
        if(res.data.status === "SUCCESS") {
          let dataList = res.data.data;
          console.log(dataList)
          const data = dataList.map(item => Object.values(item))
          console.log(data)

          let safe=0, bettery=0, cloc = 0
          data.forEach(function (val) {
            this.acid.xAxis.data.push(val[1])
            this.acid.series[0].data.push(val[3])
            safe += val[4]
            bettery += val[5]
            cloc += val[6]
          }.bind(this))

          this.acidType.series[0].data = [safe, bettery, cloc];
          console.log(this.acid.xAxis.data)
          this.datatable = this.$datatable(this.datatable, this.gridHeadings, dataList, this.columns)
        }
      })
    }
  }
  // setup() {
  //   const acid = ref({
  //     title: {
  //       text: 'Traffic Sources',
  //       left: 'center',
  //     },
  //     tooltip: {
  //       trigger: 'item',
  //       formatter: '{a} <br/>{b} : {c} ({d}%)',
  //     },
  //     legend: {
  //       orient: 'vertical',
  //       left: 'left',
  //       data: ['Direct', 'Email', 'Ad Networks', 'Video Ads', 'Search Engines'],
  //     },
  //     series: [
  //       {
  //         name: 'Traffic Sources',
  //         type: 'pie',
  //         radius: '55%',
  //         center: ['50%', '60%'],
  //         data: [
  //           { value: 335, name: 'Direct' },
  //           { value: 310, name: 'Email' },
  //           { value: 234, name: 'Ad Networks' },
  //           { value: 135, name: 'Video Ads' },
  //           { value: 1548, name: 'Search Engines' },
  //         ],
  //         emphasis: {
  //           itemStyle: {
  //             shadowBlur: 10,
  //             shadowOffsetX: 0,
  //             shadowColor: 'rgba(0, 0, 0, 0.5)',
  //           },
  //         },
  //       },
  //     ],
  //   });
  //
  //   return { acid };
  //
  // }
}
</script>

<style scoped>

</style>