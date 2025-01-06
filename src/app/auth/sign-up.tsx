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
import { useAuth } from "@/hooks/useAuth";

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
	const { register, isAuthRegisterPending } = useAuth();

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
							<FormControlErrorText>
								{errors.confirmPassword.message}
							</FormControlErrorText>
						</FormControlError>
					)}
				</FormControl>

				<Button
					disabled={isAuthRegisterPending}
					onPress={handleSubmit(register)}
					variant="solid"
					className="w-full"
					size="lg"
				>
					{isAuthRegisterPending ? (
						<Spinner />
					) : (
						<ButtonText> Registrar</ButtonText>
					)}
				</Button>
			</VStack>
		</Box>
	);
}
