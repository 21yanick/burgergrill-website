import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Zap, 
  Users, 
  Database, 
  CreditCard, 
  Mail, 
  Calendar,
  ShoppingCart,
  BarChart3,
  Lock,
  Globe,
  Smartphone
} from 'lucide-react'

export default function FeaturesPage() {

  const coreFeatures = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with encryption, authentication, and compliance standards.',
      features: ['End-to-end encryption', 'SSO integration', 'Audit logs', 'GDPR compliant'],
    },
    {
      icon: Zap,
      title: 'High Performance',
      description: 'Lightning-fast platform built with modern technology and optimized for scale.',
      features: ['Sub-second loading', 'Global CDN', 'Auto-scaling', 'Real-time updates'],
    },
    {
      icon: Database,
      title: 'Reliable Infrastructure',
      description: 'Self-hosted solution with 99.9% uptime and automatic backups.',
      features: ['Automatic backups', 'Disaster recovery', 'Load balancing', 'Monitoring'],
    },
    {
      icon: Globe,
      title: 'Multi-Region Support',
      description: 'Deploy globally with support for multiple currencies and payment methods.',
      features: ['Multi-currency', 'Localization', 'Regional compliance', 'Global payments'],
    },
  ]

  const saasFeatures = [
    {
      icon: Users,
      title: 'User Management',
      description: 'Complete user lifecycle management with roles and permissions.',
      features: ['Role-based access', 'Team management', 'User analytics', 'Onboarding flows'],
    },
    {
      icon: CreditCard,
      title: 'Subscription Billing',
      description: 'Automated recurring billing with flexible pricing models.',
      features: ['Multiple pricing tiers', 'Trial management', 'Dunning management', 'Revenue analytics'],
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Comprehensive analytics to understand your business performance.',
      features: ['Usage analytics', 'Revenue tracking', 'Custom dashboards', 'Export capabilities'],
    },
  ]

  const shopFeatures = [
    {
      icon: ShoppingCart,
      title: 'E-Commerce Engine',
      description: 'Full-featured online store with cart, checkout, and order management.',
      features: ['Product catalog', 'Inventory tracking', 'Order management', 'Shipping integration'],
    },
    {
      icon: CreditCard,
      title: 'Payment Processing',
      description: 'Secure payment processing with multiple payment methods.',
      features: ['Credit cards', 'TWINT', 'PayPal', 'Buy now pay later'],
    },
    {
      icon: BarChart3,
      title: 'Sales Analytics',
      description: 'Track sales performance and customer behavior.',
      features: ['Sales reports', 'Customer insights', 'Product analytics', 'Conversion tracking'],
    },
  ]

  const bookingFeatures = [
    {
      icon: Calendar,
      title: 'Appointment Scheduling',
      description: 'Professional booking system with calendar integration.',
      features: ['Calendar sync', 'Time slots', 'Recurring appointments', 'Availability management'],
    },
    {
      icon: Users,
      title: 'Client Management',
      description: 'Manage your clients and their appointment history.',
      features: ['Client profiles', 'Appointment history', 'Communication tools', 'Preferences tracking'],
    },
    {
      icon: CreditCard,
      title: 'Payment & Deposits',
      description: 'Collect deposits and payments for your services.',
      features: ['Deposit collection', 'Payment processing', 'Refund management', 'Invoice generation'],
    },
  ]

  const additionalFeatures = [
    {
      icon: Mail,
      title: 'Email System',
      description: 'Professional email templates and automated communications.',
      features: ['Transactional emails', 'Custom templates', 'Email tracking', 'Automation workflows'],
    },
    {
      icon: Smartphone,
      title: 'Mobile Responsive',
      description: 'Perfect experience across all devices and screen sizes.',
      features: ['Responsive design', 'Mobile optimization', 'Touch-friendly', 'Offline support'],
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'Complete data sovereignty with self-hosted deployment.',
      features: ['Self-hosted', 'Data ownership', 'Privacy controls', 'GDPR toolkit'],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl lg:text-5xl font-bold mb-6">
          Powerful Features for Every Business
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Everything you need to build, scale, and manage your digital business. 
          Built with modern technology and best practices.
        </p>
      </div>

      {/* Core Features */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Core Platform Features</h2>
          <p className="text-lg text-muted-foreground">
            Essential features available in all configurations
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreFeatures.map((feature, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.features.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-muted-foreground">
                      • {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* SaaS Platform Features */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            SaaS Platform Features
            <Badge className="ml-3">SaaS</Badge>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to run a successful software business
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {saasFeatures.map((feature, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.features.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-muted-foreground">
                      • {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>


      {/* Additional Features */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Additional Features</h2>
          <p className="text-lg text-muted-foreground">
            Enhanced capabilities that come standard with every deployment
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {additionalFeatures.map((feature, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.features.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-muted-foreground">
                      • {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}