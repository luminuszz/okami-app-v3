import {
  useAuthControllerLoginV2, useAuthControllerLoginV2Mobile,
  useAuthControllerLogout,
  useAuthControllerRegister,
} from "@/api/okami";
import { useOkamiToast } from "@/components/okami-toast";
import { STORAGE_KEYS } from "@/lib/storage";
import { mmkvStorage } from "@/lib/storage/mmkv";
import { router } from "expo-router";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useMMKVString } from "react-native-mmkv";

type MakeLoginParams = {
  email: string;
  password: string;
};

type RegisterUserParams = {
  name: string;
  email: string;
  password: string;
};

export interface UseAuthProps {
  logout: () => void;
  login: (params: MakeLoginParams) => void;
  register: (params: RegisterUserParams) => void;
  credentials: {
    token?: string;
    refreshToken?: string;
  };
  isAuth: boolean;
  isAuthLoginPending: boolean;
  isAuthRegisterPending: boolean;
}

export interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<UseAuthProps>({} as UseAuthProps);

export function AuthProvider({ children }: AuthProviderProps) {
  const toast = useOkamiToast();
  const [token, setToken] = useMMKVString(STORAGE_KEYS.TOKEN, mmkvStorage);
  const [refreshToken, setRefreshToken] = useMMKVString(
    STORAGE_KEYS.REFRESH_TOKEN,
    mmkvStorage,
  );

  const { mutate: makeLogin, isPending } = useAuthControllerLoginV2Mobile({
    mutation: {
      async onSuccess(data) {
        setToken(data.token);
        setRefreshToken(data.refreshToken);

        router.replace("/(app)/(home)");
      },

      onError(error) {
        toast({
          title: "Erro ao fazer login",
          description: `Verifique suas credenciais e tente novamente ${error.message}`,
          action: "error",
        });
      },
    },
  });

  const { mutate: makeRegister, isPending: isPedingRegister } =
    useAuthControllerRegister({
      mutation: {
        onSuccess() {
          toast({
            title: "Usuário registrado",
            description: "Agora você pode fazer login",
            action: "success",
          });
          router.push("/auth/sign-in");
        },
        onError() {
          toast({
            title: "Erro ao registrar",
            description: "Tente novamente mais tarde",
            action: "error",
          });
        },
      },
    });

  const { mutate: makeLogout } = useAuthControllerLogout({
    mutation: {
      onSuccess() {
        setToken("");
        setRefreshToken("");

        router.replace("/auth/sign-in");
      },
      onMutate() {},
    },
  });

  const login = (data: MakeLoginParams) => {
    makeLogin({
      data,
    });
  };

  const registerUser = useCallback(
    (payload: RegisterUserParams) => {
      const data = {
        email: payload.email,
        name: payload.name,
        password: payload.password,
      };

      void makeRegister({
        data,
      });
    },
    [makeRegister],
  );

  const isAuth = useMemo(() => !!refreshToken, [refreshToken]);

  useEffect(() => {
    const listener = mmkvStorage.addOnValueChangedListener((key) => {
      const isRefreshTokenChanged = key === STORAGE_KEYS.REFRESH_TOKEN;

      if (isRefreshTokenChanged) {
        const newValue = mmkvStorage.getString(key);

        if (!newValue) {
          router.replace("/auth/sign-in");
        }
      }
    });

    return () => {
      listener.remove();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout: () =>
          makeLogout({
            data: {
              refreshToken: refreshToken ?? null,
            },
          }),
        isAuth,
        isAuthLoginPending: isPending,
        credentials: { token, refreshToken },
        register: registerUser,
        isAuthRegisterPending: isPedingRegister,
      }}
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
