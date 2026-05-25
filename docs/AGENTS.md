# Codex 작업 지침

## 프로젝트 개요
- Vue2 기반 프론트엔드 프로젝트
- 인솔 디바이스를 관리하고 사용자 및 관리자를 관리하는 서비스다
- 상태관리: Vuex
- 라우팅: Vue Router
- API 통신: axios
- UI 프레임워크: 분석후 기재바람

## Codex 기본 규칙
1. 수정 전 관련 파일을 먼저 분석한다.
2. 기존 코드 스타일을 유지한다.
3. Vue2 Options API 기준으로 작성한다.
4. Vue3 Composition API 문법을 사용하지 않는다.
5. 임의로 패키지를 추가하지 않는다.
6. 변경 후 영향 파일 목록을 정리한다.
7. 가능하면 npm run lint / npm run build 기준으로 검증한다.

## 주요 폴더
- src/views: 화면 컴포넌트
- src/components: 공통 컴포넌트
- src/store: Vuex
- src/router: 라우터
- src/api : API 호출 모듈
- ../smdinsole 프로젝트에서 API를 제공한다. spring프레임웍이며 컨트롤러를 분석하여 api 사용이 맞는지도 검증한다.

## 금지사항
- 공통 컴포넌트 구조 임의 변경 금지
- 전역 스타일 무단 변경 금지
- API 응답 구조 추정 금지
- 운영 설정 파일 수정 금지
- 파일을 수정하기전 확인을 받고 수정 한다.
