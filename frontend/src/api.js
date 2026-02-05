import axios from "axios";

const API = axios.create({
  // baseURL se /v1 hata dein kyunki aapke backend routes direct /api se shuru ho rahe hain
  baseURL: "http://localhost:3000/api", 
  withCredentials: true, 
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized: Please login again.");
    }
    return Promise.reject(error);
  }
);

export default API;