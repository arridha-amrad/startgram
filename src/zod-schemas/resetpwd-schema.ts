import z from "zod";
import { pwdSchema } from "./signup-schema";

export const resetpwdSchema = z.object({
  password: pwdSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export type TResetPwdSchema = z.infer<typeof resetpwdSchema>