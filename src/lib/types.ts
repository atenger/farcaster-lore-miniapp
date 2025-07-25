// Type definitions for Farcaster Lore data structures

export interface CastIndexEntry {
  cast_hash: string;
  url: string;
  author_username: string;
  show_date: string;
  show_title: string;
  source_episode_id: string;
}

export interface EnrichedCast extends CastIndexEntry {
  author_fid?: number;
  author_pfp?: string;
  cast_date?: string;
  text?: string;
  embeds?: Embed[];
  enrichment_status?: string;
}

export interface Embed {
  url: string;
  metadata?: {
    content_type?: string;
    content_length?: number | null;
    _status?: string;
    html?: {
      ogUrl?: string;
      favicon?: string;
      ogImage?: Array<{ url: string }>;
      ogTitle?: string;
      ogLocale?: string;
      ogDescription?: string;
    };
    image?: {
      width_px?: number;
      height_px?: number;
    };
  };
}

export interface SearchFilters {
  query?: string;
  date?: string;
  author?: string;
  fid?: number;
  episode?: string;
  limit?: number;
  offset?: number;
}

export interface SearchResponse {
  casts: EnrichedCast[];
  total: number;
  limit: number;
  offset: number;
}

export interface EpisodeData extends Array<EnrichedCast> {}

export interface CastGridProps {
  casts: EnrichedCast[];
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export interface CastCardProps {
  cast: EnrichedCast;
}

export interface FilterButtonsProps {
  onFilterChange: (filter: string) => void;
  activeFilter: string;
  onDatePickerOpen: () => void;
  onUserSearchOpen: () => void;
  selectedDate: string | null;
  selectedUser: { username?: string; fid?: number } | null;
}

export interface AnalysisResult {
  totalCasts: number;
  uniqueHashes: number;
  uniqueAuthors: number;
  uniqueEpisodes: number;
  duplicateHashes: number;
  duplicateAuthorHashes: number;
  duplicateHashDetails: [string, number][];
  duplicateAuthorHashDetails: [string, number][];
} 