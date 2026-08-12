import axios from "axios";

const baseURL =
  import.meta.env.PROD
    ? "https://deployed-url.com/"
    : "http://localhost:8000/";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
