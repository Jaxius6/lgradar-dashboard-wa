import { Gazette } from '@/lib/dbSchema';

// Helper function to determine risk rating based on gazette data
export function calculateRiskRating(gazette: Gazette): 'low' | 'medium' | 'high' {
  // This is a placeholder implementation
  // You would implement your business logic here
  
  // Example logic based on impact or category
  if (gazette.impact && gazette.impact.toLowerCase().includes('significant')) {
    return 'high';
  }
  
  if (gazette.category && ['planning', 'development', 'zoning'].includes(gazette.category.toLowerCase())) {
    return 'medium';
  }
  
  return 'low';
}

// Helper function to determine if a gazette is relevant
export function isGazetteRelevant(gazette: Gazette): boolean {
  // This is a placeholder implementation
  // You would implement your business logic here
  
  // Example logic based on category or keywords
  const relevantCategories = ['planning', 'development', 'zoning', 'building'];
  return gazette.category ? relevantCategories.includes(gazette.category.toLowerCase()) : false;
}

// Helper function to calculate days until next sitting
export function getDaysUntilNextSitting(gazette: Gazette): number | null {
  if (!gazette.next_sit) return null;
  
  const nextSit = new Date(gazette.next_sit);
  const now = new Date();
  const diffTime = nextSit.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : null;
}