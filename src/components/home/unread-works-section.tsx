import { useWorkControllerListUserWorksPaged } from "@/api/okami";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { router } from "expo-router";
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
  const { data, isLoading } = useWorkControllerListUserWorksPaged(
    {
      page: 1,
      status: "unread",
      limit: limit,
    },
    {
      query: {
        select(works) {
          works.works = works.works.map((work) => {
            const formattedUpdatedAt = formatDistanceToNow(work.nextChapterUpdatedAt ?? "", {
              locale: ptBR,
              addSuffix: true,
            });

            return {
              ...work,
              nextChapterUpdatedAt: formattedUpdatedAt,
            };
          });

          return works;
        },
      },
    },
  );

  if (isLoading) {
    return (
      <VStack>
        <Skeleton className="h-[170px] w-full rounded-md" variant="rounded" />
        <SkeletonText className="w-3/4" _lines={2} />
      </VStack>
    );
  }

  return (
    <VStack className="w-full px-4">
      <HStack className="justify-between">
        <Heading size="xl">Suas atualizações</Heading>

        <Button variant="link" onPress={() => router.push("/home/works")}>
          <ButtonIcon as={() => <ChevronRight stroke="white" size={30} />} />
        </Button>
      </HStack>

      <ScrollView horizontal contentContainerStyle={{ marginLeft: -15, paddingRight: 1100 }}>
        {data?.works?.map((work) => (
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
                    {`Novo ${work.category === "ANIME" ? "Episódio" : "Capítulo"} ${work.chapter}`}
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
