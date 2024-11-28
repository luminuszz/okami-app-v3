import { ptBR } from "date-fns/locale";
import { Badge, BadgeText } from "../ui/badge";
import { Box } from "../ui/box";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Image } from "../ui/image";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

import { formatDistanceToNow, parseISO } from "date-fns";
import { Link } from "expo-router";
import { BookMarked, Clock } from "lucide-react-native";
import configColors from "tailwindcss/colors";
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
  };
}

export function WorkCard({ work }: WorkCardProps) {
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

  return (
    <Card variant="elevated" className="max-w-[200px] px-4">
      <HStack space="lg">
        <Image
          className="mb-6 h-[200px] w-[300px] rounded-md"
          source={{ uri: work.imageUrl }}
          alt="Solo Leveling"
        />

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
                <BadgeText className="text-typography-900">
                  {tag.name}
                </BadgeText>
              </Badge>
            ))}
          </Box>

          {work.newChapter ? (
            <Button
              size="sm"
              variant="link"
              className="max-w-xl justify-start"
              action="positive"
            >
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
            <Text size="sm" className="text-md text-typography-400">
              {`${categoryLabel} atual: ${work.currentChapter}`}
            </Text>
          )}

          <HStack space="xs" className="items-center">
            <Clock size="16" className="size-4 bg-slate-200" stroke="gray" />
            <Text className="text-sm text-typography-400">
              {formattedUpdatedAt}
            </Text>
          </HStack>

          {work.isFinished && (
            <Badge
              style={{ backgroundColor: configColors.green[500] }}
              className="justify-center rounded-lg text-sm"
              variant="outline"
            >
              <BadgeText className="text-typography-900">Finalizado</BadgeText>
            </Badge>
          )}
        </VStack>
      </HStack>
    </Card>
  );
}