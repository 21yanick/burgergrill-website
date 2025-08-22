/**
 * 🔄 DASHBOARD ROOT REDIRECT
 * Clean redirect to first functional dashboard page
 * 
 * KISS Principle: Simple redirect without unnecessary overview page
 * YAGNI Principle: No complex logic, just direct user to working features
 */

import { redirect } from 'next/navigation';

export default function DashboardPage() {
  // Direct redirect to first functional dashboard page
  redirect('/dashboard/opening-hours');
}