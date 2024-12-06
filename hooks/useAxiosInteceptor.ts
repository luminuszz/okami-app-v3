import { authControllerRefreshToken } from "@/api/okami";
import { isUnauthorizedError, okamiHttpGateway } from "@/lib/axios";
import { storage, useStorage } from "@/lib/storage";
import { AxiosError } from "axios";
import { router } from "expo-router";
import { useEffect } from "react";

let isRefreshing = false;

type FailRequestQueue = {
  onSuccess: (newToken: string) => void;
  onFailure: (error: AxiosError) => void;
}[];

const failRequestQueue: FailRequestQueue = [];

export function useAxiosInterceptor() {
  const storageService = useStorage();

  useEffect(() => {
    const interceptorIdRequest = okamiHttpGateway.interceptors.request.use(async (config) => {
      if (config.headers) {
        const token = await storage.getItem("TOKEN");

        config.headers["Authorization"] = `Bearer ${token}`;
      }

      config.baseURL = process.env.EXPO_PUBLIC_API_URL;

      return config;
    });

    const interceptorIdResponse = okamiHttpGateway.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const refreshToken = await storageService.getString("REFRESH_TOKEN");

        if (isUnauthorizedError(error) && refreshToken) {
          if (!isRefreshing) {
            isRefreshing = true;

            authControllerRefreshToken({ refreshToken })
              .then(({ token }) => {
                storage.setItem("TOKEN", token);

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
                router.replace("/auth/sign-in");
              },
              onSuccess: (token) => {
                if (!error.config?.headers) return;

                error.config.headers.Authorization = `Bearer ${token}`;

                resolve(okamiHttpGateway(error.config));
              },
            });
          });
        }

        return Promise.reject(error);
      },
    );
    return () => {
      okamiHttpGateway.interceptors.response.eject(interceptorIdResponse);
      okamiHttpGateway.interceptors.request.eject(interceptorIdRequest);
    };
  }, [storageService]);
}
