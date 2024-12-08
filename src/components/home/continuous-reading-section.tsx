import { toggleProfileDrawerActionAtom } from "@/store/profile-drawer";
import { useSetAtom } from "jotai";
import { Menu } from "lucide-react-native";
import { Pressable } from "react-native";
import { Badge, BadgeText } from "../ui/badge";
import { Button, ButtonIcon } from "../ui/button";
import { Card } from "../ui/card";
import { HStack } from "../ui/hstack";
import { Image } from "../ui/image";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

import { useWorkControllerListUserWorks } from "@/api/okami";
import { STORAGE_KEYS } from "@/lib/storage";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import configColors from "tailwindcss/colors";
import { ExternalLink } from "../ExternalLink";
import { Box } from "../ui/box";
import { Heading } from "../ui/heading";
import { Skeleton, SkeletonText } from "../ui/skeleton";

export function ContinuousReadingSection() {
  const openProfile = useSetAtom(toggleProfileDrawerActionAtom);
  const lastSelectedWorkStorage = useAsyncStorage(STORAGE_KEYS.LAST_WORK_CLICKED);

  const [currentWorkId, setCurrentWork] = useState<string | null>();

  const { data: works, isLoading } = useWorkControllerListUserWorks();

  const work = works?.find((work) => work.id === currentWorkId) ?? works?.[0];

  const workLabel = work?.category === "ANIME" ? "Episódio" : "Capítulo";

  const limitedTags = work?.tags.slice(0, 3).map((tag) => {
    const currentColor = tag.color as keyof typeof configColors;

    return {
      ...tag,
      color: configColors?.[currentColor]?.[500] ?? configColors.gray[500],
    };
  });

  useFocusEffect(
    useCallback(() => {
      lastSelectedWorkStorage.getItem().then((workId) => {
        setCurrentWork(workId);
      });
    }, [lastSelectedWorkStorage]),
  );

  if (isLoading || !work) {
    return (
      <HStack space="md">
        <Skeleton variant="rounded" className="h-[200px] w-[150px]" />

        <VStack>
          <SkeletonText className="mb-2 h-[20px] w-[200px]" _lines={3} />
        </VStack>
      </HStack>
    );
  }

  return (
    <VStack>
      <HStack className="justify-between px-4">
        <Heading size="xl">Agora</Heading>

        <Button variant="link" onPress={openProfile}>
          <ButtonIcon as={() => <Menu stroke="white" size={25} />} />
        </Button>
      </HStack>

      <Card className="max-w-[200px]" variant="elevated">
        <HStack space="xl">
          <VStack>
            <Badge className="z-10 -mb-8 ml-2 self-start rounded-lg" style={{ backgroundColor: configColors.sky[400] }}>
              <BadgeText className="text-typography-900">Lendo</BadgeText>
            </Badge>

            <Pressable onPress={() => {}}>
              <Image
                className="mb-6 h-[200px] w-[150px] rounded-md"
                source={{ uri: work.imageUrl ?? "" }}
                alt="Solo Leveling"
              />
            </Pressable>
          </VStack>

          <VStack space="md">
            <VStack>
              <Heading size="lg" numberOfLines={2}>
                {work.name}
              </Heading>
              <Text size="md" className="text-typography-800">
                {`${workLabel}  ${work?.chapter}`}
              </Text>
            </VStack>

            <Box className="flex-row flex-wrap gap-1">
              {limitedTags?.map((tag) => (
                <Badge
                  style={{ backgroundColor: tag.color }}
                  key={tag.id}
                  className={`rounded-lg text-sm`}
                  variant="outline"
                >
                  <BadgeText className="text-typography-900">{tag.name}</BadgeText>
                </Badge>
              ))}
            </Box>

            <Button action="primary" className="w-full bg-yellow-400">
              <ExternalLink className="font-medium text-gray-800" href={work.url ?? ""}>
                Continue lendo
              </ExternalLink>
            </Button>
          </VStack>
        </HStack>
      </Card>
    </VStack>
  );
}
