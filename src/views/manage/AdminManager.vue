<template>
  <main class="container-fluid">
    <h4 class="my-4 ps-3">
      <i class="bi bi-calendar2-check"></i> 관리자 관리
      <small class="text-muted fs-6">관리자의 정보를 등록 및 수정 할 수 있습니다.</small>
    </h4>

    <section class="section dashboard">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body pb-0">
              <div class="row my-1 align-items-center">

                <div class="col-auto d-flex align-items-center pe-4">
                  <label for="UserName" class="col-form-label flex-shrink-0 pe-2">관리자명</label>
                  <input v-model="search.mgrName" type="text" id="UserName" class="form-control" style="width: 135px;">
                </div>

                <div class="col-auto d-flex align-items-center pe-4">
                  <label for="UserPhone" class="col-form-label flex-shrink-0 pe-2">이메일</label>
                  <input v-model="search.mgrId" type="text" id="UserPhone" class="form-control" style="width: 180px;">
                </div>

                <div class="col-auto d-flex align-items-center">
                  <label for="inputDate" class="col-form-label flex-shrink-0 pe-2">날짜선택</label>
                  <input v-model="search.lastLoginDate" type="date" id="inputDate" class="form-control" style="width: 150px;">
                </div>

                <div class="col-auto ms-auto">
                  <button class="btn btn-secondary" @click="selectManagerList">
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
                <button class="btn btn-primary mt-2 ms-1" @click="appendGuard">관리자 등록</button>
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
  name: "AdminManager",
  data() {
    return {
      datatable:'',
      search: {
        mgrdName:'',
        mgrId:'',
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
          // 구분
          select: 1,
          render: function(data, cell, row) {
            const statusMap = {
              'ROLE_SADMIN': '<span class="badge bg-success">SA</span>',
              'ROLE_ADMIN': '<span class="badge bg-secondary">A</span>',
            };
            return statusMap[data] || data;
          }
        },
        {
          // ID
          select: 2,
          scope: 'row',
          render: function (data, cell, row) {
            // guardNo 위치가 데이터 구조에 따라 다를 수 있으니 확인 필요 (보통 row.data[0] 등)
            const mgrNo = row.cells[0].data;
            return `<a href="#" onclick="handleRowClick(${mgrNo})">${data}</a>`;
          }
        },
        { select: 3, scope: 'row' }, // 이름
        { select: 4, scope: 'row' }, // 소속
        {
          // 5: 마지막 로그인
          select: 5,
          render: (data) => {
            return data ? utils.convertFromStrToDate(data) : '-';
          }
        },
        {
          // 6: 잠김 상태
          select: 6,
          render: function(data, cell, row) {
            // data 변수가 'Y' 또는 'N' 값을 가지고 있다고 가정 (row.isLocked 등 상황에 맞춰 조정)
            if (data === 'Y') {
              // 잠금 상태(Y)일 때: 해제 버튼 노출
              const mgrNo = row.cells[0].data;
              return `
                <button type="button" class="btn btn-sm btn-outline-primary"
                        onclick="unlockManager(${mgrNo})">
                    <i class="bi bi-unlock"></i> 잠금해제
                </button>
            `;
            } else {
              // 정상 상태(N)일 때: 활성 또는 정상 텍스트/배지 노출
              return '<span class="badge bg-success">정상</span>';
            }
          }
        },
        {
          // 7: 비밀번호 초기화
          select: 7,
          render: function(data, cell, row) {
              // 잠금 상태(Y)일 때: 해제 버튼 노출
              const mgrNo = row.cells[0].data;
              return `
                <button type="button" class="btn btn-sm btn-outline-primary"
                        onclick="initManagerPwd(${mgrNo})">
                    <i class="bi bi-unlock"></i> 초기화
                </button>
            `;
          }
        }
      ],
      headings:["No", "구분", "이메일(ID)", "이름", "소속", "마지막 로그인", "상태", "비밀번호 초기화"],
    }
  },
  mounted() {
    this.selectManagerList();

    window.handleRowClick = (index) => {
      this.openManager(index);
    };
  },
  methods: {
    openManager(mgrNo) {
      const url = `/manageerpopup?mgrNo=${mgrNo}`;
      const name = "관리자 수정";
      const style = "width=700,height=500,left=0,top=0";
      this.$open(url, name, style);
    },
    appendGuard(){
      const url = '/manageerpopup';
      const name = "관리자 추가";
      const style = "width=650,height=500,left=0,top=0";
      this.$open(url, name, style);
    },
    telForm(data) {
      return utils.telForm(data, 1);
    },
    async selectManagerList() {
      const param = structuredClone(this.search);
      param.lastLoginDate = param.lastLoginDate.replace(/-/g, '');
      const res = await api.selManagerListByAdmin(param);
      if(res.data.status === "SUCCESS") {
        // let dataList = res.data.data;

        const dataList = res.data.data.map(item => [
          item.MGR_NO,               // 0: No
          item.MGR_TYPE,             // 1: 구분 (JSON의 MGR_TYPE 사용)
          item.MGR_ID,               // 2: 이메일(ID)
          item.MGR_NAME,             // 3: 이름
          item.NATION,               // 4: 소속
          item.LAST_LOGIN_DATE,      // 5: 마지막 로그인
          item.IS_LOCKED,            // 6: 상태(Y/N)
          ""                         // 7: 버튼 자리
        ]);
        console.log(dataList);
        this.datatable = this.$datatable(this.datatable, this.headings, dataList, this.columns)
      }
    },

    async unlockManager(mgrNo) {
      if(confirm("잠금 해제 하시겠습니까?")) {
        const res = await api.unlockManager(mgrNo);
        if (res.data.status === "SUCCESS") {
          this.selectManagerList();
        }
      }
    },

    async initManagerPwd(mgrNo) {
      if(confirm("비밀번호를 초기화 하시겠습니까?")) {
        const res = await api.initManagerPwd(mgrNo);
        if (res.data.status === "SUCCESS") {
          alert("비밀번호가 초기화 되었습니다.")
        }
      }
    },

    async allList() {
      this.search.mgrId = ""
      this.search.mgrName = ""
      this.search.lastLoginDate = ""
      this.selectManagerList()
    }
  },
  created() {
    // 팝업창에서 selectDeviceList 를 호출하기 위한 설정
    window.vueComponent = this;
    window.unlockManager = this.unlockManager;
    window.initManagerPwd = this.initManagerPwd;
  },
  unmounted() {
    delete window.unlockManager;
    delete window.initManagerPwd;
  }
}
</script>

<style scoped>

</style>