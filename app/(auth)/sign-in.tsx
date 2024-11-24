import { useAuthControllerLoginV2 } from "@/api/okami";
import { OkamiLogo } from "@/components/logo";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const formLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormSchema = z.infer<typeof formLoginSchema>;

export default function SignInScreen() {
  const { mutateAsync } = useAuthControllerLoginV2();

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

  async function handleSignIn(values: FormSchema) {
    try {
      const { refreshToken, token } = await mutateAsync({
        data: {
          email: values.email,
          password: values.password,
        },
      });

      console.log({ refreshToken, token });
    } catch (e) {
      console.log({ e });
    }
  }

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
              <FormControlErrorText>
                {errors.email.message}
              </FormControlErrorText>
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
              <FormControlErrorText>
                {errors.password.message}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        <Button
          disabled={isSubmitting}
          onPress={handleSubmit(handleSignIn)}
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
