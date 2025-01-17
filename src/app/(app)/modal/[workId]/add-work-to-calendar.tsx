import {
  useCalendarControllerAddRowInCalendar,
  useCalendarControllerFetchUserCalendar,
  useWorkControllerGetById,
} from "@/api/okami";
import { Container } from "@/components/layout/container";
import { HeaderWithGoBack } from "@/components/navigation/header-with-go-back";
import { useOkamiToast } from "@/components/okami-toast";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectScrollView,
  SelectTrigger,
} from "@/components/ui/select";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { daysOfWeek } from "@/constants/strings";
import { router, useLocalSearchParams } from "expo-router";
import { CheckCheck, ChevronDown } from "lucide-react-native";

import React, { useState } from "react";

export type Params = {
  workId: string;
};

export default function AddWorkToCalendarScreen() {
  const { workId } = useLocalSearchParams<Params>();

  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const { data: calendar } = useCalendarControllerFetchUserCalendar();

  const { data: currentWork, isLoading } = useWorkControllerGetById(workId);

  const toast = useOkamiToast();

  const { mutate, isPending } = useCalendarControllerAddRowInCalendar({
    mutation: {
      onSuccess() {
        toast({
          title: "Obra adicionada ao calendário com sucesso",
          action: "success",
        });

        router.push("/home");
      },

      onError() {
        toast({
          title: "Erro ao adicionar obra ao calendário",
          action: "error",
        });
      },
    },
  });

  const rowsInCalendarOnWork = calendar?.rows.filter(
    (row) => row.Work.id === workId,
  );

  const selectOptions = daysOfWeek.map((day) => {
    return {
      ...day,
      disabled: rowsInCalendarOnWork?.some(
        (row) => row.dayOfWeek === day.dayNumber,
      ),
    };
  });

  console.log({ daysOfWeek });

  function handleMutate() {
    if (!workId || !selectedDay) {
      toast({
        title: "Selecione uma obra e um dia",
        action: "error",
      });

      return;
    }

    mutate({
      data: {
        dayOfWeek: Number(selectedDay),
        workId,
      },
    });
  }

  const canDisableButton = !workId || isPending || !selectedDay;

  const selectedDayInList = selectOptions.find((day) => {
    return day.dayNumber === selectedDay;
  });

  if (isLoading) {
    return (
      <Container>
        <Center className="mt-10 w-full items-center gap-4 px-10">
          <SkeletonText _lines={2} className="h-3" />
          <Skeleton className="h-[200px]" variant="rounded" />
          <SkeletonText _lines={1} className="mt-10 h-10" />
        </Center>
      </Container>
    );
  }

  return (
    <Container classname="mt-10 px-10">
      <HeaderWithGoBack title="Adicionar ao Calendário" />

      <Center className="mt-5">
        <VStack space="md" className="w-full text-center">
          <Heading className="text-center" size="md">
            {currentWork?.name}
          </Heading>

          {currentWork?.imageUrl && (
            <Image
              alt={currentWork?.name}
              className="mb-6 h-[200px] w-full rounded-md"
              source={{ uri: currentWork?.imageUrl ?? "" }}
            />
          )}
        </VStack>
      </Center>
      <VStack space="md">
        <Select onValueChange={(day) => setSelectedDay(Number(day))}>
          <SelectTrigger
            variant="outline"
            size="xl"
            className="flex justify-between pr-4"
          >
            <SelectInput
              value={selectedDayInList?.dayName ?? "Selecionar o dia"}
              className="w-[90%] truncate"
            />
            <SelectIcon
              as={() => <ChevronDown stroke="white" className="size-5" />}
            />
          </SelectTrigger>
          <SelectPortal className="mt-10">
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              <SelectScrollView className="h-[320px]">
                {selectOptions.map((day) => {
                  return (
                    <SelectItem
                      className="text-typography-200"
                      key={day.dayNumber}
                      value={String(day.dayNumber)}
                      label={`${day.dayName} ${day.disabled ? "(Já adicionado)" : ""}`}
                      disabled={day.disabled}
                    />
                  );
                })}
              </SelectScrollView>
            </SelectContent>
          </SelectPortal>
        </Select>

        <Button
          disabled={canDisableButton}
          action="positive"
          onPress={handleMutate}
        >
          {isPending ? (
            <Spinner />
          ) : (
            <>
              <ButtonIcon as={CheckCheck} />
              <ButtonText>Adicionar ao calendário</ButtonText>
            </>
          )}
        </Button>
      </VStack>
    </Container>
  );
}
