import z from "zod";

export const verificationSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
  email: z.email("Invalid email format"),
});

export type TVerificationSchema = z.infer<typeof verificationSchema>;