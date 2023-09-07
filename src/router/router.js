// 라우터 구성
// 수정 불가

import Vue from "vue"
import VueRouter from "vue-router"
import store from "@/store/index"
import utils from "@/utils/utils";
import jwt from "vue-jwt-decode";

Vue.use(VueRouter)

const routes = []; //menu.getRouteView();
//routes.push({ path: "/notfound", name: "NotFound", component: NotFound, props: { msg: "no page" } })


const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
})

let nextPath;

router.beforeEach((to, from, next) => {
	nextPath = to.fullPath;

	if(to?.path === "/login") return next()
	if(to?.path === "/pwdchange") return next()

	let token = store.getters['adminStore/getToken'];
	let pwdChange = store.getters['adminStore/getPwdChange']

	if(pwdChange === 'Y' ) {
		console.log("!!!! change password", pwdChange)
		return next('/pwdchange')
	}

	if(utils.isEmpty(token) && to?.path !== "/login") {
		return next('/login')
		// return next('/chgpw')
	} else {
		console.log("router token : " + token)
		if(utils.isNotEmpty(token)) {
			const {exp} = jwt.decode(token);
			if (exp < (new Date().getTime() + 1) / 1000) {
				store.commit('adminStore/setToken', '')
				return next('/login')
			} else {
				next()
			}
		}
	}
	//스크롤 위치 상단이동
	window.scrollTo(0,0);
})

router.onError((error) => {
	if(error.name === 'ChunkLoadError') {
		window.location.href = nextPath || '/';
	}
})
export default router
