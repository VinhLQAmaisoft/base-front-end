import axios from 'axios';
import Cookies from 'universal-cookie';
export const BASE_URL = process.env.REACT_APP_BASE_SERVER_URL;

const instance = axios.create({
  baseURL: BASE_URL
});

const getCookie = (cname) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  console.log("Base Cookie:")
  for (let i = 0; i < ca.length; i++) {
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
  const cookies = new Cookies();
  const token = cookies.get("token")
  const newToken = getCookie('token')
  console.log("Token: ", cookies.getAll())
  console.log(newToken)
  config.headers.Authorization = token ? `${token}` : '';
  return config;
}, err => {
  return Promise.reject(err);
})

export default instance;