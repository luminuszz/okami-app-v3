import { useWorkControllerListUserWorksPaged } from "@/api/okami";
import { ChevronRight } from "lucide-react-native";
import { ScrollView } from "react-native";
import { Button, ButtonIcon } from "../ui/button";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Image } from "../ui/image";
import { Skeleton, SkeletonText } from "../ui/skeleton";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

export function UserWorksListSection() {
  const { data, isLoading } = useWorkControllerListUserWorksPaged({
    limit: 20,
    page: 1,
  });

  if (isLoading) {
    return (
      <HStack>
        {Array.from({ length: 5 }).map((_, index) => (
          <VStack>
            <Skeleton className="h-[170px] w-full rounded-md" variant="rounded" />
            <SkeletonText className="w-3/4" _lines={2} />
          </VStack>
        ))}
      </HStack>
    );
  }

  return (
    <VStack className="mt-5 w-full px-4">
      <HStack className="justify-between">
        <Heading size="xl">Suas obras</Heading>

        <Button variant="link">
          <ButtonIcon as={() => <ChevronRight stroke="white" size={30} />} />
        </Button>
      </HStack>

      <ScrollView
        horizontal
        contentContainerStyle={{ paddingRight: 500, marginLeft: -15 }}
        showsHorizontalScrollIndicator={false}
      >
        {data?.works.map((work) => (
          <Card variant="elevated" className="w-full max-w-[200px]">
            <VStack space="xs">
              <Image
                className="h-[200px] w-full rounded-md"
                source={{ uri: work.imageUrl ?? "" }}
                alt="Solo Leveling"
              />
              <Heading size="lg" isTruncated numberOfLines={2}>
                {work.name}
              </Heading>
              <Text className="text-typography-600" size="lg">
                {`${work.category === "ANIME" ? "Capítulo" : "Episódio"}  ${work.chapter}`}
              </Text>
            </VStack>
          </Card>
        ))}
      </ScrollView>
    </VStack>
  );
}
