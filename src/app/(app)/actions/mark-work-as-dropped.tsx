import {
	useWorkControllerDeleteWork,
	useWorkControllerListUserWorks,
} from "@/api/okami";
import { Container } from "@/components/layout/container";
import { HeaderWithGoBack } from "@/components/navigation/header-with-go-back";
import { useOkamiToast } from "@/components/okami-toast";
import { Button, ButtonText } from "@/components/ui/button";
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
import { router } from "expo-router";
import { ChevronDown } from "lucide-react-native";

import { useMemo, useState } from "react";

export default function MarkWorkAsDropped() {
	const [workId, setWorkId] = useState<string | null>(null);

	const toast = useOkamiToast();

	const { data: works, isLoading } = useWorkControllerListUserWorks({
		status: "read",
	});

	const currentWork = useMemo(
		() => works?.find((item) => item.id === workId),
		[workId, works],
	);

	const { mutate, isPending } = useWorkControllerDeleteWork({
		mutation: {
			onSuccess() {
				toast({
					title: "Obra finalizada com sucesso",
					action: "success",
				});

				router.push("/home");
			},

			onError() {
				toast({
					title: "Erro ao finalizar obra",
					action: "error",
				});
			},
		},
	});

	const canDisableButton = !workId || isPending;

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
			<HeaderWithGoBack>Excluir obra</HeaderWithGoBack>

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
				<Select onValueChange={(id) => setWorkId(id)}>
					<SelectTrigger
						variant="outline"
						size="xl"
						className="flex justify-between pr-4"
					>
						<SelectInput placeholder="Status" className="truncate" />
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
							<SelectScrollView className="mt-10">
								{works?.map((option) => (
									<SelectItem
										key={option.id}
										value={option.id}
										label={option.name}
									/>
								))}
							</SelectScrollView>
						</SelectContent>
					</SelectPortal>
				</Select>

				<Button
					disabled={canDisableButton}
					action="negative"
					onPress={() => {
						if (workId) {
							mutate({ id: workId });
						}
					}}
				>
					{isPending ? <Spinner /> : <ButtonText>Excluir</ButtonText>}
				</Button>
			</VStack>
		</Container>
	);
}
