'use server';

import { createServerComponentClient } from '@/lib/supabase';
import { Gazette } from '@/lib/dbSchema';

export interface GazetteStats {
  total: number;
  highRisk: number;
  expiringSoon: number;
  relevant: number;
}

export interface GazetteFilters {
  search?: string;
  category?: string;
  jurisdiction?: string;
  limit?: number;
  offset?: number;
}

export async function getGazettes(filters: GazetteFilters = {}): Promise<{
  data: Gazette[];
  error: string | null;
  count: number;
}> {
  try {
    const supabase = createServerComponentClient();
    
    if (!supabase) {
      return {
        data: [],
        error: 'Database connection not available',
        count: 0
      };
    }

    let query = supabase
      .from('gazettes')
      .select('*', { count: 'exact' });

    // Apply search filter
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,jurisdiction.ilike.%${filters.search}%,category.ilike.%${filters.search}%`);
    }

    // Apply category filter
    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    // Apply jurisdiction filter
    if (filters.jurisdiction) {
      query = query.eq('jurisdiction', filters.jurisdiction);
    }

    // Apply pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    // Order by date (most recent first)
    query = query.order('date', { ascending: false, nullsLast: true });

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching gazettes:', error);
      return {
        data: [],
        error: error.message,
        count: 0
      };
    }

    return {
      data: data || [],
      error: null,
      count: count || 0
    };
  } catch (error) {
    console.error('Unexpected error fetching gazettes:', error);
    return {
      data: [],
      error: 'An unexpected error occurred',
      count: 0
    };
  }
}

export async function getGazetteStats(): Promise<{
  data: GazetteStats | null;
  error: string | null;
}> {
  try {
    const supabase = createServerComponentClient();
    
    if (!supabase) {
      return {
        data: null,
        error: 'Database connection not available'
      };
    }

    // Get total count
    const { count: total, error: totalError } = await supabase
      .from('gazettes')
      .select('*', { count: 'exact', head: true });

    if (totalError) {
      throw totalError;
    }

    // For now, we'll calculate basic stats
    // In a real implementation, you might want to add columns for risk_rating, is_relevant, etc.
    // or calculate these based on your business logic
    
    const stats: GazetteStats = {
      total: total || 0,
      highRisk: 0, // Would need additional logic to determine high risk
      expiringSoon: 0, // Would need to check next_sit dates
      relevant: 0 // Would need additional logic to determine relevance
    };

    return {
      data: stats,
      error: null
    };
  } catch (error) {
    console.error('Error fetching gazette stats:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

export async function getGazetteById(id: number): Promise<{
  data: Gazette | null;
  error: string | null;
}> {
  try {
    const supabase = createServerComponentClient();
    
    if (!supabase) {
      return {
        data: null,
        error: 'Database connection not available'
      };
    }

    const { data, error } = await supabase
      .from('gazettes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching gazette:', error);
      return {
        data: null,
        error: error.message
      };
    }

    return {
      data,
      error: null
    };
  } catch (error) {
    console.error('Unexpected error fetching gazette:', error);
    return {
      data: null,
      error: 'An unexpected error occurred'
    };
  }
}