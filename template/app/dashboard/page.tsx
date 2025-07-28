/**
 * Dashboard Overview Page - Server Component
 * Optimized with server-side auth and data fetching
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CalendarDays, Mail, User, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { requireAuth, getUserSubscription } from '@/lib/auth/server';
import { getPlan } from '@/lib/plans';

export default async function DashboardPage() {
  // Server-side authentication and data fetching - no loading states needed
  const user = await requireAuth(); // Handles redirect if not authenticated
  const userSubscription = await getUserSubscription(user.id);

  const initials = user.email
    ? user.email.substring(0, 2).toUpperCase()
    : 'U';

  // Use centralized plan configuration
  const currentPlan = getPlan(userSubscription.type);

  return (
    <>
      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">
                Welcome back, {user.user_metadata?.full_name || user.email}!
              </p>
              <p className="text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">User ID: {user.id}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Email: {user.email_confirmed_at ? 'Confirmed' : 'Pending'}
              </span>
              <Badge variant={user.email_confirmed_at ? 'default' : 'secondary'}>
                {user.email_confirmed_at ? 'Verified' : 'Unverified'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Joined: {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              Account is in good standing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription</CardTitle>
            <Badge variant={currentPlan.badgeVariant}>{currentPlan.name}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentPlan.name}</div>
            <p className="text-xs text-muted-foreground mb-3">
              {userSubscription.type === 'free' 
                ? 'Upgrade to unlock more features' 
                : userSubscription.subscription?.status === 'active' 
                  ? 'Active subscription' 
                  : 'Subscription inactive'
              }
            </p>
            <Button asChild size="sm" className="w-full">
              <Link href="/dashboard/subscription">
                <CreditCard className="mr-2 h-4 w-4" />
                Manage Subscription
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Login</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Today</div>
            <p className="text-xs text-muted-foreground">
              Last activity just now
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security</CardTitle>
            <Badge variant="default">Secure</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Protected</div>
            <p className="text-xs text-muted-foreground">
              All security features enabled
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest account activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Account created</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(user.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            
            {user.email_confirmed_at && (
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                  <Mail className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Email verified</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user.email_confirmed_at).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}