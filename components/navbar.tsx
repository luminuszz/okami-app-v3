import { toggleProfileDrawerActionAtom } from "@/store/profile-drawer";
import { toggleWorkFilter } from "@/store/works-filters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSetAtom } from "jotai";
import { Menu, Search } from "lucide-react-native";
import { ProfileDrawer } from "./profile/profile-drawer";
import { Box } from "./ui/box";
import { Button, ButtonIcon } from "./ui/button";
import { Heading } from "./ui/heading";
import { HStack } from "./ui/hstack";
import { WorkFilters } from "./works/works-filters";

export function Navbar() {
  const openFilterModal = useSetAtom(toggleWorkFilter);
  const toggleProfileDrawer = useSetAtom(toggleProfileDrawerActionAtom);

  const formattedToday = format(new Date(), "'Hoje', EEEE,  dd 'de' MMMM", {
    locale: ptBR,
  });

  return (
    <Box className="mt-4 px-4">
      <HStack className="items-center justify-between">
        <Heading>{formattedToday}</Heading>
        <HStack className="items-center" space="lg">
          <Button
            size="lg"
            variant="link"
            className="mr-4"
            onPress={openFilterModal}
          >
            <ButtonIcon as={() => <Search stroke="white" size={25} />} />
          </Button>
          <Button variant="link" onPress={toggleProfileDrawer}>
            <ButtonIcon as={() => <Menu stroke="white" size={25} />} />
          </Button>
        </HStack>
      </HStack>

      <ProfileDrawer />
      <WorkFilters />
    </Box>
  );
}
