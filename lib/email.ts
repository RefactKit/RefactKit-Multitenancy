export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('Missing RESEND_API_KEY in environment variables')
      return
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'LaunchKIT <onboarding@kwizify.com>',
        to,
        subject,
        html,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error(`Failed to send email to ${to}:`, data)
      return
    }

    console.log(`Email sent successfully to ${to} (ID: ${data.id})`)
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error)
  }
}
