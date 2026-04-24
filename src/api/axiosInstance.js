import axios from 'axios';
import { API_BASE_URL, AUTH_STORAGE_KEY } from '../utils/constants';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        try {
            const raw = localStorage.getItem(AUTH_STORAGE_KEY);
            if (raw) {
                const { token } = JSON.parse(raw);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        } catch (e) {
            // Ignore storage errors safely
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response.data, 
    (error) => {
        // Optionally standardize error messages
        const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
        return Promise.reject(new Error(message));
    }
);

export default axiosInstance;
