import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "expo-router";

export default function Home() {
  const { isAuth } = useAuth();

  if (!isAuth) {
    return <Redirect href="/auth/sign-in" />;
  }

  return <Redirect href="/(app)/home" />;
}
