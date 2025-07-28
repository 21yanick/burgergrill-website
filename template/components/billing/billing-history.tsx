'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, CreditCard, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BillingHistoryItem {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  plan: string;
  invoiceUrl: string;
}

interface BillingHistoryProps {
  initialData?: BillingHistoryItem[];
}

export function BillingHistory({ initialData = [] }: BillingHistoryProps) {
  // Use server-provided initial data (fallback to empty array)
  const billingHistory = initialData

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Billing History
        </CardTitle>
        <CardDescription>
          Your past invoices and payment history
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {billingHistory.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No billing history</h3>
            <p className="text-muted-foreground">
              Your invoices will appear here after your first payment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {billingHistory.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{invoice.plan} Plan</span>
                      <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                        {invoice.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {new Date(invoice.date).toLocaleDateString()}
                      </div>
                      <span>
                        {invoice.currency} {invoice.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}