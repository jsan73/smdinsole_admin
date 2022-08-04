import utils from "@/utils/utils";

const mixin = {
	data() {
		return {
			// datatable:Object
		}
	},
	computed: {

	},
	mounted() {
		// const tables = this.$refs.datatable
		// if(tables) {
		// 	this.datatable = new simpleDatatables.DataTable(tables);
		//
		//
		// 	this.datatable.on('datatable.page', function (page) {
		//
		// 	})
		// }
	},
	methods: {
		// Native 호출

		showAlert(v) {

			let _this = this;
			// Alert 자동 닫기
			// if(v.autoClose !== undefined && v.autoClose > 0) {
			// 	v.btnTxtL = '';
			// 	v.btnTxtR = '';
			// 	// v.hasClose = true;
			//
			// 	var time = v.autoClose * 1000;
			// 	setTimeout(()=>{ _this.$root.$children[0].$refs.refAlert.hideAlert(); }, time);
			// }

			// Alert Key Event
			// if(v.btnTxtL !== '' && v.btnTxtL !== '') {
			// 	_this.abort = new AbortController();
			// 	window.addEventListener("keydown", (e) => {
			//
			// 		if(e.keyCode === 32) {
			// 			let v = this.$root.$children[0].alertData;
			// 			if(v.btnTxtL !== '') {
			// 				_this.$root.$children[0].$refs.refAlert.left(e);
			// 			}
			// 		}
			// 	}, {signal: _this.abort.signal, passive: true});
			// }

			// Alert Open
			this.$root.$children[0].alertData = {...this.$root.$children[0].alertData, ...v};
			//console.log(this.$root.$children[0].alertData);
			this.$root.$children[0].alertData.show = true;
			//this.$root.$children[0].$refs.refAlert.showAlert();

		},
		hideAlert() {

			// if(this.abort !== null) {
			// 	this.abort.abort();
			// 	this.abort = null;
			// }
			console.log("gkdlem");

			this.$root.$children[0].alertData = {
				show: false,
				msg: '',
			}
			//this.$root.$children[0].$refs.refAlert.closeAlert();
		},
		openPopup(msg, ok, cancel, doAction, param, alertType) {
			if(utils.isEmpty(alertType)) alertType =  0;
			if(utils.isEmpty(doAction)) doAction =  this.hideAlert;
			let v= {
				msg: msg,
				btnO:ok,
				btnC:cancel,
				doAction: doAction,
				doActionParam: param,
				alertType:alertType
			}
			this.showAlert(v);
		},
		gotoBack() {
			this.$router.go(-1);
		}
	}
}

export default mixin;
