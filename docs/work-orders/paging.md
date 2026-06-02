# 서버 페이징 작업 지시

1. 서버 페이징이 가능한 그리드 추천 및 교체 (무료기반)
2. 수정 되어야 할 API 목록 작성
3. 현재 그리드의 상태 및 요구사항 분석 및 기능 반영이 되어야 함
4. 페이징 처리에 필요한 컬럼 및 필터링 기능 추가

## AG Grid 전환 작업 히스토리

작업일: 2026-05-23

### 공통 적용 사항

- 기존 `$datatable` 기반 목록을 AG Grid Community 기반 목록으로 교체했다.
- AG Grid 패키지는 기존 의존성인 `@ag-grid-community/vue`, `@ag-grid-community/client-side-row-model`, `@ag-grid-community/styles`를 사용했다.
- Vue2 Options API 구조를 유지했다.
- AG Grid 기본 pagination 패널은 숨기고 커스텀 pagination UI를 사용했다.
- 그리드 상단에는 `총 N건`과 `페이지당 10 / 20 / 50 / 100개` 선택을 배치했다.
- 그리드 하단에는 직접 클릭 가능한 페이지 번호를 배치했다.
- 페이지 번호는 10개 단위로 노출하도록 구현했다.
- page size 변경 시 AG Grid v31 권장 방식인 `gridApi.setGridOption("paginationPageSize", size)`를 사용하고 첫 페이지로 이동하도록 했다.
- API 응답이 배열 또는 wrapper 객체여도 `rowData`에는 배열만 들어가도록 `toRows` 계열 방어 함수를 추가했다.
- 검색 파라미터는 가능한 원본 `search` 객체를 직접 변경하지 않고 복사본으로 전송하도록 정리했다.
- 그리드 상세 규칙은 `docs/grid_rule.md`에 별도 정리했다.

### 작업 파일

#### 기기 관리

- 파일: `src/views/device/DeviceManager.vue`
- 작업 내용:
  - 기존 datatable을 AG Grid로 교체했다.
  - 기기 목록 API 응답을 배열로 정규화하는 `toDeviceRows`를 추가했다.
  - IMEI 클릭 시 기존 기기 수정 팝업을 열도록 유지했다.
  - 마지막 신호, 전화번호, 날짜, 상태 렌더링을 AG Grid formatter/renderer로 이전했다.
  - `rowData.map is not a function` 오류를 방지하도록 `rowData` 배열 보장을 추가했다.

#### 사용자 관리

- 파일: `src/views/guard/GuardManager.vue`
- 작업 내용:
  - 기존 datatable을 AG Grid로 교체했다.
  - 전화번호(ID) 클릭 시 사용자 수정 팝업을 열도록 유지했다.
  - 사용자 유형, 마지막 접속일, 계정 상태 렌더링을 AG Grid formatter/renderer로 이전했다.
  - 배열 row와 객체 row를 모두 처리할 수 있도록 getter를 추가했다.

#### 이벤트 기기

- 파일: `src/views/event/EventDeviceManager.vue`
- 작업 내용:
  - 기존 datatable을 AG Grid로 교체했다.
  - IMEI 클릭 시 이벤트 리스트 팝업을 열도록 유지했다.
  - 안심존 이탈, 이상 이동, 이상 전송, 전화번호, 날짜, 마지막 신호 컬럼을 AG Grid 컬럼으로 이전했다.
  - 검색 조건의 `iccId` 바인딩 누락을 보완했다.

#### 기관 관리

- 파일: `src/views/orgc/OrgcManager.vue`
- 작업 내용:
  - 기존 datatable을 AG Grid로 교체했다.
  - 기관명 클릭 시 기관 수정 팝업을 열도록 유지했다.
  - 기관명 컬럼이 기존 `orgcNo,orgcName` 문자열 형태인 경우도 처리하도록 방어 로직을 추가했다.
  - 전화번호 formatter를 유지했다.

#### 관리자 관리

- 파일: `src/views/manage/AdminManager.vue`
- 작업 내용:
  - 기존 datatable을 AG Grid로 교체했다.
  - 이메일(ID) 클릭 시 관리자 수정 팝업을 열도록 유지했다.
  - 관리자 구분 배지, 마지막 로그인 날짜, 상태, 비밀번호 초기화 컬럼을 AG Grid renderer/formatter로 이전했다.
  - 잠금해제와 비밀번호 초기화 버튼 동작을 cellRenderer 이벤트로 유지했다.

#### 위치정보 확인

- 파일: `src/views/manage/LocationLog.vue`
- 작업 내용:
  - 기존 datatable을 AG Grid로 교체했다.
  - 대상 기기, 요청 서비스, 요청자, 수집 방법, 수집 요청 시간, 수집 종료 시간 컬럼을 AG Grid 컬럼으로 이전했다.
  - 날짜 검색 파라미터는 복사본에 `yyyyMMddHHmmss` 형태로 구성하도록 변경했다.

#### 접근기록 확인

- 파일: `src/views/manage/LoginLog.vue`
- 작업 내용:
  - 기존 datatable을 AG Grid로 교체했다.
  - 로그인 계정, 로그인 IP, 접속 시간 컬럼을 AG Grid 컬럼으로 이전했다.
  - 날짜 검색 파라미터는 복사본에 `yyyyMMddHHmmss` 형태로 구성하도록 변경했다.

### 검증 기록

- `npx eslint src/views/device/DeviceManager.vue` 통과
- `npx eslint src/views/guard/GuardManager.vue` 통과
- `npx eslint src/views/event/EventDeviceManager.vue` 통과
- `npx eslint src/views/orgc/OrgcManager.vue src/views/manage/AdminManager.vue src/views/manage/LocationLog.vue src/views/manage/LoginLog.vue` 통과

### 참고 사항

- 전체 `npm run lint`는 프로젝트 내 기존 lint 오류가 남아 있어 전체 통과 기준으로는 확인하지 못했다.
- 2026-05-23 추가 작업으로 주요 AG Grid 목록은 서버 페이징 기준으로 전환했다.
- 서버 페이징 화면은 API 요청에 `pageNum`, `pageSize`, `pageStart`를 포함하고, 응답의 `totalCount`로 전체 페이지를 계산한다.

## 2026-05-23 서버 페이징 전환

### 대상

- `src/views/device/DeviceManager.vue`
- `src/views/guard/GuardManager.vue`
- `src/views/event/EventDeviceManager.vue`
- `src/views/orgc/OrgcManager.vue`
- `src/views/manage/AdminManager.vue`
- `src/views/manage/LocationLog.vue`

### 변경 내용

- AG Grid 내부 pagination을 비활성화하고 서버 응답 row만 화면에 표시하도록 변경했다.
- 페이지 번호 클릭, 이전/다음/처음/마지막 클릭 시 서버 API를 다시 조회하도록 변경했다.
- 페이지당 건수 변경 시 1페이지부터 서버 API를 다시 조회하도록 변경했다.
- 조회 파라미터에 `pageNum`, `pageSize`, `pageStart`를 추가했다.
- No 컬럼은 현재 서버 페이지 기준 offset을 반영해 계산하도록 변경했다.
- 검색 조건 변경이나 조회 버튼 실행 시 1페이지부터 다시 조회하도록 정리했다.

### 검증 기록

- `npx eslint src/views/device/DeviceManager.vue src/views/guard/GuardManager.vue src/views/event/EventDeviceManager.vue src/views/orgc/OrgcManager.vue src/views/manage/AdminManager.vue src/views/manage/LocationLog.vue src/views/manage/LoginLog.vue src/views/manage/ChangeLog.vue` 통과
- `npm run build` 통과

### 참고 사항

- 서버 응답에 `totalCount`가 없으면 현재 페이지 row 수를 총 건수로 fallback한다.
- 정확한 페이지 버튼 표시를 위해 각 목록 API는 `totalCount`를 내려줘야 한다.

## 2026-05-29 이벤트 기기 이벤트 컬럼 표시 보완

### 대상

- `src/views/event/EventDeviceManager.vue`

### 변경 내용

- 이벤트 기기 리스트의 안심존 이탈, 이상 이동, 이상 전송 컬럼 getter에 백엔드 실제 응답 필드인 `DANGER_YN`, `OUT_DISTANCE_YN`, `NEAR_SIGNAL_YN`을 추가했다.
- 모델 직렬화 방식 변경 가능성을 고려해 `dangerYn`, `outDistanceYn`, `nearSignalYn`도 함께 fallback 키로 유지했다.

### 원인

- 화면은 `SAFE_ZONE_EXIT`, `ABNORMAL_MOVE`, `ABNORMAL_SEND`를 우선 조회했지만, 백엔드 `/api/admin/device/evntlist` 쿼리는 `DANGER_YN`, `OUT_DISTANCE_YN`, `NEAR_SIGNAL_YN`을 반환하고 있어 객체 응답에서 해당 컬럼 값이 비어 보였다.
