/**
 * 🟩 SHOP-ONLY: Order Confirmation Email Template
 * Sent immediately after successful purchase
 * Swiss-optimized: CHF formatting, German content
 */

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Hr,
} from '@react-email/components';

export interface OrderItem {
  product_name: string;
  quantity: number;
  unit_price: number; // in Rappen
  total_price: number; // in Rappen
}

export interface OrderConfirmationEmailProps {
  customerEmail: string;
  orderId: string;
  orderItems: OrderItem[];
  totalAmount: number; // in Rappen
  orderDate: string;
  hasShipping: boolean;
  shippingAddress?: {
    name: string;
    line1: string;
    city: string;
    postal_code: string;
    country: string;
  };
}

export function OrderConfirmationEmail({
  customerEmail,
  orderId,
  orderItems,
  totalAmount,
  orderDate,
  hasShipping,
  shippingAddress,
}: OrderConfirmationEmailProps) {
  const formattedTotal = new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
  }).format(totalAmount / 100);

  const formattedOrderDate = new Intl.DateTimeFormat('de-CH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(orderDate));

  const shortOrderId = orderId.slice(-8);

  return (
    <Html>
      <Head />
      <Preview>Bestellbestätigung - {formattedTotal}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Bestellung erfolgreich!</Heading>
          
          <Text style={text}>
            Vielen Dank für Ihre Bestellung. Wir haben Ihre Zahlung erhalten und bereiten Ihre Bestellung vor.
          </Text>

          <Section style={orderSection}>
            <Heading style={h2}>Bestelldetails</Heading>
            
            <Section style={detailRow}>
              <Text style={label}>Bestellnummer:</Text>
              <Text style={value}>#{shortOrderId}</Text>
            </Section>
            
            <Section style={detailRow}>
              <Text style={label}>Bestelldatum:</Text>
              <Text style={value}>{formattedOrderDate}</Text>
            </Section>
            
            <Section style={detailRow}>
              <Text style={label}>E-Mail:</Text>
              <Text style={value}>{customerEmail}</Text>
            </Section>
            
            <Section style={detailRow}>
              <Text style={label}>Gesamtbetrag:</Text>
              <Text style={value}>{formattedTotal}</Text>
            </Section>
          </Section>

          {/* Order Items */}
          <Section style={itemsSection}>
            <Heading style={h2}>Bestellte Artikel</Heading>
            {orderItems.map((item, index) => {
              const itemPrice = new Intl.NumberFormat('de-CH', {
                style: 'currency',
                currency: 'CHF',
              }).format(item.unit_price / 100);

              const itemTotal = new Intl.NumberFormat('de-CH', {
                style: 'currency',
                currency: 'CHF',
              }).format(item.total_price / 100);

              return (
                <Section key={index} style={itemRow}>
                  <Section style={itemDetails}>
                    <Text style={itemName}>{item.product_name}</Text>
                    <Text style={itemMeta}>
                      {item.quantity}x {itemPrice}
                    </Text>
                  </Section>
                  <Text style={itemPrice}>{itemTotal}</Text>
                </Section>
              );
            })}
          </Section>

          {/* Shipping Address */}
          {hasShipping && shippingAddress && (
            <Section style={shippingSection}>
              <Heading style={h2}>Versandadresse</Heading>
              <Text style={addressText}>
                {shippingAddress.name}<br />
                {shippingAddress.line1}<br />
                {shippingAddress.postal_code} {shippingAddress.city}<br />
                {shippingAddress.country}
              </Text>
            </Section>
          )}

          <Hr style={hr} />

          <Text style={text}>
            {hasShipping 
              ? "Ihre Bestellung wird in den nächsten 1-3 Werktagen versendet. Sie erhalten eine Benachrichtigung, sobald Ihre Bestellung unterwegs ist."
              : "Ihre digitalen Produkte stehen Ihnen sofort zur Verfügung."
            }
          </Text>

          <Section style={buttonSection}>
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/shop`} style={button}>
              Weiter einkaufen
            </Link>
          </Section>

          <Hr style={hr} />

          <Text style={footerText}>
            Bei Fragen zu Ihrer Bestellung können Sie sich jederzeit an unseren Support wenden.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles (Swiss-optimized)
const main = { backgroundColor: '#f6f9fc', fontFamily: 'system-ui, sans-serif' };

const container = { 
  backgroundColor: '#ffffff', 
  margin: '0 auto', 
  padding: '20px',
  maxWidth: '600px',
};

const h1 = { 
  color: '#333', 
  fontSize: '24px',
  marginBottom: '20px',
  textAlign: 'center' as const,
};

const h2 = { 
  color: '#333', 
  fontSize: '18px',
  marginBottom: '16px',
  marginTop: '0',
};

const text = { 
  color: '#555', 
  fontSize: '16px', 
  lineHeight: '24px',
  marginBottom: '16px',
};

const orderSection = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '20px',
};

const detailRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
};

const label = {
  color: '#666',
  fontSize: '14px',
  margin: '0',
  fontWeight: '500',
};

const value = {
  color: '#333',
  fontSize: '14px',
  margin: '0',
  fontWeight: '600',
};

const itemsSection = {
  marginBottom: '20px',
};

const itemRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 0',
  borderBottom: '1px solid #eee',
};

const itemDetails = {
  flex: '1',
};

const itemName = {
  color: '#333',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 4px 0',
};

const itemMeta = {
  color: '#666',
  fontSize: '12px',
  margin: '0',
};

const itemPrice = {
  color: '#333',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
};

const shippingSection = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '20px',
};

const addressText = {
  color: '#555',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
};

const hr = {
  borderColor: '#e6e6e6',
  margin: '20px 0',
};

const buttonSection = {
  textAlign: 'center' as const,
  marginBottom: '20px',
};

const button = {
  backgroundColor: '#5469d4',
  color: '#fff',
  padding: '12px 20px',
  textDecoration: 'none',
  borderRadius: '5px',
  display: 'inline-block',
};

const footerText = {
  color: '#888',
  fontSize: '14px',
  lineHeight: '20px',
  textAlign: 'center' as const,
};