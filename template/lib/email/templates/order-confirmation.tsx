/**
 * 📧 Order Confirmation Email Template
 * Sent to customers after successful KG-Verkauf order
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

interface OrderConfirmationEmailProps {
  orderData: KgOrderData;
  orderNumber?: string;
}

export function OrderConfirmationEmail({ 
  orderData, 
  orderNumber = `BG-${Date.now()}` 
}: OrderConfirmationEmailProps) {
  const pickupDate = new Date(orderData.pickupDate).toLocaleDateString('de-CH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Html>
      <Head />
      <Preview>Ihre Burgergrill Bestellung wurde bestätigt - {orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          
          {/* Header */}
          <Heading style={h1}>Bestellung bestätigt!</Heading>
          
          <Text style={text}>
            Liebe/r {orderData.customerName},
          </Text>
          
          <Text style={text}>
            Vielen Dank für Ihre Bestellung bei Burgergrill! Wir haben Ihre Bestellung erhalten 
            und bereiten alles für Sie vor.
          </Text>

          {/* Order Details */}
          <Section style={section}>
            <Heading style={h2}>Bestelldetails</Heading>
            <Text style={orderNumberStyle}>Bestellnummer: {orderNumber}</Text>
            
            {orderData.products.map((item, index) => (
              <Row key={index} style={productRow}>
                <Column style={productName}>
                  <Text style={productText}>
                    {item.product.name}
                  </Text>
                  <Text style={productDescription}>
                    {item.product.description}
                  </Text>
                </Column>
                <Column style={productQuantity}>
                  <Text style={productText}>
                    {item.quantity} {item.product.unit}
                  </Text>
                </Column>
              </Row>
            ))}
          </Section>

          {/* Pickup Information */}
          <Section style={section}>
            <Heading style={h2}>Abholung</Heading>
            <Text style={text}>
              <strong>Abholdatum:</strong> {pickupDate}
            </Text>
            <Text style={text}>
              <strong>Ihre Telefonnummer:</strong> {orderData.customerPhone}
            </Text>
            {orderData.specialRequests && (
              <Text style={text}>
                <strong>Spezielle Wünsche:</strong> {orderData.specialRequests}
              </Text>
            )}
          </Section>

          {/* Contact Information */}
          <Section style={section}>
            <Heading style={h2}>Fragen? Wir sind da!</Heading>
            <Text style={text}>
              Bei Fragen zu Ihrer Bestellung können Sie uns gerne kontaktieren:
            </Text>
            <Text style={text}>
              📞 Telefon: 079 489 77 55<br/>
              📧 E-Mail: info@burgergrill.ch
            </Text>
          </Section>

          {/* Footer */}
          <Text style={footerText}>
            Herzlichen Dank für Ihr Vertrauen!<br/>
            Ihr Burgergrill Team
          </Text>
          
          <Link href={`${process.env.NEXT_PUBLIC_APP_URL}`} style={button}>
            Zur Website
          </Link>
        </Container>
      </Body>
    </Html>
  );
}

// =====================================================================================
// STYLES - Consistent with welcome.tsx
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

const h1 = { 
  color: '#333', 
  fontSize: '28px',
  fontWeight: 'bold',
  marginBottom: '20px'
};

const h2 = { 
  color: '#333', 
  fontSize: '20px',
  fontWeight: 'bold',
  marginTop: '30px',
  marginBottom: '15px'
};

const text = { 
  color: '#555', 
  fontSize: '16px', 
  lineHeight: '24px',
  marginBottom: '15px'
};

const section = {
  marginBottom: '30px',
  paddingBottom: '20px',
  borderBottom: '1px solid #eee'
};

const orderNumberStyle = {
  color: '#666',
  fontSize: '14px',
  fontWeight: 'bold',
  marginBottom: '20px',
  padding: '10px',
  backgroundColor: '#f8f9fa',
  borderRadius: '4px'
};

const productRow = {
  borderBottom: '1px solid #f0f0f0',
  paddingBottom: '10px',
  marginBottom: '10px'
};

const productName = {
  width: '70%',
  paddingRight: '15px'
};

const productQuantity = {
  width: '30%',
  textAlign: 'right' as const
};

const productText = {
  color: '#555',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0'
};

const productDescription = {
  color: '#888',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '2px 0 0 0'
};


const footerText = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '20px',
  marginTop: '40px',
  marginBottom: '20px',
  textAlign: 'center' as const
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