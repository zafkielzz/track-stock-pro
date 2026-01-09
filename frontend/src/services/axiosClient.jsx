import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Bạn có thể thêm Interceptors để tự động đính kèm Token đăng nhập vào đây sau này
export default axiosClient;
