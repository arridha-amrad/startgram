import { z } from "zod"

export const pwdSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^a-zA-Z0-9]/,
    "Password must contain at least one special character"
  )

export const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters long"),

    username: z
      .string()
      .min(1, "Username is required")
      .regex(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric with no spaces"),
    // Note: Uniqueness check happens during form submission/DB query

    email: z.string().email("Invalid email format"),

    password: pwdSchema,

    avatar: z.file().optional(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Sets the error specifically to the confirmPassword field
  })

export type TSignupSchema = z.infer<typeof signupSchema>
