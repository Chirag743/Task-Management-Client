import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://deployed-url.com/"
    : "http://localhost:8000/";

const api = axios.create({
  baseURL,
});

export default api;
