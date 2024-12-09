import { ptBR } from "date-fns/locale";
import { Badge, BadgeText } from "../ui/badge";
import { Box } from "../ui/box";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Image } from "../ui/image";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

import { filtersLabels } from "@/constants/strings";
import { STORAGE_KEYS } from "@/lib/storage";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Link, router } from "expo-router";
import { BookCheck, BookMarked, Clock } from "lucide-react-native";
import { Linking, Pressable } from "react-native";
import configColors from "tailwindcss/colors";
import { useOkamiToast } from "../okami-toast";
import { Button, ButtonIcon } from "../ui/button";

export interface WorkCardProps {
  work: {
    id: string;
    imageUrl: string;
    title: string;
    tags: { name: string; color: string; id: string }[];
    alternativeTitle?: string;
    updatedAt: string;
    newChapter: number | null;
    currentChapter: number;
    type: "ANIME" | "MANGA";
    isFinished?: boolean;
    url: string;
    isFavorite: boolean;
  };
}

const statusColor = {
  finished: configColors.purple[500],
  unread: configColors.emerald[500],
  read: configColors.blue[500],
};

export function WorkCard({ work }: WorkCardProps) {
  const lastWorkClickedStorage = useAsyncStorage(STORAGE_KEYS.LAST_WORK_CLICKED);
  const toast = useOkamiToast();

  const limitedTags = work.tags.slice(0, 3).map((tag) => {
    const currentColor = tag.color as keyof typeof configColors;

    return {
      ...tag,
      color: configColors?.[currentColor]?.[500] ?? configColors.gray[500],
    };
  });

  const formattedUpdatedAt = formatDistanceToNow(parseISO(work.updatedAt), {
    locale: ptBR,
    addSuffix: true,
  });

  const categoryLabel = work.type === "ANIME" ? "Episódio" : "Capítulo";

  const status = work.isFinished ? "finished" : work.newChapter ? "unread" : "read";

  async function handlePushToUrl() {
    const canOpenUrl = await Linking.canOpenURL(work?.url);

    if (!canOpenUrl) {
      toast({
        title: "Erro ao abrir link",
        description: "Não foi possível abrir o link, tente novamente mais tarde.",
        action: "error",
      });

      return;
    }

    await lastWorkClickedStorage.setItem(work.id);

    Linking.openURL(work?.url);
  }

  return (
    <Card variant="elevated" className="max-w-[200px]">
      <HStack space="lg">
        <VStack>
          <Badge className="z-10 -mb-8 ml-2 self-start rounded-lg" style={{ backgroundColor: statusColor[status] }}>
            <BadgeText className="text-typography-900">{filtersLabels[status]}</BadgeText>
          </Badge>

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
            {work.imageUrl && (
              <Image
                className="mb-6 h-[200px] w-[300px] rounded-md"
                source={{ uri: work.imageUrl }}
                alt="Solo Leveling"
              />
            )}
          </Pressable>
        </VStack>

        <VStack space="md">
          <VStack>
            <Heading ellipsizeMode="tail" numberOfLines={2} size="md">
              {work.title.trim()}
            </Heading>

            {work.alternativeTitle && (
              <Text size="sm" className="text-typography-400">
                {work.alternativeTitle}
              </Text>
            )}
          </VStack>

          <Box className="flex-row flex-wrap gap-1">
            {limitedTags.map((tag) => (
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

          {work.newChapter ? (
            <Button size="sm" variant="link" className="max-w-xl justify-start" action="positive">
              <ButtonIcon as={BookMarked} />
              <Link
                className="text-md text-left text-emerald-500"
                href={{
                  pathname: "/modal/[workId]",
                  params: { workId: work.id },
                }}
              >
                {`Novo ${categoryLabel}: ${work.newChapter}`}
              </Link>
            </Button>
          ) : (
            <Button size="sm" variant="link" className="max-w-xl justify-start">
              <ButtonIcon as={BookCheck} />
              <Link
                className="text-md text-left text-typography-600"
                href={{
                  pathname: "/modal/[workId]",
                  params: { workId: work.id },
                }}
              >
                {` ${categoryLabel} atual: ${work.currentChapter}`}
              </Link>
            </Button>
          )}

          <HStack space="xs" className="items-center">
            <Clock size="16" className="size-4 bg-slate-200" stroke="gray" />
            <Text className="text-sm text-typography-400">{formattedUpdatedAt}</Text>
          </HStack>

          <Pressable onPress={handlePushToUrl}>
            <Badge
              action={!!work.newChapter ? "success" : "muted"}
              style={{
                backgroundColor: work.newChapter ? configColors.emerald[500] : configColors.gray[500],
              }}
              className="justify-center rounded-lg text-sm"
              variant="outline"
            >
              <Text className="text-typography-900">Ir para o site</Text>
            </Badge>
          </Pressable>
        </VStack>
      </HStack>
    </Card>
  );
}
