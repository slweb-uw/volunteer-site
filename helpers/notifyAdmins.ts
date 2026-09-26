import { firebaseAdmin } from "../firebaseAdmin";

// Firebase's "Trigger Email" extension watches this collection and sends
// whatever gets added to it. Must be enabled + configured with SMTP
// credentials in the Firebase console for this to actually deliver mail.
const MAIL_COLLECTION = "mail";

export async function notifyAdminsOfPendingAuthorization(applicantEmail: string) {
  const recipients = (process.env.ADMIN_NOTIFICATION_EMAILS || "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    console.warn(
      "ADMIN_NOTIFICATION_EMAILS is not set — skipping pending authorization notification for",
      applicantEmail,
    );
    return;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  await firebaseAdmin.firestore().collection(MAIL_COLLECTION).add({
    to: recipients,
    message: {
      subject: `New preceptor awaiting authorization: ${applicantEmail}`,
      html: `
        <p><strong>${applicantEmail}</strong> just signed up with a non-UW email and has no matching role yet.</p>
        <p>Grant them access in <a href="${siteUrl}/userManager">User Manager</a>.</p>
      `,
    },
  });
}
