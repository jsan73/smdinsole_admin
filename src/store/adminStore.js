// 토큰관련 Store 구성
// 수정 불가
import { jwtDecode } from 'jwt-decode';

const adminStore = {
    namespaced: true,
    state: {
        adminInfo: {
            adminId: '',
            autoLogin:'',
            token:'',
            roles: [],
            // 초기 로드 시 sessionStorage에 값이 있으면 가져오고, 없으면 빈 값
            pwdChangeType: sessionStorage.getItem('admin_pwdChangeType') || 'N'

        },
    },
    getters: {
        getToken: state => state.adminInfo.token,
        getRoles: state => state.adminInfo.roles,
        getPwdChange: state => sessionStorage.getItem('admin_pwdChangeType') || state.adminInfo.pwdChangeType,

        // 편리한 권한 체크를 위한 Getter 추가
        isAdmin: state => state.adminInfo.roles.includes('ROLE_ADMIN'),
        isSuperAdmin: state => state.adminInfo.roles.includes('ROLE_SADMIN'),
        // 관리자 권한 중 하나라도 있는지 확인
        hasAnyAdminRole: state => state.adminInfo.roles.some(role => ['ROLE_ADMIN', 'ROLE_SADMIN'].includes(role))

    },
    mutations: {
        setAdminInfo: (state, payload) => {
            state.adminInfo.adminId = payload.adminId;
            state.adminInfo.autoLogin = payload.autoLogin;
            // 1. Vuex state 업데이트
            state.adminInfo.pwdChangeType = payload.pwdChangeType;
            // 2. sessionStorage에 저장 (브라우저 종료 시 자동삭제 대상)

            sessionStorage.setItem('admin_pwdChangeType', payload.pwdChangeType);
            // if (payload.pwdChangeType) {
            //     sessionStorage.setItem('admin_pwdChangeType', payload.pwdChangeType);
            //     console.log('Password change flag saved in sessionStorage');
            // } else {
            //     sessionStorage.removeItem('admin_pwdChangeType');
            //     console.log('Password change flag removed from sessionStorage');
            // }
        },
        setToken: (state, token) => {
            state.adminInfo.token = token;
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    state.adminInfo.roles = decoded.roles || [];
                    // 토큰 내의 loginId를 adminId로 동기화 (선택 사항)
                    // state.adminInfo.adminId = decoded.loginId || state.adminInfo.adminId;
                } catch (e) {
                    console.error("Token decoding failed:", e);
                    state.adminInfo.roles = [];
                }
            } else {
                state.adminInfo.roles = [];
            }
        },
        setPwdChange: (state, payload) => {
            sessionStorage.setItem('admin_pwdChangeType', payload);

        },
        // 추가: pwdChange만 별도로 초기화해야 할 경우를 대비
        clearPwdChange: (state) => {
            state.adminInfo.pwdChange = 'N';
            sessionStorage.removeItem('admin_pwdChangeType');
        },
        clearAuth: (state) => {
            state.adminInfo.token = '';
            state.adminInfo.roles = [];
            state.adminInfo.adminId = '';
            sessionStorage.removeItem('admin_pwdChangeType');
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
        logout: ({ commit }) => {
            commit('clearAuth');
        }
    }
}

export default adminStore