/**
 * 🟩 SHOP-ONLY: Order Status Update Email Template
 * Sent when order status changes (processing, shipped, completed)
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

export interface OrderStatusEmailProps {
  customerEmail: string;
  orderId: string;
  oldStatus: string;
  newStatus: string;
  totalAmount: number; // in Rappen
  orderDate: string;
  trackingNumber?: string;
  hasShipping: boolean;
}

export function OrderStatusEmail({
  customerEmail,
  orderId,
  oldStatus,
  newStatus,
  totalAmount,
  orderDate,
  trackingNumber,
  hasShipping,
}: OrderStatusEmailProps) {
  const formattedTotal = new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
  }).format(totalAmount / 100);

  const formattedOrderDate = new Intl.DateTimeFormat('de-CH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(orderDate));

  const shortOrderId = orderId.slice(-8);

  // Status translations
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'pending': return 'Ausstehend';
      case 'processing': return 'In Bearbeitung';
      case 'shipped': return 'Versendet';
      case 'completed': return 'Abgeschlossen';
      default: return status;
    }
  };

  // Status-specific content
  const getStatusMessage = (status: string): string => {
    switch (status) {
      case 'processing':
        return hasShipping 
          ? "Ihre Bestellung wird bearbeitet und für den Versand vorbereitet."
          : "Ihre Bestellung wird bearbeitet.";
      case 'shipped':
        return trackingNumber
          ? `Ihre Bestellung wurde versendet. Die Sendungsnummer lautet: ${trackingNumber}`
          : "Ihre Bestellung wurde versendet und ist unterwegs zu Ihnen.";
      case 'completed':
        return hasShipping
          ? "Ihre Bestellung wurde erfolgreich zugestellt. Vielen Dank für Ihren Einkauf!"
          : "Ihre Bestellung ist abgeschlossen. Vielen Dank für Ihren Einkauf!";
      default:
        return "Der Status Ihrer Bestellung hat sich geändert.";
    }
  };

  const statusLabel = getStatusLabel(newStatus);
  const statusMessage = getStatusMessage(newStatus);

  return (
    <Html>
      <Head />
      <Preview>Bestellung #{shortOrderId} - {statusLabel}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Bestellstatus aktualisiert</Heading>
          
          <Text style={text}>
            {statusMessage}
          </Text>

          <Section style={orderSection}>
            <Heading style={h2}>Bestelldetails</Heading>
            
            <Section style={detailRow}>
              <Text style={label}>Bestellnummer:</Text>
              <Text style={value}>#{shortOrderId}</Text>
            </Section>
            
            <Section style={detailRow}>
              <Text style={label}>Status:</Text>
              <Text style={statusValue}>{statusLabel}</Text>
            </Section>
            
            <Section style={detailRow}>
              <Text style={label}>Bestelldatum:</Text>
              <Text style={value}>{formattedOrderDate}</Text>
            </Section>
            
            <Section style={detailRow}>
              <Text style={label}>Gesamtbetrag:</Text>
              <Text style={value}>{formattedTotal}</Text>
            </Section>

            {trackingNumber && (
              <Section style={detailRow}>
                <Text style={label}>Sendungsnummer:</Text>
                <Text style={value}>{trackingNumber}</Text>
              </Section>
            )}
          </Section>

          {/* Status-specific content */}
          {newStatus === 'shipped' && hasShipping && (
            <Section style={infoSection}>
              <Text style={text}>
                <strong>Versandinformationen:</strong><br />
                Ihre Bestellung ist unterwegs und sollte in den nächsten 1-3 Werktagen bei Ihnen ankommen.
                {trackingNumber && " Sie können den Versandstatus mit der oben angegebenen Sendungsnummer verfolgen."}
              </Text>
            </Section>
          )}

          {newStatus === 'completed' && (
            <Section style={infoSection}>
              <Text style={text}>
                <strong>Vielen Dank für Ihren Einkauf!</strong><br />
                {hasShipping 
                  ? "Wir hoffen, dass Sie mit Ihrer Bestellung zufrieden sind."
                  : "Ihre digitalen Produkte stehen Ihnen weiterhin zur Verfügung."
                }
              </Text>
            </Section>
          )}

          <Hr style={hr} />

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

const statusValue = {
  color: '#059669', // Green for status
  fontSize: '14px',
  margin: '0',
  fontWeight: '600',
};

const infoSection = {
  backgroundColor: '#eff6ff',
  padding: '16px',
  borderRadius: '8px',
  marginBottom: '20px',
  borderLeft: '4px solid #3b82f6',
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