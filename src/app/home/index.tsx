import { ContinuousReadingSection } from "@/components/home/continuous-reading-section";
import { UnreadWorksSection } from "@/components/home/unread-works-section";
import { UserWorksListSection } from "@/components/home/user-works-list-section";
import { Container } from "@/components/layout/container";
import { ScrollView } from "react-native";

const imageUrl =
  "https://okami-storage.daviribeiro.com/work-images/66fef92b0dacc255dfb5e916-40707c04-9c6e-43d9-bbcc-36b9afabad44.webp";

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
