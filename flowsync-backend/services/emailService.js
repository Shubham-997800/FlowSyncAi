const nodemailer = require('nodemailer')

let etherealAccount = null

async function getTransporter() {
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!user || !pass) {
    if (!etherealAccount) {
      etherealAccount = await nodemailer.createTestAccount()
      console.log('SMTP not configured. Using Ethereal dev email:')
      console.log(`  User: ${etherealAccount.user}`)
      console.log(`  Pass: ${etherealAccount.pass}`)
      console.log(`  Web:  https://ethereal.email/login`)
    }
    return nodemailer.createTransport({
      host: etherealAccount.smtp.host,
      port: etherealAccount.smtp.port,
      secure: etherealAccount.smtp.secure,
      auth: { user: etherealAccount.user, pass: etherealAccount.pass },
    })
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  })
}

const sendResetEmail = async (to, token) => {
  const transporter = await getTransporter()
  if (!transporter) return

  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${token}`

  const info = await transporter.sendMail({
    from: `"FlowSync AI" <${process.env.SMTP_FROM || 'noreply@flowsync.ai'}>`,
    to,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #6366f1;">FlowSync AI</h2>
        <p>You requested a password reset. Click the button below to set a new password.</p>
        <a href="${resetUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #666; font-size: 14px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
      </div>
    `,
  })

  if (etherealAccount) {
    console.log(`[EMAIL] Preview: ${nodemailer.getTestMessageUrl(info)}`)
  }
}

const sendVerificationEmail = async (to, otp) => {
  const transporter = await getTransporter()
  if (!transporter) return

  const info = await transporter.sendMail({
    from: `"FlowSync AI" <${process.env.SMTP_FROM || 'noreply@flowsync.ai'}>`,
    to,
    subject: 'Verify your email — FlowSync AI',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #6366f1;">FlowSync AI</h2>
        <p>Welcome! Use the OTP below to verify your email address.</p>
        <div style="background: #f0f0ff; border-radius: 12px; padding: 20px; text-align: center; margin: 16px 0;">
          <span style="font-size: 36px; font-weight: bold; color: #6366f1; letter-spacing: 8px;">${otp}</span>
        </div>
        <p style="color: #666; font-size: 14px;">This OTP expires in 10 minutes. If you didn't create this account, ignore this email.</p>
      </div>
    `,
  })

  if (etherealAccount) {
    console.log(`[EMAIL] Preview: ${nodemailer.getTestMessageUrl(info)}`)
  }
}

module.exports = { sendResetEmail, sendVerificationEmail }
