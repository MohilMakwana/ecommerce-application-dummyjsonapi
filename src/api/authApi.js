import axiosInstance from './axiosInstance';

export async function loginUser({ username, password }) {
  return await axiosInstance.post('/auth/login', { username, password, expiresInMins: 60 });
}

export async function getAuthenticatedUser() {
  return await axiosInstance.get('/auth/me');
}

export async function refreshAuthToken(refreshToken) {
  return await axiosInstance.post('/auth/refresh', { refreshToken, expiresInMins: 60 });
}
