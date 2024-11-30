import {
  getWorkControllerListUserWorksQueryKey,
  useWorkControllerGetById,
  useWorkControllerUpdateChapter,
} from "@/api/okami";
import { Container } from "@/components/layout/container";
import { useOkamiToast } from "@/components/okami-toast";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Input, InputField } from "@/components/ui/input";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { worksFiltersAtom } from "@/store/works-filters";
import { useQueryClient } from "@tanstack/react-query";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useAtomValue } from "jotai";
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import { z } from "zod";

const validChapter = z.coerce.number().positive();

export default function UpdateWorkChapterScreen() {
  const { workId } = useLocalSearchParams<{ workId: string }>();

  const { data: currentWork, isLoading } = useWorkControllerGetById(workId);

  const client = useQueryClient();
  const toast = useOkamiToast();

  const [error, setError] = useState("");
  const [chapter, setChapter] = useState(String(currentWork?.nextChapter ?? 0));

  const filters = useAtomValue(worksFiltersAtom);

  const { mutate: updateWorkChapter, isPending } =
    useWorkControllerUpdateChapter({
      mutation: {
        async onSuccess() {
          toast({
            title: "Obra atualizada com sucesso !",
            action: "success",
          });

          const currentWorkListQuery = getWorkControllerListUserWorksQueryKey({
            search: filters.search ?? undefined,
            status: filters.status ?? undefined,
          });

          await client.invalidateQueries({
            queryKey: currentWorkListQuery,
          });

          router.push("/home");
        },

        onError() {
          toast({
            title: "Erro ao atualizar obra",
            action: "error",
            description: "Verifique os dados e tente novamente",
          });
        },
      },
    });

  function handleUpdateChapter() {
    const chapterResult = validChapter.safeParse(chapter);

    if (!chapterResult.success) {
      setError("Capítulo inválido");
      return;
    }

    updateWorkChapter({
      id: workId,
      data: {
        chapter: chapterResult.data,
      },
    });
  }

  useEffect(() => {
    if (currentWork?.nextChapter) {
      setChapter(String(currentWork?.nextChapter));
    }
    return () => {
      setChapter(String(currentWork?.nextChapter));
    };
  }, [currentWork?.nextChapter]);

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
    <Container classname="px-10 mt-10">
      <HStack className="mt-10 w-full justify-between">
        <Heading>Atualizar Obra</Heading>
        <Link href="/home">
          <ChevronLeft stroke="white" size={30} />
        </Link>
      </HStack>

      <Center className="mt-5">
        <VStack space="md" className="w-full text-center">
          <Heading className="text-center" size="md">
            {currentWork?.name}
          </Heading>

          <Image
            alt={currentWork?.name}
            className="mb-6 h-[200px] w-full rounded-md"
            source={{ uri: currentWork?.imageUrl ?? "" }}
          />
        </VStack>
      </Center>

      <VStack space="md">
        <FormControl size="lg" isInvalid={!!error}>
          <Input size="xl">
            <InputField
              value={chapter}
              onChangeText={(vl) => {
                setChapter(vl);
              }}
              className="w-full"
              keyboardType="numbers-and-punctuation"
              type="text"
            />
          </Input>

          {error && (
            <FormControlError>
              <FormControlErrorText>{error}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        <Button
          onPress={handleUpdateChapter}
          className="w-full"
          variant="solid"
          action="positive"
          isDisabled={isPending}
        >
          <ButtonText>{isPending ? <Spinner /> : "Atualizar"}</ButtonText>
        </Button>
      </VStack>
    </Container>
  );
}
