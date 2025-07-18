'use server';

import { createServerComponentClient } from '@/lib/supabase';
import { Tabled } from '@/lib/dbSchema';

export interface GetTabledItemsParams {
  search?: string;
  types?: string[];
  limit?: number;
  offset?: number;
}

export async function getTabledItems(params: GetTabledItemsParams = {}) {
  try {
    const supabase = createServerComponentClient();
    const { search, types, limit = 50, offset = 0 } = params;

    let query = supabase
      .from('tabled')
      .select('*')
      .order('date', { ascending: false });

    // Apply search filter
    if (search && search.trim()) {
      query = query.or(`name.ilike.%${search}%,type.ilike.%${search}%,paper_no.ilike.%${search}%`);
    }

    // Apply type filter
    if (types && types.length > 0) {
      query = query.in('type', types);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching tabled items:', error);
      return { data: [], error: error.message };
    }

    return { data: data as Tabled[], error: null };
  } catch (error) {
    console.error('Error in getTabledItems:', error);
    return { data: [], error: 'Failed to fetch tabled items' };
  }
}

export async function updateTabledItemFlag(id: number, is_flagged: boolean) {
  try {
    const supabase = createServerComponentClient();
    
    const { data, error } = await supabase
      .from('tabled')
      .update({ is_flagged })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating tabled item flag:', error);
      return { data: null, error: error.message };
    }

    return { data: data as Tabled, error: null };
  } catch (error) {
    console.error('Error in updateTabledItemFlag:', error);
    return { data: null, error: 'Failed to update flag status' };
  }
}

export async function updateTabledItemReview(id: number, is_reviewed: boolean) {
  try {
    const supabase = createServerComponentClient();
    
    const { data, error } = await supabase
      .from('tabled')
      .update({ is_reviewed })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating tabled item review:', error);
      return { data: null, error: error.message };
    }

    return { data: data as Tabled, error: null };
  } catch (error) {
    console.error('Error in updateTabledItemReview:', error);
    return { data: null, error: 'Failed to update review status' };
  }
}

export async function getTabledItemTypes() {
  try {
    const supabase = createServerComponentClient();
    
    const { data, error } = await supabase
      .from('tabled')
      .select('type')
      .not('type', 'is', null);

    if (error) {
      console.error('Error fetching tabled item types:', error);
      return { data: [], error: error.message };
    }

    // Get unique types
    const uniqueTypes = [...new Set(data.map((item: any) => item.type))].filter(Boolean);
    
    return { data: uniqueTypes, error: null };
  } catch (error) {
    console.error('Error in getTabledItemTypes:', error);
    return { data: [], error: 'Failed to fetch types' };
  }
}