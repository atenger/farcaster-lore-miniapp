import { SearchFilters, SearchResponse, EnrichedCast, EpisodeData } from './types';

// Cache for episode data to avoid repeated API calls
const episodeCache = new Map<string, EpisodeData>();

/**
 * Search casts with filters and pagination
 */
export async function searchCasts(filters: SearchFilters): Promise<SearchResponse> {
  const params = new URLSearchParams();
  
  if (filters.query) params.append('q', filters.query);
  if (filters.date) params.append('date', filters.date);
  if (filters.author) params.append('author', filters.author);
  if (filters.fid) params.append('fid', filters.fid.toString());
  if (filters.episode) params.append('episode', filters.episode);
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.offset) params.append('offset', filters.offset.toString());
  
  const response = await fetch(`/api/casts/search?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Get all casts (for initial load)
 */
export async function getAllCasts(limit: number = 50, offset: number = 0): Promise<SearchResponse> {
  return searchCasts({ limit, offset });
}

/**
 * Get episode data with caching
 */
export async function getEpisodeData(videoId: string): Promise<EpisodeData> {
  // Check cache first
  if (episodeCache.has(videoId)) {
    return episodeCache.get(videoId)!;
  }
  
  const response = await fetch(`/api/episodes/${videoId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to load episode ${videoId}: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Cache the data
  episodeCache.set(videoId, data);
  
  return data;
}

/**
 * Get cast index data
 */
export async function getCastIndex(): Promise<EnrichedCast[]> {
  const response = await fetch('/api/casts/index');
  
  if (!response.ok) {
    throw new Error(`Failed to load cast index: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Clear episode cache (useful for development)
 */
export function clearEpisodeCache(): void {
  episodeCache.clear();
}

/**
 * Get unique episode IDs from a list of casts
 */
export function getUniqueEpisodeIds(casts: EnrichedCast[]): string[] {
  return [...new Set(casts.map(cast => cast.source_episode_id))];
}

/**
 * Validate and clean cast data, removing duplicates and handling edge cases
 */
export function validateAndCleanCasts(casts: EnrichedCast[]): EnrichedCast[] {
  const seen = new Set<string>();
  const cleaned: EnrichedCast[] = [];
  const duplicates: string[] = [];
  
  casts.forEach(cast => {
    // Create a unique identifier for each cast
    const uniqueId = `${cast.cast_hash}-${cast.author_username}-${cast.cast_date || cast.show_date}`;
    
    if (seen.has(uniqueId)) {
      duplicates.push(uniqueId);
      console.warn(`Duplicate cast detected and removed: ${cast.cast_hash} by ${cast.author_username}`);
    } else {
      seen.add(uniqueId);
      
      // Validate required fields
      if (cast.cast_hash && cast.author_username) {
        cleaned.push(cast);
      } else {
        console.warn(`Invalid cast data: missing required fields`, cast);
      }
    }
  });
  
  if (duplicates.length > 0) {
    console.warn(`Removed ${duplicates.length} duplicate casts from the dataset`);
  }
  
  return cleaned;
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format cast date for display
 */
export function formatCastDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
} 