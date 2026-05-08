import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log('🧪 Testing Brevo Email Configuration\n');

// Check if credentials are set
if (!process.env.BREVO_SMTP_KEY) {
  console.error('❌ Missing BREVO_SMTP_KEY in .env file');
  console.log('\nPlease add to backend/.env:');
  console.log('BREVO_SMTP_USER=your-email@example.com');
  console.log('BREVO_SMTP_KEY=xsmtpsib-your-key-here');
  process.exit(1);
}

// Create transporter with Brevo settings
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER || process.env.EMAIL_USER || 'test@example.com',
    pass: process.env.BREVO_SMTP_KEY,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
  debug: true,
  logger: true,
});

console.log('📧 Brevo SMTP Configuration:');
console.log('  Host: smtp-relay.brevo.com');
console.log('  Port: 587');
console.log('  User:', process.env.BREVO_SMTP_USER || process.env.EMAIL_USER || 'NOT SET');
console.log('  Key:', process.env.BREVO_SMTP_KEY ? `${process.env.BREVO_SMTP_KEY.substring(0, 15)}...` : 'NOT SET');
console.log('');

// Test email content
const testEmail = {
  from: `"EventHub Test" <${process.env.BREVO_SMTP_USER || process.env.EMAIL_USER || 'test@example.com'}>`,
  to: process.env.TEST_EMAIL || process.env.EMAIL_USER || 'namansharma2109@gmail.com',
  subject: '🧪 Brevo Email Test - EventHub',
  html: `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 30px; border-radius: 8px; }
          .success { background: #10b981; color: white; padding: 15px; border-radius: 4px; text-align: center; }
          .info { background: white; padding: 20px; margin-top: 20px; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="success">
            <h1>✅ Email Test Successful!</h1>
          </div>
          <div class="info">
            <p><strong>Congratulations!</strong> Your Brevo email service is working correctly.</p>
            <p><strong>Configuration:</strong></p>
            <ul>
              <li>SMTP Host: smtp-relay.brevo.com</li>
              <li>Port: 587 (STARTTLS)</li>
              <li>Service: Brevo (formerly Sendinblue)</li>
            </ul>
            <p><strong>Next steps:</strong></p>
            <ol>
              <li>Add these credentials to Render environment variables</li>
              <li>Deploy and test booking flow</li>
              <li>Check email deliverability in Brevo dashboard</li>
            </ol>
            <p>Sent at: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
    </html>
  `,
  text: 'Brevo Email Test - If you see this, your email service is working!',
};

console.log('📤 Sending test email to:', testEmail.to);
console.log('');

try {
  const info = await transporter.sendMail(testEmail);
  console.log('✅ Email sent successfully!');
  console.log('Message ID:', info.messageId);
  console.log('Response:', info.response);
  console.log('');
  console.log('🎉 Brevo email service is working correctly!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Check inbox for test email');
  console.log('2. Add these credentials to Render:');
  console.log('   - BREVO_SMTP_USER:', process.env.BREVO_SMTP_USER || process.env.EMAIL_USER);
  console.log('   - BREVO_SMTP_KEY: <your-key>');
  console.log('3. Wait for Render to redeploy');
  console.log('4. Test booking flow on production');
  process.exit(0);
} catch (error) {
  console.error('❌ Email sending failed!');
  console.error('');
  console.error('Error:', error.message);
  console.error('Code:', error.code);
  console.error('');
  
  if (error.code === 'ETIMEDOUT') {
    console.log('🔍 Connection timeout - possible causes:');
    console.log('  1. Invalid SMTP key');
    console.log('  2. Network/firewall blocking port 587');
    console.log('  3. Brevo account not activated');
  } else if (error.code === 'EAUTH') {
    console.log('🔍 Authentication failed - check:');
    console.log('  1. BREVO_SMTP_KEY is correct');
    console.log('  2. BREVO_SMTP_USER matches your Brevo account email');
  }
  
  console.log('');
  console.log('Verify your credentials at: https://app.brevo.com/');
  process.exit(1);
}
