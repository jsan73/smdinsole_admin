import Vue from "vue";
import Vuex from 'vuex'
import App from "./App.vue";
import router from "./router/router";
import store from "./store/index"
import mixin from "./utils/mixin"
import ui from "./components";
import util from "./assets/js/util"
// import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../public/static/css/admin_style.css'
import '../public/assets/vendor/simple-datatables/style.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(Vuex);
Vue.use(ui);
Vue.use(util);
Vue.mixin(mixin);
// Vue.use(BootstrapVue)

Vue.config.productionTip = false;
Vue.prototype.store = store;

let _gKey = process.env.VUE_APP_GOOGLE_MAP_KEY;


//Skip token Key for UI - 여기 변경해야 모바일 빌드가능
var _skipToken = false;

if(location.pathname === "/login") {
    _skipToken = true;
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
    new Vue({
        store,
        router,
        render: h => h(App),
    }).$mount("#app");
}

