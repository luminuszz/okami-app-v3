import { useCalendarControllerFetchUserCalendar } from "@/api/okami";
import { Container } from "@/components/layout/container";
import { HeaderWithGoBack } from "@/components/navigation/header-with-go-back";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { concatWithCategoryLabel, parseCategory } from "@/helpers/strings";
import { formattedCurrentWeekDaysAtom } from "@/store/calendar";
import { format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { router } from "expo-router";
import { useAtomValue } from "jotai";
import { groupBy } from "lodash";
import { FlatList, Pressable } from "react-native";

function CalendarSkeleton() {
  return (
    <VStack>
      {Array.from({ length: 7 }).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <Skeleton variant="rounded" className="w-full h-150px" key={index} />
      ))}
    </VStack>
  );
}

export default function CalendarScreen() {
  const week = useAtomValue(formattedCurrentWeekDaysAtom);

  const formattedToday = format(new Date(), "'Hoje,' EEEE ',' dd/MM/yyyy", {
    locale: ptBR,
  });

  const { data: calendar, isLoading } =
    useCalendarControllerFetchUserCalendar();

  const parsedCalendarRows = groupBy(calendar?.rows, "dayOfWeek");

  if (isLoading || !calendar) {
    return <CalendarSkeleton />;
  }

  return (
    <Container classname="px-4">
      <HeaderWithGoBack>
        <Heading size="xl">Calendário</Heading>
      </HeaderWithGoBack>

      <Text className="text-typography-600  mt-2" size="lg">
        {formattedToday}
      </Text>

      <Box className="mt-10 pb-24">
        <FlatList
          data={week}
          renderItem={({ item }) => {
            const worksInCurrentDay =
              parsedCalendarRows[item.dayOfWeekNumber] ?? [];

            const isCurrentDate = isToday(item.originalDate);

            console.log({ isCurrentDate });

            return (
              <Card
                className={`my-2 ${isCurrentDate ? "bg-cyan-900" : "bg-current"}`}
              >
                <VStack space="md">
                  <Text
                    size="xl"
                    className={`font-medium  ${isCurrentDate ? "text-emerald-500" : "text-blue-500"}`}
                  >
                    {item.dayOfWeek}
                  </Text>
                  {!worksInCurrentDay?.length ? (
                    <Text size="md">Sem obras</Text>
                  ) : (
                    worksInCurrentDay.map((item) => (
                      <Pressable
                        key={`${item.Work.id}-${item.dayOfWeek}`}
                        onPress={() =>
                          router.push({
                            pathname: "/modal/[workId]",
                            params: {
                              workId: item.Work.id,
                            },
                          })
                        }
                      >
                        <HStack space="md" className="flex-1 my-1">
                          <Image
                            className="rounded h-full"
                            source={{ uri: item.Work.imageUrl ?? "" }}
                            alt={item.Work.name}
                          />
                          <VStack space="sm">
                            <Text
                              ellipsizeMode="tail"
                              numberOfLines={2}
                              size="lg"
                              className="accent-typography-400 max-w-[300px]"
                            >
                              {item.Work.name}
                            </Text>
                            <Badge
                              className={`justify-center w-[60px] ${item.Work.category === "MANGA" ? "bg-cyan-500" : "bg-yellow-300"} rounded `}
                            >
                              <BadgeText className="text-center text-typography-200 font-bold">
                                {parseCategory(item.Work.category)}
                              </BadgeText>
                            </Badge>
                            <Text>
                              {concatWithCategoryLabel(
                                item.Work.category,
                                item.Work.chapters,
                              )}
                            </Text>
                          </VStack>
                        </HStack>
                      </Pressable>
                    ))
                  )}
                </VStack>
              </Card>
            );
          }}
        />
      </Box>
    </Container>
  );
}
