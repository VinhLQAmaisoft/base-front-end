import newAxios, { BASE_URL } from "../newAxios";
import { convertParamsToQuery } from "../../utility/Utils";
const PostService = {
    getPost: async (params) => {
        let queryString = convertParamsToQuery(params);
        return newAxios({
            method: 'GET',
            url: process.env.REACT_APP_BASE_SERVER_URL + queryString
        })
    }
}
export default PostService;