import { toggleProfileDrawerActionAtom } from "@/store/profile-drawer";
import { toggleWorkFilter } from "@/store/works-filters";
import { useSetAtom } from "jotai";
import { Menu, Search } from "lucide-react-native";
import { ProfileDrawer } from "./profile/profile-drawer";
import { Box } from "./ui/box";
import { Button, ButtonIcon } from "./ui/button";
import { HStack } from "./ui/hstack";

import { WorkFilters } from "./works/works-filters";

export function Navbar() {
	const openFilterModal = useSetAtom(toggleWorkFilter);

	const toggleProfileDrawer = useSetAtom(toggleProfileDrawerActionAtom);

	return (
		<Box className="mt-4 px-4">
			<HStack className="items-center justify-between">
				<HStack className="flex-1 items-center justify-between" space="lg">
					<Button variant="link" onPress={toggleProfileDrawer}>
						<ButtonIcon as={() => <Menu stroke="white" size={25} />} />
					</Button>

					<Button
						size="lg"
						variant="link"
						className="mr-4"
						onPress={openFilterModal}
					>
						<ButtonIcon as={() => <Search stroke="white" size={25} />} />
					</Button>
				</HStack>
			</HStack>

			<ProfileDrawer />
			<WorkFilters />
		</Box>
	);
}
