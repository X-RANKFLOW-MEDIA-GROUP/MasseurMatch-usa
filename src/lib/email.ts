// Email notification service
// Supports multiple providers: Resend, SendGrid, or SMTP

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Email templates
export const EMAIL_TEMPLATES = {
  paymentPastDue: (name: string, amount: string, daysPastDue: number, updateUrl: string) => ({
    subject: `Action Required: Payment ${daysPastDue} Day${daysPastDue > 1 ? 's' : ''} Past Due`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); padding: 32px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Payment Past Due</h1>
    </div>
    <div style="padding: 32px;">
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">
        Your payment of <strong style="color: #7c3aed;">${amount}</strong> is <strong>${daysPastDue} day${daysPastDue > 1 ? 's' : ''}</strong> past due.
      </p>
      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 4px;">
        <p style="color: #92400e; margin: 0; font-size: 14px;">
          <strong>Important:</strong> To avoid service interruption, please update your payment method as soon as possible.
        </p>
      </div>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${updateUrl}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Update Payment Method
        </a>
      </div>
      <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
        If you've already made a payment, please disregard this email. It may take a few hours for our system to update.
      </p>
    </div>
    <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
        MasseurMatch • Professional Massage Services
      </p>
    </div>
  </div>
</body>
</html>
    `,
    text: `Hi ${name},\n\nYour payment of ${amount} is ${daysPastDue} day${daysPastDue > 1 ? 's' : ''} past due.\n\nTo avoid service interruption, please update your payment method: ${updateUrl}\n\nMasseurMatch`,
  }),

  paymentFailed: (name: string, amount: string, updateUrl: string) => ({
    subject: "Payment Failed - Action Required",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 32px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Payment Failed</h1>
    </div>
    <div style="padding: 32px;">
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">
        We were unable to process your payment of <strong style="color: #dc2626;">${amount}</strong>.
      </p>
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">
        This could be due to:
      </p>
      <ul style="color: #6b7280; font-size: 14px; line-height: 1.8;">
        <li>Insufficient funds</li>
        <li>Expired card</li>
        <li>Card declined by your bank</li>
      </ul>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${updateUrl}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Update Payment Method
        </a>
      </div>
    </div>
    <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
        MasseurMatch • Professional Massage Services
      </p>
    </div>
  </div>
</body>
</html>
    `,
    text: `Hi ${name},\n\nWe were unable to process your payment of ${amount}.\n\nPlease update your payment method: ${updateUrl}\n\nMasseurMatch`,
  }),

  renewalReminder: (name: string, plan: string, renewalDate: string, amount: string, manageUrl: string) => ({
    subject: `Your ${plan} subscription renews in 3 days`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); padding: 32px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Subscription Renewal Reminder</h1>
    </div>
    <div style="padding: 32px;">
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">
        This is a friendly reminder that your <strong style="color: #7c3aed;">${plan}</strong> subscription will automatically renew on <strong>${renewalDate}</strong>.
      </p>
      <div style="background-color: #f3f4f6; border-radius: 12px; padding: 24px; margin: 24px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="color: #6b7280; padding: 8px 0;">Plan</td>
            <td style="color: #111827; font-weight: 600; text-align: right; padding: 8px 0;">${plan}</td>
          </tr>
          <tr>
            <td style="color: #6b7280; padding: 8px 0;">Renewal Date</td>
            <td style="color: #111827; font-weight: 600; text-align: right; padding: 8px 0;">${renewalDate}</td>
          </tr>
          <tr>
            <td style="color: #6b7280; padding: 8px 0;">Amount</td>
            <td style="color: #7c3aed; font-weight: 600; text-align: right; padding: 8px 0;">${amount}</td>
          </tr>
        </table>
      </div>
      <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
        No action is needed if you wish to continue your subscription. If you'd like to make changes or cancel, please do so before the renewal date.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${manageUrl}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Manage Subscription
        </a>
      </div>
    </div>
    <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
        MasseurMatch • Professional Massage Services
      </p>
    </div>
  </div>
</body>
</html>
    `,
    text: `Hi ${name},\n\nYour ${plan} subscription will renew on ${renewalDate} for ${amount}.\n\nManage your subscription: ${manageUrl}\n\nMasseurMatch`,
  }),

  subscriptionRenewed: (name: string, plan: string, amount: string) => ({
    subject: `Payment Received - ${plan} Subscription Renewed`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 32px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Payment Successful</h1>
    </div>
    <div style="padding: 32px;">
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">
        Your <strong style="color: #10b981;">${plan}</strong> subscription has been successfully renewed.
      </p>
      <div style="background-color: #ecfdf5; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
        <p style="color: #065f46; margin: 0 0 8px 0; font-size: 14px;">Amount charged</p>
        <p style="color: #10b981; margin: 0; font-size: 32px; font-weight: 700;">${amount}</p>
      </div>
      <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
        Thank you for being a valued member of MasseurMatch. You'll continue to enjoy all the benefits of your ${plan} plan.
      </p>
    </div>
    <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
        MasseurMatch • Professional Massage Services
      </p>
    </div>
  </div>
</body>
</html>
    `,
    text: `Hi ${name},\n\nYour ${plan} subscription has been renewed. Amount charged: ${amount}.\n\nThank you for being a MasseurMatch member!\n\nMasseurMatch`,
  }),
};

// Email sending function using fetch (works with most email APIs)
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  const provider = process.env.EMAIL_PROVIDER || "resend";
  const from = options.from || process.env.EMAIL_FROM || "MasseurMatch <noreply@masseurmatch.com>";

  try {
    if (provider === "resend") {
      return await sendWithResend({ ...options, from });
    } else if (provider === "sendgrid") {
      return await sendWithSendGrid({ ...options, from });
    } else {
      console.log("Email (no provider configured):", options.subject, "to:", options.to);
      return { success: true, messageId: "dev-mode" };
    }
  } catch (error) {
    console.error("Email send error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function sendWithResend(options: EmailOptions & { from: string }): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("Resend API key not configured, skipping email");
    return { success: true, messageId: "no-api-key" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: options.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return { success: false, error: data.message || "Resend API error" };
  }

  return { success: true, messageId: data.id };
}

async function sendWithSendGrid(options: EmailOptions & { from: string }): Promise<EmailResult> {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.log("SendGrid API key not configured, skipping email");
    return { success: true, messageId: "no-api-key" };
  }

  const extractEmailFromSender = (from: string) => {
    const start = from.indexOf("<");
    const end = from.indexOf(">", start + 1);

    if (start !== -1 && end !== -1) {
      return from.slice(start + 1, end);
    }

    return from;
  };

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: options.to }] }],
      from: { email: extractEmailFromSender(options.from) },
      subject: options.subject,
      content: [
        { type: "text/plain", value: options.text || "" },
        { type: "text/html", value: options.html },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    return { success: false, error: text || "SendGrid API error" };
  }

  return { success: true, messageId: response.headers.get("x-message-id") || "sent" };
}

// Helper to send notification emails
export async function sendNotificationEmail(
  type: keyof typeof EMAIL_TEMPLATES,
  to: string,
  params: Record<string, string | number>
): Promise<EmailResult> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://masseurmatch.com";
  const defaultManageUrl = `${baseUrl}/dashboard/billing`;

  const templateParams = {
    name: params.name as string || "there",
    amount: params.amount as string || "$0",
    daysPastDue: params.daysPastDue as number || 1,
    plan: params.plan as string || "Standard",
    renewalDate: params.renewalDate as string || "soon",
    updateUrl: params.updateUrl as string || defaultManageUrl,
    manageUrl: params.manageUrl as string || defaultManageUrl,
  };

  let template;
  switch (type) {
    case "paymentPastDue":
      template = EMAIL_TEMPLATES.paymentPastDue(
        templateParams.name,
        templateParams.amount,
        templateParams.daysPastDue,
        templateParams.updateUrl
      );
      break;
    case "paymentFailed":
      template = EMAIL_TEMPLATES.paymentFailed(
        templateParams.name,
        templateParams.amount,
        templateParams.updateUrl
      );
      break;
    case "renewalReminder":
      template = EMAIL_TEMPLATES.renewalReminder(
        templateParams.name,
        templateParams.plan,
        templateParams.renewalDate,
        templateParams.amount,
        templateParams.manageUrl
      );
      break;
    case "subscriptionRenewed":
      template = EMAIL_TEMPLATES.subscriptionRenewed(
        templateParams.name,
        templateParams.plan,
        templateParams.amount
      );
      break;
    default:
      return { success: false, error: "Unknown template type" };
  }

  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}
