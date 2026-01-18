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
                  <button class="btn btn-secondary" @click="selectGuardList">
                    <i class="bi bi-search"></i> 조회
                  </button>
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
      // ... 기존 코드 (data 리턴 문 안의 columns 부분 수정)
      columns: [
        {
          select: 0,
          render: function(data, cell, row) {
            return row.dataIndex + 1;
          }
        },
        {
          select: 1,
          scope: 'row',
          render: function (data, cell, row) {
            // guardNo 위치가 데이터 구조에 따라 다를 수 있으니 확인 필요 (보통 row.data[0] 등)
            let guardNo = row.cells[0].data;
            return `<a href="#" onclick="handleRowClick(${guardNo})">${utils.telForm(data, 1)}</a>`;
          }
        },
        { select: 2, scope: 'row' }, // 사용자명
        { select: 3, scope: 'row' }, // 이메일
        {
          // 4: 사용자 유형
          select: 4,
          render: function(data, cell, row) {
            if (!data) return "-";
            // 데이터가 "1,2" 형태거나 [1, 2] 배열인 경우를 모두 고려
            const types = String(data).split(',');
            let result = [];
            if (types.includes('1')) result.push("대표");
            if (types.includes('2')) result.push("추가");
            return result.join(', ');
          }
        },
        { select: 5, scope: 'row' }, // 연결 기기 수
        {
          // 6: 마지막 접속일
          select: 6,
          render: (data) => {
            // dateForm이 utils에 정의되어 있다고 가정
            return utils.dateForm(data);
          }
        },
        {
          // 7: 계정상태
          select: 7,
          render: function(data) {
            const statusMap = {
              'N': '<span class="badge bg-success">정상</span>',
              'H': '<span class="badge bg-secondary">휴면</span>',
              'S': '<span class="badge bg-danger">정지(제재)</span>',
              'D': '<span class="badge bg-dark">탈퇴</span>'
            };
            return statusMap[data] || data;
          }
        }
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
      const style = "width=700,height=500,left=0,top=0";
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