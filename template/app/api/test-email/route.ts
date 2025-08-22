/**
 * 🧪 Test Email API Route - Infomaniak SMTP
 * GET /api/test-email - Validates SMTP configuration
 * POST /api/test-email - Sends test email via Infomaniak
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateEmailSetup, getSetupInstructions } from '@/lib/email/test-email-setup';
import { getLogger } from '@/lib/logger';

const logger = getLogger('test-email-api');

// =====================================================================================
// GET - Validate Configuration
// =====================================================================================

export async function GET(): Promise<NextResponse> {
  try {
    logger.info('Infomaniak SMTP configuration validation requested');
    
    const validation = await validateEmailSetup();
    const instructions = getSetupInstructions();
    
    return NextResponse.json({
      status: validation.configValid ? 'ready' : 'needs_setup',
      configValid: validation.configValid,
      smtpConnectionValid: validation.smtpConnectionValid,
      summary: validation.summary,
      instructions,
      details: validation.results.config,
      smtpDetails: validation.results.smtpConnection,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error({ error }, 'Error validating Infomaniak SMTP configuration');
    
    return NextResponse.json({
      status: 'error',
      error: 'Failed to validate Infomaniak SMTP configuration',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// =====================================================================================
// POST - Send Test Email
// =====================================================================================

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json({
        status: 'error',
        error: 'Email address is required in request body'
      }, { status: 400 });
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        status: 'error',
        error: 'Invalid email address format'
      }, { status: 400 });
    }
    
    logger.info({ testEmail: email }, 'Test email requested');
    
    const validation = await validateEmailSetup(email);
    
    if (!validation.configValid) {
      return NextResponse.json({
        status: 'config_error',
        error: 'Infomaniak SMTP configuration is invalid',
        summary: validation.summary,
        instructions: getSetupInstructions()
      }, { status: 400 });
    }
    
    return NextResponse.json({
      status: validation.testEmailSent ? 'sent' : 'failed',
      configValid: validation.configValid,
      testEmailSent: validation.testEmailSent,
      messageId: validation.results.testEmail?.messageId,
      error: validation.results.testEmail?.error,
      summary: validation.summary,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error({ error }, 'Error sending test email');
    
    return NextResponse.json({
      status: 'error',
      error: 'Failed to send test email',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}