/**
 * 📧 Email Client - Infomaniak SMTP
 * Re-export from infomaniak-client for backward compatibility
 */

export { 
  getTransporter,
  verifyConnection,
  getSmtpStatus,
  getFromAddress,
  getReplyToAddress,
  closeConnection
} from './infomaniak-client';