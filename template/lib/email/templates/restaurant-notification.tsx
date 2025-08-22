/**
 * 🔔 Restaurant Notification Email Template
 * Sent to restaurant team when new KG-Verkauf order is received
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
  Row,
  Column,
} from '@react-email/components';
import type { KgOrderData } from '@/components/restaurant/kg-verkauf/types';
import { formatPrice } from '@/lib/config';

interface RestaurantNotificationEmailProps {
  orderData: KgOrderData;
  orderNumber?: string;
  orderSource?: 'hero' | 'kg-verkauf-section';
}

export function RestaurantNotificationEmail({ 
  orderData, 
  orderNumber = `BG-${Date.now()}`,
  orderSource = 'kg-verkauf-section'
}: RestaurantNotificationEmailProps) {
  const pickupDate = new Date(orderData.pickupDate).toLocaleDateString('de-CH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const orderTime = new Date().toLocaleString('de-CH', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const sourceLabel = orderSource === 'hero' ? 'Hero-Sektion' : 'KG-Verkauf Sektion';

  return (
    <Html>
      <Head />
      <Preview>🔔 Neue Burgergrill Bestellung - {orderNumber} - {orderData.customerName}</Preview>
      <Body style={main}>
        <Container style={container}>
          
          {/* Alert Header */}
          <Section style={alertSection}>
            <Heading style={alertHeading}>🔔 NEUE BESTELLUNG</Heading>
            <Text style={alertText}>
              Bestellnummer: <strong>{orderNumber}</strong><br/>
              Eingang: {orderTime}<br/>
              Quelle: {sourceLabel}
            </Text>
          </Section>

          {/* Customer Information */}
          <Section style={section}>
            <Heading style={h2}>👤 Kundendaten</Heading>
            <Text style={customerInfo}>
              <strong>Name:</strong> {orderData.customerName}<br/>
              <strong>E-Mail:</strong> {orderData.customerEmail}<br/>
              <strong>Telefon:</strong> {orderData.customerPhone}
            </Text>
          </Section>

          {/* Order Details */}
          <Section style={section}>
            <Heading style={h2}>📋 Bestelldetails</Heading>
            
            {orderData.products.map((item, index) => (
              <Row key={index} style={productRow}>
                <Column style={productName}>
                  <Text style={productText}>
                    <strong>{item.product.name}</strong>
                  </Text>
                  <Text style={productDescription}>
                    {item.product.description}
                  </Text>
                  <Text style={preparationTime}>
                    Vorbereitungszeit: {item.product.preparationTime}
                  </Text>
                </Column>
                <Column style={productQuantity}>
                  <Text style={quantityText}>
                    <strong>{item.quantity} {item.product.unit}</strong>
                  </Text>
                </Column>
                <Column style={productPrice}>
                  <Text style={priceText}>
                    <strong>{formatPrice(item.quantity * item.product.price)}</strong>
                  </Text>
                </Column>
              </Row>
            ))}
            
            <Row style={totalRow}>
              <Column style={totalLabel}>
                <Text style={totalText}>GESAMTPREIS:</Text>
              </Column>
              <Column style={totalPrice}>
                <Text style={totalText}>{formatPrice(orderData.totalPrice)}</Text>
              </Column>
            </Row>
          </Section>

          {/* Pickup Information */}
          <Section style={section}>
            <Heading style={h2}>📅 Abholung</Heading>
            <Text style={pickupInfo}>
              <strong>Abholdatum:</strong> {pickupDate}<br/>
              <strong>Kundenkontakt:</strong> {orderData.customerPhone}
            </Text>
            
            {orderData.specialRequests && (
              <Section style={specialRequestsSection}>
                <Text style={specialRequestsTitle}>
                  <strong>⚠️ Spezielle Wünsche:</strong>
                </Text>
                <Text style={specialRequestsText}>
                  {orderData.specialRequests}
                </Text>
              </Section>
            )}
          </Section>

          {/* Action Items */}
          <Section style={actionSection}>
            <Heading style={h2}>✅ Nächste Schritte</Heading>
            <Text style={actionText}>
              1. ✅ Bestellung bestätigen und einplanen<br/>
              2. 📞 Kunde bei Fragen kontaktieren: {orderData.customerPhone}<br/>
              3. 🥩 Produkte vorbereiten bis: {pickupDate}<br/>
              4. 📋 Bestellung für Abholung bereitstellen
            </Text>
          </Section>

          {/* Footer */}
          <Text style={footerText}>
            Diese E-Mail wurde automatisch vom Burgergrill Website-System generiert.<br/>
            Bestellzeit: {orderTime}
          </Text>
          
          <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`} style={button}>
            Zum Dashboard
          </Link>
        </Container>
      </Body>
    </Html>
  );
}

// =====================================================================================
// STYLES - Restaurant-focused with alert styling
// =====================================================================================

const main = { 
  backgroundColor: '#f6f9fc', 
  fontFamily: 'Helvetica, Arial, sans-serif' 
};

const container = { 
  backgroundColor: '#ffffff', 
  margin: '0 auto', 
  padding: '20px',
  maxWidth: '600px'
};

const alertSection = {
  backgroundColor: '#e8f4fd',
  padding: '20px',
  borderRadius: '8px',
  border: '2px solid #0066cc',
  marginBottom: '30px',
  textAlign: 'center' as const
};

const alertHeading = {
  color: '#0066cc',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 15px 0'
};

const alertText = {
  color: '#004499',
  fontSize: '16px',
  lineHeight: '22px',
  margin: '0'
};

const h2 = { 
  color: '#333', 
  fontSize: '20px',
  fontWeight: 'bold',
  marginTop: '0',
  marginBottom: '15px'
};

const section = {
  marginBottom: '30px',
  paddingBottom: '20px',
  borderBottom: '1px solid #eee'
};

const customerInfo = {
  color: '#555',
  fontSize: '16px',
  lineHeight: '24px',
  backgroundColor: '#f8f9fa',
  padding: '15px',
  borderRadius: '5px',
  margin: '0'
};

const productRow = {
  backgroundColor: '#f9f9f9',
  padding: '15px',
  borderRadius: '5px',
  marginBottom: '15px',
  border: '1px solid #e0e0e0'
};

const productName = {
  width: '50%',
  paddingRight: '15px'
};

const productQuantity = {
  width: '25%',
  textAlign: 'center' as const
};

const productPrice = {
  width: '25%',
  textAlign: 'right' as const
};

const productText = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '20px',
  margin: '0 0 5px 0'
};

const productDescription = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '18px',
  margin: '0 0 8px 0'
};

const preparationTime = {
  color: '#cc6600',
  fontSize: '13px',
  fontWeight: 'bold',
  margin: '0'
};

const quantityText = {
  color: '#333',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0'
};

const priceText = {
  color: '#28a745',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0'
};

const totalRow = {
  backgroundColor: '#e8f5e8',
  padding: '20px',
  borderRadius: '8px',
  border: '2px solid #28a745',
  marginTop: '20px'
};

const totalLabel = {
  width: '70%',
  textAlign: 'right' as const,
  paddingRight: '15px'
};

const totalPrice = {
  width: '30%',
  textAlign: 'right' as const
};

const totalText = {
  color: '#28a745',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0'
};

const pickupInfo = {
  color: '#555',
  fontSize: '16px',
  lineHeight: '24px',
  backgroundColor: '#fff3cd',
  padding: '15px',
  borderRadius: '5px',
  border: '1px solid #ffeeba',
  margin: '0'
};

const specialRequestsSection = {
  backgroundColor: '#fff0f0',
  padding: '15px',
  borderRadius: '5px',
  border: '1px solid #ffcccc',
  marginTop: '15px'
};

const specialRequestsTitle = {
  color: '#cc0000',
  fontSize: '16px',
  margin: '0 0 8px 0'
};

const specialRequestsText = {
  color: '#666',
  fontSize: '15px',
  lineHeight: '22px',
  margin: '0',
  fontStyle: 'italic'
};

const actionSection = {
  backgroundColor: '#f0f8f0',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #cceecc'
};

const actionText = {
  color: '#555',
  fontSize: '16px',
  lineHeight: '28px',
  margin: '0'
};

const footerText = {
  color: '#999',
  fontSize: '12px',
  lineHeight: '18px',
  marginTop: '40px',
  marginBottom: '20px',
  textAlign: 'center' as const,
  borderTop: '1px solid #eee',
  paddingTop: '20px'
};

const button = {
  backgroundColor: '#5469d4',
  color: '#fff',
  padding: '12px 20px',
  textDecoration: 'none',
  borderRadius: '5px',
  display: 'inline-block',
  fontWeight: 'bold'
};