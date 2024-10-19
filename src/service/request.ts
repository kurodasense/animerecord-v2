import axios, { type AxiosRequestConfig } from "axios";

export function request(config: AxiosRequestConfig) {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
  });
  instance.interceptors.request.use((config) => {
    // if (store.state) config.headers.Authorization = store.state.token;
    return config;
  });
  return instance(config);
}
