import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { storage } from "./storage";

export const okamiHttpGateway = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const controller = new AbortController();

  const promise = okamiHttpGateway({
    ...config,
    ...options,
    signal: controller.signal,
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    controller.abort();
  };

  return promise;
};

okamiHttpGateway.interceptors.request.use(async (config) => {
  if (config.headers) {
    const token = await storage.getItem("TOKEN");

    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;

export const isUnauthorizedError = (error: AxiosError): boolean =>
  [401, 403].includes(error.response?.status || 0);

export const refreshTokenInterceptor = {
  onSuccess: (axiosCall: AxiosResponse) => axiosCall,
};
