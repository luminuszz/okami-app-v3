import { useWorkControllerListUserWorksPaged } from "@/api/okami";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { Pressable, ScrollView } from "react-native";
import { Button, ButtonIcon } from "../ui/button";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Image } from "../ui/image";
import { Skeleton, SkeletonText } from "../ui/skeleton";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

export function UserWorksListSection() {
	const { data } = useWorkControllerListUserWorksPaged({
		limit: 10,
		page: 1,
	});

	const isLoading = !data;

	if (isLoading) {
		return (
			<VStack className="mt-4 px-4">
				<Heading size="xl">Suas obras</Heading>
				<HStack space="md" className="my-2">
					{Array.from({ length: 2 }).map((_, index) => (
						<VStack key={index} space="md">
							<Skeleton
								variant="rounded"
								className="h-[200px] w-[170px] rounded-md"
							/>
							<SkeletonText className="h-3 w-[170px]" _lines={3} />
						</VStack>
					))}
				</HStack>
			</VStack>
		);
	}

	return (
		<VStack className="mt-5 w-full px-4">
			<Pressable
				className="flex-1 flex-row items-center justify-between"
				onPress={() =>
					router.push({
						pathname: "/(app)/home/works",
						params: {
							status: "read",
						},
					})
				}
			>
				<Heading size="xl">Suas obras</Heading>

				<Button variant="link">
					<ButtonIcon as={() => <ChevronRight stroke="white" size={30} />} />
				</Button>
			</Pressable>

			<ScrollView
				horizontal
				contentContainerStyle={{ paddingRight: 250, marginLeft: -15 }}
			>
				{data?.works.map((work) => (
					<Pressable
						key={work.id}
						className="w-full max-w-[200px]"
						onPress={() =>
							router.push({
								pathname: "/modal/[workId]",
								params: {
									workId: work.id,
								},
							})
						}
					>
						<Card variant="elevated">
							<VStack space="xs">
								<Image
									className="h-[200px] w-full rounded-md"
									source={{ uri: work.imageUrl ?? "" }}
									alt="Solo Leveling"
								/>
								<Heading size="lg" isTruncated numberOfLines={2}>
									{work.name}
								</Heading>
								<Text className="text-typography-600" size="lg">
									{`${work.category === "MANGA" ? "Capítulo" : "Episódio"}  ${work.chapter}`}
								</Text>
							</VStack>
						</Card>
					</Pressable>
				))}
			</ScrollView>
		</VStack>
	);
}
