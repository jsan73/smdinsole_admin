# 관리자 변경 로그 조회 화면 작업지시서

## 1. 목적

관리자 화면에서 백엔드 변경 로그를 조회하고 상세 내용을 확인할 수 있는 화면을 구성합니다.

대상 백엔드 컨트롤러:

- `AdminChangeLogController`
- Base URL: `/api/admin/change-log`

## 2. 인증

관리자 API이므로 기존 관리자 인증 토큰을 사용합니다.

```text
X-Auth-Token: {admin JWT}
```

백엔드 공통 응답은 `ResponseWrappingAdvice`에 의해 아래 형태로 감싸질 수 있습니다.

```json
{
  "status": "SUCCESS",
  "code": 0,
  "message": null,
  "data": {}
}
```

프론트에서는 실제 업무 데이터는 `response.data.data` 기준으로 처리합니다.

## 3. 목록 조회 API

### 3.1 Endpoint

```text
POST /api/admin/change-log/list
```

### 3.2 Request Body

```json
{
  "userType": "ADMIN",
  "userId": "admin01",
  "userNo": null,
  "httpMethod": "POST",
  "requestUri": "/api/admin/device/upd",
  "actionType": "UPDATE",
  "targetType": "DEVICE",
  "targetId": "100",
  "successYn": "Y",
  "startDate": "20260501000000",
  "endDate": "20260523235959",
  "pageNum": 1,
  "pageSize": 20
}
```

### 3.3 검색 조건

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `userType` | string | `ADMIN`, `GUARD`, `ANONYMOUS` |
| `userId` | string | 관리자 ID 또는 보호자 식별값. LIKE 검색 |
| `userNo` | number | 보호자 번호 등 숫자 사용자 식별자 |
| `httpMethod` | string | `POST`, `GET` 등 |
| `requestUri` | string | 요청 URI. LIKE 검색 |
| `actionType` | string | `INSERT`, `UPDATE`, `DELETE` |
| `targetType` | string | `DEVICE`, `GUARDIAN`, `FOTA`, `GUARD_INVITE`, `MANAGER` 등 |
| `targetId` | string | 변경 대상 키값 |
| `successYn` | string | `Y`, `N` |
| `startDate` | string | 조회 시작일시. `yyyyMMddHHmmss` |
| `endDate` | string | 조회 종료일시. `yyyyMMddHHmmss` |
| `pageNum` | number | 1부터 시작 |
| `pageSize` | number | 페이지 크기 |

빈 조건은 `null` 또는 빈 문자열로 전달 가능합니다.

### 3.4 Response Data

```json
{
  "list": [
    {
      "logSeq": 123,
      "userType": "ADMIN",
      "userId": "admin01",
      "userNo": null,
      "httpMethod": "POST",
      "requestUri": "/api/admin/device/upd",
      "controllerName": "com.kokasin.insole.admin.controller.AdminRestController",
      "methodName": "updDeviceInfo",
      "actionType": "UPDATE",
      "targetType": "DEVICE",
      "targetId": "100",
      "requestData": null,
      "beforeData": null,
      "afterData": null,
      "successYn": "Y",
      "errorMessage": null,
      "clientIp": "127.0.0.1",
      "userAgent": "Mozilla/5.0 ...",
      "regDate": "20260523153020"
    }
  ],
  "totalCount": 123
}
```

목록 조회에서는 상세 payload 컬럼인 `requestData`, `beforeData`, `afterData`가 조회되지 않으므로 `null`일 수 있습니다.

## 4. 상세 조회 API

### 4.1 Endpoint

```text
POST /api/admin/change-log/get/{logSeq}
```

### 4.2 Path Variable

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `logSeq` | number | 변경 로그 순번 |

### 4.3 Request Body

없음.

### 4.4 Response Data

```json
{
  "logSeq": 123,
  "userType": "ADMIN",
  "userId": "admin01",
  "userNo": null,
  "httpMethod": "POST",
  "requestUri": "/api/admin/device/upd",
  "controllerName": "com.kokasin.insole.admin.controller.AdminRestController",
  "methodName": "updDeviceInfo",
  "actionType": "UPDATE",
  "targetType": "DEVICE",
  "targetId": "100",
  "requestData": "[{\"deviceNo\":100,\"nickName\":\"new name\"}]",
  "beforeData": "{\"NICK_NAME\":\"old name\"}",
  "afterData": "{\"NICK_NAME\":\"new name\"}",
  "successYn": "Y",
  "errorMessage": null,
  "clientIp": "127.0.0.1",
  "userAgent": "Mozilla/5.0 ...",
  "regDate": "20260523153020"
}
```

## 5. 화면 구성 권장

### 5.1 검색 영역

필수 권장 검색 필드:

- 기간: `startDate`, `endDate`
- 사용자 유형: `userType`
- 사용자 ID: `userId`
- 변경 유형: `actionType`
- 대상 유형: `targetType`
- 성공 여부: `successYn`
- URI 검색: `requestUri`

날짜 UI는 사용자가 보기에는 `yyyy-MM-dd HH:mm:ss` 형태로 표시하고, API 요청 시 `yyyyMMddHHmmss`로 변환합니다.

### 5.2 목록 테이블 컬럼

권장 컬럼:

- `regDate`
- `successYn`
- `actionType`
- `targetType`
- `targetId`
- `userType`
- `userId`
- `httpMethod`
- `requestUri`
- `clientIp`
- `methodName`

`logSeq`는 상세 조회용 key로 사용합니다.

### 5.3 상세 화면

목록 row 클릭 또는 상세 버튼 클릭 시 상세 API를 호출합니다.

상세 화면 구성:

- 기본 정보
    - `logSeq`
    - `regDate`
    - `successYn`
    - `errorMessage`
- 사용자 정보
    - `userType`
    - `userId`
    - `userNo`
    - `clientIp`
    - `userAgent`
- 요청 정보
    - `httpMethod`
    - `requestUri`
    - `controllerName`
    - `methodName`
    - `requestData`
- 변경 정보
    - `beforeData`
    - `afterData`

## 6. JSON 표시 규칙

`requestData`, `beforeData`, `afterData`는 JSON 문자열입니다.

프론트 처리 권장:

1. 값이 `null` 또는 빈 문자열이면 `-` 표시
2. `JSON.parse()` 가능하면 pretty print로 표시
3. 파싱 실패 시 원문 문자열 그대로 표시

예시:

```javascript
function formatJsonText(value) {
  if (!value) return '-'
  try {
    return JSON.stringify(JSON.parse(value), null, 2)
  } catch (e) {
    return value
  }
}
```

## 7. 페이징

목록 API request에 `pageNum`, `pageSize`를 전달합니다.

백엔드 응답의 `totalCount`를 기준으로 페이지네이션을 구성합니다.

```json
{
  "pageNum": 1,
  "pageSize": 20
}
```

## 8. 주의사항

- 목록 API는 상세 JSON payload를 반환하지 않습니다.
- 상세 JSON payload는 상세 API에서만 조회합니다.
- `beforeData`, `afterData`에는 전체 row가 아니라 실제 변경된 컬럼만 들어갑니다.
- INSERT는 `beforeData`가 없고 `afterData`에 생성된 row 값이 들어갈 수 있습니다.
- DELETE는 `afterData`가 없고 `beforeData`에 삭제 전 row 값이 들어갈 수 있습니다.
- UPDATE에서 실제 변경된 컬럼이 없으면 `beforeData`, `afterData`가 비어 있을 수 있습니다.

## 9. 프론트 화면 구성
- 기존 접근기록 확인 메뉴에 탭 형태로 구분하여 화면 추가
- 즉 관리자 접근 기록 확인 | 변경기록 로그로 구분 
- 추후 탭 추가 예정
- 그리드는 html 태그로 구성된 그리드 말고 3
- 서버 페이징 기능으로 구성
- 화면 UI는 현재 작업되어 있는 기기 관리의 UI/UX를 참고 하여 작업