import { mmkvStorage } from "@/lib/storage/mmkv";
import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { isPast } from "date-fns";
import { jwtDecode } from "jwt-decode";
import { env } from "../env";
import { STORAGE_KEYS } from "../storage";

export const okamiHttpGateway = axios.create({
  baseURL: env.EXPO_PUBLIC_API_URL,
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

const refreshTokenCall = async (
  refreshToken: string,
): Promise<[string, false] | [null, AxiosError]> => {
  try {
    const response = await okamiHttpGateway.post("/auth/v2/refresh-token", {
      refreshToken,
    });

    const { token } = response.data;

    return [token, false];
  } catch (e) {
    return [null, e as AxiosError];
  }
};

const isTokenExpired = (token: string | null): boolean => {
  if (!token) return false;

  const { exp } = jwtDecode(token);

  return isPast(new Date(Number(exp) * 1000));
};

let isRefreshing = false;

const updateTokenByRefreshToken = async () => {
  isRefreshing = true;

  const refreshToken = mmkvStorage.getString(STORAGE_KEYS.REFRESH_TOKEN);

  const [newToken, error] = await refreshTokenCall(refreshToken ?? "");

  if (error) {
    return null;
  }

  mmkvStorage.set(STORAGE_KEYS.TOKEN, newToken);

  isRefreshing = false;

  return newToken;
};

okamiHttpGateway.interceptors.request.use(async (config) => {
  let token = mmkvStorage.getString(STORAGE_KEYS.TOKEN) ?? null;

  if (config.headers) {
    if (isTokenExpired(token) || !isRefreshing) {
      token = await updateTokenByRefreshToken();
    }

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;
