import { Text } from "@/components/ui/text";
import { useStorage } from "@/lib/storage";
import { router } from "expo-router";
import { Box } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";

export default function IndexScreen() {
  const storageService = useStorage();

  const [isLoading, setIsLoading] = useState(true);

  const checksUserSession = useCallback(async () => {
    setIsLoading(true);
    const refreshToken = await storageService.getString("REFRESH_TOKEN");
    if (!refreshToken) {
      router.replace("/auth/sign-in");
    } else {
      router.replace("/home");
    }
    setIsLoading(false);
  }, [storageService]);

  useEffect(() => {
    checksUserSession();
  }, [checksUserSession]);

  return (
    <Box className="flex h-full w-full flex-1 items-center justify-center">
      {isLoading ? <Text>Carregando</Text> : null}
    </Box>
  );
}
