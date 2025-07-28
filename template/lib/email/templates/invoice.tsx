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

interface InvoiceEmailProps {
  userFirstname: string;
  invoiceId: string;
  amount: number;
  currency: string;
  planName: string;
  billingPeriod: string;
  paymentDate: string;
  nextBillingDate?: string;
  invoiceUrl?: string;
}

export function InvoiceEmail({
  userFirstname,
  invoiceId,
  amount,
  currency = 'EUR',
  planName,
  billingPeriod,
  paymentDate,
  nextBillingDate,
  invoiceUrl,
}: InvoiceEmailProps) {
  const formattedAmount = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);

  const formattedPaymentDate = new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(paymentDate));

  const formattedNextBillingDate = nextBillingDate
    ? new Intl.DateTimeFormat('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(nextBillingDate))
    : null;

  return (
    <Html>
      <Head />
      <Preview>Payment confirmation - {formattedAmount}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Payment Confirmed</Heading>
          
          <Text style={text}>
            Hi {userFirstname},
          </Text>
          
          <Text style={text}>
            Thank you for your payment! Your subscription has been successfully processed.
          </Text>

          <Section style={invoiceSection}>
            <Heading style={h2}>Invoice Details</Heading>
            
            <Section style={detailRow}>
              <Text style={label}>Invoice ID:</Text>
              <Text style={value}>{invoiceId}</Text>
            </Section>
            
            <Section style={detailRow}>
              <Text style={label}>Plan:</Text>
              <Text style={value}>{planName} ({billingPeriod})</Text>
            </Section>
            
            <Section style={detailRow}>
              <Text style={label}>Amount:</Text>
              <Text style={value}>{formattedAmount}</Text>
            </Section>
            
            <Section style={detailRow}>
              <Text style={label}>Payment Date:</Text>
              <Text style={value}>{formattedPaymentDate}</Text>
            </Section>
            
            {formattedNextBillingDate && (
              <Section style={detailRow}>
                <Text style={label}>Next Billing Date:</Text>
                <Text style={value}>{formattedNextBillingDate}</Text>
              </Section>
            )}
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            You can manage your subscription and download invoices anytime from your dashboard.
          </Text>

          <Section style={buttonSection}>
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`} style={button}>
              Go to Dashboard
            </Link>
            
            {invoiceUrl && (
              <Link href={invoiceUrl} style={buttonSecondary}>
                Download Invoice
              </Link>
            )}
          </Section>

          <Hr style={hr} />

          <Text style={footerText}>
            If you have any questions about this payment, please contact our support team.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = { backgroundColor: '#f6f9fc', fontFamily: 'sans-serif' };

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

const invoiceSection = {
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
  marginRight: '10px',
  marginBottom: '10px',
};

const buttonSecondary = {
  backgroundColor: '#6c757d',
  color: '#fff',
  padding: '12px 20px',
  textDecoration: 'none',
  borderRadius: '5px',
  display: 'inline-block',
  marginLeft: '10px',
  marginBottom: '10px',
};

const footerText = {
  color: '#888',
  fontSize: '14px',
  lineHeight: '20px',
  textAlign: 'center' as const,
};