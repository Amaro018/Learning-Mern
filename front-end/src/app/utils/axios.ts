import axios from "axios";

const api = axios.create({
  baseURL: process.env.API_PATH,
  withCredentials: true,
});

export default api;
