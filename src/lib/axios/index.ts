import { mmkvStorage } from "@/lib/storage/mmkv";
import axios, { type AxiosError, type AxiosRequestConfig } from "axios";

import { STORAGE_KEYS } from "../storage";

export const okamiHttpGateway = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    Authorization: `Bearer ${mmkvStorage.getString(STORAGE_KEYS.TOKEN)}`,
  },
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

let isRefreshing = false;

type FailRequestQueue = {
  onSuccess: (newToken: string) => void;
  onFailure: (error: AxiosError) => void;
}[];

let failRequestQueue: FailRequestQueue = [];

const refreshTokenCall = async (refreshToken: string) => {
  const response = await okamiHttpGateway.post("/auth/v2/refresh-token/mobile", {
    refreshToken,
  });

  const { token } = response.data;

  return {
    token,
  };
};

okamiHttpGateway.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const refreshToken = mmkvStorage.getString(STORAGE_KEYS.REFRESH_TOKEN);

    const originalConfig = error.config;

    if (isUnauthorizedError(error) && refreshToken) {
      if (!isRefreshing) {
        isRefreshing = true;

        refreshTokenCall(refreshToken)
          .then(({ token }) => {
            mmkvStorage.set(STORAGE_KEYS.TOKEN, token);
            okamiHttpGateway.defaults.headers.Authorization = `Bearer ${token}`;

            failRequestQueue.forEach((request) => {
              request.onSuccess(token);
            });
          })
          .catch((error) => {
            mmkvStorage.delete(STORAGE_KEYS.REFRESH_TOKEN);
            mmkvStorage.delete(STORAGE_KEYS.TOKEN);

            failRequestQueue.forEach((request) => {
              request.onFailure(error);
            });
          })
          .finally(() => {
            isRefreshing = false;
            failRequestQueue = [];
          });
      }

      return new Promise((resolve, reject) => {
        failRequestQueue.push({
          onFailure: (error: AxiosError) => {
            reject(error);
          },
          onSuccess: (token) => {
            if (originalConfig?.headers) {
              originalConfig.headers.Authorization = `Bearer ${token}`;

              return resolve(okamiHttpGateway(originalConfig));
            }
          },
        });
      });
    }

    return Promise.reject(error);
  },
);

export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;
