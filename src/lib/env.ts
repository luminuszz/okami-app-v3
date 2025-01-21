import { z } from "zod";

export const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url(),
  EXPO_PUBLIC_ONE_SIGNAL_APP_ID: z.string(),
  EXPO_PUBLIC_ENV: z.string().optional(),
});

const envData = {
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_ONE_SIGNAL_APP_ID: process.env.EXPO_PUBLIC_ONE_SIGNAL_APP_ID,
  EXPO_PUBLIC_ENV: process.env.EXPO_PUBLIC_ENV,
};

export const env = envSchema.parse(envData);
