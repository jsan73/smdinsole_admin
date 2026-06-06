# 기기 상태 코드 계약 Admin 반영 작업 요약

작성일: 2026-06-06

기준 작업지시서:

- `D:\project\kokasin\docs\DEVICE_STATUS_CODE_CONTRACT_WORK_ORDER_20260606.md`
- `D:\project\kokasin\docs\DEVICE_STATUS_CODE_CONTRACT_DRAFT_20260606.md`

## 작업 범위

- 기기 목록의 `ACTIVE_STATE` 표시를 신규 상태 코드 `N/R/P/A/L/E/D` 기준으로 확장했다.
- 목록/상세 표시 모두 API 응답의 `activeStateName`을 우선 사용하고, 없으면 코드별 fallback 표시를 사용하도록 했다.
- legacy `V`는 신규 옵션으로 노출하지 않고, 조회 시에만 `등록중(구 인증완료)` fallback으로 표시하도록 했다.
- 기기 수정 팝업에는 상태를 읽기 전용 배지로 표시하고, 일반 등록/수정 요청 payload에서는 상태 관련 필드를 제거했다.
- 강제초기화/개통취소 UI는 추가하지 않았다.

## 변경 파일

- `D:\project\kokasin\smdinsole_admin\src\views\device\DeviceManager.vue`
- `D:\project\kokasin\smdinsole_admin\src\views\device\DevicePopup.vue`
- `D:\project\kokasin\smdinsole_admin\docs\work-orders\device_status_code_contract_20260606.md`

## 검증 결과

- `npx eslint src/views/device/DeviceManager.vue src/views/device/DevicePopup.vue`
  - 실패: 현재 PowerShell PATH에서 `npx` 명령을 찾을 수 없음.
- `C:\Users\ajs00\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe node_modules\eslint\bin\eslint.js src/views/device/DeviceManager.vue src/views/device/DevicePopup.vue`
  - 통과
- `C:\Users\ajs00\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe node_modules\@vue\cli-service\bin\vue-cli-service.js build --dest .codex-build-verify`
  - 통과
  - 기존 번들 크기 경고와 Node deprecation warning은 표시됨.
  - 검증 후 `.codex-build-verify` 임시 산출물은 삭제함.
- 번들 Node 기반 `.vue` script 문법 검증
  - `src/views/device/DeviceManager.vue`: 통과
  - `src/views/device/DevicePopup.vue`: 통과
- `rg -n "activeStateName|ACTIVE_STATE_NAME|ACTIVE_STATE|activeState" src\views\device src\views\ststs src\api`
  - 상태 표시/저장 영향 위치가 `DeviceManager.vue`, `DevicePopup.vue`로 한정됨을 확인.
- `rg -n "인증완료" src\views\device src\views\ststs src\api`
  - legacy `V` fallback 문구 2건만 확인.
- `rg -n "value=.V." src\views\device src\views\ststs src\api`
  - 검색/선택 옵션의 `V` 노출 없음.
- `Test-NetConnection -ComputerName localhost -Port 8080`
  - `TcpTestSucceeded: False`
  - 로컬 API 서버 미실행으로 실제 API 응답 기반 화면 확인은 수행하지 못함.

## 미검증 항목

- 실제 API 연동 화면 확인은 수행하지 못했다. 현재 세션에서 `localhost:8080` API 서버가 실행 중이 아니며, API 응답의 `activeStateName`/`activeState` 제공은 확정 작업지시서 계약을 기준으로 반영했다.
