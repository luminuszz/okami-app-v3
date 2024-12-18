import { useAuthControllerLoginV2 } from "@/api/okami";
import { useCallback, useMemo } from "react";
import { useOkamiToast } from "@/components/okami-toast";
import { useMMKVString } from "react-native-mmkv";
import { STORAGE_KEYS } from "@/lib/storage";
import { mmkvStorage } from "@/lib/mmkv";
import { router } from "expo-router";

type MakeLoginParams = {
  email: string;
  password: string;
};

export interface UseAuthProps {
  logout: () => void;
  login: (params: MakeLoginParams) => void;
  credentials: {
    token?: string;
    refreshToken?: string;
  };
  isAuth: boolean;
}

export function useAuth(): UseAuthProps {
  const toast = useOkamiToast();
  const [token, setToken] = useMMKVString(STORAGE_KEYS.TOKEN, mmkvStorage);
  const [refreshToken, setRefreshToken] = useMMKVString(STORAGE_KEYS.REFRESH_TOKEN, mmkvStorage);

  const { mutate: makeLogin } = useAuthControllerLoginV2({
    mutation: {
      async onSuccess(data) {
        setToken(data.token);
        setRefreshToken(data.refreshToken);

        router.replace("/home");
      },

      onError(error) {
        toast({
          title: "Erro ao fazer login",
          description: "Verifique suas credenciais e tente novamente" + error.message,
          action: "error",
        });
      },
    },
  });

  const logout = useCallback(() => {
    setToken("");
    setRefreshToken("");

    router.replace("/auth/sign-in");
  }, [setRefreshToken, setToken]);

  const login = (data: MakeLoginParams) => {
    makeLogin({
      data,
    });
  };

  const isAuth = useMemo(() => !!refreshToken, [refreshToken]);

  return {
    isAuth,
    login,
    logout,
    credentials: {
      token,
      refreshToken,
    },
  };
}
