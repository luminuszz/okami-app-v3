import { useWorkControllerToggleFavorite } from "@/api/okami";
import { workActionsDrawerIsOpen } from "@/store/work-actions-drawer";
import { type Href, router } from "expo-router";
import { useAtom } from "jotai";
import {
  BookCheck,
  Calendar,
  Heart,
  HeartCrack,
  NotebookPen,
} from "lucide-react-native";
import { useEffect, useState } from "react";
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
  isFavorite: boolean;
}

export function WorkActionsDrawler({
  hasNewChapter,
  workId,
  isFinished,

  isFavorite,
}: WorkActionsDrawlerProps) {
  const [isOpen, setIsOpen] = useAtom(workActionsDrawerIsOpen);
  const [workIsFavorite, setWorkIsFavorite] = useState(isFavorite);

  function handlePushToRoute(route: Href) {
    setIsOpen(false);

    router.push(route);
  }

  const markWorkAsFavoriteMutation = useWorkControllerToggleFavorite({
    mutation: {
      onMutate() {
        setWorkIsFavorite((prev) => !prev);
      },
      onError() {
        setWorkIsFavorite((prev) => !prev);
      },
    },
  });

  useEffect(() => {
    setWorkIsFavorite(isFavorite);
  }, [isFavorite]);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      size="md"
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

            <Button
              disabled={markWorkAsFavoriteMutation.isPending}
              action="primary"
              className={`mt-5 w-full items-center ${workIsFavorite ? "bg-purple-600" : "bg-purple-500"}`}
              onPress={() => {
                markWorkAsFavoriteMutation.mutate({
                  id: workId,
                });
              }}
            >
              <ButtonIcon
                size="md"
                color="white"
                as={workIsFavorite ? HeartCrack : Heart}
              />
              <ButtonText className="font-medium text-typography-800">
                {workIsFavorite
                  ? "Remover dos favoritos"
                  : "Adicionar aos favoritos"}
              </ButtonText>
            </Button>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
