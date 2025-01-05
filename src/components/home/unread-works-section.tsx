import { useWorkControllerListUserWorksPaged } from "@/api/okami";
import { parseDateDistance, sortDateByDesc } from "@/helpers/date";
import { router } from "expo-router";
import { chain } from "lodash";
import { ChevronRight } from "lucide-react-native";
import { Pressable, ScrollView } from "react-native";
import { Button, ButtonIcon } from "../ui/button";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Image } from "../ui/image";
import { Skeleton, SkeletonText } from "../ui/skeleton";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

const limit = 10;

export function UnreadWorksSection() {
  const { data: works } = useWorkControllerListUserWorksPaged(
    {
      page: 1,
      status: "unread",
      limit: limit,
    },
    {
      query: {
        select: (data) => data?.works ?? [],
      },
    },
  );

  const isLoading = !works;

  const formattedWorks = chain(works)
    .sort((a, b) => sortDateByDesc(a.nextChapterUpdatedAt, b.nextChapterUpdatedAt))
    .map((work) => ({
      ...work,
      nextChapterUpdatedAt: parseDateDistance(work.nextChapterUpdatedAt),
    }))
    .value();

  if (isLoading) {
    return (
      <VStack space="md" className="mt-2 px-4">
        <Heading size="xl">Suas atualizações</Heading>
        <Skeleton variant="rounded" className="h-[170px] w-full rounded-md" />
        <SkeletonText _lines={2} className="h-3 w-full" />
      </VStack>
    );
  }

  return (
    <VStack className="w-full px-4">
      <Pressable
        className="flex-row items-center justify-between"
        onPress={() =>
          router.push({
            pathname: "/(app)/home/works",
            params: {
              status: "unread",
            },
          })
        }
      >
        <Heading size="xl">Suas atualizações</Heading>

        <Button variant="link">
          <ButtonIcon as={() => <ChevronRight stroke="white" size={30} />} />
        </Button>
      </Pressable>

      <ScrollView horizontal contentContainerStyle={{ marginLeft: -15, paddingRight: 1000 }}>
        {formattedWorks.map((work) => (
          <Pressable
            key={work.id}
            className="w-full max-w-[400px]"
            onPress={() =>
              router.push({
                pathname: "/modal/[workId]",
                params: {
                  workId: work.id,
                },
              })
            }
          >
            <Card variant="elevated">
              <VStack space="xs">
                <Image
                  className="h-[170px] w-full rounded-md"
                  source={{ uri: work.imageUrl ?? "" }}
                  alt="Solo Leveling"
                />
                <Heading size="lg" numberOfLines={1}>
                  {work.name.trim()}
                </Heading>

                <HStack space="md">
                  <Text className="font-medium text-emerald-500" size="lg">
                    {`Novo ${work.category === "ANIME" ? "Episódio" : "Capítulo"} ${work.nextChapter}`}
                  </Text>

                  <HStack className="items-center" space="sm">
                    <Text size="md" className="text-typography-500">
                      {work.nextChapterUpdatedAt}
                    </Text>
                  </HStack>
                </HStack>
              </VStack>
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </VStack>
  );
}
