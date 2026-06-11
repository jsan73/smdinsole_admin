# 기기 분실/폐기/교체 Admin UI 반영

작성일: 2026-06-11

## 수정 파일

- `src/views/device/DevicePopup.vue`
- `src/views/device/DeviceManager.vue`
- `src/api/api.js`

## 추가 API client 함수

- `lostDevice(param)`: `POST /api/admin/device/lost`
- `releaseLostDevice(param)`: `POST /api/admin/device/lost/release`
- `disposeDevice(param)`: `POST /api/admin/device/dispose`
- `replaceDevice(param)`: `POST /api/admin/device/replace`

## 구현 내용

- 기기 등록/수정 팝업에서 기기 전화번호, 소속 기관, 기기 사이즈 필수 검증을 완화했다.
- 소속 기관 미선택값은 `orgcNo=0`, 기기 사이즈 미선택값은 `deviceSize=0`으로 전달하도록 보정했다.
- 기기 전화번호는 값이 입력된 경우에만 전화번호 형식 검증을 수행한다.
- 수정 팝업에 `기기 교체(이관)`, `분실`, `분실 해제`, `폐기` 버튼을 추가하고 기존 `삭제`, `수정` 버튼을 유지했다.
- 기기 교체(이관) 모드에서 IMEI/ICCID를 공백으로 초기화하고, 기존 `deviceNo`와 신규 IMEI/ICCID/사유를 `/api/admin/device/replace`로 전달하도록 구현했다.
- 기기 교체(이관) 모드의 교체 사유 입력 항목은 제거하고, API 요청 시 `reason = 'A/S 교체'`를 기본 문구로 전달하도록 조정했다.
- 기기 수정 팝업의 `개통일`과 `만료일`은 별도 행으로 유지했다.
- `기기 교체(이관)`, `분실/분실 해제`, `폐기` 액션 버튼은 하단 왼쪽으로 정렬하고, `삭제/수정/등록` 버튼은 오른쪽 액션으로 분리했다.
- 팝업 헤더, 카드, 입력 테이블, 버튼 영역에 scoped 스타일을 적용해 화면 밀도와 구분감을 개선했다.
- 추가 정책 변경에 따라 `분실`, `폐기` 버튼은 조건 미충족 시에도 disabled 처리하지 않고, 클릭 후 사유 alert를 표시한 뒤 API 호출을 중단하도록 조정했다.
- 분실 상태(`ACTIVE_STATE='L'`)에서는 `분실` 버튼을 disabled 처리하고, `기기 교체(이관)`도 분실 해제 전에는 disabled 처리하도록 추가 조정했다.
- 분실/분실 해제/폐기 액션은 API 메시지를 우선 표시할 수 있도록 기존 공통 오류 처리 흐름을 유지했다.
- 기기 목록에 상태 필터를 추가하고 `N/R/P/A/L/E/D` 옵션을 제공한다.
- 상태 배지는 API `activeStateName`을 우선 사용하고, 없으면 Admin fallback 표시명을 사용한다.
- Excel 업로드 화면 자체에는 필수값 검증이 없어 변경하지 않았고, 완화 검증은 API 업로드 처리 결과에 의존한다.

## 버튼 활성 조건

| 버튼 | 조건 |
| --- | --- |
| 삭제 | 연결 사용자 수 0건 |
| 수정 | 기존 수정 버튼 유지 |
| 기기 교체(이관) | 연결 사용자 수 1건 이상, `D/L` 상태 아님 |
| 분실 | 기본 클릭 가능. `L` 상태는 disabled, `A`가 아니면 사유 alert 후 API 호출 중단 |
| 분실 해제 | `ACTIVE_STATE='L'` |
| 폐기 | 항상 클릭 가능. 사용자 연결 1건 이상 또는 `D` 상태면 사유 alert 후 API 호출 중단 |

## API 대기/확인 항목

- 로컬 백엔드 조회 기준으로 Admin controller의 `/api/admin/device/lost`, `/lost/release`, `/dispose`, `/replace` endpoint는 아직 확인되지 않았다.
- `AdminMapper.xml`의 기기 목록/Excel 목록 조회에서 `activeState` 검색 조건과 기본 `D` 제외 조건은 아직 확인되지 않았다.
- Excel 업로드 서버 처리에는 기존 기기 전화번호/소속 기관 필수 검증 흔적이 남아 있어 API 담당 반영 후 재확인이 필요하다.
- 따라서 신규 버튼 클릭, `D` 필터 조회, Excel 필수값 완화의 실제 성공 여부는 API 반영 후 통합 확인이 필요하다.

## 검증 결과

- `npx eslint src/views/device/DevicePopup.vue src/views/device/DeviceManager.vue src/api/api.js`: 통과
- `npm run lint`: 실패
  - 이번 수정 파일 오류는 없음
  - 기존 오류 18건: `src/api/index.js`, `src/components/common/Footer.vue`, `src/components/index.js`, `src/components/layout/PopupLayout.vue`, `src/main.js`, `src/utils/mixin.js`, `src/views/guard/GuardManager_old.vue`, `src/views/guard/GuardPopup_old.vue`, `src/views/login/AdminLogin_old.vue`, `src/views/login/Login.vue`, `src/views/login/PwdChange_old.vue`
- `npm run build`: 성공
  - 기존 번들 크기 경고와 Node/webpack deprecation 경고가 출력됨
- `npm run serve -- --host 0.0.0.0 --port 8081`: 컴파일 성공 및 `http://localhost:8081/` 제공 로그 확인

## 미검증 항목

- API 서버 연동 수동 동작
- 브라우저 실제 화면 조작 확인
- 신규 기기 액션 endpoint의 성공/실패 메시지 확인
- Excel 업로드 필수값 완화 통합 확인
