import { toggleProfileDrawerActionAtom } from "@/store/profile-drawer";
import { useSetAtom } from "jotai";
import { Menu } from "lucide-react-native";
import { Pressable } from "react-native";
import { Badge, BadgeText } from "../ui/badge";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { Card } from "../ui/card";
import { HStack } from "../ui/hstack";
import { Image } from "../ui/image";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

import { useWorkControllerListUserWorks } from "@/api/okami";
import { useGoToWorkUrlAction } from "@/hooks/useGoToWorkUrlAction";
import { STORAGE_KEYS } from "@/lib/storage";
import { mmkvStorage } from "@/lib/storage/mmkv";
import { router } from "expo-router";
import { useMMKVString } from "react-native-mmkv";
import configColors from "tailwindcss/colors";
import { ProfileDrawer } from "../profile/profile-drawer";
import { Box } from "../ui/box";
import { Heading } from "../ui/heading";
import { Spinner } from "../ui/spinner";

export function ContinuousReadingSection() {
  const handlePushToUrl = useGoToWorkUrlAction();
  const [lastSelectedWorkStorage] = useMMKVString(STORAGE_KEYS.LAST_WORK_CLICKED, mmkvStorage);

  const openProfile = useSetAtom(toggleProfileDrawerActionAtom);

  const { data: works, isLoading } = useWorkControllerListUserWorks();

  const work = works?.find((work) => work.id === lastSelectedWorkStorage) ?? works?.[0];

  const workLabel = work?.category === "ANIME" ? "Episódio" : "Capítulo";

  const limitedTags = work?.tags.slice(0, 3).map((tag) => {
    const currentColor = tag.color as keyof typeof configColors;

    return {
      ...tag,
      color: configColors?.[currentColor]?.[500] ?? configColors.gray[500],
    };
  });

  if (isLoading) {
    return (
      <HStack space="md" className="my-2 px-4">
        <Spinner size="large" />
      </HStack>
    );
  }

  return (
    <VStack>
      <ProfileDrawer />

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

            {work && (
              <Pressable onPress={() => router.push({ pathname: "/modal/[workId]", params: { workId: work?.id } })}>
                <Image
                  className="mb-6 h-[200px] w-[150px] rounded-md"
                  source={{ uri: work?.imageUrl ?? "" }}
                  alt="Solo Leveling"
                />
              </Pressable>
            )}
          </VStack>

          <VStack space="md">
            <VStack>
              <Heading size="lg" numberOfLines={2}>
                {work?.name}
              </Heading>
              <Text size="md" className={work?.hasNewChapter ? "text-emerald-500" : "text-typography-800"}>
                {`${work?.hasNewChapter ? "Novo" : "Ultimo"} ${workLabel}  ${work?.chapter}`}
              </Text>
            </VStack>

            <Box className="flex-row flex-wrap gap-1">
              {limitedTags?.map((tag) => (
                <Badge
                  style={{ backgroundColor: tag.color }}
                  key={tag.id}
                  className="rounded-lg text-sm"
                  variant="outline"
                >
                  <BadgeText className="text-typography-900">{tag.name}</BadgeText>
                </Badge>
              ))}
            </Box>

            {work && (
              <Button
                action="primary"
                className="w-full bg-yellow-400"
                onPress={() => handlePushToUrl({ workId: work?.id, workUrl: work.url })}
              >
                <ButtonText className="text-sm font-medium text-gray-800">
                  Continue {work.category === "ANIME" ? "assistindo" : "lendo"}
                </ButtonText>
              </Button>
            )}
          </VStack>
        </HStack>
      </Card>
    </VStack>
  );
}
