import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components';

interface WelcomeEmailProps {
  userFirstname: string;
}

export function WelcomeEmail({ userFirstname }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Willkommen bei Burgergrill!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Willkommen bei Burgergrill, {userFirstname}!</Heading>
          <Text style={text}>
            Danke für Ihre Registrierung. Wir freuen uns, Sie bei unserem Burgergrill begrüssen zu dürfen!
          </Text>
          <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`} style={button}>
            Zu Ihrem Konto
          </Link>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = { backgroundColor: '#f6f9fc', fontFamily: 'sans-serif' };
const container = { backgroundColor: '#ffffff', margin: '0 auto', padding: '20px' };
const h1 = { color: '#333', fontSize: '24px' };
const text = { color: '#555', fontSize: '16px', lineHeight: '24px' };
const button = {
  backgroundColor: '#5469d4',
  color: '#fff',
  padding: '12px 20px',
  textDecoration: 'none',
  borderRadius: '5px',
  display: 'inline-block',
};