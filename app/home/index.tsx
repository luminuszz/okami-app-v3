import { useWorkControllerListUserWorks } from "@/api/okami";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
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

  return (
    <Box className="mt-10">
      <WorkFilters />
      <Button size="lg" onPress={openFilterModal}>
        <ButtonText>Abrir filtros</ButtonText>
      </Button>
    </Box>
  );
}
