import { useAuthControllerGetMe } from "@/api/okami";
import { Container } from "@/components/layout/container";
import { ProfileLoading } from "@/components/profile/profile-loading";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

export default function ProfileScreen() {
  const { data: userDetails, isLoading } = useAuthControllerGetMe();

  if (isLoading) {
    return <ProfileLoading />;
  }

  return (
    <Container classname="mt-10 px-10">
      <VStack space="lg">
        <VStack className="items-center" space="md">
          <Avatar size="2xl">
            {userDetails?.avatarImageUrl ? (
              <AvatarImage source={{ uri: userDetails.avatarImageUrl }} />
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
    </Container>
  );
}
