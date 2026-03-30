import Vue from "vue";
import Vuex from 'vuex'
import App from "./App.vue";
import router from "./router/router";
import store from "./store/index"
import mixin from "./utils/mixin"
import ui from "./components";
import util from "./assets/js/util"
// import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import '../public/static/css/admin_style.css'
// import '../public/static/css/bootstrap.min.css'
import '../public/assets/vendor/simple-datatables/style.css'
import '../public/assets/vendor/bootstrap-icons/bootstrap-icons.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import { use } from 'echarts/core'

import {
    CanvasRenderer
} from 'echarts/renderers'
import {
    BarChart,
    LineChart
} from 'echarts/charts'
import {
    GridComponent,
    TooltipComponent,
    LegendComponent,
    TitleComponent
} from 'echarts/components'
import { jwtDecode } from "jwt-decode";

use([
    CanvasRenderer,
    BarChart,
    LineChart,
    GridComponent,
    TooltipComponent,
    LegendComponent,
    TitleComponent
]);

Vue.component('v-chart', ECharts)
Vue.use(Vuex);
Vue.use(ui);
Vue.use(util);
Vue.mixin(mixin);
// Vue.use(BootstrapVue)

Vue.config.productionTip = false;
Vue.prototype.store = store;


// let _gKey = process.env.VUE_APP_GOOGLE_MAP_KEY;


//Skip token Key for UI - 여기 변경해야 모바일 빌드가능
// var _skipToken = false;

/**
 * v-role 커스텀 디렉티브 등록
 * 사용법: <div v-role="['ROLE_ADMIN', 'ROLE_SADMIN']">...</div>
 */
Vue.directive('role', {
    inserted(el, binding) {
        const requiredRoles = Array.isArray(binding.value) ? binding.value : [binding.value];
        // adminStore의 adminInfo.roles에 접근
        const userRoles = store.getters['adminStore/getRoles'] || [];

        const hasRole = userRoles.some(role => requiredRoles.includes(role));

        if (!hasRole) {
            // 권한이 없으면 DOM에서 즉시 제거
            el.parentNode && el.parentNode.removeChild(el);
        }
    }
});

if(location.pathname === "/login" || location.pathname === "/pwdchange") {
        // _skipToken = true;
        Vue.prototype.$skipToken = true;
}

start();

// if(!_skipToken) {
//     const token =_storage.getItem(_tokenKey);
//    //start();
//     try {
//         if (token) {
//             let decodeToken = jwt.decode(token);
//             if (decodeToken) {
//                 let userData = JSON.stringify(decodeToken);
//                 _storage.setItem(_userKey, userData);
//
//                 start();
//             }
//         }else{
//             //window.location.href = "/login";
//             start();
//         }
//     }catch (err){
//         //window.location.href = "/login";
//     }
// } else {
//
//     start();
//
//
// }

function start() {
    var vm = new Vue({
        store,
        router,
        render: h => h(App),
    }).$mount("#app");

    // javascript 에서 vue 함수 호출 하기 위한 설정
    window.app = vm;
}

