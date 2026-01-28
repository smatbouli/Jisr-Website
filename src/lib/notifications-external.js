export async function sendEmail({ to, subject, text }) {
    console.log('---------------------------------------------------');
    console.log(`📧 MOCK EMAIL SENT`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${text}`);
    console.log('---------------------------------------------------');
    return { success: true };
}

export async function sendSMS({ to, text }) {
    console.log('---------------------------------------------------');
    console.log(`📱 MOCK SMS SENT`);
    console.log(`To: ${to}`);
    console.log(`Message: ${text}`);
    console.log('---------------------------------------------------');
    return { success: true };
}
