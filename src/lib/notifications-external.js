/**
 * Mock implementation of external notification services.
 * In a real application, these would integrate with services like SendGrid, AWS SES, or Twilio.
 */

export async function sendEmail({ to, subject, text, html }) {
    console.log(`[EXTERNAL_EMAIL_MOCK] Sending to ${to}: ${subject}`);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return { success: true, messageId: `mock-${Date.now()}` };
}

export async function sendSMS({ to, text }) {
    console.log(`[EXTERNAL_SMS_MOCK] Sending to ${to}: ${text}`);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return { success: true, messageId: `mock-${Date.now()}` };
}
