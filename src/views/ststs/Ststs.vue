<template>
  <div>
    <SideMenu @chooseArea="selStat" :totalCount=totalCount ></SideMenu>
  <main id="main" class="">
    <div class="pagetitle">
      <h4>경보발생 통계</h4>
      <small class="text-muted fs-6">{{addrName1}} {{addrName2}}</small>

    </div><!-- End Page Title -->

    <section class="section dashboard">
      <!-- 검색조건 -->
      <div class="row">
        <div class="col-lg-12">

          <div class="card search-card compact-search">
            <div class="card-body py-2">
              <div class="dashboard-search-bar">
                <div class="period-control" role="group" aria-label="기간">
                  <label class="period-option" :class="{ active: period == 1 }" for="gridRadios1">
                    <input type="radio" name="gridRadios" id="gridRadios1" v-model="period" value="1">
                    일간
                  </label>
                  <label class="period-option" :class="{ active: period == 7 }" for="gridRadios2">
                    <input type="radio" name="gridRadios" id="gridRadios2" v-model="period" value="7">
                    주간
                  </label>
                  <label class="period-option" :class="{ active: period == 30 }" for="gridRadios3">
                    <input type="radio" name="gridRadios" id="gridRadios3" v-model="period" value="30">
                    월간
                  </label>
                </div>
                <div class="date-range-control">
                  <span class="search-label">날짜</span>
                  <input type="date" class="form-control form-control-sm date-input" v-model="search.sdate">
                  <span class="date-separator">~</span>
                  <input type="date" class="form-control form-control-sm date-input" v-model="search.edate">
                </div>
                <button class="btn btn-secondary btn-sm search-button" @click="selSearch">조회</button>
              </div>
            </div>
          </div>

        </div>
      </div><!--// 검색조건 -->

      <div class="row dashboard-summary-row">
        <div class="col-lg-4 col-md-6 mb-3">
          <div class="summary-box">
            <div class="summary-title">사용중인 기기수 <span>(On device)</span></div>
            <div class="device-status-counts">
              <div class="status-count">
                <strong>{{ deviceSummary.statusSummary.onCount }}</strong>
                <span>On</span>
              </div>
              <div class="status-divider">/</div>
              <div class="status-count">
                <strong>{{ deviceSummary.statusSummary.chargingCount }}</strong>
                <span>Charging</span>
              </div>
              <div class="status-divider">/</div>
              <div class="status-count">
                <strong>{{ deviceSummary.statusSummary.offCount }}</strong>
                <span>Off</span>
              </div>
            </div>
            <div v-if="isSummaryLoading" class="summary-muted">요약 조회 중...</div>
          </div>
        </div>

        <div class="col-lg-4 col-md-6 mb-3">
          <div class="summary-box">
            <div class="summary-title">이심 만료 기한 <span>(30일이내 목록)</span></div>
            <div class="summary-list">
              <button
                  v-for="item in deviceSummary.esimExpiring.list"
                  :key="'esim-' + item.date"
                  type="button"
                  class="summary-list-row"
                  @click="goDeviceExpireDate('esim', item.date)"
              >
                <span>{{ item.displayDate }}</span>
                <strong>{{ item.count }}</strong>
              </button>
              <div v-if="!isSummaryLoading && deviceSummary.esimExpiring.list.length === 0" class="summary-empty">
                30일 이내 만료 예정 없음
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4 col-md-12 mb-3">
          <div class="summary-box">
            <div class="summary-title">사용 만료 기한 <span>(30일이내 목록)</span></div>
            <div class="summary-list">
              <button
                  v-for="item in deviceSummary.deviceExpiring.list"
                  :key="'device-' + item.date"
                  type="button"
                  class="summary-list-row"
                  @click="goDeviceExpireDate('device', item.date)"
              >
                <span>{{ item.displayDate }}</span>
                <strong>{{ item.count }}</strong>
              </button>
              <div v-if="!isSummaryLoading && deviceSummary.deviceExpiring.list.length === 0" class="summary-empty">
                30일 이내 만료 예정 없음
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-xxl-4 col-xl-12">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">경보발생 <span>({{ alram_count1 }}건)</span></h5>

              <!-- Bar Chart -->
<!--              <div id="barChart" style="min-height: 400px;" class="echart"></div>-->
              <v-chart :option="acid" style="min-height: 400px; min-width:200px; height: 400px;" class="echart" />
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
              <h5 class="card-title">발생유형 <span>({{ alram_count2 }}건)</span></h5>

              <!-- Bar Chart -->
<!--              <div id="barChart1" style="min-height: 400px;" class="echart"></div>-->
              <v-chart :option="acidType" style="min-height: 400px; min-width:200px; height: 400px;" class="echart" />
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
              <div class="chart-title-row">
                <h5 class="card-title">발생시간대별 건수 <span>({{ alram_count3 }}건)</span></h5>
                <select class="form-select form-select-sm alert-type-select" v-model="search.alertType" @change="selStatAcidTime">
                  <option value="ALL">전체</option>
                  <option value="ACTIVE_OUT">안심존이탈</option>
                  <option value="BATTERY">베터리방전</option>
                  <option value="REQ_LOC">현재위치찾기</option>
                </select>
              </div>
              <!-- Bar Chart -->
<!--              <div id="barChart2" style="min-height: 400px;" class="echart"></div>-->
              <v-chart :option="acidTime" style="min-height: 400px; min-width:200px; height: 400px;" class="echart" />
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
  name: "StstsView",
  components: {
    SideMenu,
  },
  data() {
    return {
      period:1,
      search: {
        sdate:'',
        edate:'',
        addr1:'',
        addr2:'',
        countryCode:'KR',
        stateAddrCode:'',
        countyAddrCode:'',
        cityAddrCode:'',
        alertType:'ALL'
      },
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
      gridHeadings:["code", "구분", "기기대수", "경보발생수", "안심존이탈", "배터리방전","현재위치찾기"],
      alram_count1:0,
      alram_count2:0,
      alram_count3:0,
      totalCount:0,
      addrName1:'',
      addrName2:'',
      isSummaryLoading: false,
      deviceSummary: {
        statusSummary: {
          onCount: 0,
          chargingCount: 0,
          offCount: 0
        },
        esimExpiring: {
          list: []
        },
        deviceExpiring: {
          list: []
        }
      }
    }
  },
  watch: {
    period(){
      this.calcPeriod();
    }
  },
  mounted() {
    this.calcPeriod();
    this.selStatAcid();
    this.selStatAcidTime();
    this.selDashboardDeviceSummary();
  },
  methods: {
    selSearch() {
      this.selStatAcid();
      this.selStatAcidTime();
      this.selDashboardDeviceSummary();
    },
    calcPeriod() {

      let sdate = "";
      let today = new Date();
      if(this.period == 7) {
        let diff = today.getDate() - today.getDay() + (today.getDay() == 0 ? -6 : 1);
        sdate = new Date(today.setDate(diff));
      }else if(this.period == 30) {
        sdate = new Date(today.getFullYear(), today.getMonth(), 1);
      }else{
        sdate =  new Date();
      }
      this.search.sdate = utils.getYmd10(sdate);
      this.search.edate = utils.getYmd10(new Date());
    },
    selStat(addr1, addr2, addrName1, addrName2) {
      if(addr1 && typeof addr1 === "object") {
        const area = addr1;
        this.search.countryCode = area.countryCode || "KR";
        this.search.stateAddrCode = area.stateAddrCode || "";
        this.search.countyAddrCode = area.countyAddrCode || "";
        this.search.cityAddrCode = area.cityAddrCode || "";
        this.search.addr1 = area.addr1 || area.stateAddrCode || "";
        this.search.addr2 = area.addr2 || area.cityAddrCode || area.countyAddrCode || "";
        this.addrName1 = area.stateName || area.countyName || area.displayName || "";
        this.addrName2 = area.cityName || (!area.cityName && area.countyName && area.stateName ? area.countyName : "");
      } else {
        this.search.addr1 = addr1;
        this.search.addr2 = addr2;
        this.addrName1 = addrName1;
        this.addrName2 = addrName2;
        this.search.countryCode = "KR";
        this.search.stateAddrCode = addr1 || "";
        this.search.countyAddrCode = "";
        this.search.cityAddrCode = addr2 || "";
      }
      this.selSearch();
    },
    getStatParam() {
      const param = {
        countryCode: this.search.countryCode || "KR",
        sdate: (this.search.sdate || "").split("-").join("") + "000000",
        edate: (this.search.edate || "").split("-").join("") + "235959",
        alertType: this.search.alertType || "ALL"
      };
      if(param.countryCode === "KR") {
        param.addr1 = this.search.addr1 || "";
        param.addr2 = this.search.addr2 || "";
      }
      if(this.search.cityAddrCode) {
        param.cityAddrCode = this.search.cityAddrCode;
      } else if(this.search.countyAddrCode) {
        param.countyAddrCode = this.search.countyAddrCode;
      } else if(this.search.stateAddrCode) {
        param.stateAddrCode = this.search.stateAddrCode;
      }
      return param;
    },
    getDeviceSummaryParam() {
      const param = {
        countryCode: this.search.countryCode || "KR"
      };
      if(param.countryCode === "KR") {
        param.addr1 = this.search.addr1 || "";
        param.addr2 = this.search.addr2 || "";
      }
      if(this.search.cityAddrCode) {
        param.cityAddrCode = this.search.cityAddrCode;
      } else if(this.search.countyAddrCode) {
        param.countyAddrCode = this.search.countyAddrCode;
      } else if(this.search.stateAddrCode) {
        param.stateAddrCode = this.search.stateAddrCode;
      }
      return param;
    },
    async selDashboardDeviceSummary() {
      this.isSummaryLoading = true;
      try {
        const res = await api.selDashboardDeviceSummary(this.getDeviceSummaryParam());
        if(res.data.status === "SUCCESS") {
          this.deviceSummary = this.normalizeDeviceSummary(res.data.data || {});
        }
      } catch (e) {
        this.deviceSummary = this.normalizeDeviceSummary({});
      } finally {
        this.isSummaryLoading = false;
      }
    },
    normalizeDeviceSummary(data) {
      const statusSummary = data.statusSummary || data.STATUS_SUMMARY || {};
      const esimExpiring = data.esimExpiring || data.ESIM_EXPIRING || {};
      const deviceExpiring = data.deviceExpiring || data.DEVICE_EXPIRING || {};
      return {
        statusSummary: {
          onCount: this.toNumber(this.getValue(statusSummary, ["onCount", "ON_COUNT"])),
          chargingCount: this.toNumber(this.getValue(statusSummary, ["chargingCount", "CHARGING_COUNT"])),
          offCount: this.toNumber(this.getValue(statusSummary, ["offCount", "OFF_COUNT"]))
        },
        esimExpiring: {
          list: this.toExpireRows(esimExpiring.list || esimExpiring.LIST)
        },
        deviceExpiring: {
          list: this.toExpireRows(deviceExpiring.list || deviceExpiring.LIST)
        }
      };
    },
    toExpireRows(data) {
      return this.toArray(data).map(row => {
        const rawDate = this.getValue(row, ["date", "DATE", "expDate", "EXP_DATE", "esimExpDate", "ESIM_EXP_DATE"]);
        const date = this.normalizeDate(rawDate);
        return {
          date,
          displayDate: this.getValue(row, ["displayDate", "DISPLAY_DATE"]) || this.toDisplayDate(date),
          count: this.toNumber(this.getValue(row, ["count", "COUNT", "deviceCount", "DEVICE_COUNT"]))
        };
      }).filter(row => row.date);
    },
    normalizeDate(value) {
      const digits = String(value || "").replace(/[^0-9]/g, "");
      if(digits.length < 8) return "";
      return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
    },
    toDisplayDate(date) {
      return date ? date.replace(/-/g, ".") : "";
    },
    goDeviceExpireDate(type, date) {
      if(!date) return;
      const query = type === "esim"
          ? { esimExpDateStart: date, esimExpDateEnd: date }
          : { expDateStart: date, expDateEnd: date };
      this.$router.push({ path: "/device", query });
    },
    selStatAcid() {
      const param = this.getStatParam();
      this.totalCount = 0;
      this.alram_count1 = 0;
      this.alram_count2 = 0;
      this.acid.xAxis.data = [];
      this.acid.series[0].data = [];
      this.acidType.series[0].data = [];
      api.selStatAcidRegion(param).then(res => {
        if(res.data.status === "SUCCESS") {
          let dataList = this.toStatRows(res.data.data);
          let safe = 0, bettery = 0, cloc = 0;
          dataList.forEach(function (val) {
            this.totalCount += val.deviceCount;
            this.acid.xAxis.data.push(val.addrName);
            this.acid.series[0].data.push(val.alramCount);
            this.alram_count1 += val.alramCount;
            safe += val.activeOutCount;
            bettery += val.batteryCount;
            cloc += val.reqCount;
          }.bind(this));

          this.alram_count2 = safe + bettery + cloc;
          this.acidType.series[0].data = [safe, bettery, cloc];
          this.datatable = this.$datatable(this.datatable, this.gridHeadings, dataList, this.columns);
        }
      }).catch(() => {
        if((this.search.countryCode || "KR") === "KR") this.selStatAcidLegacy(param);
      });
    },
    selStatAcidLegacy(param) {
      api.selStatAcid(param).then(res => {
        if(res.data.status === "SUCCESS") {
          let dataList = this.toStatRows(res.data.data);
          let safe = 0, bettery = 0, cloc = 0;
          dataList.forEach(function (val) {
            this.totalCount += val.deviceCount;
            this.acid.xAxis.data.push(val.addrName);
            this.acid.series[0].data.push(val.alramCount);
            this.alram_count1 += val.alramCount;
            safe += val.activeOutCount;
            bettery += val.batteryCount;
            cloc += val.reqCount;
          }.bind(this));

          this.alram_count2 = safe + bettery + cloc;
          this.acidType.series[0].data = [safe, bettery, cloc];
          this.datatable = this.$datatable(this.datatable, this.gridHeadings, dataList, this.columns);
        }
      });
    },
    selStatAcidTime() {
      const param = this.getStatParam();
      this.alram_count3 = 0;
      this.acidTime.series[0].data = [];
      api.selStatAcidTime(param).then(res => {
        if(res.data.status === "SUCCESS") {
          let dataList = Array.isArray(res.data.data) ? res.data.data : [];
          let data = new Array(24).fill(0);
          dataList.forEach(function (time) {
            const hour = this.toNumber(this.getValue(time, ["REPORT_HOUR", "reportHour"]));
            const count = this.toNumber(this.getValue(time, ["ALERT_COUNT", "alertCount", "ALRAM_COUNT", "alramCount"]));
            data[hour] = count;
            this.alram_count3 += count;
          }.bind(this))
          this.acidTime.series[0].data = data;
        }
      })
    },
    toStatRows(data) {
      const rows = this.toArray(data);
      return rows.map(row => ({
        code: this.getValue(row, ["ADDR_CODE", "addrCode", "code"]),
        addrName: this.getValue(row, ["ADDR_NAME", "addrName", "ADDR2", "addr2", "ADDR1", "addr1", "name"]),
        deviceCount: this.toNumber(this.getValue(row, ["DEVICE_COUNT", "deviceCount", "DEVICE_CNT", "deviceCnt"])),
        alramCount: this.toNumber(this.getValue(row, ["ALRAM_COUNT", "alramCount", "ALERT_COUNT", "alertCount"])),
        activeOutCount: this.toNumber(this.getValue(row, ["ACTIVE_OUT_COUNT", "activeOutCount", "SAFE_COUNT", "safeCount"])),
        batteryCount: this.toNumber(this.getValue(row, ["BATTERY_COUNT", "batteryCount", "BETTERY_COUNT", "betteryCount"])),
        reqCount: this.toNumber(this.getValue(row, ["REQ_COUNT", "reqCount", "CLOC_COUNT", "clocCount"])),
      }));
    },
    toArray(data) {
      if(Array.isArray(data)) return data;
      if(!data || typeof data !== "object") return [];
      const rowKeys = ["list", "rows", "items", "content", "statList"];
      const rows = rowKeys.map(key => data[key]).find(Array.isArray);
      return rows || [];
    },
    getValue(row, keys) {
      if(!row || typeof row !== "object") return "";
      const key = keys.find(item => row[item] !== undefined && row[item] !== null);
      return key ? row[key] : "";
    },
    toNumber(value) {
      const number = parseInt(value, 10);
      return Number.isNaN(number) ? 0 : number;
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
.search-card {
  margin-bottom: 12px;
}

.dashboard-search-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.period-control {
  display: inline-flex;
  overflow: hidden;
  border: 1px solid #cfd7e3;
  border-radius: 6px;
  background: #fff;
}

.period-option {
  min-width: 62px;
  margin: 0;
  padding: 6px 12px;
  border-right: 1px solid #cfd7e3;
  color: #52616f;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  user-select: none;
}

.period-option:last-child {
  border-right: 0;
}

.period-option input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.period-option.active {
  background: #2f4a73;
  color: #fff;
}

.date-range-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-label {
  color: #26384f;
  font-size: 13px;
  font-weight: 700;
}

.date-input {
  width: 150px;
}

.date-separator {
  color: #6c757d;
}

.search-button {
  min-width: 68px;
}

.chart-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.chart-title-row .card-title {
  margin-bottom: 0;
}

.alert-type-select {
  width: 138px;
  flex: 0 0 138px;
}

.dashboard-summary-row {
  margin-top: 4px;
  margin-bottom: 4px;
}

.summary-box {
  min-height: 178px;
  height: 100%;
  padding: 18px 20px;
  border: 1px solid #2f4a73;
  border-radius: 6px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.summary-title {
  margin-bottom: 16px;
  color: #26384f;
  font-size: 16px;
  font-weight: 700;
}

.summary-title span {
  color: #6c757d;
  font-size: 13px;
  font-weight: 600;
}

.device-status-counts {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 14px;
  padding-top: 10px;
}

.status-count {
  min-width: 64px;
  text-align: center;
}

.status-count strong {
  display: block;
  color: #172b4d;
  font-size: 30px;
  line-height: 1.1;
}

.status-count span {
  display: block;
  margin-top: 7px;
  color: #6c757d;
  font-size: 12px;
  font-weight: 600;
}

.status-divider {
  padding-top: 4px;
  color: #8a96a8;
  font-size: 26px;
  font-weight: 600;
}

.summary-list {
  max-height: 104px;
  overflow-y: auto;
  padding-right: 4px;
}

.summary-list-row {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 0;
  border: 0;
  background: transparent;
  color: #26384f;
  font-size: 14px;
  text-align: left;
}

.summary-list-row strong {
  color: #0d6efd;
  text-decoration: underline;
}

.summary-list-row:hover strong,
.summary-list-row:focus strong {
  color: #084298;
}

.summary-empty,
.summary-muted {
  color: #6c757d;
  font-size: 13px;
}

.summary-empty {
  padding: 22px 0;
  text-align: center;
}

.summary-muted {
  margin-top: 10px;
}

@media (max-width: 575.98px) {
  .dashboard-search-bar {
    align-items: stretch;
  }

  .period-control,
  .date-range-control,
  .search-button {
    width: 100%;
  }

  .period-option {
    flex: 1;
  }

  .date-input {
    flex: 1;
    width: auto;
  }

  .chart-title-row {
    align-items: flex-start;
    flex-direction: column;
  }

  .alert-type-select {
    width: 100%;
    flex-basis: auto;
  }

  .summary-box {
    min-height: auto;
  }

  .device-status-counts {
    gap: 8px;
  }

  .status-count {
    min-width: 54px;
  }

  .status-count strong {
    font-size: 24px;
  }
}
</style>
