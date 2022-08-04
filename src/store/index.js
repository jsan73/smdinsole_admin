import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";		// 새로고침시에도 state 유지
import createMutationsSharer from "vuex-shared-mutations";

// 작성한 모듈을 가져옵니다.
import adminStore from '@/store/adminStore.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules: {
		plugins: [createPersistedState()],
		// 키: 값 형태로 저장됩니다.
		adminStore: adminStore,
	},
	plugins: [
		createPersistedState({
			//주목! : 여기에 쓴 모듈만 저장됩니다.
			paths: ["adminStore"],
		}),
		createMutationsSharer({
			predicate: []
		})
	],

})

export default store