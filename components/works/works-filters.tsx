import {
  toggleWorkFilter,
  worksFiltersAtom,
  worksFiltersIsIsOpen,
} from "@/store/works-filters-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtomValue, useSetAtom } from "jotai";
import { ChevronDown } from "lucide-react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button, ButtonText } from "../ui/button";
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "../ui/drawer";
import { FormControl } from "../ui/form-control";

import { Heading } from "../ui/heading";
import { Input, InputField } from "../ui/input";
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
  SelectTrigger,
} from "../ui/select";
import { VStack } from "../ui/vstack";

const workFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["unread", "read", "finished", "favorites"]).nullable(),
});

type WorkFiltersSchema = z.infer<typeof workFiltersSchema>;

export function WorkFilters() {
  const isOpen = useAtomValue(worksFiltersIsIsOpen);

  const handleClose = useSetAtom(toggleWorkFilter);
  const updateFilters = useSetAtom(worksFiltersAtom);

  const { control, handleSubmit } = useForm<WorkFiltersSchema>({
    values: {
      search: "",
      status: null,
    },
    resolver: zodResolver(workFiltersSchema),
  });

  function handlerFilterWorks(values: WorkFiltersSchema) {
    console.log({ values });

    return updateFilters({
      search: values.search ?? "",
      status: values.status ?? null,
    });
  }
  return (
    <Drawer isOpen={isOpen} onClose={handleClose} size="sm" anchor="bottom">
      <DrawerHeader>
        <Heading> Filtros de obras</Heading>
      </DrawerHeader>

      <DrawerBackdrop />

      <DrawerContent>
        <DrawerBody>
          <VStack space="md">
            <FormControl size="lg">
              <Controller
                name="search"
                control={control}
                render={({ field }) => (
                  <Input size="xl">
                    <InputField
                      onBlur={field.onBlur}
                      onChangeText={field.onChange}
                      value={field.value}
                      className="w-full"
                      type="text"
                      placeholder="Nome da obra"
                    />
                  </Input>
                )}
              />
            </FormControl>

            <FormControl>
              <Controller
                control={control}
                name="status"
                render={({ field }) => {
                  return (
                    <Select
                      isDisabled={field.disabled}
                      onClose={field.onBlur}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger
                        variant="outline"
                        size="xl"
                        className="flex justify-between pr-4"
                      >
                        <SelectInput placeholder="Status" />
                        <SelectIcon
                          as={() => (
                            <ChevronDown stroke="white" className="size-5" />
                          )}
                        />
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                          <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                          </SelectDragIndicatorWrapper>
                          <SelectItem label="Favoritos" value="favorites" />
                          <SelectItem label="Finalizados" value="finish" />
                          <SelectItem label="Lidos" value="read" />
                          <SelectItem label="Não lidos" value="unread" />
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                  );
                }}
              />
            </FormControl>
          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <Button className="w-full" onPress={handleSubmit(handlerFilterWorks)}>
            <ButtonText>Filtrar</ButtonText>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
