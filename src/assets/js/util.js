export default {
	install(Vue) {
		// window Open
		Vue.prototype.$open = function (url, name, style, replace, domain = "") {
			let _url = url;
			if (domain !== "") _url = domain + _url;

			// style 값 , 구분으로 분리
			let styles = style.split(",");
			let width = 1280; // style 에 width 값이 없는 경우 default 값
			let height = 880; // style 에 height 값이 없는 경우 default 값
			let top;
			let left;
			let scrollbars = "no"; // style 에 scrollbars 값이 없는 경우 default 값
			// style 값에 width,height,scrollbars 값이 있을 경우 default 값 수정
			styles.forEach(function (val) {
				let s = val.split("=");
				let k = s[0].trim();
				let v = s[1];
				width = (k === "width") ? (parseInt(v) > 1280) ? width : parseInt(v) : width;
				height = (k === "height") ? (parseInt(v) > 900) ? height : parseInt(v) : height;
				scrollbars = (k === "scrollbars") ? v : scrollbars;
			});

			top = Math.round((screen.height - height) / 2); // 팝업 오픈시 top 위치 값
			left = Math.round((screen.width - width) / 2); // 팝업 오픈시 left 위치 값

			// 팝업 창 스타일 값 update
			let _style = [
				"width=" + width,
				"height=" + height,
				"top=" + top,
				"left=" + left,
				"scrollbar=" + scrollbars
			].join(", ");

			return window.open(
				_url,
				name,
				_style,
			);
		},
		Vue.prototype.$datatable = function (datatable, headings, dataList, columns) {
			const tables = this.$refs.datatable

			const data = dataList.map(item => Object.values(item))
			dataList ={"headings": headings, "data": data}
			if(datatable) datatable.destroy();
			return new window.simpleDatatables.DataTable(tables, {
				data: dataList,
				columns: columns
			});
		}

    }
}
