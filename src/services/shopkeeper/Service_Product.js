import newAxios, { BASE_URL } from "../newAxios";
import { convertParamsToQuery } from "../../utility/Utils";
const ProductService = {
    createProduct: async (params) => {
        params = params ? params : {}
        return newAxios.post('/product/create', params).catch(err => console.log("Create Comment Service Fail: ", err.message));
    },
    getProduct: async (params) => {
        params = params ? params : ''
        return newAxios.get('/product/get' + params).catch(err => console.log("Get Product Service Fail: ", err.message));
    },
    updateProduct: async (params) => {
        params = params ? params : {}
        return newAxios.put('/product/edit', params).catch(err => console.log("Update Product Service Fail: ", err.message));
    },
    deleteProduct: async (params) => {
        params = params ? params : {}
        return newAxios.post('/product/delete', params).catch(err => console.log("Delete Product Service Fail: ", err.message));
    },
    countProduct: async (params) => {
        params = params ? params : ''
        return newAxios.get('/product/count' + params).catch(err => console.log("Count Product Service Fail: ", err.message));
    },

}
export default ProductService;