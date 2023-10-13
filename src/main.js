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

