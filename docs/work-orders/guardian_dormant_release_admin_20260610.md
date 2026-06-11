# 보호자 휴면 계정 해제 UI 반영

작성일: 2026-06-10

## 작업 범위

- 보호자 상세 팝업에서 휴면(`H`) 계정의 계정상태 select를 읽기 전용에서 수정 가능 상태로 변경했다.
- 휴면 계정 상세에서는 `휴면`, `정상` 선택지만 노출하도록 조정했다.
- Admin 허용 전환을 `N -> S`, `S -> N`, `H -> N`으로 정리했다.
- 휴면 직접 전환(`N/S -> H`), 휴면에서 정지 전환(`H -> S`), 탈퇴 Pending(`P`) 복구/전환은 허용하지 않도록 유지했다.
- 휴면 안내 문구와 허용되지 않는 전환 alert 문구를 확정 작업지시서 기준으로 맞췄다.

## API 의존성

- 신규 API 호출은 추가하지 않았다.
- 기존 보호자 수정 API(`POST /api/admin/guardian/upd`)의 `accountState` 값을 그대로 사용한다.
- 휴면 해제 시 기존 수정 요청에 `accountState = 'N'`을 전달한다.

## 상태 전환 기준

| 원상태 | 선택 가능 상태 | 저장 허용 |
| --- | --- | --- |
| `N` 정상 | 정상, 정지 | `N -> S` |
| `S` 정지 | 정지, 정상 | `S -> N` |
| `H` 휴면 | 휴면, 정상 | `H -> N` |
| `P` 탈퇴 | 탈퇴 | 전환 불가 |

## 검증 결과

- `npx eslint src/views/guard/GuardPopup.vue`: 통과
- `npm run lint`: 실패
  - 이번 수정 파일 오류는 없음
  - 기존 오류: `src/api/index.js`, `src/components/common/Footer.vue`, `src/components/index.js`, `src/components/layout/PopupLayout.vue`, `src/main.js`, `src/utils/mixin.js`, `src/views/guard/GuardManager_old.vue`, `src/views/guard/GuardPopup_old.vue`, `src/views/login/AdminLogin_old.vue`, `src/views/login/Login.vue`, `src/views/login/PwdChange_old.vue`의 ESLint 오류 18건
- `npm run build`: 성공
  - 기존 번들 크기 경고와 Node/webpack deprecation 경고가 출력됨

## 미검증 항목

- 실제 API 서버와 연결한 화면 수동 동작은 검증하지 못했다.
- 휴면 계정 실데이터로 `H -> N` 수정 성공 여부는 API 실행 환경에서 추가 확인이 필요하다.
