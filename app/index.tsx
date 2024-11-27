import { authControllerRefreshToken } from "@/api/okami";
import { isUnauthorizedError, okamiHttpGateway } from "@/lib/axios";
import { useStorage } from "@/lib/storage";
import { AxiosError } from "axios";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";

let isRefreshing = false;

type FailRequestQueue = {
  onSuccess: (newToken: string) => void;
  onFailure: (error: AxiosError) => void;
}[];

const failRequestQueue: FailRequestQueue = [];

export default function IndexScreen() {
  const storageService = useStorage();

  useFocusEffect(
    useCallback(() => {
      const interceptorId = okamiHttpGateway.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
          const refreshToken = storageService.getString("REFRESH_TOKEN");

          if (isUnauthorizedError(error) && refreshToken) {
            if (!isRefreshing) {
              isRefreshing = true;

              authControllerRefreshToken({ refreshToken })
                .then(({ token }) => {
                  storageService.set("TOKEN", token);

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
                onFailure: (error) => reject(error),
                onSuccess: (token) => {
                  if (!error.config?.headers) return;

                  error.config.headers.Authorization = `Bearer ${token}`;

                  resolve(okamiHttpGateway(error.config));
                },
              });
            });
          }

          router.replace("/auth/sign-in");

          return Promise.reject(error);
        },
      );

      return () => {
        okamiHttpGateway.interceptors.response.eject(interceptorId);
      };
    }, [storageService]),
  );

  return null;
}
