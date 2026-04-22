import { z } from "zod"
import * as m from "@/paraglide/messages"

export const pwdSchema = z
  .string()
  .min(8, m.validation_password_min_8())
  .regex(/[0-9]/, m.validation_password_number())
  .regex(
    /[^a-zA-Z0-9]/,
    m.validation_password_special()
  )

export const signupSchema = z
  .object({
    fullName: z.string().min(2, m.validation_fullname_min_2()),

    username: z
      .string()
      .min(1, m.validation_username_required())
      .regex(/^[a-zA-Z0-9]+$/, m.validation_username_alphanumeric()),
    // Note: Uniqueness check happens during form submission/DB query

    email: z.string().email(m.validation_email_invalid()),

    password: pwdSchema,

    avatar: z.any().optional(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: m.validation_password_mismatch(),
    path: ["confirmPassword"], // Sets the error specifically to the confirmPassword field
  })

export type TSignupSchema = z.infer<typeof signupSchema>
