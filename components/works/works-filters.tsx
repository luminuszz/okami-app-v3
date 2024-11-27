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
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader } from "../ui/drawer";
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
    updateFilters({
      search: values.search ?? "",
      status: values.status ?? null,
    });
  }
  return (
    <Drawer isOpen={isOpen} onClose={handleClose} size="full" anchor="bottom">
      <DrawerHeader>
        <Heading> Filtros de obras</Heading>
      </DrawerHeader>

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
                    keyboardType="email-address"
                    type="text"
                    placeholder="E-mail"
                  />
                </Input>
              )}
            />
          </FormControl>

          <FormControl>
            <Controller
              control={control}
              name="status"
              render={() => {
                return (
                  <Select>
                    <SelectTrigger variant="outline" size="md">
                      <SelectInput placeholder="Select option" />
                      <SelectIcon
                        className="mr-3"
                        as={() => <ChevronDown className="size-5" />}
                      />
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        <SelectDragIndicatorWrapper>
                          <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>
                        <SelectItem label="UX Research" value="ux" />
                        <SelectItem label="Web Development" value="web" />
                        <SelectItem
                          label="Cross Platform Development Process"
                          value="Cross Platform Development Process"
                        />
                        <SelectItem
                          label="UI Designing"
                          value="ui"
                          isDisabled={true}
                        />
                        <SelectItem
                          label="Backend Development"
                          value="backend"
                        />
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
        <Button onPress={handleSubmit(handlerFilterWorks)}>
          <ButtonText>Filtrar</ButtonText>
        </Button>
      </DrawerFooter>
    </Drawer>
  );
}
