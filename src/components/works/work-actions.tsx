import { workActionsDrawerIsOpen } from "@/store/work-actions-drawer";
import { type Href, router } from "expo-router";
import { useAtom } from "jotai";
import {
  BookCheck,
  Calendar,
  CheckCheck,
  NotebookPen,
} from "lucide-react-native";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
} from "../ui/drawer";
import { VStack } from "../ui/vstack";

export interface WorkActionsDrawlerProps {
  hasNewChapter: boolean;
  workId: string;
  isFinished: boolean;
}

export function WorkActionsDrawler({
  hasNewChapter,
  workId,
  isFinished,
}: WorkActionsDrawlerProps) {
  const [isOpen, setIsOpen] = useAtom(workActionsDrawerIsOpen);

  function handlePushToRoute(route: Href) {
    setIsOpen(false);

    router.push(route);
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      size="sm"
      anchor="bottom"
    >
      <DrawerBackdrop />
      <DrawerContent>
        <DrawerBody>
          <VStack space="md">
            <Button
              variant="solid"
              action="primary"
              className="bg-sky-500"
              onPress={() =>
                handlePushToRoute({
                  pathname: "/modal/[workId]/edit-work",
                  params: {
                    workId,
                  },
                })
              }
            >
              <ButtonIcon as={NotebookPen} />
              <ButtonText>Editar obra</ButtonText>
            </Button>

            {!hasNewChapter && !isFinished && (
              <Button
                disabled={hasNewChapter}
                onPress={() => {
                  handlePushToRoute({
                    pathname: "/modal/[workId]/mark-work-as-finish",
                    params: {
                      workId,
                    },
                  });
                }}
              >
                <ButtonIcon as={BookCheck} />
                <ButtonText>Finalizar obra</ButtonText>
              </Button>
            )}

            {hasNewChapter && (
              <Button
                variant="solid"
                action="positive"
                onPress={() =>
                  handlePushToRoute({
                    pathname: "/modal/[workId]/update-work-chapter",
                    params: { workId },
                  })
                }
              >
                <ButtonIcon as={CheckCheck} />
                <ButtonText>Marcar como lida</ButtonText>
              </Button>
            )}

            <Button
              variant="solid"
              onPress={() =>
                handlePushToRoute({
                  pathname: "/modal/[workId]/add-work-to-calendar",
                  params: {
                    workId,
                  },
                })
              }
            >
              <ButtonIcon as={Calendar} />
              <ButtonText>Adicionar ao calendário</ButtonText>
            </Button>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
