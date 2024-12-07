import { useAuthControllerRegister } from "@/api/okami";
import { OkamiLogo } from "@/components/logo";
import { useOkamiToast } from "@/components/okami-toast";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl, FormControlError, FormControlErrorText } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const registerFormSchema = z
  .object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .superRefine((context, ctx) => {
    if (context.password !== context.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "As senhas não coincidem",
      });
    }
  });

type RegisterFormSchema = z.infer<typeof registerFormSchema>;

export default function SignUpScreen() {
  const toast = useOkamiToast();
  const { mutate: registerUser, isPending } = useAuthControllerRegister({
    mutation: {
      onSuccess() {
        toast({
          title: "Usuário registrado",
          description: "Agora você pode fazer login",
          action: "success",
        });
        router.push("/auth/sign-in");
      },
      onError(e) {
        if (e instanceof AxiosError) {
          const isBadRequestResponse = e.code === "400";

          if (isBadRequestResponse) {
            toast({
              title: "Erro ao registrar",
              description: "E-mail já cadastrado",
              action: "error",
            });
          } else {
            toast({
              title: "Erro ao registrar",
              description: "Tente novamente mais tarde",
              action: "error",
            });
          }
        }
      },
    },
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    values: {
      confirmPassword: "",
      email: "",
      name: "",
      password: "",
    },
  });

  function handleRegisterUser(values: RegisterFormSchema) {
    registerUser({
      data: {
        email: values.email,
        name: values.name,
        password: values.password,
      },
    });
  }

  return (
    <Box className="flex-1 items-center justify-center gap-4">
      <OkamiLogo />
      <Text className="text-2xl tracking-widest">OKAMI</Text>
      <VStack className="w-full max-w-[300px]" space="md">
        <FormControl size="lg">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input size="xl">
                <InputField
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  value={field.value}
                  className="w-full"
                  keyboardType="default"
                  type="text"
                  placeholder="E-mail"
                />
              </Input>
            )}
          />
          {errors.name && (
            <FormControlError>
              <FormControlErrorText>{errors.name.message}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

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

        <FormControl size="lg">
          <Input className="my-1" size="xl">
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <InputField
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  value={field.value}
                  className="w-full"
                  type="password"
                  placeholder="Confirmar senha"
                />
              )}
            />
          </Input>
          {errors.confirmPassword && (
            <FormControlError>
              <FormControlErrorText>{errors.confirmPassword.message}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        <Button
          disabled={isPending}
          onPress={handleSubmit(handleRegisterUser)}
          variant="solid"
          className="w-full"
          size="lg"
        >
          {isPending ? <Spinner /> : <ButtonText> Registrar</ButtonText>}
        </Button>
      </VStack>
    </Box>
  );
}
