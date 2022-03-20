import axios from "axios";
import { convertParamsToQuery } from "../../utility/Utils";
const PostService = {
    getPost: async (params) => {
        let queryString = convertParamsToQuery(params);
        return axios({
            method: 'GET',
            url: process.env.REACT_APP_BASE_SERVER_URL + queryString
        })
    }
}
export default PostService;