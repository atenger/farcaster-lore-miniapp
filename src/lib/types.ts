export interface Cast {
  cast_hash: string;
  url: string;
  author_username: string;
  author_fid: number;
  timestamp: string;
  text: string;
  embeds: string[];
  source_episode_id: string;
}

export interface CastGridProps {
  casts: Cast[];
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export interface CastCardProps {
  cast: Cast;
}

export interface FilterButtonsProps {
  onFilterChange: (filter: string) => void;
  activeFilter: string;
} 