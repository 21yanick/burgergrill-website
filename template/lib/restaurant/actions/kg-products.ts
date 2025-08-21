/**
 * 🥩 SINGLE-TENANT KG-PRODUCTS SERVER ACTIONS
 * Clean server-side operations for kg-verkauf product management
 * 
 * Architecture:
 * - PUBLIC functions: No auth needed (marketing website)
 * - ADMIN functions: Auth required (dashboard)
 * - Direct table access: No complex restaurant_id relations
 * - Type-safe database operations with Supabase
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';

// =====================================================================================
// TYPES (DB-Aligned for Single-Tenant)
// =====================================================================================

export type KgProduct = {
  id: string;
  product_id: string;        // 'wuerste-pikant', 'sucuk-mild'
  name: string;              // 'Würste pikant'
  description: string;       // '6er Pack (500g) - Würzige Würste...'
  price: number;             // 9.00, 18.00
  unit: string;              // 'pack', 'kg', 'stk'
  min_order: number;         // 1, 0.5
  max_order: number;         // 20, 8
  available: boolean;        // true/false
  unavailable_reason: string | null; // 'Ausverkauft bis Montag'
  preparation_time: string;  // '24h'
  created_at: string;
  updated_at: string;
};

export type CreateKgProductData = {
  product_id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  min_order: number;
  max_order: number;
  available?: boolean;
  unavailable_reason?: string | null;
  preparation_time?: string;
};

export type UpdateKgProductData = Partial<Omit<CreateKgProductData, 'product_id'>>;

// =====================================================================================
// VALIDATION HELPERS
// =====================================================================================

function validateProductData(data: CreateKgProductData | UpdateKgProductData): { valid: boolean; error?: string } {
  // Price validation
  if ('price' in data && (typeof data.price !== 'number' || data.price <= 0)) {
    return { valid: false, error: 'Price must be a positive number' };
  }
  
  // Order quantity validation
  if ('min_order' in data && 'max_order' in data) {
    if (data.min_order! <= 0) {
      return { valid: false, error: 'Minimum order must be greater than 0' };
    }
    if (data.max_order! < data.min_order!) {
      return { valid: false, error: 'Maximum order must be greater than or equal to minimum order' };
    }
  }
  
  // Unit validation
  if ('unit' in data && data.unit && !['kg', 'pack', 'stk'].includes(data.unit)) {
    return { valid: false, error: 'Unit must be one of: kg, pack, stk' };
  }
  
  return { valid: true };
}

// =====================================================================================
// PUBLIC FUNCTIONS (No Auth Required - Marketing Website)
// =====================================================================================

/**
 * Get all available products for KG-Verkauf - PUBLIC ACCESS
 * Used by marketing website and order forms
 */
export async function getAvailableKgProducts(): Promise<KgProduct[]> {
  const supabase = await createClient();
  
  try {
    const { data: products, error } = await supabase
      .from('kg_products')
      .select('*')
      .eq('available', true)
      .order('product_id');

    if (error) {
      console.error('[Available KG Products] Database error:', error);
      return [];
    }

    return products || [];
  } catch (error) {
    console.error('[Available KG Products] Unexpected error:', error);
    return [];
  }
}

/**
 * Get specific product by product_id - PUBLIC ACCESS
 * Used by marketing website for product details
 */
export async function getKgProduct(productId: string): Promise<KgProduct | null> {
  const supabase = await createClient();
  
  try {
    const { data: product, error } = await supabase
      .from('kg_products')
      .select('*')
      .eq('product_id', productId)
      .single();

    if (error) {
      console.error(`[KG Product ${productId}] Database error:`, error);
      return null;
    }

    return product;
  } catch (error) {
    console.error(`[KG Product ${productId}] Unexpected error:`, error);
    return null;
  }
}

// =====================================================================================
// ADMIN FUNCTIONS (Auth Required - Dashboard Only)
// =====================================================================================

/**
 * Get all products (including unavailable) - ADMIN ONLY
 * Used by dashboard to manage all products
 */
export async function getAllKgProducts(): Promise<KgProduct[]> {
  await requireAuth(); // Auth required for admin access
  const supabase = await createClient();
  
  try {
    const { data: products, error } = await supabase
      .from('kg_products')
      .select('*')
      .order('product_id');

    if (error) {
      console.error('[All KG Products] Database error:', error);
      throw new Error('Failed to fetch products');
    }

    return products || [];
  } catch (error) {
    console.error('[All KG Products] Unexpected error:', error);
    throw error;
  }
}

/**
 * Update product data - ADMIN ONLY
 * Used by dashboard to modify product information
 */
export async function updateKgProduct(id: string, data: UpdateKgProductData): Promise<void> {
  await requireAuth(); // Auth required for modifications
  const supabase = await createClient();
  
  try {
    // Validate input data
    const validation = validateProductData(data);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const { error } = await supabase
      .from('kg_products')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error(`[Update KG Product ${id}] Database error:`, error);
      throw new Error('Failed to update product');
    }

    // Invalidate cache for marketing website
    revalidatePath('/');
    revalidatePath('/dashboard');
  } catch (error) {
    console.error(`[Update KG Product ${id}] Unexpected error:`, error);
    throw error;
  }
}

/**
 * Toggle product availability - ADMIN ONLY
 * Used by dashboard to mark products as available/unavailable
 */
export async function toggleProductAvailability(
  id: string, 
  available: boolean, 
  reason?: string
): Promise<void> {
  await requireAuth(); // Auth required for modifications
  const supabase = await createClient();
  
  try {
    const updateData: UpdateKgProductData = {
      available,
      unavailable_reason: available ? null : (reason || 'Vorübergehend nicht verfügbar'),
    };

    const { error } = await supabase
      .from('kg_products')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error(`[Toggle Product Availability ${id}] Database error:`, error);
      throw new Error('Failed to update product availability');
    }

    // Invalidate cache for marketing website
    revalidatePath('/');
    revalidatePath('/dashboard');
  } catch (error) {
    console.error(`[Toggle Product Availability ${id}] Unexpected error:`, error);
    throw error;
  }
}

/**
 * Create new product - ADMIN ONLY
 * Used by dashboard to add new products (future feature)
 */
export async function createKgProduct(data: CreateKgProductData): Promise<string> {
  await requireAuth(); // Auth required for modifications
  const supabase = await createClient();
  
  try {
    // Validate input data
    const validation = validateProductData(data);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Check if product_id already exists
    const { data: existing } = await supabase
      .from('kg_products')
      .select('id')
      .eq('product_id', data.product_id)
      .single();

    if (existing) {
      throw new Error(`Product with ID '${data.product_id}' already exists`);
    }

    const { data: newProduct, error } = await supabase
      .from('kg_products')
      .insert({
        ...data,
        available: data.available ?? true,
        preparation_time: data.preparation_time ?? '24h',
      })
      .select('id')
      .single();

    if (error) {
      console.error('[Create KG Product] Database error:', error);
      throw new Error('Failed to create product');
    }

    // Invalidate cache for marketing website
    revalidatePath('/');
    revalidatePath('/dashboard');

    return newProduct.id;
  } catch (error) {
    console.error('[Create KG Product] Unexpected error:', error);
    throw error;
  }
}

/**
 * Delete product - ADMIN ONLY
 * Used by dashboard to remove products (future feature)
 */
export async function deleteKgProduct(id: string): Promise<void> {
  await requireAuth(); // Auth required for modifications
  const supabase = await createClient();
  
  try {
    const { error } = await supabase
      .from('kg_products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`[Delete KG Product ${id}] Database error:`, error);
      throw new Error('Failed to delete product');
    }

    // Invalidate cache for marketing website
    revalidatePath('/');
    revalidatePath('/dashboard');
  } catch (error) {
    console.error(`[Delete KG Product ${id}] Unexpected error:`, error);
    throw error;
  }
}