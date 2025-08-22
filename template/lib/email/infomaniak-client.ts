/**
 * 🇨🇭 Infomaniak SMTP Client
 * Secure, Swiss-hosted email delivery via Nodemailer
 * Zero external dependencies, full data privacy compliance
 */

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { getLogger } from '@/lib/logger';

const logger = getLogger('infomaniak-smtp');

// =====================================================================================
// INFOMANIAK SMTP CONFIGURATION
// =====================================================================================

/**
 * Official Infomaniak SMTP settings (2025)
 * Optimized configuration using STARTTLS on port 587
 * Source: https://www.infomaniak.com/en/support/faq/2023/use-authenticated-e-mail-from-a-website
 */
const INFOMANIAK_CONFIG = {
  host: 'mail.infomaniak.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASSWORD!,
  },
  connectionTimeout: 60000,
  greetingTimeout: 30000,
  socketTimeout: 75000,
} as const;

// =====================================================================================
// SMTP CLIENT CREATION
// =====================================================================================

/**
 * Create Infomaniak SMTP transporter
 * Lazy initialization with connection validation
 */
function createTransporter(): Transporter {
  // Validate required environment variables
  if (!process.env.SMTP_USER) {
    throw new Error('SMTP_USER environment variable is required (full email address)');
  }
  
  if (!process.env.SMTP_PASSWORD) {
    throw new Error('SMTP_PASSWORD environment variable is required (email password)');
  }

  logger.debug({ 
    host: INFOMANIAK_CONFIG.host,
    port: INFOMANIAK_CONFIG.port,
    secure: INFOMANIAK_CONFIG.secure
  }, 'Creating Infomaniak SMTP transporter');

  const transporter = nodemailer.createTransport(INFOMANIAK_CONFIG);

  // Add connection event handlers for monitoring
  transporter.on('error', (error: Error) => {
    logger.error({ error }, 'SMTP connection error');
  });

  return transporter;
}

// =====================================================================================
// SINGLETON INSTANCE
// =====================================================================================

let transporterInstance: Transporter | null = null;

/**
 * Get or create SMTP transporter instance
 * Singleton pattern for connection reuse
 */
export function getTransporter(): Transporter {
  if (!transporterInstance) {
    transporterInstance = createTransporter();
  }
  return transporterInstance;
}

/**
 * Close SMTP connection (for cleanup)
 */
export function closeConnection(): void {
  if (transporterInstance) {
    transporterInstance.close();
    transporterInstance = null;
    logger.info('SMTP connection closed');
  }
}

// =====================================================================================
// CONNECTION VALIDATION
// =====================================================================================

/**
 * Verify SMTP connection and authentication
 * Use this for health checks and setup validation
 */
export async function verifyConnection(): Promise<{
  success: boolean;
  error?: string;
  config: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
  };
}> {
  try {
    const transporter = getTransporter();
    
    logger.info('Verifying Infomaniak SMTP connection');
    
    await transporter.verify();
    
    logger.info('SMTP connection verified successfully');
    
    return {
      success: true,
      config: {
        host: INFOMANIAK_CONFIG.host,
        port: INFOMANIAK_CONFIG.port,
        secure: INFOMANIAK_CONFIG.secure,
        user: process.env.SMTP_USER!,
      },
    };
    
  } catch (error) {
    logger.error({ error }, 'SMTP connection verification failed');
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown SMTP error',
      config: {
        host: INFOMANIAK_CONFIG.host,
        port: INFOMANIAK_CONFIG.port,
        secure: INFOMANIAK_CONFIG.secure,
        user: process.env.SMTP_USER || 'NOT_SET',
      },
    };
  }
}

// =====================================================================================
// UTILITY FUNCTIONS
// =====================================================================================

/**
 * Get SMTP configuration status
 */
export function getSmtpStatus(): {
  configured: boolean;
  missingVars: string[];
  config: typeof INFOMANIAK_CONFIG;
} {
  const missingVars: string[] = [];
  
  if (!process.env.SMTP_USER) {
    missingVars.push('SMTP_USER');
  }
  
  if (!process.env.SMTP_PASSWORD) {
    missingVars.push('SMTP_PASSWORD');
  }
  
  return {
    configured: missingVars.length === 0,
    missingVars,
    config: INFOMANIAK_CONFIG,
  };
}

/**
 * Generate standard "from" address for all emails
 */
export function getFromAddress(): string {
  const user = process.env.SMTP_USER;
  if (!user) {
    throw new Error('SMTP_USER not configured');
  }
  
  // Extract domain from email for consistent branding
  if (user.includes('@burgergrill.ch')) {
    return 'Burgergrill <noreply@burgergrill.ch>';
  }
  
  return `Burgergrill <${user}>`;
}

/**
 * Get reply-to address (typically main business email)
 */
export function getReplyToAddress(): string {
  return 'info@burgergrill.ch';
}