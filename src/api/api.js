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

	getAddress(data) {
		// 개발용 인증 키( 사용 가능 일자 : 2021.08.04 )
		// let _confmKey = "devU01TX0FVVEgyMDIxMDcwNTEyNTg1NjExMTM1ODE=";
		// 운영용 인증 키 발급 받은 후 사용
		let _confmKey = "U01TX0FVVEgyMDIxMTAwNDE3NDkzNDExMTcxNzI="; // todo : 인증키 관리위치 수정

		data.append("confmKey", _confmKey);
		data.append('resultType', 'json');
		data.append("firstSort", "none")
		data.append('currentPage', 1);
		data.append("countPerPage", 100); // 주소검색 API 에서 한 페이지에 최대 100건 까지만 응답

		// http.post 사용 시 CORS 오류로 인해 처리가 불가능 하여 아래 방식으로 실행
		// CORS 오류 해결 방법 확인 필요
		let config = {
			method : 'post',
			url    : 'https://www.juso.go.kr/addrlink/addrLinkApi.do',
			headers: {
				"Content-Type": "multipart/form-data",
			},
			data:data,
			timeout: 5000
		}
		return axios(config)
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