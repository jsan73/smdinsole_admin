import http from "./http"

export default {

	back() {
		this.$router.go(-1);
	},

	login(param) {
		return http.postParam(process.env.VUE_APP_SERVER_URL + `/api/admin/get/token`, param)
	},
	login_step1(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + `/api/admin/auth/login/step1`, param)
	},
	login_step2(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + `/api/admin/auth/login/step2`, param)
	},
	login_verify(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + `/api/admin/auth/login/verify-mfa`, param)
	},
	login_verify_pwfind(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + `/api/admin/auth/login/verify-mfa-pwfind`, param)
	},

	// 기기관리
	selDeviceList(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/device/list', param)
	},
	downDeviceListExcel(param) {
		return http.postFileDn(process.env.VUE_APP_SERVER_URL + '/api/admin/device/downExcel', param)
	},
	uploadDeviceListExcel(param) {
		return http.postFile(process.env.VUE_APP_SERVER_URL + `/api/admin/device/uploadExcel`, param)
	},
	insDevice(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/device/ins', param)
	},
	updDevice(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/device/upd', param)
	},
	delDevice(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/device/del/' + param);
	},
	// 단순 단말 조회
	getDeviceInfo(deviceIMEI) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/device/get/' + deviceIMEI);
	},
	getAdminDeviceNotice(deviceNo) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/device/notice/get/' + deviceNo);
	},
	setAdminDeviceNotice(option, param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/device/notice/set/' + option, param);
	},

	// 이벤트
	// 이벤트 기기 리스트
	selEventDeviceList(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/device/evntlist', param)
	},
	selEventLogList(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/device/location/list', param)
	},
	delEventLog(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/device/location/del', param)
	},

	// Fota
	getDeviceFotaInfo() {
		return http.post(process.env.VUE_APP_SERVER_URL + `/api/admin/device/fota/get`)
	},
	regDeviceFota(param) {
		return http.postFile(process.env.VUE_APP_SERVER_URL + `/api/admin/device/fota/reg`, param)
	},
	delDeviceFota() {
		return http.post(process.env.VUE_APP_SERVER_URL + `/api/admin/device/fota/del`)
	},

	// 사용자관리
	selGuardList(param) {
		console.log(param)
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/guard/list', param)
	},
	selGuardPhoneList(deviceIMEI) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/guard/phonelist', deviceIMEI)
	},
	insGuard(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/guard/ins', param)
	},
	updGuard(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/guard/upd', param)
	},
	delGuard(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/guard/del/' + param);
	},

	// 관리자 사용자 리스트
	selGuardianListByAdmin(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/guardian/list', param);
	},
	// 관리자 사용자 추가
	insGuardianByAdmin(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/guardian/ins', param);
	},
	// 사용자 핸드폰 등록 여부 확인
	checkGuardPhone(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/guardian/phone/check', param);
	},
	// 사용자 수정
	updGuardianByAdmin(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/guardian/upd', param);
	},
	// 사용자 연결 기기 목록
	selDeviceListByAdmin(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/guardian/device/list/' + param);
	},
	//사용자 정보 수정을 위한 검색 쿼리
	getGuardianInfo(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/guardian/info/'+ param);
	},
	// 대표 사용자 이전을 위한 검색 쿼리
	getMasterGuardianSearch(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/guardian/master/search', param);
	},
	//대표 사용자 이전
	chageMasterGuardByAdmin(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/guardian/master/ins', param);
	},
	//기기 추가를 위한 검색 쿼리
	getDeviceInsSearch(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/guardian/device/search/'+ param);
	},
	//사용자에 기기 추가
	insDeviceGuardByAdmin(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/guardian/device/ins', param);
	},
	// 사용자에 기기 삭제 (권한해제)
	delDeviceGuardianByAdmin(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/guardian/device/del', param);
	},

	// 단순 단말 조회
	geGuardInfo(deviceIMEI) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/guard/get/' + deviceIMEI);
	},

	selAddrList() {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/addr/list');
	},

	selStatAcid(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/stat/acid/list', param);
	},

	selStatAcidTime(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/stat/acid/list/time', param);
	},

	// 기관관리
	selOrgcList(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/orgc/list', param)
	},
	insOrgc(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/orgc/ins', param)
	},
	updOrgc(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/orgc/upd', param)
	},
	delOrgc(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/orgc/del/' + param);
	},
	// 단순 단말 조회
	getOrgcInfo(orgcNo) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/orgc/info/' + orgcNo);
	},

	// 패스워드 변경
	// updChangePwd(param) {
	// 	return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/manager/upd/pwd', param)
	// },
	updChangePwd(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/auth/change-password', param)
	},

	selLocationLog(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/manager/location/log', param)
	},

	selLoginLog(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/manager/login/log', param)
	},
	insDevicePtl(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/manager/device/ins', param)
	},
	stopDevicePtl(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/manager/device/stop', param)
	},
	selDeviceLog(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/manager/device/log', param)
	},

	saveDeviceLog(param) {
		return http.postParamFileDn(process.env.VUE_APP_SERVER_URL + '/api/admin/manager/device/download', param)
	},
	resetDeviceLog(param) {
		return http.postParam(process.env.VUE_APP_SERVER_URL + '/api/admin/manager/device/reset', param)
	},
	// 관리자 변경 로그
	selChangeLogList(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/change-log/list', param)
	},
	getChangeLog(logSeq) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/change-log/get/' + logSeq)
	},
	// API 접근 로그
	selAccessLogList(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/access-log/list', param)
	},
	getAccessLog(accessLogSeq) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/access-log/get/' + accessLogSeq)
	},
	// 공통코드 가져오기
	getCommCode(params) {
		return http.post(process.env.VUE_APP_ADMIN_PJT + `/api/get/commcode`, params)
	},

	// 관리자 관리
	// 관리자 사용자 리스트
	selManagerListByAdmin(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/manager/list', param);
	},
	getManagerByAdmin(mgrNo) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/manager/get/' + mgrNo);
	},
	registerManagerByAdmin(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/manager/register', param);
	},
	unlockManager(mgrNo) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/manager/unlock/' + mgrNo);
	},
	initManagerPwd(mgrNo) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/manager/initpwd/' + mgrNo);
	},

	checkManagerId(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/manager/checkId', param);
	},
	updMangerByAdmin(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/manager/update', param);
	},
	delManagerByAdmin(mgrNo) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/manager/delete/' + mgrNo);
	},
	findAdminAccount(findInfo) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/auth/login/find', findInfo);
	},

	// 로그아웃
	logout() {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/auth/logout');
	},

}
