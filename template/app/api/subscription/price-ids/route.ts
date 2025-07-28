import { NextResponse } from 'next/server'
import { env } from '@/lib/env'

export async function GET() {
  try {
    return NextResponse.json({
      starterPriceId: env.STRIPE_STARTER_PRICE_ID,
      proPriceId: env.STRIPE_PRO_PRICE_ID,
    })
  } catch (error) {
    console.error('Error fetching price IDs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}