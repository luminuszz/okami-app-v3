import { toggleWorkFilter, worksFiltersAtom, worksFiltersIsIsOpen } from "@/store/works-filters";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ChevronDown } from "lucide-react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button, ButtonText } from "../ui/button";
import { Drawer, DrawerBackdrop, DrawerBody, DrawerContent, DrawerFooter } from "../ui/drawer";
import { FormControl } from "../ui/form-control";

import { filtersLabels, filtersOptions } from "@/constants/strings";
import { Input, InputField } from "../ui/input";
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from "../ui/select";
import { VStack } from "../ui/vstack";

const workFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["unread", "read", "finished", "favorites"]).nullable(),
});

type WorkFiltersSchema = z.infer<typeof workFiltersSchema>;

export function WorkFilters() {
  const isOpen = useAtomValue(worksFiltersIsIsOpen);

  const handleClose = useSetAtom(toggleWorkFilter);

  const [filters, updateFilters] = useAtom(worksFiltersAtom);

  const { control, handleSubmit, reset } = useForm<WorkFiltersSchema>({
    values: {
      search: filters.search ?? "",
      status: filters.status ?? null,
    },
    resolver: zodResolver(workFiltersSchema),
  });

  function handlerFilterWorks(values: WorkFiltersSchema) {
    updateFilters({
      search: values.search ?? "",
      status: values.status ?? null,
    });

    handleClose();
  }

  function handleClearFilters() {
    reset();

    updateFilters({
      search: "",
      status: null,
    });

    handleClose();
  }

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} size="sm" anchor="bottom">
      <DrawerBackdrop />
      <DrawerContent>
        <DrawerBody>
          <VStack space="md">
            <FormControl size="md">
              <Controller
                name="search"
                control={control}
                render={({ field }) => (
                  <Input size="xl">
                    <InputField onBlur={field.onBlur} onChangeText={field.onChange} value={field.value} className="w-full" type="text" placeholder="Nome da obra" />
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
                      <SelectTrigger variant="outline" size="xl" className="flex justify-between pr-4">
                        <SelectInput placeholder="Status" value={field.value ? filtersLabels[field.value] : ""} />
                        <SelectIcon as={() => <ChevronDown stroke="white" className="size-5" />} />
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                          <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                          </SelectDragIndicatorWrapper>
                          {filtersOptions.map((option) => (
                            <SelectItem key={option.value} label={option.label} value={option.value} />
                          ))}
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                  );
                }}
              />
            </FormControl>
          </VStack>
        </DrawerBody>

        <DrawerFooter className="mb-10">
          <VStack className="w-full" space="md">
            <Button size="sm" className="w-full" onPress={handleSubmit(handlerFilterWorks)}>
              <ButtonText>Filtrar</ButtonText>
            </Button>

            <Button size="sm" className="w-full" onPress={handleClearFilters}>
              <ButtonText>Limpar</ButtonText>
            </Button>
          </VStack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
