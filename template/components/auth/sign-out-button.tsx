'use client';

import { signOutAction } from '@/lib/auth/actions';
import { LogOut } from 'lucide-react';

export function SignOutButton() {
  return (
    <form action={signOutAction} className="w-full">
      <button
        type="submit"
        className="flex w-full items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign out
      </button>
    </form>
  );
}