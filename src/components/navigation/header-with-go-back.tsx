import { Href, router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable } from "react-native";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";

export interface BaseHeaderWithGoBackProps {
  route?: Href;
  title?: string;
  children?: React.ReactNode;
}

interface HeaderWithChildrenProps extends BaseHeaderWithGoBackProps {
  children: React.ReactNode;
  title?: never;
}

interface HeaderWithTitleProps extends BaseHeaderWithGoBackProps {
  children?: never;
  title: string;
}

type HeaderWithGoBackProps = HeaderWithChildrenProps | HeaderWithTitleProps;

export function HeaderWithGoBack({ title, route, children }: HeaderWithGoBackProps) {
  function handleRoute() {
    if (route) {
      return router.push(route);
    }

    return router.canGoBack() ? router.back() : router.push("/home");
  }

  return (
    <HStack className="mt-10 w-full justify-between">
      <Heading>{children || title}</Heading>
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
