import { useWorkControllerGetWorkById } from "@/api/okami";
import { Container } from "@/components/layout/container";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { WorkActionsDrawler } from "@/components/works/work-actions";
import { resolveTagColor } from "@/helpers/colors";
import { parseDateDistance } from "@/helpers/date";
import { useGoToWorkUrlAction } from "@/hooks/useGoToWorkUrlAction";
import { toggleWorkActionsDrawerActionAtom } from "@/store/work-actions-drawer";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useSetAtom } from "jotai";
import {
  BookOpen,
  CheckCheck,
  ChevronLeft,
  Clock,
  Menu,
  Tv2,
} from "lucide-react-native";

import { Pressable, ScrollView } from "react-native";

export type WorkDetailsParams = {
  workId: string;
};

export default function WorkDetails() {
  const { workId } = useLocalSearchParams<WorkDetailsParams>();

  const handlePushToUrl = useGoToWorkUrlAction();

  const toggleWorkActionsDrawer = useSetAtom(toggleWorkActionsDrawerActionAtom);

  const {
    data: work,
    isLoading,
    isError,
    error,
  } = useWorkControllerGetWorkById(workId);

  console.log({ error });

  if (isLoading) {
    return (
      <Center className="h-full w-full flex-1">
        <Spinner size="large" />
      </Center>
    );
  }

  if (!work || isError) {
    return (
      <Container>
        <Center className="hf w-full flex-1 gap-2">
          <Heading>Obra não encontrada</Heading>
          <Button>
            <Link href="/(app)/(home)">Voltar</Link>
          </Button>
        </Center>
      </Container>
    );
  }

  const parsedTags = work.tags.map(resolveTagColor);

  const formattedDate = parseDateDistance(work.updatedAt ?? work.createdAt);

  const categoryLabel = work.category === "ANIME" ? "Episódio" : "Capítulo";

  return (
    <ScrollView>
      <Container classname="mt-12 px-4">
        <WorkActionsDrawler
          hasNewChapter={work.hasNewChapter}
          workId={work.id}
          isFinished={work.isFinished}
          isFavorite={work.isFavorite}
        />

        <HStack className="items-center justify-between">
          <Pressable
            onPress={() =>
              router.canGoBack() ? router.back() : router.push("/(app)/(home)")
            }
          >
            <ChevronLeft stroke="white" size={30} />
          </Pressable>

          <Heading>Detalhes da obra</Heading>

          <Pressable onPress={toggleWorkActionsDrawer}>
            <Menu stroke="white" size={30} />
          </Pressable>
        </HStack>

        <VStack className="mt-10 px-4" space="md">
          <VStack>
            <Heading size="lg" className="text-center">
              {work.name.trim()}
            </Heading>
            {work.alternativeName && (
              <Text size="md" className="text-center">
                "{work.alternativeName}"
              </Text>
            )}
          </VStack>

          <Box className="w-full">
            <Image
              className="h-[300px] w-full rounded-lg"
              source={{ uri: work?.imageUrl ?? "" }}
              alt={work.name}
            />
          </Box>

          <Heading
            className={`${work.hasNewChapter ? "text-emerald-500" : "text-typography-900"} `}
          >{`${work.hasNewChapter ? "Novo" : "Ultimo"} ${categoryLabel}: ${work.nextChapter ?? work.chapter}`}</Heading>

          <Box className="flex-row flex-wrap gap-1">
            {parsedTags.map((tag) => {
              return (
                <Badge
                  style={{ backgroundColor: tag.color }}
                  key={tag.id}
                  className="rounded-lg text-sm"
                  variant="outline"
                >
                  <BadgeText className="text-typography-900">
                    {tag.name}
                  </BadgeText>
                </Badge>
              );
            })}
          </Box>

          <Text
            className="truncate text-typography-600"
            lineBreakMode="clip"
            numberOfLines={8}
            size="sm"
          >
            {work.description}
          </Text>

          <HStack space="sm">
            <Clock size={20} stroke="white" />
            <Text className="text-typography-600">{`Ultima atualização: ${formattedDate}`}</Text>
          </HStack>

          <VStack className="mt-5" space="md">
            {work.hasNewChapter && (
              <Button
                variant="solid"
                action="positive"
                onPress={() =>
                  router.push({
                    pathname: "/modal/[workId]/update-work-chapter",
                    params: { workId },
                  })
                }
              >
                <ButtonIcon as={CheckCheck} />
                <ButtonText>Marcar como lida</ButtonText>
              </Button>
            )}

            <Button
              className="w-full items-center bg-yellow-400"
              onPress={() => {
                void handlePushToUrl({
                  workId: work.id,
                  workUrl: work.url,
                });
              }}
            >
              <ButtonIcon as={work.category === "ANIME" ? Tv2 : BookOpen} />
              <ButtonText className="font-medium text-gray-800">
                {work.category === "ANIME" ? "Assistir" : "Ler"} Agora
              </ButtonText>
            </Button>
          </VStack>
        </VStack>
      </Container>
    </ScrollView>
  );
}
