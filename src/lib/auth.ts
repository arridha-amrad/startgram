import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP, username } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { db } from "@/db";
import * as schema from "@/db/schema";
import * as m from "@/paraglide/messages";
import { sendEmail } from "./mailer";

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
		sendResetPassword: async ({ url, user }) => {
			void sendEmail({
				to: user.email,
				subject: m.email_resetpwd_subject(),
				html: m.email_resetpwd_body({ url }),
			});
		},
	},
	emailVerification: {
		autoSignInAfterVerification: true,
	},
	plugins: [
		emailOTP({
			sendVerificationOnSignUp: true,
			overrideDefaultEmailVerification: true,
			async sendVerificationOTP({ email, otp, type }) {
				if (type === "email-verification") {
					void sendEmail({
						to: email,
						subject: m.email_verification_subject(),
						html: m.email_verification_body({ otp }),
					});
				}
			},
		}),
		username(),
		tanstackStartCookies(),
	],
});


