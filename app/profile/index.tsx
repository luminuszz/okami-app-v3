import { useAuthControllerGetMe } from "@/api/okami";
import { ProfileLoading } from "@/components/profile/profile-loading";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

export default function ProfileScreen() {
  const { data: userDetails, isLoading } = useAuthControllerGetMe({});

  if (isLoading) {
    return <ProfileLoading />;
  }

  return (
    <VStack space="lg" className="justify-center">
      <Avatar size="lg">
        {userDetails?.avatarImageUrl ? (
          <AvatarImage src={userDetails.avatarImageUrl} />
        ) : (
          <AvatarFallbackText>{userDetails?.name}</AvatarFallbackText>
        )}
      </Avatar>
      <Text className="text-lg">{userDetails?.name}</Text>

      <HStack className="mt-10 justify-between">
        <VStack>
          <Text className="text-sm">Obras finalizadas</Text>
          <Text className="text-lg">{userDetails?.finishedWorksCount}</Text>
        </VStack>

        <VStack>
          <Text className="text-sm">Obras em andamento</Text>
          <Text className="text-lg">{userDetails?.readingWorksCount}</Text>
        </VStack>
      </HStack>
    </VStack>
  );
}
