import { useWorkControllerListUserWorksPagedInfinite } from "@/api/okami";
import { Navbar } from "@/components/navbar";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { WorkCard } from "@/components/works/work-card";
import { filtersLabels } from "@/constants/strings";
import { toggleWorkFilter, worksFiltersAtom } from "@/store/works-filters";
import { useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";
import { FlatList, Pressable } from "react-native";

export default function WorksScreen() {
  const { search, status } = useAtomValue(worksFiltersAtom);

  const { data, refetch, isFetching, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useWorkControllerListUserWorksPagedInfinite(
      {
        status: status ?? undefined,
        search: search ?? undefined,
        limit: 10,
        page: 1,
      },
      {
        query: {
          initialPageParam: 1,
          getNextPageParam: (lastPage) => lastPage.nextPage,
        },
      },
    );

  const hasFilters = status || search;

  const canFetchNextPage = !isFetchingNextPage && hasNextPage;

  const sortedWorks = useMemo(() => data?.pages.flatMap((page) => page.works), [data]);

  const toggleFilters = useSetAtom(toggleWorkFilter);

  return (
    <Box className="mt-10 w-full flex-1 px-4">
      <Navbar />

      {hasFilters && (
        <Pressable onPress={toggleFilters}>
          <HStack className="mt-5 px-4" space="md">
            <Text className="text-typography-400">Filtros</Text>

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
        </Pressable>
      )}

      <Box className="mt-5 pb-24">
        {isLoading ? (
          <Center className="flex h-full w-full">
            <Spinner />
          </Center>
        ) : (
          <FlatList
            ListEmptyComponent={() => {
              return (
                <Center>
                  <Heading>Nada por aqui, adicione novas obras</Heading>
                </Center>
              );
            }}
            onRefresh={refetch}
            refreshing={isFetching}
            keyExtractor={(item) => item.id}
            data={sortedWorks}
            onEndReached={() => canFetchNextPage && fetchNextPage()}
            renderItem={({ item: work }) => (
              <WorkCard
                work={{
                  imageUrl: work.imageUrl ?? "",
                  tags: work.tags,
                  title: work.name,
                  alternativeTitle: work.alternativeName ?? "",
                  updatedAt: work.nextChapterUpdatedAt ?? work.updatedAt ?? work.createdAt,
                  currentChapter: work.chapter,
                  newChapter: work.nextChapter,
                  type: work.category,
                  isFinished: work.isFinished,
                  id: work.id,
                  url: work.url,
                  isFavorite: work.isFavorite,
                }}
              />
            )}
          />
        )}
      </Box>
    </Box>
  );
}
