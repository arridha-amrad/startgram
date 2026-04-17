import { betterAuth } from 'better-auth'
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP, username } from "better-auth/plugins"
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { db } from '@/db';
import * as schema from "@/db/schema"
import { sendEmail } from './mailer';


export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema: schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
  },
  emailVerification: {
    autoSignInAfterVerification: true,
  },
  plugins: [
    emailOTP({
      sendVerificationOnSignUp: true,
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          // Send the OTP for sign in
        } else if (type === "email-verification") {
          void sendEmail({
            to: email,
            subject: "Verify your email",
            html: `
              <p>Your verification code is: ${otp}</p>
            `,
          })
        } else {
          // Send the OTP for password reset
        }
      },
    }),
    username(), tanstackStartCookies()],
})


