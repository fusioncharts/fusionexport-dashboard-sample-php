import axios from "axios";


const instance = axios.create({
  baseURL: process.env.VUE_APP_DATA_SERVER
});

export default {
  get: (endPoint, payload) => instance.get(endPoint, payload),
  post: (endPoint, payload) => instance.post(endPoint, payload)
};
