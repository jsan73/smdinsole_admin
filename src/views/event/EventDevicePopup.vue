<template>
  <div class="m-4">
    <h5 class="pb-2">
      <i class="bi bi-caret-right-square"></i> {{popupTitle}}</h5>


      <div class="card-body pb-0">
        <table class="table table-sm table-bordered">
          <tbody>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col" width="28%">IMEI</th>
            <td class="text-center align-middle">{{deviceIMEI}}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="row">
        <div class="col-lg-12">
          <!-- 목록 테이블 -->
          <div class="card dataTableStyle overflow-auto">
            <div class="card-body">
              <table class="table table-borderless datatable " ref="datatable"></table>
            </div>
          </div><!--// 목록 테이블 -->

        </div>
      </div>


    <p class="text-end">
      <button class="btn btn-primary mb-1 ms-1"  @click="close">닫기</button>
    </p>
  </div>

</template>

<script>
import api from '@/api/api';
import utils from "@/utils/utils";

export default {
  name: "EventDDevicePopup",
  data() {
    return {
      datatable:'',

      popupTitle: '기기 이벤트 리스트',

      columns:[
        {select:0, render: function(data, cell, row) {
            return row.dataIndex + 1
          }
        },
        {select:1, scope:'row', render: function(data){
            let event = data.split(",")
            let eventName = "";
            if(event[0] === "Y") eventName += "안심존 이탈 "
            if(event[1] === "Y") eventName += "이상 이동 "
            if(event[2] === "Y") eventName += "이상 전송"

            return eventName
          }
        },
        {select:2, scope:'row'},
        {select:3, scope:'row', render: this.dateForm},
        {select:4, type: "number", render: function (data) {
            return `<a href="#" onclick="handleRowClick(${data})">삭제</a>`;
        }}
      ],
      headings:["No", "이벤트", "lOG", "발생 시간", "삭제"]
    }
  },


  mounted() {
    this.deviceIMEI = this.$route.query.device;
    this.getEventLogList()

    window.handleRowClick = (index) => {
      this.delEventLog(index);
    };
  },
  methods: {
    close() {
      window.close()
    },
    dateForm(data) {
      return utils.convertFromStrToDate(data);
    },
    delEventLog(locationNo) {
      if(confirm("삭제 하시겠습니까?")) {
        api.delEventLog(locationNo).then(res => {
          if(res.data.status === "SUCCESS") {
            alert("삭제 되었습니다.");
            this.getEventLogList();
          }
        });

      }
    },
    async getEventLogList() {

        let res = await api.selEventLogList(this.deviceIMEI);
        if(res.data.status === "SUCCESS") {
          let dataList = res.data.data;
          let options = {searchable : false, paging : true}
          this.datatable = this.$datatable(this.datatable, this.headings, dataList, this.columns, options )
          // this.datatable.options.searchable  = false;
          console.log(this.datatable.options)
        }
    },

    delDevice() {
      if(confirm("삭제 하시겠습니까?")) {
        api.delDevice(this.deviceIMEI).then(res => {
          if(res.data.status === "SUCCESS") {
            alert("삭제 되었습니다.")
            window.opener.vueComponent.selectDeviceList();
            window.close();
          }
        });

      }
    },


  },
  created(){
    // 팝업창에서 selectDeviceList 를 호출하기 위한 설정
    // window.vueComponent = this;
    this.deviceIMEI = this.$route.query.device;
  }

}
</script>

<style scoped>

</style>