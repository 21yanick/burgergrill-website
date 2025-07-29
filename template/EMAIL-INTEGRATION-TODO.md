# 📧 Resend Email Integration - Implementation TODO

## 🎯 Ziel
Bestellbestätigungen und Restaurant-Benachrichtigungen für Grillfleisch-Verkauf per Email versenden.

## 📋 Implementation Checklist

### ✅ Bereits vorbereitet:
- [x] Resend API Key in `.env.example` konfiguriert
- [x] Email Template Structure in `lib/email/templates/`
- [x] Order Data Types definiert in `components/restaurant/kg-verkauf/types.ts`

### 🔧 TODO - Resend Integration:

#### 1. Email Templates erstellen
```typescript
// lib/email/templates/order-confirmation.tsx
// - Kundenseite: Bestellbestätigung mit Details
// - Restaurant: Neue Bestellung Benachrichtigung
```

#### 2. Email Service implementieren  
```typescript
// lib/email/send-order-emails.ts
export async function sendOrderConfirmation(orderData: KgOrderData): Promise<void>
export async function sendRestaurantNotification(orderData: KgOrderData): Promise<void>
```

#### 3. Integration in Order Handlers
```typescript
// components/restaurant/hero/hero-section.tsx (Line 47-52)
// components/restaurant/kg-verkauf/kg-verkauf-section.tsx (Line 17-22)
// - Replace TODO comments with actual email sending
// - Add error handling for email failures
// - Add success feedback to user
```

#### 4. Environment Variables
```bash
# .env.local (add real values)
RESEND_API_KEY=re_YOUR_ACTUAL_RESEND_API_KEY
```

## 📨 Email Flow
1. User submits order → Dialog
2. `handleOrderSubmit()` called
3. Send confirmation email to customer  
4. Send notification email to restaurant
5. Show success message to user
6. Close dialog

## 🔗 Resend Documentation
- API: https://resend.com/docs/api-reference/emails/send
- React Templates: https://resend.com/docs/send-with-react

## ⚡ Priority: HIGH
Benötigt für Production-Launch der Grillfleisch-Verkauf Funktion.