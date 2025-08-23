import nodemailer from 'nodemailer'

export async function sendShelterRequestMail({
  name,
  email,
  website,
  message,
  address,
  mapsLink,
  attachments = [],
}) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_RECEIVER,
    subject: `Neue Tierheim-Bewerbung: ${name}`,
    html: `
      <div style="background: #F4EFE9; border-radius: 20px; padding: 20px; font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="font-size: 44px; margin-bottom: 24px;">Neue Tierheim-Bewerbung</h2>

        <p style="margin: 0 0 8px;">Name</p>
        <div style="background: #ffffff; padding: 8px 16px; border-radius: 90px; box-shadow: 0px 0px 4px rgba(0,0,0,0.25); margin-bottom: 16px;">
          ${name}
        </div>

        <p style="margin: 0 0 8px;">E-Mail</p>
        <div style="background: #ffffff; padding: 8px 16px; border-radius: 90px; box-shadow: 0px 0px 4px rgba(0,0,0,0.25); margin-bottom: 16px;">
          ${email}
        </div>

        ${website ? `
          <p style="margin: 0 0 8px;">Website</p>
          <div style="background: #ffffff; padding: 8px 16px; border-radius: 90px; box-shadow: 0px 0px 4px rgba(0,0,0,0.25); margin-bottom: 16px;">
            ${website}
          </div>
        ` : ''}

        ${address ? `
          <p style="margin: 0 0 8px;">Adresse</p>
          <div style="background: #ffffff; padding: 8px 16px; border-radius: 90px; box-shadow: 0px 0px 4px rgba(0,0,0,0.25); margin-bottom: 16px;">
            ${address}
          </div>
        ` : ''}

        ${mapsLink ? `
          <p style="margin: 0 0 8px;">Standort</p>
          <div style="background: #ffffff; padding: 8px 16px; border-radius: 90px; box-shadow: 0px 0px 4px rgba(0,0,0,0.25); margin-bottom: 16px;">
            <a href="${mapsLink}" target="_blank" style="color: #000;">📍 Google Maps</a>
          </div>
        ` : ''}

        <p style="margin: 0 0 8px;">Nachricht</p>
        <div style="background: #ffffff; padding: 8px 16px; border-radius: 1rem; box-shadow: 0px 0px 4px rgba(0,0,0,0.25); white-space: pre-wrap;">
          ${message.replace(/\n/g, '<br>')}
        </div>
      </div>
    `,
    attachments,
  }

  await transporter.sendMail(mailOptions)
}
