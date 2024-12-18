import { ContinuousReadingSection } from "@/components/home/continuous-reading-section";
import { UnreadWorksSection } from "@/components/home/unread-works-section";
import { UserWorksListSection } from "@/components/home/user-works-list-section";
import { Container } from "@/components/layout/container";
import { ScrollView } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView>
      <Container classname="px-4 mb-10">
        <ContinuousReadingSection />
        <UnreadWorksSection />
        <UserWorksListSection />
      </Container>
    </ScrollView>
  );
}
