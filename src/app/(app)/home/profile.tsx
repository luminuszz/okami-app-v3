import { useAuthControllerGetMe } from "@/api/okami";
import { Container } from "@/components/layout/container";
import {
	Avatar,
	AvatarFallbackText,
	AvatarImage,
} from "@/components/ui/avatar";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import colors from "tailwindcss/colors";
import { VictoryPie, VictoryTheme } from "victory-native";

export default function ProfileScreen() {
	const { data: userDetails } = useAuthControllerGetMe();

	const chartData = [
		{
			x: "Finalizadas",
			y: userDetails?.finishedWorksCount,
			fill: colors.emerald[500],
		},
		{
			x: "Em andamento",
			y: userDetails?.readingWorksCount,
			fill: colors.blue[500],
		},
		{
			x: "Favoritas",
			y:
				userDetails?.finishedWorksCount ??
				0 ??
				+(userDetails?.readingWorksCount ?? 0),
			fill: colors.purple[500],
		},
	];

	return (
		<Container classname="mt-12 px-10">
			<VStack space="lg">
				<VStack className="items-center" space="md">
					<Avatar size="2xl">
						{userDetails?.avatarImageUrl ? (
							<AvatarImage source={{ uri: userDetails.avatarImageUrl ?? "" }} />
						) : (
							<AvatarFallbackText>{userDetails?.name}</AvatarFallbackText>
						)}
					</Avatar>
					<Heading className="text-xl">{userDetails?.name}</Heading>
					<Text className="text-md text-typography-400">
						{userDetails?.email}
					</Text>
				</VStack>

				<HStack className="mt-10 justify-between">
					<VStack className="items-center">
						<Text className="text-sm">Obras finalizadas</Text>
						<Text className="text-lg">{userDetails?.finishedWorksCount}</Text>
					</VStack>

					<VStack className="items-center">
						<Text className="text-sm">Obras em andamento</Text>
						<Text className="text-lg">{userDetails?.readingWorksCount}</Text>
					</VStack>
				</HStack>
			</VStack>

			<VStack className="mt-[50px] w-full items-center justify-center">
				<VictoryPie
					animate={{ duration: 1000, easing: "bounce" }}
					data={chartData}
					theme={VictoryTheme.clean}
					innerRadius={100}
					labelRadius={170}
					padAngle={2}
					categories={{
						x: ["Finalizadas", "Em andamento", "Favoritas"],
					}}
					style={{
						data: {
							fill: ({ datum }) => datum.fill,
							stroke: colors.gray[100],
							strokeWidth: 1,
						},
						labels: { fill: colors.gray[100], fontSize: 15, fontWeight: "400" },
						parent: {
							backgroundColor: "#031318",
						},
					}}
				/>
			</VStack>
		</Container>
	);
}
