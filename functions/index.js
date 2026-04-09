const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Resend } = require('resend');

admin.initializeApp();

// Initialize Resend with your API Key
// You should set this in your Firebase environment:
// firebase functions:config:set resend.key="YOUR_RESEND_API_KEY"
const resend = new Resend(functions.config().resend ? functions.config().resend.key : 're_placeholder');

/**
 * Triggered when a new message is added to Firestore.
 * Sends an email to the admin and a confirmation to the user.
 */
exports.sendContactEmail = functions.firestore
  .document('messages/{messageId}')
  .onCreate(async (snap, context) => {
    const newValue = snap.data();
    const { name, email, phone, message } = newValue;

    try {
      // 1. Notify Admin
      await resend.emails.send({
        from: 'RetireSafe Crypto <notifications@retiresafe.com>',
        to: 'admin@retiresafe.com',
        subject: `New Lead: ${name}`,
        html: `
          <h1>New Contact Request</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });

      // 2. Confirmation to User
      await resend.emails.send({
        from: 'RetireSafe Crypto <hello@retiresafe.com>',
        to: email,
        subject: 'We received your request - RetireSafe Crypto',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #4f46e5;">Hello ${name},</h2>
            <p>Thank you for reaching out to RetireSafe Crypto. We have received your request for a consultation.</p>
            <p>One of our retirement specialists will review your message and contact you within the next 24 hours to schedule a friendly, no-obligation conversation.</p>
            <p>In the meantime, feel free to explore our conservative investment approach on our website.</p>
            <br>
            <p>Best regards,</p>
            <p><strong>The RetireSafe Team</strong></p>
          </div>
        `,
      });

      console.log('Emails sent successfully');
    } catch (error) {
      console.error('Error sending emails:', error);
    }
  });

/**
 * HTTP Callable function for admins to export contacts as CSV.
 */
exports.exportContacts = functions.https.onCall(async (data, context) => {
  // Check if user is admin
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Only admins can export contacts.'
    );
  }

  try {
    const snapshot = await admin.firestore().collection('messages').orderBy('timestamp', 'desc').get();
    
    let csv = 'Name,Email,Phone,Message,Status,Date\n';
    
    snapshot.forEach(doc => {
      const d = doc.data();
      const date = d.timestamp ? d.timestamp.toDate().toISOString() : '';
      // Escape quotes for CSV
      const cleanMsg = (d.message || '').replace(/"/g, '""');
      csv += `"${d.name}","${d.email}","${d.phone}","${cleanMsg}","${d.status}","${date}"\n`;
    });

    return csv;
  } catch (error) {
    console.error('Export error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to generate CSV');
  }
});
