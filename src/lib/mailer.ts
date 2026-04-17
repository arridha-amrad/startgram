import nodemailer from 'nodemailer'
import { env } from '#/env'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: env.GOOGLE_USER,
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    refreshToken: env.GOOGLE_REFRESH_TOKEN
  }
})

type Args = {
  to: string
  subject: string
  html: string
}

export async function sendEmail(args: Args) {
  const { html, subject, to } = args
  await transporter.sendMail({
    to,
    subject,
    html
  })
}
