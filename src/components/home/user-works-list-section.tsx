import { useWorkControllerListUserWorksPaged } from "@/api/okami";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { FlatList, Pressable } from "react-native";
import { Button, ButtonIcon } from "../ui/button";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Image } from "../ui/image";
import { Skeleton, SkeletonText } from "../ui/skeleton";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

export function UserWorksListSection() {
  const { data, isFetching } = useWorkControllerListUserWorksPaged({
    limit: 10,
    page: 1,
  });

  if (isFetching) {
    return (
      <VStack className="mt-4 px-4">
        <Heading size="xl">Suas obras</Heading>
        <HStack space="md" className="my-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <VStack key={`${index}-${Date.now()}`} space="md">
              <Skeleton
                variant="rounded"
                className="h-[200px] w-[170px] rounded-md"
              />
              <SkeletonText className="h-3 w-[170px]" _lines={3} />
            </VStack>
          ))}
        </HStack>
      </VStack>
    );
  }

  return (
    <VStack className="mt-5 w-full px-4">
      <Pressable
        className="flex-1 flex-row items-center justify-between"
        onPress={() =>
          router.push({
            pathname: "/(app)/(home)/works",
            params: {
              status: "read",
            },
          })
        }
      >
        <Heading size="xl">Suas obras</Heading>

        <Button variant="link">
          <ButtonIcon as={() => <ChevronRight stroke="white" size={30} />} />
        </Button>
      </Pressable>

      <FlatList
        contentContainerStyle={{ paddingRight: 250 }}
        horizontal
        data={data?.works ?? []}
        keyExtractor={(work) => work.id}
        renderItem={({ item: work }) => (
          <Pressable
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
                  className="h-[200px] w-full rounded-md max-w-[200px]"
                  source={{ uri: work.imageUrl ?? "" }}
                  alt="Solo Leveling"
                />
                <Heading
                  className="max-w-[200px]"
                  size="md"
                  isTruncated
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {work.name}
                </Heading>
                <Text className="text-typography-600" size="md">
                  {work.alternativeName}
                </Text>
              </VStack>
            </Card>
          </Pressable>
        )}
      />
    </VStack>
  );
}
