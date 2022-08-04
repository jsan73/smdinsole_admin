// 토큰관련 Store 구성
// 수정 불가

const adminStore = {
    namespaced: true,
    state: {
        adminInfo: {
            adminId: '',
            autoLogin:'',
            token:'',

        },
    },
    getters: {
        getAdminInfo: state => {
            return state.adminInfo
        },
        getToken: state=> {
            return state.adminInfo.token
        },

    },
    mutations: {
        setAdminInfo: (state, payload) => {
            state.adminInfo.adminId = payload.adminId;
            state.adminInfo.autoLogin = payload.autoLogin;
        },
        setToken: (state, token) => {
            state.adminInfo.token = token;
        }
    },
    actions: {
        commitAdminInfo: ({ commit }, payload) => {
            commit('setAdminInfo', payload)
        },
        commitToken: ({commit}, token) => {
            commit('setToken', token)
        },
    }
}

export default adminStore