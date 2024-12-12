import { Container } from "@/components/layout/container";
import { useOkamiToast } from "@/components/okami-toast";
import { Center } from "@/components/ui/center";
import { Spinner } from "@/components/ui/spinner";

import { isAuthAction } from "@/store/auth";
import { Redirect } from "expo-router";
import { useAtomValue } from "jotai";

export default function IndexPage() {
  const results = useAtomValue(isAuthAction);

  const toast = useOkamiToast();

  if (results.state === "loading") {
    return (
      <Container classname="h-full w-full flex-1">
        <Center>
          <Spinner size={40} />
        </Center>
      </Container>
    );
  }

  if (results.state === "hasError") {
    toast({
      title: "Houve um erro ao checar a sessão",
      action: "error",
    });

    return <Redirect href="/auth/sign-in" />;
  }

  return <Redirect href={results.data ? "/home" : "/auth/sign-in"} />;
}
