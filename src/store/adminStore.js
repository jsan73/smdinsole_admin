// 토큰관련 Store 구성
// 수정 불가

const adminStore = {
    namespaced: true,
    state: {
        adminInfo: {
            adminId: '',
            autoLogin:'',
            token:'',
            // 초기 로드 시 sessionStorage에 값이 있으면 가져오고, 없으면 빈 값
            pwdChange: sessionStorage.getItem('admin_pwdChange') || ''

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
            // if(sessionStorage.getItem('admin_pwdChange') === "Y" || state.adminInfo.pwdChange === "Y")
            return sessionStorage.getItem('admin_pwdChange') || state.adminInfo.pwdChange
        },

    },
    mutations: {
        setAdminInfo: (state, payload) => {
            state.adminInfo.adminId = payload.adminId;
            state.adminInfo.autoLogin = payload.autoLogin;
            // 1. Vuex state 업데이트
            state.adminInfo.pwdChange = payload.pwdChange;
            // 2. sessionStorage에 저장 (브라우저 종료 시 자동삭제 대상)
            if (payload.pwdChange) {
                sessionStorage.setItem('admin_pwdChange', payload.pwdChange);
                console.log('Password change flag saved in sessionStorage');
            } else {
                sessionStorage.removeItem('admin_pwdChange');
                console.log('Password change flag removed from sessionStorage');
            }
        },
        setToken: (state, token) => {
            state.adminInfo.token = token;
        },
        setPwdChange: (state, payload) => {
            sessionStorage.setItem('admin_pwdChange', payload);
        },
        // 추가: pwdChange만 별도로 초기화해야 할 경우를 대비
        clearPwdChange: (state) => {
            state.adminInfo.pwdChange = 'N';
            sessionStorage.removeItem('admin_pwdChange');
        }
    },
    actions: {
        commitAdminInfo: ({ commit }, payload) => {
            commit('setAdminInfo', payload)
        },
        commitToken: ({commit}, token) => {
            commit('setToken', token)
        },
        commitPwdChange: ({commit}, payload) => {
            console.log('Password change flag updated:', payload);
            commit('setPwdChange', payload)
        },
        clearPwdChange: ({commit}) => {
            commit('clearPwdChange')
        },
    }
}

export default adminStore