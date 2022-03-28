import newAxios, { BASE_URL } from "../newAxios";
import { convertParamsToQuery } from "../../utility/Utils";
const CookieService = {
    createCookie: async (params) => {
        params = params ? params : {}
        return newAxios.get('/cookie/create', params)
            .catch(err => console.log("Create Comment Service Fail: ", err.message));
    },
    deleteCookie: async (params) => {
        params = params ? params : {}
        return newAxios.post('/cookie/delete', params).catch(err => console.log("Delete Cookie Service Fail: ", err.message));
    },
    getAllCookie: async (params) => {
        params = params ? params : {}
        return newAxios.post('/cookie/getAll', params).catch(err => console.log("Get All Cookie Service Fail: ", err.message));
    },
    updateCookie: async (params) => {
        params = params ? params : {}
        return newAxios.put('/cookie/update', params).catch(err => console.log("Update Cookie Service Fail: ", err.message));
    },
    getOne: async (params) => {
        params = params ? params : {}
        return newAxios.put('/cookie/getOne', params).catch(err => console.log("Get One Cookie Service Fail: ", err.message));
    },
}
export default CookieService;