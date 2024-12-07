import { Href, router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable } from "react-native";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";

export interface HeaderWithGoBackProps {
  route?: Href;
  title: string;
}

export function HeaderWithGoBack({ title, route }: HeaderWithGoBackProps) {
  function handleRoute() {
    if (route) {
      return router.push(route);
    }

    return router.canGoBack() ? router.back() : router.push("/home");
  }

  return (
    <HStack className="mt-10 w-full justify-between">
      <Heading>{title}</Heading>
      <Pressable
        onPress={() => {
          handleRoute();
        }}
      >
        <ChevronLeft stroke="white" size={30} />
      </Pressable>
    </HStack>
  );
}
