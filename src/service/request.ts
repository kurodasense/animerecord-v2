import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import type { IRequestType } from "./types";
import useRootState from "@/stores";

export function request(config: AxiosRequestConfig): Promise<AxiosResponse<IRequestType>> {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
  });
  const rootState = useRootState();
  instance.interceptors.request.use((config) => {
    if (rootState.token) config.headers.Authorization = rootState.token;
    return config;
  });
  return instance(config);
}
