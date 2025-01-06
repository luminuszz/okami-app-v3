import {
	useWorkControllerGetById,
	useWorkControllerUpdateChapter,
} from "@/api/okami";
import { Container } from "@/components/layout/container";
import { HeaderWithGoBack } from "@/components/navigation/header-with-go-back";
import { useOkamiToast } from "@/components/okami-toast";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import {
	FormControl,
	FormControlError,
	FormControlErrorText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { Input, InputField } from "@/components/ui/input";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView, ScrollView } from "react-native";
import { z } from "zod";

const schema = z.object({
	chapter: z.coerce
		.number({ invalid_type_error: "Informe um valor válido" })
		.positive(),
});

type Schema = z.infer<typeof schema>;

export default function UpdateWorkChapterScreen() {
	const client = useQueryClient();
	const toast = useOkamiToast();

	const { workId } = useLocalSearchParams<{ workId: string }>();

	const {
		data: currentWork,
		isLoading,
		isError,
	} = useWorkControllerGetById(workId);

	const { mutate: updateWorkChapter, isPending } =
		useWorkControllerUpdateChapter({
			mutation: {
				async onSuccess() {
					toast({
						title: "Obra atualizada com sucesso !",
						action: "success",
					});

					client.invalidateQueries({
						predicate: ({ queryKey }) => queryKey.includes("/work/list"),
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

	const form = useForm<Schema>({
		resolver: zodResolver(schema),
		values: {
			chapter: currentWork?.nextChapter ?? currentWork?.chapter ?? 0,
		},
		reValidateMode: "onSubmit",
	});

	function handleUpdateChapter({ chapter }: Schema) {
		updateWorkChapter({
			id: workId,
			data: {
				chapter,
			},
		});
	}

	useEffect(() => {
		return () => {
			form.reset();
		};
	}, []);

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

	if (isError) {
		toast({
			title: "Erro ao carregar obra",
			action: "error",
		});

		return <Redirect href="/home" />;
	}

	return (
		<SafeAreaView>
			<ScrollView>
				<Container classname="px-10 mt-10 flex-1 h-full">
					<HeaderWithGoBack>Atualizar Obra</HeaderWithGoBack>

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
						<Controller
							control={form.control}
							name="chapter"
							render={({ field, fieldState }) => (
								<FormControl
									size="lg"
									isInvalid={fieldState.invalid}
									isDisabled={field.disabled}
								>
									<Input size="xl">
										<InputField
											onBlur={field.onBlur}
											value={String(field.value)}
											onChangeText={field.onChange}
											className="w-full"
											keyboardType="numbers-and-punctuation"
										/>
									</Input>
									{fieldState.invalid && (
										<FormControlError>
											<FormControlErrorText>
												{fieldState.error?.message}
											</FormControlErrorText>
										</FormControlError>
									)}
								</FormControl>
							)}
						/>
						<Button
							onPress={form.handleSubmit(handleUpdateChapter)}
							className="w-full"
							variant="solid"
							action="positive"
							isDisabled={isPending}
						>
							<ButtonText>
								{isPending ? (
									<Spinner />
								) : currentWork?.hasNewChapter ? (
									"Marcar como lido"
								) : (
									"Atualizar"
								)}
							</ButtonText>
						</Button>
					</VStack>
				</Container>
			</ScrollView>
		</SafeAreaView>
	);
}
