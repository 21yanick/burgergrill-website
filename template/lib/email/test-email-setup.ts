/**
 * 🧪 Email Setup Test Utility
 * Validates Infomaniak SMTP configuration and sends test emails
 * Swiss data privacy compliant - no external dependencies
 */

import { 
  getTransporter, 
  verifyConnection, 
  getSmtpStatus, 
  getFromAddress, 
  getReplyToAddress 
} from './client';
import { siteConfig } from '@/lib/config';
import { getLogger } from '@/lib/logger';
import { render } from '@react-email/components';

const logger = getLogger('email-test');

// =====================================================================================
// CONFIGURATION VALIDATION
// =====================================================================================

/**
 * Check if Infomaniak SMTP is properly configured
 */
export function validateSmtpConfig(): {
  valid: boolean;
  errors: string[];
  userSet: boolean;
  passwordSet: boolean;
  userFormat: boolean;
} {
  const errors: string[] = [];
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;

  // Check if SMTP user is set
  const userSet = !!smtpUser && smtpUser !== 'noreply@burgergrill.ch';
  if (!userSet) {
    errors.push('SMTP_USER not set or still using placeholder value');
  }

  // Check SMTP user format (should be full email address)
  const userFormat = smtpUser?.includes('@') || false;
  if (smtpUser && !userFormat) {
    errors.push('SMTP_USER must be a full email address (e.g., noreply@burgergrill.ch)');
  }

  // Check if SMTP password is set
  const passwordSet = !!smtpPassword && smtpPassword !== 'your-email-password';
  if (!passwordSet) {
    errors.push('SMTP_PASSWORD not set or still using placeholder value');
  }

  return {
    valid: errors.length === 0,
    errors,
    userSet,
    passwordSet,
    userFormat
  };
}

/**
 * Test email configuration by sending a test email
 */
export async function sendTestEmail(
  testRecipientEmail: string
): Promise<{
  success: boolean;
  error?: string;
  messageId?: string;
  configValidation: ReturnType<typeof validateSmtpConfig>;
}> {
  const configValidation = validateSmtpConfig();

  if (!configValidation.valid) {
    logger.error({ errors: configValidation.errors }, 'SMTP configuration invalid');
    return {
      success: false,
      error: `Configuration errors: ${configValidation.errors.join(', ')}`,
      configValidation
    };
  }

  try {
    logger.info({ testRecipientEmail }, 'Sending test email via Infomaniak SMTP');

    const transporter = getTransporter();
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #28a745;">✅ E-Mail-Konfiguration erfolgreich!</h1>
        <p>Diese Test-E-Mail bestätigt, dass Ihre Infomaniak SMTP-Integration korrekt funktioniert.</p>
        
        <h2 style="color: #333;">🎯 Konfiguration:</h2>
        <ul style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
          <li><strong>SMTP Server:</strong> mail.infomaniak.com</li>
          <li><strong>Von:</strong> ${getFromAddress()}</li>
          <li><strong>An:</strong> ${testRecipientEmail}</li>
          <li><strong>Domain:</strong> burgergrill.ch</li>
          <li><strong>Datenschutz:</strong> 🇨🇭 Schweizer Hosting</li>
        </ul>
        
        <h2 style="color: #333;">📧 Nächste Schritte:</h2>
        <ol style="background: #e8f4fd; padding: 15px; border-radius: 5px;">
          <li>Testen Sie eine echte KG-Verkauf Bestellung</li>
          <li>Überprüfen Sie Kundenbestätigungs-E-Mails</li>
          <li>Überprüfen Sie Restaurant-Benachrichtigungs-E-Mails</li>
          <li>Überwachen Sie E-Mail-Logs in Infomaniak-Dashboard</li>
        </ol>
        
        <p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
          Diese E-Mail wurde automatisch vom Burgergrill Website-System generiert.<br/>
          Zeitstempel: ${new Date().toLocaleString('de-CH')}<br/>
          SMTP Provider: Infomaniak (🇨🇭 Swiss Data Privacy)
        </p>
      </div>
    `;

    const mailOptions = {
      from: getFromAddress(),
      to: testRecipientEmail,
      replyTo: getReplyToAddress(),
      subject: '🧪 Burgergrill Email Test - Infomaniak SMTP erfolgreich',
      html: htmlContent,
      headers: {
        'X-Email-Type': 'test-email',
        'X-Environment': process.env.NODE_ENV || 'development',
        'X-SMTP-Provider': 'infomaniak'
      }
    };

    const result = await transporter.sendMail(mailOptions);

    logger.info({ 
      messageId: result.messageId,
      testRecipientEmail,
      accepted: result.accepted,
      rejected: result.rejected
    }, 'Test email sent successfully via Infomaniak SMTP');

    return {
      success: true,
      messageId: result.messageId,
      configValidation
    };

  } catch (error) {
    logger.error({ error, testRecipientEmail }, 'Unexpected error sending test email');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected error occurred while sending test email',
      configValidation
    };
  }
}

/**
 * Comprehensive email setup validation
 */
export async function validateEmailSetup(testEmail?: string): Promise<{
  configValid: boolean;
  smtpConnectionValid?: boolean;
  testEmailSent?: boolean;
  results: {
    config: ReturnType<typeof validateSmtpConfig>;
    smtpConnection?: Awaited<ReturnType<typeof verifyConnection>>;
    testEmail?: Awaited<ReturnType<typeof sendTestEmail>>;
  };
  summary: string[];
}> {
  const results = {
    config: validateSmtpConfig(),
    smtpConnection: undefined as Awaited<ReturnType<typeof verifyConnection>> | undefined,
    testEmail: undefined as Awaited<ReturnType<typeof sendTestEmail>> | undefined
  };

  const summary: string[] = [];

  // Configuration validation
  if (results.config.valid) {
    summary.push('✅ SMTP configuration is valid');
  } else {
    summary.push('❌ SMTP configuration has errors:');
    results.config.errors.forEach(error => {
      summary.push(`   • ${error}`);
    });
  }

  // SMTP connection test (if config is valid)
  if (results.config.valid) {
    results.smtpConnection = await verifyConnection();
    
    if (results.smtpConnection.success) {
      summary.push('✅ SMTP connection to Infomaniak verified');
      summary.push(`   Host: ${results.smtpConnection.config.host}:${results.smtpConnection.config.port}`);
    } else {
      summary.push(`❌ SMTP connection failed: ${results.smtpConnection.error}`);
    }
  }

  // Test email (optional)
  if (testEmail && results.config.valid && results.smtpConnection?.success) {
    results.testEmail = await sendTestEmail(testEmail);
    
    if (results.testEmail.success) {
      summary.push(`✅ Test email sent successfully to ${testEmail}`);
      summary.push(`   Message ID: ${results.testEmail.messageId}`);
    } else {
      summary.push(`❌ Failed to send test email: ${results.testEmail.error}`);
    }
  }

  return {
    configValid: results.config.valid,
    smtpConnectionValid: results.smtpConnection?.success,
    testEmailSent: results.testEmail?.success || false,
    results,
    summary
  };
}

/**
 * Get setup instructions for user
 */
export function getSetupInstructions(): string[] {
  const config = validateSmtpConfig();
  const instructions: string[] = [];

  instructions.push('📧 INFOMANIAK SMTP SETUP INSTRUCTIONS:');
  instructions.push('');

  if (!config.userSet) {
    instructions.push('1. ⚠️  Set your SMTP credentials in .env.local:');
    instructions.push('   SMTP_USER=noreply@burgergrill.ch  # Your full email address');
    instructions.push('   SMTP_PASSWORD=your-email-password  # Your email account password');
    instructions.push('');
  } else {
    instructions.push('1. ✅ SMTP credentials are set');
  }

  instructions.push('2. 📧 Create email account at Infomaniak:');
  instructions.push('   • Login to your Infomaniak hosting panel');
  instructions.push('   • Create email address: noreply@burgergrill.ch');
  instructions.push('   • Set a strong password');
  instructions.push('   • Configure SMTP access if needed');
  instructions.push('');

  instructions.push('3. 🔧 SMTP Configuration (Auto-configured):');
  instructions.push('   • Server: mail.infomaniak.com');
  instructions.push('   • Port: 465 (SSL) or 587 (TLS)');
  instructions.push('   • Security: SSL/TLS encryption');
  instructions.push('   • Authentication: Required');
  instructions.push('');

  instructions.push('4. 🧪 Test your setup:');
  instructions.push('   • Use validateEmailSetup() function');
  instructions.push('   • Send a test order through the website');
  instructions.push('   • Check both customer and restaurant emails');
  instructions.push('');

  instructions.push('5. 🚀 Go live:');
  instructions.push('   • All email functionality is ready');
  instructions.push('   • Monitor email logs in Infomaniak dashboard');
  instructions.push('   • Customer orders will trigger automatic emails');
  instructions.push('   • 🇨🇭 100% Swiss data privacy compliance');

  return instructions;
}