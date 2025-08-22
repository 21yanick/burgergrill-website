/**
 * 📧 Order Email Service
 * Handles sending order-related emails via Infomaniak SMTP
 * Swiss data privacy compliant - no data leaves Switzerland
 */

import { getTransporter, getFromAddress, getReplyToAddress } from './client';
import { siteConfig } from '@/lib/config';
import { getLogger } from '@/lib/logger';
import { OrderConfirmationEmail, RestaurantNotificationEmail } from './templates';
import { render } from '@react-email/components';
import type { KgOrderData } from '@/components/restaurant/kg-verkauf/types';

const logger = getLogger('email-service');

// =====================================================================================
// EMAIL CONFIGURATION
// =====================================================================================

const EMAIL_CONFIG = {
  restaurantEmail: siteConfig.contact.email,
} as const;

// =====================================================================================
// EMAIL SERVICE FUNCTIONS
// =====================================================================================

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmation(
  orderData: KgOrderData,
  orderSource: 'hero' | 'kg-verkauf-section' = 'kg-verkauf-section'
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  try {
    const orderNumber = generateOrderNumber();
    const transporter = getTransporter();
    
    logger.info({ 
      orderNumber,
      source: orderSource,
      productCount: orderData.products.length
    }, 'Sending order confirmation email');

    // Render React Email template to HTML
    const emailHtml = await render(OrderConfirmationEmail({ 
      orderData, 
      orderNumber 
    }));

    const mailOptions = {
      from: getFromAddress(),
      to: orderData.customerEmail,
      replyTo: getReplyToAddress(),
      subject: `Bestellbestätigung - ${orderNumber} - Burgergrill`,
      html: emailHtml,
      // Add metadata as headers for tracking
      headers: {
        'X-Email-Type': 'order-confirmation',
        'X-Email-Source': orderSource,
        'X-Order-Number': orderNumber,
        'X-Customer': orderData.customerName.replace(/\s/g, '-').toLowerCase()
      }
    };

    const result = await transporter.sendMail(mailOptions);

    logger.info({ 
      messageId: result.messageId,
      customerEmail: orderData.customerEmail,
      orderNumber,
      accepted: result.accepted,
      rejected: result.rejected
    }, 'Order confirmation email sent successfully');

    return { 
      success: true, 
      messageId: result.messageId 
    };

  } catch (error) {
    logger.error({ 
      error, 
      customerEmail: orderData.customerEmail 
    }, 'Unexpected error sending order confirmation email');
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unexpected error occurred while sending confirmation email'
    };
  }
}

/**
 * Send new order notification to restaurant team
 */
export async function sendRestaurantNotification(
  orderData: KgOrderData,
  orderSource: 'hero' | 'kg-verkauf-section' = 'kg-verkauf-section'
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  try {
    const orderNumber = generateOrderNumber();
    const transporter = getTransporter();
    
    logger.info({ 
      orderNumber,
      source: orderSource,
      productCount: orderData.products.length,
      pickupDate: orderData.pickupDate
    }, 'Sending restaurant notification email');

    // Render React Email template to HTML
    const emailHtml = await render(RestaurantNotificationEmail({ 
      orderData, 
      orderNumber,
      orderSource 
    }));

    const mailOptions = {
      from: getFromAddress(),
      to: EMAIL_CONFIG.restaurantEmail,
      replyTo: orderData.customerEmail, // Restaurant can reply directly to customer
      subject: `🔔 Neue Bestellung - ${orderNumber} - ${orderData.customerName}`,
      html: emailHtml,
      // Add metadata as headers for tracking
      headers: {
        'X-Email-Type': 'restaurant-notification',
        'X-Email-Source': orderSource,
        'X-Order-Number': orderNumber,
        'X-Priority': 'high'
      }
    };

    const result = await transporter.sendMail(mailOptions);

    logger.info({ 
      messageId: result.messageId,
      orderNumber,
      restaurantEmail: EMAIL_CONFIG.restaurantEmail,
      accepted: result.accepted,
      rejected: result.rejected
    }, 'Restaurant notification email sent successfully');

    return { 
      success: true, 
      messageId: result.messageId 
    };

  } catch (error) {
    logger.error({ 
      error, 
      orderNumber: generateOrderNumber()
    }, 'Unexpected error sending restaurant notification email');
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unexpected error occurred while sending restaurant notification'
    };
  }
}

/**
 * Send both order confirmation and restaurant notification
 * Main function to be called from order handlers
 */
export async function sendOrderEmails(
  orderData: KgOrderData,
  orderSource: 'hero' | 'kg-verkauf-section' = 'kg-verkauf-section'
): Promise<{
  confirmationSent: boolean;
  notificationSent: boolean;
  errors: string[];
  messageIds: string[];
  orderNumber: string;
}> {
  // Generate single order number for both emails
  const orderNumber = generateOrderNumber();
  
  logger.info({ 
    source: orderSource,
    productCount: orderData.products.length,
    orderNumber
  }, 'Sending complete order email set');

  // Create modified functions that use the same order number
  const sendConfirmationWithOrderNumber = async () => {
    try {
      const transporter = getTransporter();
      const emailHtml = await render(OrderConfirmationEmail({ orderData, orderNumber }));
      
      const mailOptions = {
        from: getFromAddress(),
        to: orderData.customerEmail,
        replyTo: getReplyToAddress(),
        subject: `Bestellbestätigung - ${orderNumber} - Burgergrill`,
        html: emailHtml,
        headers: {
          'X-Email-Type': 'order-confirmation',
          'X-Email-Source': orderSource,
          'X-Order-Number': orderNumber,
          'X-Customer': orderData.customerName.replace(/\s/g, '-').toLowerCase()
        }
      };

      const result = await transporter.sendMail(mailOptions);
      logger.debug({ messageId: result.messageId, to: orderData.customerEmail }, 'Confirmation email sent successfully');
      return { success: true, messageId: result.messageId };
    } catch (error) {
      logger.error({ error, to: orderData.customerEmail }, 'Failed to send confirmation email');
      throw error;
    }
  };

  const sendNotificationWithOrderNumber = async () => {
    try {
      const transporter = getTransporter();
      const emailHtml = await render(RestaurantNotificationEmail({ orderData, orderNumber, orderSource }));
      
      const mailOptions = {
        from: getFromAddress(),
        to: EMAIL_CONFIG.restaurantEmail,
        replyTo: orderData.customerEmail,
        subject: `🔔 Neue Bestellung - ${orderNumber} - ${orderData.customerName}`,
        html: emailHtml,
        headers: {
          'X-Email-Type': 'restaurant-notification',
          'X-Email-Source': orderSource,
          'X-Order-Number': orderNumber,
          'X-Priority': 'high'
        }
      };

      const result = await transporter.sendMail(mailOptions);
      logger.debug({ messageId: result.messageId, to: EMAIL_CONFIG.restaurantEmail }, 'Restaurant notification sent successfully');
      return { success: true, messageId: result.messageId };
    } catch (error) {
      logger.error({ error, to: EMAIL_CONFIG.restaurantEmail }, 'Failed to send restaurant notification');
      throw error;
    }
  };

  const results = await Promise.allSettled([
    sendConfirmationWithOrderNumber(),
    sendNotificationWithOrderNumber()
  ]);

  const confirmationResult = results[0];
  const notificationResult = results[1];

  const response = {
    confirmationSent: false,
    notificationSent: false,
    errors: [] as string[],
    messageIds: [] as string[],
    orderNumber
  };

  // Process confirmation email result
  if (confirmationResult.status === 'fulfilled') {
    const result = confirmationResult.value;
    response.confirmationSent = result.success;
    if (result.messageId) {
      response.messageIds.push(result.messageId);
    }
  } else {
    response.errors.push(`Confirmation: ${confirmationResult.reason}`);
  }

  // Process notification email result
  if (notificationResult.status === 'fulfilled') {
    const result = notificationResult.value;
    response.notificationSent = result.success;
    if (result.messageId) {
      response.messageIds.push(result.messageId);
    }
  } else {
    response.errors.push(`Notification: ${notificationResult.reason}`);
  }

  logger.info({
    confirmationSent: response.confirmationSent,
    notificationSent: response.notificationSent,
    orderNumber,
    errorCount: response.errors.length
  }, 'Order email sending completed');

  return response;
}

// =====================================================================================
// UTILITY FUNCTIONS
// =====================================================================================

/**
 * Generate unique order number
 */
function generateOrderNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `BG-${timestamp.toString().slice(-8)}-${random}`;
}

/**
 * Validate email address format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate order data before sending emails
 */
export function validateOrderData(orderData: KgOrderData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!orderData.customerName?.trim()) {
    errors.push('Customer name is required');
  }

  if (!validateEmail(orderData.customerEmail)) {
    errors.push('Valid customer email is required');
  }

  if (!orderData.customerPhone?.trim()) {
    errors.push('Customer phone is required');
  }

  if (!orderData.products || orderData.products.length === 0) {
    errors.push('At least one product is required');
  }

  if (!orderData.pickupDate) {
    errors.push('Pickup date is required');
  }

  // Note: totalPrice validation removed - this is a simple order system
  // Restaurant calculates final price at pickup based on selected products

  return { valid: errors.length === 0, errors };
}