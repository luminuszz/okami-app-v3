import { useWorkControllerListUserWorks } from "@/api/okami";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { WorkFilters } from "@/components/works/works-filters";
import {
  toggleWorkFilter,
  worksFiltersAtom,
} from "@/store/works-filters-store";
import { useAtomValue, useSetAtom } from "jotai";

export default function WorkListScreen() {
  const openFilterModal = useSetAtom(toggleWorkFilter);
  const { search, status } = useAtomValue(worksFiltersAtom);

  const { data } = useWorkControllerListUserWorks({
    status: status ?? undefined,
    search: search ?? "",
  });

  console.log({ data });

  return (
    <Box>
      <WorkFilters />
      <Text>Work List screen</Text>
      <Button onPress={openFilterModal}>
        <Text>Open Filter</Text>
      </Button>
    </Box>
  );
}
