# 관리자 180일 미접속 잠금 및 보호자 휴면 UI 검증

- 작성일: 2026-06-13
- 담당: Admin
- 대상 프로젝트: `/Users/jsan/project/kokasin/smdinsole_admin`

## 변경 파일

- `src/views/login/AdminLogin.vue`
  - 관리자 미접속 잠금 기본 안내 문구를 `180일 이상 미접속` 기준으로 정정했다.
  - 오류 응답의 `90`, `180`, `미접속`, `INACTIVE`, `DORMANT` 문자열을 미접속 잠금으로 인식하도록 유지/확장했다.
- `src/views/manage/AdminManager.vue`
  - 관리자 목록 잠금 유형 배지에서 `INACTIVE_90D`, `INACTIVE_90DAYS`, `INACTIVE_180D`, `DORMANT`를 모두 `미접속 잠금`으로 표시하도록 보정했다.

## 보호자 휴면 UI 확인

- `src/views/guard/GuardManager.vue`
  - 목록 계정상태 옵션에 `H(휴면)` 조회 옵션이 있다.
  - 목록 계정상태 배지는 `H`를 `휴면`으로 표시한다.
- `src/views/guard/GuardPopup.vue`
  - 휴면 계정 상세에서는 `휴면`, `정상` 선택지만 노출한다.
  - 허용 전환은 `H -> N`이며, `N <-> S` 기존 전환은 유지한다.
  - `N/S -> H`, `H -> S`, `P -> N/H/S`, `N/H/S -> P`는 UI 옵션 또는 저장 전 검증으로 차단한다.
  - 허용되지 않는 전환 문구는 `계정상태는 정상↔정지 또는 휴면→정상 전환만 가능합니다.`로 확인했다.

## 문자열 검색 결과

- 대상 화면의 `90일` 문구는 제거했다.
- `rg -n "90일" .` 결과는 이 작업 기록의 설명 문구만 남았다.
- `INACTIVE_90D`, `INACTIVE_90DAYS`는 기존 DB 호환 표시를 위해 코드에 남겼다.
- `180` 검색 결과에는 MFA 타이머 180초 값과 180일 안내/호환 처리 관련 내용이 함께 포함된다.

## 검증 결과

- `npx eslint src/views/login/AdminLogin.vue src/views/manage/AdminManager.vue src/views/guard/GuardManager.vue src/views/guard/GuardPopup.vue`
  - 통과
  - npm 로그 파일을 `/Users/jsan/.npm/_logs`에 생성하지 못했다는 경고가 있었으나 ESLint 종료 코드는 0이다.
- `npm run build`
  - 통과
  - 기존 번들 크기 제한 경고와 Webpack `[hash]` deprecation 경고가 발생했다.
  - 빌드 산출물 위치: `../build/local/kokasin_admin`
- `git diff --check`
  - 통과

## 미검증 항목

- 실제 API 연동으로 보호자 휴면 계정 `H -> N` 수정 성공 여부는 확인하지 못했다.
- 실제 관리자 잠금 데이터로 `INACTIVE_90D`, `INACTIVE_90DAYS`, `INACTIVE_180D`, `DORMANT` 배지 표시를 브라우저에서 확인하지 못했다.
