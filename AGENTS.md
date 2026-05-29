# Codex 작업 지침

## 프로젝트 개요
- Vue2 기반 관리자 프론트엔드 프로젝트다.
- 인솔 디바이스, 사용자, 기관, 관리자, 이벤트, 로그를 관리하는 서비스다.
- 상태관리: Vuex 3
- 라우팅: Vue Router 3, history mode
- API 통신: axios 래퍼(`src/api/http.js`)와 API 모듈(`src/api/api.js`)
- UI/스타일: Bootstrap 5, Bootstrap Icons, 프로젝트 공통 CSS(`public/static/css/admin_style.css`)
- 주요 목록 UI: AG Grid Community v31
- 차트: ECharts / vue-echarts
- Vue 버전은 2.7.x이며, 화면 컴포넌트는 Vue2 Options API 기준으로 작성한다.

## Codex 기본 규칙
1. 수정 전 관련 파일을 먼저 분석한다.
2. 기존 코드 스타일, 들여쓰기, 네이밍, 한글 문구 톤을 유지한다.
3. Vue2 Options API 기준으로 작성한다.
4. Vue3 Composition API 문법을 사용하지 않는다.
5. 임의로 패키지를 추가하지 않는다.
6. 변경 후 영향 파일 목록과 검증 결과를 정리한다.
7. 가능하면 `npm run lint` / `npm run build` 기준으로 검증한다.
8. 전체 lint/build가 기존 오류로 실패하면, 대상 파일 검증 결과와 전체 실패 원인을 구분해 보고한다.
9. 사용자가 명시적으로 수정을 요청한 경우에는 해당 요청을 수정 승인으로 보고 진행한다.
10. 요청 범위를 넘어선 리팩터링, 스타일 개편, 공통 구조 변경은 먼저 확인한다.

## 주요 폴더
- `src/views`: 화면 컴포넌트
- `src/components`: 공통 컴포넌트와 레이아웃 등록
- `src/store`: Vuex store
- `src/router`: Vue Router 설정
- `src/api`: API 호출 모듈
- `src/utils`: 공통 유틸과 mixin
- `src/assets/js`: 전역 util 플러그인
- `public/static/css`: 프로젝트 공통 CSS
- `public/assets/vendor`: 외부 vendor 정적 파일
- `docs`: 작업 규칙과 작업 기록
- `docs/work-orders`: 기능별 작업 기록/분석 문서
- `../smdinsole`: API를 제공하는 Spring 백엔드 프로젝트

## API 작업 규칙
- API 응답 구조를 추정하지 않는다.
- 프론트 API 모듈(`src/api/api.js`)과 백엔드 `../smdinsole` 컨트롤러/서비스를 함께 확인한다.
- 신규 API 연결 또는 파라미터 변경 시 엔드포인트, HTTP method, 요청 DTO, 응답 필드를 백엔드 기준으로 검증한다.
- axios 직접 호출을 화면에 새로 추가하지 말고, 기존 패턴처럼 `src/api/api.js`에 함수를 추가해 사용한다.
- 인증 토큰, 공통 헤더, 파일 다운로드/업로드는 `src/api/http.js`의 기존 메서드 사용 방식을 따른다.
- 운영 환경 변수와 서버 URL 설정은 임의로 변경하지 않는다.

## 화면 개발 규칙
- 기존 화면의 HTML 구조와 Bootstrap class 사용 방식을 우선 따른다.
- 공통 레이아웃은 `Default-Layout`, 팝업은 `Popup-Layout` 패턴을 우선 확인한다.
- 메뉴/라우팅은 `src/menu.js`와 `src/app.js`의 동적 라우트 생성 방식을 확인한 뒤 수정한다.
- 권한 제어는 기존 `v-role` 디렉티브와 `adminStore` role getter 사용 방식을 따른다.
- 사용자에게 보이는 문구는 기존 화면의 한글 표현과 용어를 맞춘다.
- 로그인, 권한, 비밀번호, 관리자 잠금 등 보안 관련 흐름은 작은 변경도 영향 범위를 먼저 확인한다.

## AG Grid 작업 규칙
- AG Grid 작업은 `docs/grid_rule.md`를 우선 기준으로 삼는다.
- `rowData`에는 반드시 배열만 전달한다.
- 서버 페이징 화면은 API의 `totalCount`, `pageNum`, `pageSize`, `pageStart` 사용 여부를 확인한다.
- 페이지 크기 옵션은 특별한 요구가 없으면 `10 / 20 / 50 / 100`을 사용한다.
- 그리드 로딩, 빈 데이터, API 실패 상태를 화면에서 깨지지 않게 처리한다.
- AG Grid v31 API 사용 방식을 따른다. 예: page size 변경은 `setGridOption("paginationPageSize", size)`.

## 검증 기준
- 문서만 수정한 경우에는 별도 빌드 없이 내용 검토와 diff 확인으로 충분하다.
- Vue 파일 수정 시 최소한 대상 파일 ESLint를 확인한다.
  - 예: `npx eslint src/views/device/DeviceManager.vue`
- API 또는 공통 모듈 수정 시 관련 화면 단위 동작과 빌드 영향도를 확인한다.
- 큰 변경, 라우팅/공통 컴포넌트/API 공통 래퍼 변경 시 `npm run build`를 우선 검토한다.
- 검증을 실행하지 못한 경우 이유를 명확히 남긴다.

## 작업 기록
- 의미 있는 기능 변경 후 `docs/work-orders`에 요약 문서를 추가하거나 기존 문서를 보강한다.
- 그리드/페이징 관련 변경은 `docs/grid_rule.md`와 `docs/work-orders/paging.md`를 확인하고 필요 시 갱신한다.
- 변경 이력 보고에는 변경 파일, 주요 동작, 검증 명령, 남은 이슈를 포함한다.

## 금지사항
- 공통 컴포넌트 구조 임의 변경 금지
- 전역 스타일 무단 변경 금지
- API 응답 구조 추정 금지
- 운영 설정 파일 수정 금지
- 패키지 임의 추가 금지
- 빌드 산출물(`build`, `dist` 등) 임의 수정 금지
- `src/api/http.js`, `src/router/router.js`처럼 "수정 불가" 주석이 있는 파일은 요청 범위가 명확할 때만 최소 변경한다.
- 사용자 확인 없이 대규모 리팩터링, 파일 이동, 삭제, 포맷팅 일괄 적용을 하지 않는다.
