/**
 * 🚪 DASHBOARD LOGOUT BUTTON
 * Client component for secure logout from dashboard
 * 
 * Features:
 * - Server Action integration
 * - Loading state with spinner
 * - Error handling
 * - Responsive design
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2 } from 'lucide-react';
import { signOutAction } from '@/lib/auth/actions';
import { cn } from '@/lib/utils';

// =====================================================================================
// TYPES
// =====================================================================================

interface LogoutButtonProps {
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

// =====================================================================================
// MAIN COMPONENT
// =====================================================================================

export function LogoutButton({ 
  className, 
  variant = 'outline', 
  size = 'sm' 
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOutAction();
      // signOutAction will redirect to '/' automatically
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoading}
      className={cn(
        'transition-all duration-200',
        variant === 'outline' && 'hover:bg-destructive hover:text-destructive-foreground hover:border-destructive',
        className
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Logging out...
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </>
      )}
    </Button>
  );
}

export default LogoutButton;