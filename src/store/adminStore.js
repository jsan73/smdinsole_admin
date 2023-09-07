// 토큰관련 Store 구성
// 수정 불가

const adminStore = {
    namespaced: true,
    state: {
        adminInfo: {
            adminId: '',
            autoLogin:'',
            token:'',
            pwdChange:''

        },
    },
    getters: {
        // getAdminInfo: state => {
        //     return state.adminInfo
        // },
        getToken: state=> {
            return state.adminInfo.token
        },
        getPwdChange: state=> {
            return state.adminInfo.pwdChange
        },

    },
    mutations: {
        setAdminInfo: (state, payload) => {
            state.adminInfo.adminId = payload.adminId;
            state.adminInfo.autoLogin = payload.autoLogin;
            state.adminInfo.pwdChange = payload.pwdChange;
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