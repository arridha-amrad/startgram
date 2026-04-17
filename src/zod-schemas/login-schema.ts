import z from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(1, "Please insert email or username"),
  password: z.string().min(1, "Password is required"),
})

export type TLoginSchema = z.infer<typeof loginSchema>