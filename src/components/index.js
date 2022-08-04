// 레이아웃 유형
//import TempLayout from "./layout/TempLayout.vue"
import DefaultLayout from "./layout/DefaultLayout.vue"
import PopupLayout from "./layout/PopupLayout.vue"
//import LayerLayout from "./layout/LayerLayout.vue"
import Header from "./common/Header.vue"
import Footer from "./common/Footer.vue"



export default {
	install(Vue) {
		//Layout
//		Vue.component("Temp-Layout", TempLayout);
		Vue.component("Default-Layout", DefaultLayout);
//		Vue.component("Layer-Layout", LayerLayout);
		Vue.component("Header", Header);
		Vue.component("Footer", Footer);
		Vue.component("Popup-Layout", PopupLayout);
//		Vue.component("Gnb", Gnb);

		//Component
		// Vue.component("Checkbox", Checkbox);
		// Vue.component("Radio", Radio);
		// Vue.component("InputText", InputText);
		// Vue.component("Switcher", Switcher);
		// Vue.component("Selectbox", Selectbox);
		// Vue.component("MultiSelect", MultiSelect);
		// Vue.component("OrgList", OrgList);
		// Vue.component("SelectboxTree", SelectboxTree);
		// Vue.component("RangeCalendar", RangeCalendar);
		// Vue.component("Calendar", Calendar);
		// Vue.component("Textarea", Textarea);
		// Vue.component("Tabs", Tabs);
		// Vue.component("TabsRoute", TabsRoute);
		// Vue.component("TabSlider", TabSlider);
		// Vue.component("TabSliderRoute", TabSliderRoute);
		// Vue.component("Popup", Popup);
		//
		// //Plugin
		// Vue.component("VueBottomSheet", VueBottomSheet);
	}
}
