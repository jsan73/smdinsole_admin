import http from "./http"
import axios from "axios";
import jsonp from "jsonp";

export default {

	back() {
		this.$router.go(-1);
	},

	login(param) {
		return http.postParam(process.env.VUE_APP_SERVER_URL + `/api/admin/get/token`, param)
	},

	// 기기관리
	selDeviceList(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/device/list', param)
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
	updChangePwd(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/manager/upd/pwd', param)
	},

	selLocationLog(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/manager/location/log', param)
	},

	selLoginLog(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/manager/login/log', param)
	},

	selDeviceLog(param) {
		return http.post(process.env.VUE_APP_SERVER_URL + '/api/admin/manager/device/log', param)
	},
	// 공통코드 가져오기
	getCommCode(params) {
		return http.post(process.env.VUE_APP_ADMIN_PJT + `/api/get/commcode`, params)
	},
	// 로그아웃
	logout() {
		let url = process.env.VUE_APP_LOGOUT_URL;

		return new Promise(function (resolve, reject) {
			jsonp(url, null, (err, data) => {
				if (err) {
					console.error("logout", err?.message);
					reject(err?.message)
				} else {
					console.log("logout", data?.RESULT);
					resolve(data?.RESULT)
				}
			});
		});
	},
}