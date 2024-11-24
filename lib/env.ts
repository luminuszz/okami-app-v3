import { z } from "zod";

export const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string(),
});

export const env = envSchema.parse(process.env);
