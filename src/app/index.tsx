import { Redirect } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

export default function IndexPage() {
  const { isAuth } = useAuth();

  return <Redirect href={isAuth ? "/home" : "/auth/sign-in"} />;
}
