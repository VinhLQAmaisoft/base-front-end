import newAxios, { BASE_URL } from "../newAxios";
import { convertParamsToQuery } from "../../utility/Utils";
const PostService = {
    getPost: async (params) => {
        params = params ? params : ''
        return newAxios.get('/post/get-post' + params).catch(err => console.log("Get Post Service Fail: ", err.message));
    },
    uploadPost: async (params) => {
        params = params ? params : {}
        return newAxios.post('/post/create', params).catch(err => console.log("Upload Post Service Fail: ", err.message));
    },
    disablePost: async (params) => {
        params = params ? params : {}
        return newAxios.post('/post/disable', params).catch(err => console.log("Disable Post Service Fail: ", err.message));
    }
}
export default PostService;