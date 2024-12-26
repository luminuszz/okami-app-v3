import { useAuthControllerLoginV2 } from "@/api/okami";
import { useOkamiToast } from "@/components/okami-toast";
import { STORAGE_KEYS } from "@/lib/storage";
import { mmkvStorage } from "@/lib/storage/mmkv";
import { router } from "expo-router";
import { createContext, useCallback, useContext, useMemo } from "react";
import { useMMKVString } from "react-native-mmkv";

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
  isAuthLoginPending: boolean;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<UseAuthProps>({} as UseAuthProps);

export function AuthProvider({ children }: AuthProviderProps) {
  const toast = useOkamiToast();
  const [token, setToken] = useMMKVString(STORAGE_KEYS.TOKEN, mmkvStorage);
  const [refreshToken, setRefreshToken] = useMMKVString(STORAGE_KEYS.REFRESH_TOKEN, mmkvStorage);

  const { mutate: makeLogin, isPending } = useAuthControllerLoginV2({
    mutation: {
      async onSuccess(data) {
        setToken(data.token);
        setRefreshToken(data.refreshToken);

        router.replace("/(app)/home");
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

    router.replace("/sign-in");
  }, [setRefreshToken, setToken]);

  const login = (data: MakeLoginParams) => {
    makeLogin({
      data,
    });
  };

  const isAuth = useMemo(() => !!refreshToken, [refreshToken]);

  return (
    <AuthContext.Provider
      value={{ login, logout, isAuth, isAuthLoginPending: isPending, credentials: { token, refreshToken } }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): UseAuthProps {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
