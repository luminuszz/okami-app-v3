import { mmkvStorage } from "@/lib/storage/mmkv";
import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { STORAGE_KEYS } from "../storage";

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

export const isUnauthorizedError = (error: AxiosError): boolean =>
  [401, 403].includes(error.response?.status || 0);

okamiHttpGateway.interceptors.request.use(async (config) => {
  if (config.headers) {
    const token = mmkvStorage.getString(STORAGE_KEYS.TOKEN);

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const refreshTokenCall = async (refreshToken: string) => {
  const response = await okamiHttpGateway.post("/auth/v2/refresh-token", {
    refreshToken,
  });

  const { token } = response.data;

  return {
    token,
  };
};

export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;
