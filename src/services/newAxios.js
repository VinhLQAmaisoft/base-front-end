import axios from 'axios';

export const BASE_URL = 'http://localhost:3000';

const instance = axios.create({
    baseURL: BASE_URL
});

const getCookie = (cname) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

instance.interceptors.request.use(config => {
    const token = getCookie('token')
    config.headers.Authorization = token ? `Bearer ${token}`: '';
    return config;
}, err => {
    return Promise.reject(err);
})

export default instance;