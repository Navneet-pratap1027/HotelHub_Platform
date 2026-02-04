import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api", 
  withCredentials: true, // Isse cookies aur sessions backend tak jayenge
});

// Optional: Response Interceptor (Errors ko handle karne ke liye)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Agar user authorized nahi hai toh login par bhej sakte hain
      console.log("Unauthorized, please login.");
    }
    return Promise.reject(error);
  }
);

export default API;