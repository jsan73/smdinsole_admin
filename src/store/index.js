import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";		// 새로고침시에도 state 유지
import createMutationsSharer from "vuex-shared-mutations";

// 작성한 모듈을 가져옵니다.
import adminStore from '@/store/adminStore.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules: {
		// plugins: [createPersistedState()],
		// 키: 값 형태로 저장됩니다.
		adminStore: adminStore,
	},
	plugins: [
		createPersistedState({
			// adminStore 모듈 전체를 로컬스토리지에 유지 (새로고침 대응)
			paths: ["adminStore"],
		}),
		createMutationsSharer({
			// 브라우저 탭 간의 상태 동기화 (필요한 경우만 추가)
			predicate: ["adminStore/setToken", "adminStore/setAdminInfo"]
		})
	],

})

export default store