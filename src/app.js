import Vue from "vue";
import router from "@/router/router";
import menuList from "@/menu";
import {mapState} from "vuex";
import http from '@/api/http';
// import LayerLayout from "@/components/layout/LayerLayout";
//import {mapState, mapMutations, mapActions} from "vuex";
//import mapState from "vuex"

function loadView(path, view) {
	if(view === undefined) return null;
	else return () => import(/* webpackChunkName: "view-[request]" */ `@/${path}/${view}.vue`);
}


export default {
	name: "App",
	data() {
		return {
			menulist: [],
			tabMenu: [],
			firstPage: "",
			isSkipToken: false,
			isDev: false,
			titleMap: null,

		};
	},
	watch:{
		"$route"(){
//			this.classClean();
		}
	},
	computed: {
		...mapState('adminStore', ['adminInfo']),
		layout() {
			//return ((this.$route.meta.layout === "Main" || this.$route.path === "/main" || this.$route.path === "/") ? "Main" : "Default-Layout");
			//return ((this.$route.meta.layout === "Main") ? "Main" : "Default-Layout");

			return (this.$route.meta.layout || "Default") + "-Layout";
		},
	},
	components: {
	},
	methods: {

		makeRouteView() {
			let data = JSON.parse(JSON.stringify(menuList.list));

			this.menuGlobal = [];
			let records = {};
			let itemLength = data.length;

			for(let i = 0; i < itemLength; i++) {
				let el = data[i];
				let meta = el?.meta === undefined ? {} : el.meta;
				meta.access = !(meta.authority === true && this.accessMenuId[el.menuId] === undefined);
				meta.title = el.menuName;

				data[i] = {
					fullpath: el.url,
					path: el.url,
					name: el.menuId,
					menuid: el.menuId,
					pid: el.parentId,
					hidden: el.modal,
					props: el.props || true,
					meta: meta,
				};

				data[i] = {
					...data[i],
					component: loadView(el.pagePath, el.componentName),
				};

				// Router Redirect 추가
				if(el.redirect !== undefined) {
					data[i] = {
						...data[i],
						redirect : el.redirect
					};
				}

				records[data[i].menuid] = data[i];
			}

			for(let i = 0; i < itemLength; i++) {
				let currentData = data[i];
				if(currentData.meta.authority === true && currentData.meta.access === false) {
					continue;
				}
				let parentData = records[currentData.pid];
				if(parentData && parentData.component == null) {
					parentData = records[parentData.pid];
				}

				if(!parentData) {
					if(currentData.path == null) continue;
					// if(this.firstPage === "" && !currentData.hidden) {
					// 	this.firstPage = currentData.menuid;
					// 	currentData.path = "/";
					// }
					this.menuGlobal.push(currentData);
					continue;
				}

				//currentData.path = currentData.path.substring(parentData.path.length > 1 ? parentData.path.length + 1 : 0);
				parentData.children = parentData.children || [];
				parentData.children.push(currentData);

			}
			Vue.prototype._routelist = this.menuGlobal;

			router.addRoutes(this.menuGlobal);
		},
		getRouteView() {
			return this.menuGlobal || [];
		},
	},
	created: function () {
		console.debug(this.layout);
		if(this.$skipToken === undefined) {
			http.setToken(this.adminInfo.token)
		} else {
			this.isSkipToken = true;
			console.log("1")
		}

		this.makeRouteView();

		// 개발모드
		if(process.env.VUE_APP_MODE === "dev") {
			this.isDev = true;
		}

	},
};
