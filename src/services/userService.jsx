import axiosClient from "./axiosClient";

const userService = {
  // Params Để thêm filter :
  // const myFilter = {
  //     page: 1,
  //     limit: 10,
  //     search: 'Samsung',
  //     category: 'Phone'
  // };

  // productService.getAll(myFilter);

  // Axios sẽ tự động nối chuỗi thành:
  // URL gọi đi: http://localhost:8080/api/products?page=1&limit=10&search=Samsung&category=Phone
  getAll: (params) => {
    return axiosClient.get("/users", { params });
  },

  getById: (id) => {
    return axiosClient.get(`/users/${id}`);
  },

  create: (payload) => {
    return axiosClient.post("/users", payload);
  },

  //   update: (id, data) => {
  //     return axiosClient.put(`/products/${id}`, data);
  //   },

  //   delete: (id) => {
  //     return axiosClient.delete(`/products/${id}`);
  //   },
};

export default userService;
