import newAxios, { BASE_URL } from "../newAxios";
import { convertParamsToQuery } from "../../utility/Utils";
const OrderService = {
    createOrder: async (params) => {
        params = params ? params : {}
        return newAxios.post('/order/create', params)
            .catch(err => console.log("Create Comment Service Fail: ", err.message));
    },
    deleteOrder: async (params) => {
        params = params ? params : {}
        return newAxios.post('/order/delete', params).catch(err => console.log("Delete Order Service Fail: ", err.message));
    },
    getOrder: async (params) => {
        params = params ? params : ''
        return newAxios.get('/order/get-order' + params).catch(err => console.log("Get Order Service Fail: ", err.message));
    },
    editOrder: async (params) => {
        params = params ? params : {}
        return newAxios.post('/order/edit', params).catch(err => console.log("Edit Order Service Fail: ", err.message));
    },

    updateStatus: async (params) => {
        params = params ? params : ''
        return newAxios.put('/order/changeStatus' + params).catch(err => console.log("Update Order Status Service Fail: ", err.message));
    },
    getTotalEarn: async (params) => {
        params = params ? params : {}
        return newAxios.put('/order/totalEarn', params).catch(err => console.log("Get Order Total Earn Service Fail: ", err.message));
    },
}
export default OrderService;