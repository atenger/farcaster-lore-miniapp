import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import castsIndex from '@/data/casts_index.json';
import { EnrichedCast } from '@/lib/types';

interface CastIndexEntry {
  cast_hash: string;
  url: string;
  author_username: string;
  show_date: string;
  show_title: string;
  source_episode_id: string;
  author_fid?: string;
}

interface SearchFilters {
  query?: string;
  date?: string;
  author?: string;
  fid?: number;
  episode?: string;
  limit?: number;
  offset?: number;
}

function filterCasts(casts: CastIndexEntry[], filters: SearchFilters): CastIndexEntry[] {
  return casts.filter(cast => {
    if (filters.query) {
      const searchText = `${cast.author_username} ${cast.show_title}`.toLowerCase();
      if (!searchText.includes(filters.query.toLowerCase())) return false;
    }
    // Update: include all casts on or before the selected date
    if (filters.date && cast.show_date > filters.date) return false;
    // Username search: starts with (prefix match)
    if (filters.author) {
      const uname = cast.author_username.toLowerCase();
      const filterVal = filters.author.toLowerCase();
      const match = uname.startsWith(filterVal);
      if (!match) return false;
    }
    if (filters.episode && cast.source_episode_id !== filters.episode) return false;
    // FID filtering on index data (author_fid is string in index)
    if (filters.fid && (!cast.author_fid || parseInt(cast.author_fid) !== filters.fid)) return false;
    return true;
  });
}

async function enrichCastsWithEpisodeData(casts: CastIndexEntry[]): Promise<EnrichedCast[]> {
  // Get unique episode IDs
  const episodeIds = [...new Set(casts.map(cast => cast.source_episode_id))];
  
  // Load episode data for each unique episode
  const episodeDataMap = new Map();
  
  for (const episodeId of episodeIds) {
    try {
      const filePath = join(process.cwd(), 'src', 'data', 'episodes', `episode_${episodeId}.json`);
      const episodeData: EnrichedCast[] = JSON.parse(readFileSync(filePath, 'utf8'));
      
      // Create a map of cast_hash to enriched data
      episodeData.forEach((enrichedCast) => {
        episodeDataMap.set(enrichedCast.cast_hash, enrichedCast);
      });
    } catch (error) {
      console.warn(`Could not load episode ${episodeId}:`, error);
    }
  }
  
  // Merge index data with enriched data
  return casts.map(cast => {
    const enrichedData = episodeDataMap.get(cast.cast_hash);
    if (enrichedData) {
      // Preserve episode-specific fields from index data (show_date, show_title, source_episode_id)
      // and FID from index data, merge with enriched data
      // This ensures correct show_date when the same cast appears in multiple episodes
      return { 
        ...enrichedData, 
        show_date: cast.show_date,
        show_title: cast.show_title,
        source_episode_id: cast.source_episode_id,
        author_fid: cast.author_fid 
      };
    }
    // Fallback to index data if enrichment fails
    return cast;
  });
}

// Function to filter enriched casts (after episode data is loaded)
function filterEnrichedCasts(casts: EnrichedCast[], filters: SearchFilters): EnrichedCast[] {
  return casts.filter(cast => {
    // FID filtering can only be done on enriched data
    if (filters.fid && cast.author_fid != filters.fid) return false;
    // Username search: starts with (prefix match)
    if (filters.author) {
      const uname = cast.author_username.toLowerCase();
      const filterVal = filters.author.toLowerCase();
      const match = uname.startsWith(filterVal);
      if (!match) return false;
    }
    // Update: include all casts on or before the selected date
    if (filters.date) {
      const castDate = cast.cast_date || cast.show_date;
      if (castDate > filters.date) return false;
    }
    return true;
  });
}

// Function to detect and log duplicates in the data
function detectDuplicates(casts: CastIndexEntry[]): void {
  const seen = new Set<string>();
  const duplicates: string[] = [];
  
  casts.forEach(cast => {
    const key = `${cast.cast_hash}-${cast.source_episode_id}-${cast.author_username}`;
    if (seen.has(key)) {
      duplicates.push(key);
    } else {
      seen.add(key);
    }
  });
  
  if (duplicates.length > 0) {
    console.warn(`Found ${duplicates.length} duplicate casts in the data:`, duplicates.slice(0, 10));
    if (duplicates.length > 10) {
      console.warn(`... and ${duplicates.length - 10} more duplicates`);
    }
  }
}

export async function GET(request: Request) {
  // Cleaned up: removed debug logs
  const { searchParams } = new URL(request.url);
  try {
    const filters: SearchFilters = {
      query: searchParams.get('q') || undefined,
      date: searchParams.get('date') || undefined,
      author: searchParams.get('author') || undefined,
      fid: searchParams.get('fid') ? parseInt(searchParams.get('fid')!) : undefined,
      episode: searchParams.get('episode') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
    };
    let filteredCasts = filterCasts(castsIndex, filters);
    filteredCasts = filteredCasts.sort((a, b) => b.show_date.localeCompare(a.show_date));
    detectDuplicates(filteredCasts);
    let enrichedCasts = await enrichCastsWithEpisodeData(filteredCasts);
    if (filters.fid || filters.date) {
      enrichedCasts = filterEnrichedCasts(enrichedCasts, filters);
      enrichedCasts = enrichedCasts.sort((a, b) => (b.cast_date || b.show_date).localeCompare(a.cast_date || a.show_date));
    }
    
    // Calculate the correct total before pagination
    const totalCasts = enrichedCasts.length;
    const paginatedCasts = enrichedCasts.slice(filters.offset, filters.offset! + filters.limit!);
    
    return NextResponse.json({
      casts: paginatedCasts,
      total: totalCasts,
      limit: filters.limit,
      offset: filters.offset,
    }, {
      headers: {
        'Cache-Control': 'public, max-age=1800',
        'Content-Type': 'application/json',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 