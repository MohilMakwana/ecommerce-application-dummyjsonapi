import axiosInstance from './axiosInstance';

export async function fetchUserCart(userId) {
  return await axiosInstance.get(`/carts/user/${userId}`);
}

export async function addCart(userId, products) {
  return await axiosInstance.post('/carts/add', { userId, products });
}
