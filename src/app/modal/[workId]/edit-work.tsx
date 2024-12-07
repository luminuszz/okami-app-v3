import {
  getWorkControllerGetByIdQueryKey,
  getWorkControllerListUserWorksQueryKey,
  useWorkControllerGetById,
  useWorkControllerUpdateWork,
} from "@/api/okami";
import { Container } from "@/components/layout/container";
import { useOkamiToast } from "@/components/okami-toast";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Input, InputField } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Link, router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";

import { z } from "zod";

type EditWorkParams = {
  workId: string;
};

const editWorkFormSchema = z.object({
  name: z.string().min(3).max(255),
  url: z.string().url(),
  chapter: z
    .string()
    .min(1)
    .max(255)
    .refine((item) => !isNaN(Number(item))),
  alternativeName: z.string().optional(),
});

type EditFormValues = z.infer<typeof editWorkFormSchema>;

export default function EditWorkScreen() {
  const { workId } = useLocalSearchParams<EditWorkParams>();
  const toast = useOkamiToast();

  const client = useQueryClient();

  const { data: currentWork, isLoading } = useWorkControllerGetById(workId);

  const updateWorkMutation = useWorkControllerUpdateWork({
    mutation: {
      async onSuccess() {
        client.invalidateQueries({
          queryKey: getWorkControllerGetByIdQueryKey(workId),
        });

        client.invalidateQueries({
          queryKey: getWorkControllerListUserWorksQueryKey(),
        });
      },
    },
  });

  const isPending = false;

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = useForm<EditFormValues>({
    resolver: zodResolver(editWorkFormSchema),
    values: {
      chapter: String(currentWork?.chapter) ?? "",
      name: currentWork?.name ?? "",
      url: currentWork?.url ?? "",
      alternativeName: currentWork?.alternativeName ?? "",
    },
  });

  const categoryLabel = currentWork?.category === "ANIME" ? "Episódio" : "Capítulo";

  async function handleEditWork(values: EditFormValues) {
    try {
      const data = {
        alternativeName: values.alternativeName ?? "",
        chapter: Number(values.chapter),
        name: values.name,
        url: values.url,
        tagsId: currentWork?.tags.map((tag) => tag.id) ?? [],
      };

      if (currentWork?.hasNewChapter) {
        // @ts-ignore
        delete data.chapter;
      }

      await updateWorkMutation.mutateAsync({
        data,
        id: workId,
      });
      toast({
        title: "Obra atualizada com sucesso",
        action: "success",
      });

      router.push("/home");
    } catch {
      toast({
        title: "Erro ao atualizar obra",
        action: "error",
      });
    }
  }

  if (isLoading) {
    return (
      <Center className="flex h-full w-full">
        <Spinner size={50} />
      </Center>
    );
  }

  return (
    <Container classname="px-10 mt-10">
      <HStack className="mt-10 w-full justify-between">
        <Heading>Editar Obra</Heading>
        <Link href="/home">
          <ChevronLeft stroke="white" size={30} />
        </Link>
      </HStack>

      <Center className="mt-5">
        <VStack space="md" className="w-full text-center">
          <Heading className="text-center" size="lg">
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
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <FormControl size="md" isInvalid={!!fieldState.error}>
              <FormControlLabel>
                <FormControlLabelText>Nome da obra</FormControlLabelText>
              </FormControlLabel>
              <Input size="xl">
                <InputField
                  value={field.value}
                  onChangeText={(vl) => field.onChange(vl)}
                  onBlur={field.onBlur}
                  className="text-md w-full"
                  type="text"
                />
              </Input>

              {fieldState.error && (
                <FormControlError>
                  <FormControlErrorText>{fieldState.error.message}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          )}
        />

        <Controller
          control={control}
          name="alternativeName"
          render={({ field, fieldState }) => (
            <FormControl size="md" isInvalid={!!fieldState.error}>
              <FormControlLabel>
                <FormControlLabelText>Nome alternativo</FormControlLabelText>
              </FormControlLabel>

              <Input size="xl">
                <InputField
                  value={field.value}
                  onChangeText={(vl) => field.onChange(vl)}
                  onBlur={field.onBlur}
                  className="text-md w-full"
                  type="text"
                />
              </Input>

              {fieldState.error && (
                <FormControlError>
                  <FormControlErrorText>{fieldState.error.message}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          )}
        />

        <Controller
          disabled={currentWork?.hasNewChapter}
          control={control}
          name="chapter"
          render={({ field, fieldState }) => (
            <FormControl size="md" isInvalid={!!fieldState.error} isDisabled={currentWork?.hasNewChapter}>
              <FormControlLabel>
                <FormControlLabelText>{categoryLabel}</FormControlLabelText>
              </FormControlLabel>

              <Input
                size="xl"
                isDisabled={currentWork?.hasNewChapter}
                className={currentWork?.hasNewChapter ? "bg-typography-100" : ""}
              >
                <InputField
                  value={field.value}
                  onChangeText={(vl) => field.onChange(vl)}
                  onBlur={field.onBlur}
                  className="text-md w-full"
                  type="text"
                  keyboardType="numbers-and-punctuation"
                />
              </Input>

              {fieldState.error && (
                <FormControlError>
                  <FormControlErrorText>{fieldState.error.message}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          )}
        />

        <Controller
          control={control}
          name="url"
          render={({ field, fieldState }) => (
            <FormControl size="md" isInvalid={!!fieldState.error}>
              <FormControlLabel>
                <FormControlLabelText>Url da obra</FormControlLabelText>
              </FormControlLabel>

              <Input size="xl">
                <InputField
                  value={field.value}
                  onChangeText={(vl) => field.onChange(vl)}
                  onBlur={field.onBlur}
                  className="text-md w-full"
                  type="text"
                  keyboardType="numbers-and-punctuation"
                />
              </Input>

              {fieldState.error && (
                <FormControlError>
                  <FormControlErrorText>{fieldState.error.message}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          )}
        />

        <Button
          onPress={handleSubmit(handleEditWork)}
          className="w-full"
          variant="solid"
          action="positive"
          isDisabled={isSubmitting || isLoading}
        >
          <ButtonText>{isPending || isSubmitting ? <Spinner /> : "Salvar"}</ButtonText>
        </Button>
      </VStack>
    </Container>
  );
}
