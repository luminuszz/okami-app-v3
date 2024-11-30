import { useWorkControllerListUserWorks } from "@/api/okami";
import { Navbar } from "@/components/navbar";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { WorkCard } from "@/components/works/work-card";
import { filtersLabels } from "@/constants/strings";
import { worksFiltersAtom } from "@/store/works-filters";
import { useAtomValue } from "jotai";

import { FlatList } from "react-native";

export default function WorkListScreen() {
  const { search, status } = useAtomValue(worksFiltersAtom);

  const { data, refetch, isFetching } = useWorkControllerListUserWorks({
    status: status ?? undefined,
    search: search ?? "",
  });

  const hasFilters = status || search;

  return (
    <Box className="mt-10 w-full flex-1 px-4">
      <Navbar />

      <HStack className="mt-5" space="md">
        {hasFilters && <Text className="text-typography-400">Filtros</Text>}

        {status && (
          <Badge variant="outline" action="info">
            <BadgeText>{`Status: ${filtersLabels[status]} `}</BadgeText>
          </Badge>
        )}

        {search && (
          <Badge variant="outline" action="info">
            <BadgeText>{`Nome: ${search} `}</BadgeText>
          </Badge>
        )}
      </HStack>

      <Box className="mt-10 pb-24">
        <FlatList
          onRefresh={refetch}
          refreshing={isFetching}
          keyExtractor={(item) => item.id}
          data={data}
          renderItem={({ item: work }) => (
            <WorkCard
              work={{
                imageUrl: work.imageUrl ?? "",
                tags: work.tags,
                title: work.name,
                alternativeTitle: work.alternativeName ?? "",
                updatedAt:
                  work.nextChapterUpdatedAt ?? work.updatedAt ?? work.createdAt,
                currentChapter: work.chapter,
                newChapter: work.nextChapter,
                type: work.category,
                isFinished: work.isFinished,
                id: work.id,
                url: work.url,
              }}
            />
          )}
        />
      </Box>
    </Box>
  );
}
