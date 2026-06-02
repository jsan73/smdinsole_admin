# AG Grid 작업 규칙

## 적용 대상
- Vue2 Options API 화면에서 AG Grid를 사용하는 목록 화면
- 현재 기준 구현 예시: `src/views/device/DeviceManager.vue`

## 기본 구성
- AG Grid는 `@ag-grid-community/vue`와 `ClientSideRowModelModule`을 사용한다.
- `rowData`에는 반드시 배열만 전달한다.
- API 응답이 배열이 아닐 수 있으므로, 화면 컴포넌트에서 배열 추출 함수를 두고 방어적으로 처리한다.
- 그리드 기본 pagination 패널은 숨기고 커스텀 pagination UI를 사용한다.

```vue
<ag-grid-vue
    class="ag-theme-alpine device-grid"
    :modules="gridModules"
    :columnDefs="columnDefs"
    :rowData="list"
    :defaultColDef="defaultColDef"
    :pagination="true"
    :paginationPageSize="paginationPageSize"
    :suppressPaginationPanel="true"
    @grid-ready="onGridReady"
    @pagination-changed="onPaginationChanged"
/>
```

## 데이터 처리
- API 조회 파라미터는 원본 검색 객체를 직접 수정하지 말고 복사해서 만든다.
- 전화번호처럼 포맷 제거가 필요한 값은 복사본에서 변환한다.
- AG Grid의 `rowData.map is not a function` 오류를 막기 위해 `rowData` 할당 전 배열 여부를 확인한다.

```js
toRows(data) {
  if(Array.isArray(data)) return data;
  if(!data || typeof data !== "object") return [];

  const rowKeys = ["list", "rows", "items", "content", "deviceList"];
  const rows = rowKeys.map(key => data[key]).find(Array.isArray);
  return rows || [];
}
```

## Pagination UI
- 그리드 상단에는 전체 건수와 페이지당 size 선택을 배치한다.
- 그리드 하단에는 직접 클릭 가능한 페이지 번호를 배치한다.
- 페이지 번호는 10개 단위로 노출한다.
- 페이지 size 옵션은 기본적으로 `10 / 20 / 50 / 100`을 사용한다.
- 페이지 size 변경 시 첫 페이지로 이동한다.
- AG Grid v31 기준으로 page size 변경은 `setGridOption("paginationPageSize", size)`를 사용한다.

상단 툴바:
```vue
<div class="grid-toolbar">
  <div class="grid-total-count">총 {{ totalRows }}건</div>
  <div class="grid-page-size">
    <label for="pageSize" class="form-label mb-0">페이지당</label>
    <select
        id="pageSize"
        v-model.number="paginationPageSize"
        class="form-select form-select-sm"
        @change="onPageSizeChange"
    >
      <option v-for="size in pageSizeOptions" :key="size" :value="size">
        {{ size }}개
      </option>
    </select>
  </div>
</div>
```

하단 페이지 이동:
```vue
<div class="grid-pagination-wrap">
  <div v-if="totalPages > 1" class="grid-pagination">
    <button type="button" class="btn btn-sm btn-outline-secondary" @click="goToPage(1)">처음</button>
    <button
        v-for="page in paginationPages"
        :key="page"
        type="button"
        class="btn btn-sm"
        :class="page === currentPage ? 'btn-primary' : 'btn-outline-secondary'"
        @click="goToPage(page)"
    >
      {{ page }}
    </button>
    <button type="button" class="btn btn-sm btn-outline-secondary" @click="goToPage(totalPages)">마지막</button>
  </div>
</div>
```

Pagination 상태:
```js
data() {
  return {
    paginationPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    currentPage: 1,
    totalPages: 0,
    totalRows: 0,
  }
},
computed: {
  paginationPages() {
    const pageCount = 10;
    const start = Math.floor((this.currentPage - 1) / pageCount) * pageCount + 1;
    const end = Math.min(start + pageCount - 1, this.totalPages);
    const pages = [];

    for(let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    return pages;
  },
},
methods: {
  onGridReady(params) {
    this.gridApi = params.api;
    this.updatePaginationState();
  },
  onPaginationChanged() {
    this.updatePaginationState();
  },
  updatePaginationState() {
    if(!this.gridApi) {
      this.totalRows = this.list.length;
      return;
    }

    this.totalRows = this.gridApi.paginationGetRowCount();
    this.totalPages = this.gridApi.paginationGetTotalPages();
    this.currentPage = this.totalPages === 0 ? 1 : this.gridApi.paginationGetCurrentPage() + 1;
  },
  onPageSizeChange() {
    if(!this.gridApi) return;

    this.gridApi.setGridOption("paginationPageSize", this.paginationPageSize);
    this.gridApi.paginationGoToFirstPage();
    this.updatePaginationState();
  },
  goToPage(page) {
    if(!this.gridApi || page < 1 || page > this.totalPages || page === this.currentPage) return;

    this.gridApi.paginationGoToPage(page - 1);
    this.updatePaginationState();
  },
}
```

## 스타일 기준
- 그리드 상단 툴바는 `총 건수`를 왼쪽, `페이지당 size`를 오른쪽에 둔다.
- 페이지 번호 버튼은 그리드 하단 중앙에 둔다.
- Bootstrap 버튼과 form-select 클래스를 우선 사용한다.
- 그리드 높이는 화면별 요구가 없으면 명시적으로 지정한다.

```css
.device-grid {
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

.grid-pagination-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 12px;
}
```

## 검증
- 변경 후 최소한 대상 Vue 파일을 eslint로 확인한다.

```sh
npx eslint src/views/device/DeviceManager.vue
```

- 전체 `npm run lint`는 기존 프로젝트 lint 오류가 있을 수 있으므로, 실패 시 대상 파일 검증 결과와 전체 실패 원인을 구분해서 보고한다.
