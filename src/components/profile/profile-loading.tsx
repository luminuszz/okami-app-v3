import { HStack } from "../ui/hstack";
import { Skeleton, SkeletonText } from "../ui/skeleton";
import { VStack } from "../ui/vstack";

export function ProfileLoading() {
	return (
		<VStack space="lg">
			<Skeleton variant="circular" className="h-[20px] w-[200px]" />
			<SkeletonText className="h-[20px] w-[200px]" />

			<HStack>
				<VStack>
					<SkeletonText className="h-[16px] w-[100px]" />
					<SkeletonText className="h-[20px] w-[100px]" />
				</VStack>

				<VStack>
					<SkeletonText className="h-[16px] w-[100px]" />
					<SkeletonText className="h-[20px] w-[100px]" />
				</VStack>
			</HStack>
		</VStack>
	);
}
