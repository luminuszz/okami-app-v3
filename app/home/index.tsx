import { useWorkControllerListUserWorks } from "@/api/okami";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { WorkCard } from "@/components/works/work-card";
import { WorkFilters } from "@/components/works/works-filters";
import {
  toggleWorkFilter,
  worksFiltersAtom,
} from "@/store/works-filters-store";
import { useAtomValue, useSetAtom } from "jotai";
import { FlatList } from "react-native";

export default function WorkListScreen() {
  const openFilterModal = useSetAtom(toggleWorkFilter);
  const { search, status } = useAtomValue(worksFiltersAtom);

  const { data } = useWorkControllerListUserWorks({
    status: status ?? undefined,
    search: search ?? "",
  });

  return (
    <Box className="mt-10 w-full flex-1 px-4">
      <WorkFilters />
      <Button size="lg" onPress={openFilterModal}>
        <ButtonText>Filtrar obras</ButtonText>
      </Button>

      <Box className="mt-10">
        <FlatList
          keyExtractor={(item) => item.id}
          data={data}
          renderItem={({ item: work }) => (
            <WorkCard
              work={{
                imageUrl: work.imageUrl ?? "",
                tags: work.tags,
                title: work.name,
                alternativeTitle: work.alternativeName ?? "",
                updatedAt: work.updatedAt ?? work.createdAt,
                currentChapter: work.chapter,
                newChapter: work.nextChapter,
                type: work.category,
                isFinished: work.isFinished,
                id: work.id,
              }}
            />
          )}
        />
      </Box>
    </Box>
  );
}
