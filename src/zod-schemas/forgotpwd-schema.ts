import z from "zod";

export const forgotpwdSchema = z.object({
  email: z.email("Invalid email format"),
})

export type TForgotPwdSchema = z.infer<typeof forgotpwdSchema>