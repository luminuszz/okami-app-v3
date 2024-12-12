import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { storage, STORAGE_KEYS } from "../storage";

export const okamiHttpGateway = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

export const customInstance = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
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

export const isUnauthorizedError = (error: AxiosError): boolean => [401, 403].includes(error.response?.status || 0);

let isRefreshing = false;

type FailRequestQueue = {
  onSuccess: (newToken: string) => void;
  onFailure: (error: AxiosError) => void;
}[];

const failRequestQueue: FailRequestQueue = [];

okamiHttpGateway.interceptors.request.use(async (config) => {
  if (config.headers) {
    const token = await storage.getItem(STORAGE_KEYS.TOKEN);
    config.headers["Authorization"] = `Bearer ${token}`;
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

okamiHttpGateway.interceptors.response.use(
  (response) => response,
  async (error) => {
    const refreshToken = await storage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    if (isUnauthorizedError(error) && refreshToken) {
      if (!isRefreshing) {
        isRefreshing = true;

        refreshTokenCall(refreshToken)
          .then(({ token }) => {
            storage.setItem(STORAGE_KEYS.TOKEN, token);

            failRequestQueue.forEach((request) => {
              request.onSuccess(token);
            });
          })
          .catch((error) => {
            failRequestQueue.forEach((request) => {
              request.onFailure(error);
            });
          })
          .finally(() => {
            isRefreshing = false;
          });
      }

      return new Promise((resolve, reject) => {
        failRequestQueue.push({
          onFailure: (error) => {
            reject(error);
          },
          onSuccess: (token) => {
            if (!error.config?.headers) return;

            error.config.headers.Authorization = `Bearer ${token}`;

            resolve(axios(error.config));
          },
        });
      });
    }

    return Promise.reject(error);
  },
);

export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;
