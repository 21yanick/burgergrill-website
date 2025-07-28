/**
 * Email Templates Export
 * Clean imports für alle email templates
 */

// ✅ SHARED - Universal templates
export { WelcomeEmail } from './welcome'

// 🟦 SAAS-ONLY - Subscription-related emails  
export { InvoiceEmail } from './invoice'

// 🟩 SHOP-ONLY - E-commerce emails
export { OrderConfirmationEmail } from './order-confirmation'
export { OrderStatusEmail } from './order-status'

// Re-export types for convenience
export type {
  OrderItem,
  OrderConfirmationEmailProps,
} from './order-confirmation'

export type {
  OrderStatusEmailProps,
} from './order-status'