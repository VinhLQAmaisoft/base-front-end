import newAxios, { BASE_URL } from "../newAxios";
import { convertParamsToQuery } from "../../utility/Utils";
const AttachmentService = {
    uploadImage: async (formData) => {
        return newAxios.post('/uploadfile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).catch(err => console.log("Upload Image Service Fail: ", err.message));
    },
}
export default AttachmentService;