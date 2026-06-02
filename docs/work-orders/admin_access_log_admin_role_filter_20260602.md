# API 접근 기록 관리자 역할 검색 UI 변경 작업 기록

작성일: 2026-06-02

## 1. 변경 대상

- `src/views/manage/LoginLog.vue`

## 2. 반영 내용

- API 접근 탭의 사용자 유형 검색 바인딩을 `accessSearch.adminRoleType`으로 변경했다.
- 사용자 유형 검색 option을 `전체`, `일반관리자(ADMIN)`, `슈퍼관리자(SADMIN)`로 변경했다.
- API 접근 탭의 Method 검색 입력과 `accessSearch.httpMethod`를 제거했다.
- 화면 검색용 `accessSearch.userType`을 제거했다.
- 일반관리자 범위 적용 시 `accessSearch.userType = "ADMIN"` 강제를 제거하고, 본인 `userId` 강제는 유지했다.
- 목록 그리드와 상세 팝업의 사용자 유형 및 Method 표시는 유지했다.
- 기존 `enableCellTextSelection` 설정을 유지했다.
- `src/views/manage/LoginLog.vue`의 줄바꿈을 기존 파일 형식인 CRLF로 정규화했다.

## 3. API 계약

- Endpoint: `POST /api/admin/access-log/list`
- 검색 request에 선택 필드 `adminRoleType`을 전달한다.
- 허용값: 빈 값, `ADMIN`, `SADMIN`
- 목록 및 상세 response 변경은 없다.

## 4. 검증 결과

- `npx eslint src/views/manage/LoginLog.vue`: 통과
- `npm run build`: 통과
  - webpack asset size limit, entrypoint size limit 경고 2건이 출력되었으나 빌드는 완료됐다.
- `git diff --check -- src/views/manage/LoginLog.vue`: 통과
- 줄바꿈 확인: CRLF 508줄, LF 단독 0줄

## 5. 미검증 항목

- 실행 중인 API 서버와 브라우저를 이용한 슈퍼관리자/일반관리자 계정별 실제 조회 결과 확인은 수행하지 않았다.
- 로그인/로그아웃 탭의 브라우저 회귀 확인은 수행하지 않았다.
