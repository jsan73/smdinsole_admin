<template>
	<div class="popup-layout-compact">
		<router-view></router-view>
	</div>
</template>
<script>
	export default {
		name: "PopupLayout",
	};
</script>
<style>
.popup-layout-compact {
	min-height: 100vh;
	max-height: 100vh;
	overflow-y: auto;
	font-size: 13px;
}

.popup-layout-compact > .p-4,
.popup-layout-compact > .m-4 {
	padding: 1rem !important;
	margin: 0 !important;
}

.popup-layout-compact label,
.popup-layout-compact .form-label,
.popup-layout-compact .table {
	font-size: 13px;
}

.popup-layout-compact .form-control:not(textarea),
.popup-layout-compact .form-select {
	min-height: 32px;
	padding: 0.25rem 0.5rem;
	font-size: 13px;
}

.popup-layout-compact textarea.form-control {
	padding: 0.35rem 0.5rem;
	font-size: 13px;
}

.popup-layout-compact .btn:not(.btn-close) {
	min-height: 30px;
	padding: 0.25rem 0.5rem;
	font-size: 13px;
}

.popup-layout-compact .table > :not(caption) > * > * {
	padding: 0.35rem 0.5rem;
}

.popup-layout-compact .popup-form-table > :not(caption) > * > * {
	padding: 3px 6px;
	line-height: 1.2;
}

.popup-layout-compact .popup-form-table .form-control:not(textarea),
.popup-layout-compact .popup-form-table .form-select {
	height: 29px;
	min-height: 29px;
	padding: 2px 6px;
	line-height: 1.2;
}

</style>
