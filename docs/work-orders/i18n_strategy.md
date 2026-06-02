# 관리자 프론트 다국어 처리 검토 보고서

## 1. 검토 목적

관리자 프론트(`smdinsole_admin`)에 다국어 처리를 도입하기 위한 구조, 적용 범위, 전환 순서, 위험 요소를 정리한다.

현재 프로젝트는 Vue2 기반이며 화면 문자열이 템플릿, 메뉴 설정, AG Grid 컬럼 정의, alert/confirm 메시지, placeholder 등에 직접 작성되어 있다. 따라서 일괄 치환보다 공통 i18n 레이어를 먼저 도입하고 화면별로 단계 전환하는 방식이 적합하다.

## 2. 현재 상태

### 기술 스택

- Vue 2.7.x
- Vue Router 3.x
- Vuex 3.x
- AG Grid Community
- Bootstrap 5
- 현재 i18n 전용 라이브러리 없음

### 문자열 분포

한글 UI 문자열은 대략 다음 영역에 분산되어 있다.

- `src/menu.js`
- `src/components/common/Header.vue`
- `src/components/common/Footer.vue`
- `src/views/**`
- AG Grid `columnDefs.headerName`
- `alert()`, `confirm()`
- placeholder, select option, 버튼명, 팝업 제목
- 서버 응답 메시지 fallback 문구

현재 기준으로 `src`, `public`, `docs` 내 한글 문자열 검색 결과가 800건 이상 확인된다. 실제 다국어 전환 대상은 `docs`와 주석을 제외하고 화면/메시지 문자열 중심으로 선별해야 한다.

## 3. 권장 방식

### 결론

Vue2 프로젝트이므로 `vue-i18n@8` 도입을 권장한다.

Vue I18n v9는 Vue3 중심이므로 현재 구조에서는 `vue-i18n@8`이 가장 안정적이다.

### 기본 방향

- 한국어를 기본 locale로 둔다.
- 다국어 key는 화면별 namespace로 분리한다.
- 처음부터 모든 문자열을 전환하지 않고 공통 영역과 주요 메뉴부터 단계 적용한다.
- 서버 코드값은 프론트에서 label map을 통해 번역한다.
- 서버 에러 메시지는 가능하면 서버 message code를 받는 구조로 확장한다.

## 4. 권장 디렉터리 구조

```text
src/
  i18n/
    index.js
    ko.js
    en.js
    ja.js
```

초기에는 `ko.js`, `en.js`만 두고, 추가 언어가 필요할 때 파일을 확장한다.

예시:

```javascript
// src/i18n/ko.js
export default {
  common: {
    search: '조회',
    register: '등록',
    update: '수정',
    delete: '삭제',
    cancel: '취소',
    save: '저장',
    totalCount: '총 {count}건',
    pageSize: '페이지당',
    noRows: '조회된 데이터가 없습니다.',
    loading: '조회 중...',
    first: '처음',
    previous: '이전',
    next: '다음',
    last: '마지막',
  },
  menu: {
    dashboard: '대시보드',
    guard: '사용자 관리',
    device: '기기 관리',
    eventDevice: '이벤트 기기',
    orgc: '기관 관리',
    manager: '관리자 관리',
    locationLog: '위치정보 확인',
    accessLog: '접근 기록',
    changeLog: '변경이력',
  },
}
```

```javascript
// src/i18n/en.js
export default {
  common: {
    search: 'Search',
    register: 'Register',
    update: 'Update',
    delete: 'Delete',
    cancel: 'Cancel',
    save: 'Save',
    totalCount: 'Total {count}',
    pageSize: 'Rows',
    noRows: 'No data found.',
    loading: 'Loading...',
    first: 'First',
    previous: 'Prev',
    next: 'Next',
    last: 'Last',
  },
  menu: {
    dashboard: 'Dashboard',
    guard: 'Users',
    device: 'Devices',
    eventDevice: 'Event Devices',
    orgc: 'Organizations',
    manager: 'Admins',
    locationLog: 'Location Logs',
    accessLog: 'Access Logs',
    changeLog: 'Change Logs',
  },
}
```

```javascript
// src/i18n/index.js
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import ko from './ko';
import en from './en';

Vue.use(VueI18n);

const locale = localStorage.getItem('admin_locale') || 'ko';

export default new VueI18n({
  locale,
  fallbackLocale: 'ko',
  silentFallbackWarn: true,
  messages: {
    ko,
    en,
  },
});
```

`src/main.js`에는 다음처럼 연결한다.

```javascript
import i18n from './i18n';

new Vue({
  store,
  router,
  i18n,
  render: h => h(App),
}).$mount('#app');
```

## 5. 적용 대상별 처리 방안

### 5.1 메뉴

현재 `src/menu.js`는 `menuName`에 한글을 직접 가진다.

권장:

- `menuName`은 기존 호환을 위해 유지한다.
- `i18nKey`를 추가한다.
- Header, route meta title 표시 시 `i18nKey`가 있으면 `$t(i18nKey)`를 사용한다.

예시:

```javascript
{
  menuId: 'Guard',
  menuName: '사용자 관리',
  i18nKey: 'menu.guard',
  componentName: 'GuardManager',
  pagePath: 'views/guard',
  url: '/guard'
}
```

라우트 생성 시:

```javascript
meta.title = el.i18nKey || el.menuName;
```

화면 표시 시:

```vue
{{ $te($route.meta.title) ? $t($route.meta.title) : $route.meta.title }}
```

### 5.2 Header

현재 Header는 메뉴 텍스트를 직접 작성한다.

권장:

- 1차로 직접 `$t('menu.xxx')` 적용
- 2차로 `menu.js` 기반 동적 렌더링 검토

예시:

```vue
{{ $t('menu.guard') }}
```

### 5.3 공통 버튼/페이징/그리드 문구

여러 화면에서 반복되는 문구는 `common` namespace로 이동한다.

대상:

- 조회
- 등록
- 수정
- 삭제
- 취소
- 총 N건
- 페이지당
- 처음/이전/다음/마지막
- 조회된 데이터가 없습니다.
- 조회 중...

AG Grid overlay:

```javascript
overlayNoRowsTemplate() {
  return `<span class="text-muted">${this.$t('common.noRows')}</span>`;
}
```

단, 현재 `overlayNoRowsTemplate`은 data 문자열로 선언되어 있어 locale 변경 시 자동 갱신되지 않는다. locale 변경을 즉시 반영하려면 computed 또는 method에서 생성해야 한다.

### 5.4 AG Grid 컬럼명

현재 각 화면의 `columnDefs.headerName`에 한글이 직접 들어가 있다.

권장:

- `columnDefs`를 `computed`로 이동하거나 `buildColumnDefs()` method로 생성한다.
- locale 변경 시 컬럼명이 갱신되도록 `this.$t()`를 사용한다.

예시:

```javascript
computed: {
  columnDefs() {
    return [
      { headerName: this.$t('device.columns.imei'), field: 'deviceIMEI' },
      { headerName: this.$t('device.columns.orgcName'), field: 'orgcName' },
    ];
  }
}
```

AG Grid가 locale 변경을 즉시 반영하지 않는 경우:

```javascript
this.gridApi.setColumnDefs(this.columnDefs);
this.gridApi.refreshHeader();
```

### 5.5 alert/confirm/message

현재 `alert()`와 `confirm()` 문자열이 많다.

권장:

- 단기: `alert(this.$t('message.xxx'))`
- 중기: 공통 메시지 함수 도입
- 장기: 브라우저 기본 alert/confirm 대신 프로젝트 공통 modal/toast로 통일

예시:

```javascript
if(confirm(this.$t('message.confirmDelete'))) {
  ...
}
```

서버 오류 fallback:

```javascript
alert(e.response?.data?.message || this.$t('message.saveFailed'));
```

주의:

- 서버가 이미 한국어 message를 내려주는 경우 프론트에서 번역할 수 없다.
- 다국어 완성도를 높이려면 서버가 `messageCode`와 `messageArgs`를 내려주고 프론트가 번역하는 구조가 필요하다.

### 5.6 코드값 라벨

상태값, 유형값, 성공 여부 등은 코드와 표시명을 분리해야 한다.

예시:

```javascript
managerStatus: {
  locked: '잠김',
  normal: '정상',
}
```

렌더러:

```javascript
statusRenderer(params) {
  return params.value === 'Y'
    ? this.$t('status.locked')
    : this.$t('status.normal');
}
```

### 5.7 날짜/숫자/전화번호

현재 날짜 포맷은 `utils.convertFromStrToDate`, `utils.dateForm` 중심이다.

권장:

- 날짜 포맷은 locale별 정책을 정한다.
- 한국어: `YYYY-MM-DD HH:mm:ss`
- 영어: `MM/DD/YYYY HH:mm:ss` 또는 운영 정책에 맞춘 ISO 계열
- 전화번호는 국가별 형식이 필요하므로 단순 번역 대상이 아니다.

초기에는 날짜 포맷 변경보다 문자열 다국어 처리를 우선한다.

## 6. 언어 선택 UI

권장 위치:

- Header 우측 로그아웃 버튼 근처

예시:

```vue
<select v-model="$i18n.locale" @change="changeLocale">
  <option value="ko">KO</option>
  <option value="en">EN</option>
</select>
```

```javascript
changeLocale() {
  localStorage.setItem('admin_locale', this.$i18n.locale);
  document.documentElement.lang = this.$i18n.locale;
}
```

초기 언어 선택 기준:

1. localStorage `admin_locale`
2. 브라우저 언어
3. 기본값 `ko`

관리자별 언어 저장이 필요하면 추후 서버 프로필 설정과 연동한다.

## 7. 단계별 전환 계획

### 1단계: 기반 도입

- `vue-i18n@8` 설치
- `src/i18n/index.js`, `ko.js`, `en.js` 추가
- `main.js`에 i18n 연결
- locale 저장/복원 구조 추가
- Header에 언어 선택 UI 추가

### 2단계: 공통 영역 전환

- Header 메뉴
- 공통 버튼
- 페이징 문구
- 그리드 no rows/loading 문구
- 공통 alert/confirm 메시지 일부

### 3단계: 주요 목록 화면 전환

우선순위:

1. 로그인 화면
2. 기기 관리
3. 사용자 관리
4. 관리자 관리
5. 접근 기록/변경 이력

각 화면에서 전환할 항목:

- 제목/설명
- 검색조건 label/placeholder
- 버튼
- AG Grid 컬럼명
- select option label
- alert/confirm

### 4단계: 팝업 화면 전환

- `DevicePopup.vue`
- `GuardPopup.vue`
- `AdminManagerPopup.vue`
- `OrgcPopup.vue`
- `DeviceFotaPopup.vue`
- `EventDevicePopup.vue`

팝업은 입력 검증 메시지와 confirm이 많으므로 화면 단위로 처리한다.

### 5단계: 서버 메시지 연동

- 서버 응답 message를 그대로 노출하는 부분 정리
- 가능하면 서버에서 `messageCode`, `messageArgs` 제공
- 프론트는 code 기반으로 `$t()` 처리

## 8. 번역 key 네이밍 규칙

권장 규칙:

```text
common.search
common.save
menu.device
device.title
device.search.imei
device.columns.imei
device.message.saved
guard.popup.notice.saved
admin.columns.lockType
accessLog.tabs.login
changeLog.detail.title
```

규칙:

- 화면 단위 namespace 사용
- 공통 문구는 `common`
- 메뉴는 `menu`
- 코드값 label은 `code`
- 메시지는 `message` 또는 화면 하위 `message`
- key에는 한국어 발음을 사용하지 않는다.

## 9. 구현 시 주의 사항

### Vue2 반응성

객체에 없는 key를 나중에 추가하면 반응성이 깨질 수 있다. i18n 메시지는 초기 파일에 key를 선언해두는 방식이 안전하다.

### AG Grid

AG Grid `columnDefs`는 data에 고정하면 locale 변경 시 자동 갱신되지 않는다. computed 또는 locale watcher로 재설정해야 한다.

### 동적 라우트

현재 라우트는 `src/app.js`에서 `menu.js`를 기반으로 동적으로 생성한다. `meta.title`에는 번역된 문자열보다 i18n key를 넣는 것이 좋다.

### 서버 메시지

서버가 한국어 문장만 내려주면 프론트 다국어 처리가 불완전해진다. 서버와 협의해 message code 기반 응답을 도입해야 한다.

### 레이아웃

영문은 한글보다 길어질 수 있다. 버튼, 탭, 테이블 컬럼, Header 메뉴는 overflow를 확인해야 한다.

특히 Header는 메뉴 수가 많고 고정 폭 logo 영역이 있어 영어 적용 시 줄바꿈 또는 overflow 가능성이 있다.

## 10. 예상 영향 파일

초기 기반 도입:

- `package.json`
- `package-lock.json`
- `src/main.js`
- `src/i18n/index.js`
- `src/i18n/ko.js`
- `src/i18n/en.js`
- `src/components/common/Header.vue`
- `src/menu.js`

주요 화면 전환:

- `src/views/login/AdminLogin.vue`
- `src/views/device/DeviceManager.vue`
- `src/views/guard/GuardManager.vue`
- `src/views/guard/GuardPopup.vue`
- `src/views/event/EventDeviceManager.vue`
- `src/views/orgc/OrgcManager.vue`
- `src/views/manage/AdminManager.vue`
- `src/views/manage/LocationLog.vue`
- `src/views/manage/LoginLog.vue`
- `src/views/manage/ChangeLog.vue`

## 11. 검증 기준

- 기본 locale `ko`에서 기존 화면 문구가 동일하게 표시된다.
- locale을 `en`으로 변경하면 Header, 메뉴, 공통 버튼, 주요 화면 제목이 즉시 변경된다.
- 새로고침 후 선택한 locale이 유지된다.
- AG Grid 컬럼명과 overlay 문구가 locale 변경 후 갱신된다.
- alert/confirm 주요 메시지가 선택 locale로 표시된다.
- 로그인 전 화면에서도 locale 선택/유지가 정상 동작한다.
- 빌드가 성공한다.

## 12. 권장 결론

단기적으로는 전체 화면을 한 번에 바꾸기보다 `vue-i18n@8` 기반을 먼저 도입하고, 공통 영역과 신규/수정 빈도가 높은 화면부터 단계적으로 전환하는 것이 적절하다.

권장 1차 적용 범위:

- i18n 기반 설치
- Header 메뉴
- 공통 버튼/페이징 문구
- 로그인 화면
- AG Grid 공통 overlay 문구

이 범위가 안정화되면 기기 관리, 사용자 관리, 관리자 관리, 접근 기록 순서로 확장한다.
