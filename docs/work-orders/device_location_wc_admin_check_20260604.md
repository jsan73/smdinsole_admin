# 측위 우회(WC) JSON 요청 변경 Admin 확인 결과

작성일: 2026-06-04

대상 작업지시서: `/home/jsan/project/kokasin/docs/device-location-wc/DEVICE_LOCATION_WC_JSON_REQUEST_WORK_ORDER_20260604.md`

## 1. 확인 목적

API 프로젝트의 `POST /api/device/loc/wc` 요청 body 처리 방식 변경이 Admin 프로젝트에 영향을 주는지 확인했다.

이번 API 변경은 클라이언트 호출 방식(endpoint, query parameter `deviceIMEI`, `location`, JSON body)을 변경하지 않는 작업이므로, Admin에서 해당 API를 직접 호출하거나 기존 에러 문자열을 직접 표시하는 코드가 있는지 확인하는 것이 범위다.

## 2. 검색 및 검토 범위

- `src/api/api.js`
- `src/api/http.js`
- `src/api/index.js`
- `src/views`
- `src/components`
- `src/store`
- `src/router`
- `src/menu.js`
- `src/app.js`
- `docs/work-orders`

검색 키워드:

- `/api/device/loc/wc`
- `device/loc/wc`
- `loc/wc`
- `BAD_REQUEST_EMPTY_WIFI`
- `PROXY_LOCATION_INPUT_EMPTY`
- `PROXY_INVALID_WIFI`
- `위치측위값`
- `3301`
- `deviceIMEI`
- `location`

## 3. 확인 결과

### 3.1 WC API 호출 코드

Admin 프로젝트에서 `POST /api/device/loc/wc` 또는 유사 경로를 직접 호출하는 코드는 확인되지 않았다.

`src/api/api.js`에는 Admin 전용 기기/위치/로그 API만 존재한다.

- `/api/admin/device/location/list`
- `/api/admin/device/location/del`
- `/api/admin/manager/location/log`

따라서 WC API의 RequestBody 타입이 서버 내부에서 `JsonNode` 또는 JSON 원문 처리로 변경되어도 Admin 호출부 수정은 필요하지 않다.

### 3.2 에러 문자열 및 코드 표시

Admin 프로젝트에서 `BAD_REQUEST_EMPTY_WIFI`, `PROXY_LOCATION_INPUT_EMPTY`, `PROXY_INVALID_WIFI`, `위치측위값`, `3301`을 직접 참조하거나 화면에 별도 분기 표시하는 코드는 확인되지 않았다.

공통 axios 응답 인터셉터는 HTTP 오류를 그대로 reject하고, 개별 화면이 필요한 경우 `e.response.data.message`를 alert로 표시하는 구조다. WC API를 호출하는 Admin 화면이 없으므로 신규 메시지 `위치측위값이 없습니다.`에 대한 별도 화면 수정은 필요하지 않다.

### 3.3 화면/메뉴/라우팅 영향

`src/menu.js`, `src/app.js`, 라우터 구성에서 WC API 변경과 직접 연결된 화면, 메뉴, 라우팅은 확인되지 않았다.

현재 위치 관련 화면은 `LocationLog` 메뉴(`/loclog`)이며, 호출 API는 `/api/admin/manager/location/log`다. WC API 요청 body 계약 변경과 직접 영향이 없다.

## 4. 변경 사항

소스 수정 없음.

이번 작업에서는 확인 결과 기록을 위해 본 문서만 추가했다.

## 5. 검증 결과

수정이 없으므로 `npx eslint` 또는 `npm run build`는 수행하지 않았다.

대신 아래 정적 검색 및 파일 검토로 검증했다.

- WC endpoint 및 에러 문자열 검색 결과: 해당 없음
- Admin API 모듈 검토: WC 호출 함수 없음
- 공통 axios 처리 검토: WC 전용 에러 분기 없음
- 위치 로그 화면 검토: `/api/admin/manager/location/log`만 사용
- 메뉴/라우팅 검토: WC API와 연결된 화면 없음

## 6. 미검증 항목

- API 서버 실제 응답 연동 테스트는 수행하지 않았다.
- Admin 프로젝트 소스 수정이 없으므로 빌드/ESLint 검증은 수행하지 않았다.
