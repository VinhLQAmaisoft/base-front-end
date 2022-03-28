import newAxios, { BASE_URL } from "../newAxios";
import { convertParamsToQuery } from "../../utility/Utils";
const CommentService = {
    getComment: async (params) => {
        params = params ? params : ''
        return newAxios.get('/comment/get-comment' + params).catch(err => console.log("Get Comment Service Fail: ", err.message));
    },
    scanComment: async (params) => {
        params = params ? params : {}
        return newAxios.post('/comment/scan-comment', params).catch(err => console.log("Scan Comment Service Fail: ", err.message));
    },
    replyComment: async (params) => {
        params = params ? params : {}
        return newAxios.post('/comment/reply-comment', params).catch(err => console.log("Reply Comment Service Fail: ", err.message));
    },

    createComment: async (params) => {
        params = params ? params : {}
        return newAxios.post('/comment/create-comment', params).catch(err => console.log("Create Comment Service Fail: ", err.message));
    },
}
export default CommentService;