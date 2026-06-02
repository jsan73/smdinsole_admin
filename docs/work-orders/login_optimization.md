# 로그인 단계 최적화 작업 보고서

작업일: 2026-05-23

## 검토 대상

- `src/views/login/AdminLogin.vue`
- `src/router/router.js`
- 참고 확인:
  - `src/views/login/PwdChange.vue`
  - `src/store/adminStore.js`
  - `src/api/api.js`
  - `src/api/http.js`

## 기존 로그인 단계

1. `LOGIN`
   - ID와 비밀번호 입력
   - `/api/admin/auth/login/step1` 호출
2. `MFA`
   - 이메일 또는 휴대폰 인증 수단 선택
   - `/api/admin/auth/login/step2` 호출로 인증번호 발송
   - `/api/admin/auth/login/verify-mfa` 호출로 인증번호 검증
3. `PWD_CHANGE`
   - 비밀번호 변경 주기 경과 또는 초기화 계정이면 `/pwdchange`로 이동
4. `DEVICE`
   - 정상 로그인 완료 시 `/device`로 이동

단계 구조 자체는 보안 요구상 유지하는 것이 적절하다고 판단했다.

## 작업 내용

### 중복 호출 방지

- 로그인 버튼에 `isLoginLoading` 적용
- MFA 인증번호 발송 버튼에 `isMfaSending` 적용
- MFA 인증 확인 버튼에 `isMfaVerifying` 적용
- 비밀번호 찾기 확인 버튼에 `isFindPwdLoading` 적용
- 각 loading 상태 중 같은 API가 중복 호출되지 않도록 early return 처리

### 입력 상태 제어

- 로그인 중 ID/PW 입력 disabled 처리
- MFA 발송/검증 중 인증수단 radio disabled 처리
- MFA 검증 중 인증번호 입력 disabled 처리
- 비밀번호 찾기 확인 중 입력 disabled 처리
- ID, 이메일, 이름, MFA 코드 입력에 `trim` 적용

### 단계 전환 안정화

- `resetMfaState()` 추가
  - 인증번호 초기화
  - 발송 여부 초기화
  - 오류 메시지 초기화
  - 타이머 초기화
  - 기존 interval 정리
- 비밀번호 찾기 진입 시 로그인 오류와 MFA 상태 초기화
- 로그인 화면 복귀 시 비밀번호 찾기 정보와 MFA 상태 초기화
- MFA 재발송 시 기존 인증번호와 오류 메시지 초기화

### MFA 검증 개선

- 인증번호 미발송 상태에서 인증 확인을 누르면 API 호출하지 않고 안내 메시지 표시
- 인증번호 미입력 상태에서 인증 확인을 누르면 API 호출하지 않고 안내 메시지 표시
- 인증 시간이 만료되면 인증번호를 비우고 재발송 안내 메시지 표시

### 로그인 응답 상태 방어 처리

- `login_step1` 성공 후 `data.status === "MFA"`인 경우만 MFA 단계로 이동
- 서버가 알 수 없는 성공 상태를 반환하면 화면이 멈추지 않도록 오류 메시지 표시
- `manager` 정보가 비어 있어도 화면 오류가 나지 않도록 optional chaining 적용

### 보안 로그 제거

- `src/router/router.js`에서 JWT 전체를 출력하던 `console.log("router token : " + token)` 제거
- 토큰 전체 로그는 개발/운영 모두에서 노출 위험이 있어 제거가 필요했다.

### 컴포넌트명 정리

- `src/views/login/AdminLogin.vue`의 component name을 `Login`에서 `AdminLogin`으로 변경
- 파일명과 라우트 componentName에 맞추고 ESLint `vue/multi-word-component-names` 규칙을 만족하도록 정리했다.

## 변경 파일

- `src/views/login/AdminLogin.vue`
- `src/router/router.js`
- `docs/work-orders/login_optimization.md`

## 검증

아래 명령으로 대상 파일 검증을 수행했다.

```sh
npx eslint src/views/login/AdminLogin.vue src/router/router.js
```

결과:

- 통과
- Browserslist `caniuse-lite` 업데이트 안내만 출력됨

## 남은 검토 사항

- 구버전 로그인 화면 `src/views/login/Login.vue`는 현재 메뉴 라우트 기준 사용되지 않는 것으로 보인다.
- 혼동 방지를 위해 추후 deprecated 표시 또는 제거 여부를 결정할 필요가 있다.
- 비밀번호 찾기 API인 `findAdminAccount`는 `src/api/api.js`에 정의되어 있음을 확인했다.
- 실제 비밀번호 찾기 응답 필드명은 현재 화면 구현 기준으로 `mgrId`, `mgrPhone`을 사용한다.
- 전체 `npm run lint`는 프로젝트 전반의 기존 lint 오류가 남아 있어 별도 정리 대상이다.
