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