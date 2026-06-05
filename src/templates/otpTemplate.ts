export function getOtpEmailTemplate(otp: number): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Verification Code</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; color: #1f2937;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; padding: 40px 16px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="480px" border="0" cellspacing="0" cellpadding="0" style="max-width: 480px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #f3f4f6; padding: 32px;">
              
              <tr>
                <td align="center" style="padding-bottom: 20px; border-bottom: 1px solid #f3f4f6;">
                  <span style="font-size: 18px; font-weight: 700; letter-spacing: -0.025em; color: #111827;">AppSecurity</span>
                </td>
              </tr>

              <tr>
                <td align="left" style="padding-top: 24px;">
                  <h1 style="font-size: 20px; font-weight: 600; color: #111827; margin: 0 0 12px 0;">Verify your account</h1>
                  <p style="font-size: 14px; line-height: 1.5; color: #4b5563; margin: 0 0 24px 0;">Use the following verification code to complete your authentication. This code is valid for <b>5 minutes</b> and can only be used once.</p>
                </td>
              </tr>

              <tr>
                <td align="center" style="background-color: #f3f4f6; border-radius: 8px; padding: 16px; margin: 24px 0;">
                  <span style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #111827; padding-left: 6px;">${otp}</span>
                </td>
              </tr>

              <tr>
                <td align="left" style="padding-top: 24px;">
                  <p style="font-size: 12px; line-height: 1.5; color: #9ca3af; margin: 0;">If you did not request this code, please ignore this email or secure your account settings if you suspect malicious activity.</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>`;
}
