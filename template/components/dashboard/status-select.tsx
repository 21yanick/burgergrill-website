/**
 * 🟩 SHOP-ONLY: Order Status Select Component
 * KISS Implementation with optimistic UI and server actions
 */

'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Loader2, ChevronDown } from 'lucide-react'
import { updateOrderStatus } from '@/lib/dashboard/actions'

interface StatusSelectProps {
  orderId: string
  currentStatus: string
}

// Status options with German labels
const STATUS_OPTIONS = [
  { value: 'pending', label: 'Ausstehend', color: 'outline' as const },
  { value: 'processing', label: 'In Bearbeitung', color: 'secondary' as const },
  { value: 'shipped', label: 'Versendet', color: 'default' as const },
  { value: 'completed', label: 'Abgeschlossen', color: 'secondary' as const },
]

export function StatusSelect({ orderId, currentStatus }: StatusSelectProps) {
  const [status, setStatus] = useState(currentStatus)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleStatusChange = (newStatus: string) => {
    // Optimistic UI update
    setStatus(newStatus)
    setError(null)
    
    startTransition(async () => {
      try {
        const result = await updateOrderStatus(orderId, newStatus)
        
        if (result.error) {
          // Rollback optimistic update
          setStatus(currentStatus)
          setError(result.error)
        }
      } catch (err) {
        // Rollback optimistic update
        setStatus(currentStatus)
        setError('Fehler beim Aktualisieren des Status')
        console.error('Status update error:', err)
      }
    })
  }

  const currentOption = STATUS_OPTIONS.find(option => option.value === status)

  return (
    <div className="space-y-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between" disabled={isPending}>
            <div className="flex items-center space-x-2">
              {isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                currentOption && (
                  <Badge variant={currentOption.color} className="text-xs">
                    {currentOption.label}
                  </Badge>
                )
              )}
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full">
          {STATUS_OPTIONS.map((option) => (
            <DropdownMenuItem 
              key={option.value} 
              onClick={() => handleStatusChange(option.value)}
              disabled={option.value === status}
            >
              <Badge variant={option.color} className="text-xs">
                {option.label}
              </Badge>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}