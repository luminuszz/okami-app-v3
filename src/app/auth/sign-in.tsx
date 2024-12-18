import { useAuthControllerLoginV2 } from "@/api/okami";
import { OkamiLogo } from "@/components/logo";
import { useOkamiToast } from "@/components/okami-toast";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl, FormControlError, FormControlErrorText } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { STORAGE_KEYS, useStorage } from "@/lib/storage";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const formLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormSchema = z.infer<typeof formLoginSchema>;

export default function SignInScreen() {
  const { mutateAsync } = useAuthControllerLoginV2({
    mutation: {
      async onSuccess({ refreshToken, token }) {
        await storage.multiSet([
          [STORAGE_KEYS.TOKEN, token],
          [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
        ]);

        router.push("/home");
      },
      onError(error) {
        toast({
          title: "Erro ao fazer login",
          description: "Verifique suas credenciais e tente novamente" + error.message,
          action: "error",
        });
      },
    },
  });
  const storage = useStorage();
  const toast = useOkamiToast();

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<FormSchema>({
    values: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formLoginSchema),
  });

  const handleMutate = (values: FormSchema) =>
    mutateAsync({
      data: {
        email: values.email,
        password: values.password,
      },
    });

  return (
    <Box className="flex-1 items-center justify-center gap-4">
      <OkamiLogo />
      <Text className="text-2xl tracking-widest">OKAMI</Text>
      <VStack className="w-full max-w-[300px]" space="md">
        <FormControl size="lg">
          <Controller
            name="email"
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

          {errors.email && (
            <FormControlError>
              <FormControlErrorText>{errors.email.message}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
        <FormControl size="lg">
          <Input className="my-1" size="xl">
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <InputField
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  value={field.value}
                  className="w-full"
                  type="password"
                  placeholder="Senha"
                />
              )}
            />
          </Input>
          {errors.password && (
            <FormControlError>
              <FormControlErrorText>{errors.password.message}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        <Button
          disabled={isSubmitting}
          onPress={handleSubmit(handleMutate)}
          variant="solid"
          className="w-full"
          size="lg"
        >
          {isSubmitting ? <Spinner /> : <ButtonText> Entrar</ButtonText>}
        </Button>
      </VStack>
    </Box>
  );
}
