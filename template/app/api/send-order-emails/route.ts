/**
 * 📧 Order Email API Route - Server-Side Email Sending
 * POST /api/send-order-emails - Handles KG-Verkauf order email sending via Infomaniak SMTP
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendOrderEmails, validateOrderData } from '@/lib/email/send-order-emails';
import { getLogger } from '@/lib/logger';
import type { KgOrderData } from '@/components/restaurant/kg-verkauf/types';

const logger = getLogger('send-order-emails-api');

export async function POST(request: NextRequest) {
  try {
    logger.debug('Order email API endpoint called');

    // Parse request body
    const body = await request.json();
    const { orderData, orderSource = 'kg-verkauf-section' } = body as {
      orderData: KgOrderData;
      orderSource?: 'hero' | 'kg-verkauf-section';
    };

    // Validate request data
    if (!orderData) {
      logger.warn('Missing orderData in request');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing order data' 
        },
        { status: 400 }
      );
    }

    // Validate order data structure
    const validation = validateOrderData(orderData);
    if (!validation.valid) {
      logger.warn({ 
        errors: validation.errors,
        customerName: orderData.customerName 
      }, 'Order validation failed');
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Order validation failed',
          details: validation.errors
        },
        { status: 400 }
      );
    }

    logger.info({ 
      customerName: orderData.customerName,
      orderSource,
      productCount: orderData.products.length
    }, 'Processing order email request');

    // Send emails via Infomaniak SMTP
    const emailResults = await sendOrderEmails(orderData, orderSource);

    // Create product summary for response
    const productSummary = orderData.products
      .map(item => `${item.quantity} ${item.product.unit} ${item.product.name}`)
      .join(', ');

    logger.info({
      confirmationSent: emailResults.confirmationSent,
      notificationSent: emailResults.notificationSent,
      orderNumber: emailResults.orderNumber,
      errorCount: emailResults.errors.length
    }, 'Order email processing completed');

    // Return success response
    return NextResponse.json({
      success: true,
      confirmationSent: emailResults.confirmationSent,
      notificationSent: emailResults.notificationSent,
      orderNumber: emailResults.orderNumber,
      productSummary,
      errors: emailResults.errors
    });

  } catch (error) {
    logger.error({ error }, 'Unexpected error in order email API');
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error occurred while sending emails' 
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to send order emails.' },
    { status: 405 }
  );
}