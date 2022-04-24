import newAxios, { BASE_URL } from "../newAxios";
import { convertParamsToQuery } from "../../utility/Utils";
const ShipperService = {
    getShipper: async (params) => {
        params = params ? params : {}
        return newAxios.post('/shipper/get-shipper', params).catch(err => console.log("Get Shipper Service Fail: ", err.message));
    },
    addShipper: async (params) => {
        params = params ? params : ''
        return newAxios.post('/shipper/add-shipper', params).catch(err => console.log("Add Shipper Service Fail: ", err.message));
    },
    findShipper: async (params) => {
        params = params ? params : {}
        return newAxios.post('/shipper/find-shipper', params).catch(err => console.log("Find Shipper Service Fail: ", err.message));
    },
    deleteShipper: async (params) => {
        params = params ? params : {}
        return newAxios.post('/shipper/delete-shipper', params).catch(err => console.log("Delete Shipper Service Fail: ", err.message));
    },
    getShipperDetail: async (params) => {
        params = params ? params : {}
        return newAxios.post('/shipper/shipper-detail', params).catch(err => console.log("Get Shipper Detail Service Fail: ", err.message));
    },
    getJob: async (params) => {
        params = params ? params : {}
        return newAxios.post('/shipper/get-job', params).catch(err => console.log("Get job Service Fail: ", err.message));
    },
    updateJob: async (params) => {
        params = params ? params : {}
        return newAxios.post('/shipper/update-job', params).catch(err => console.log("Update job Service Fail: ", err.message));
    },

}
export default ShipperService;