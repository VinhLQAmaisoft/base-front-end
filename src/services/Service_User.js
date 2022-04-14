import newAxios, { BASE_URL } from "./newAxios";
const UserService = {
    getProfile: async (params) => {
        params = params ? params : ''
        return newAxios.post('/account/profile', params).catch(err => console.log("Get Profile Service Fail: ", err.message));
    },
    updateProfile: async (params) => {
        params = params ? params : {}
        return newAxios.put('/account/profile', params).catch(err => console.log("Update Profile Service Fail: ", err.message));
    },
    addCookie: async (params) => {
        params = params ? params : {}
        return newAxios.post('/account/cookie', params).catch(err => console.log("Add User Cookie Service Fail: ", err.message));
    },
    getCookie: async (params) => {
        params = params ? params : ''
        return newAxios.get('/account/cookie' + params).catch(err => console.log("Get User Cookie Service Fail: ", err.message));
    },
    getGroupList: async (params) => {
        params = params ? params : ''
        return newAxios.get('/account/group-list' + params).catch(err => console.log("Get User Group List Service Fail: ", err.message));
    },
    changePassword: async (params) => {
        params = params ? params : {}
        return newAxios.put('/account/changePassword', params).catch(err => console.log("Change User Password Service Fail: ", err.message));
    },
    getUserDetail: async (params) => {
        params = params ? params : ''
        return newAxios.get('/account/user-detail' + params).catch(err => console.log("GET USER DETAIL DATA Service Fail: ", err.message));
    },
}
export default UserService;