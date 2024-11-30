import { useAuthControllerGetMe } from "@/api/okami";
import { toggleProfileDrawerActionAtom } from "@/store/profile-drawer";
import { toggleWorkFilter } from "@/store/works-filters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSetAtom } from "jotai";
import { Search } from "lucide-react-native";
import { Pressable } from "react-native";
import { ProfileDrawer } from "./profile/profile-drawer";
import { Avatar, AvatarFallbackText, AvatarImage } from "./ui/avatar";
import { Box } from "./ui/box";
import { Button, ButtonIcon } from "./ui/button";
import { Heading } from "./ui/heading";
import { HStack } from "./ui/hstack";
import { WorkFilters } from "./works/works-filters";

export function Navbar() {
  const { data: userDetails } = useAuthControllerGetMe();
  const openFilterModal = useSetAtom(toggleWorkFilter);

  const toggleProfileDrawer = useSetAtom(toggleProfileDrawerActionAtom);

  const formattedToday = format(new Date(), "'Hoje', EEEE", { locale: ptBR });

  return (
    <Box className="mt-4 px-4">
      <HStack className="items-center justify-between">
        <Heading>{formattedToday}</Heading>
        <HStack className="items-center" space="lg">
          <Button
            size="lg"
            variant="link"
            className="mr-5"
            onPress={openFilterModal}
          >
            <ButtonIcon as={() => <Search stroke="white" size={25} />} />
          </Button>
          <Pressable onPress={toggleProfileDrawer}>
            <Avatar size="md">
              {userDetails?.avatarImageUrl ? (
                <AvatarImage
                  source={{ uri: userDetails?.avatarImageUrl ?? "" }}
                />
              ) : (
                <AvatarFallbackText>{userDetails?.name}</AvatarFallbackText>
              )}
            </Avatar>
          </Pressable>
        </HStack>
      </HStack>

      <ProfileDrawer />
      <WorkFilters />
    </Box>
  );
}
