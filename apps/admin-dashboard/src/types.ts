export type TabType = 'movies' | 'series' | 'iptv' | 'radios';

export interface MediaItem {
  id: string;
  type: TabType;
  title: string;
  synopsis?: string;
  rating?: string;
  year?: string;
  categories: string[];
  poster?: string;
  backdrop?: string;
  logo?: string;
  streamUrl: string;
  duration?: string;
  seasons?: string;
  episodes?: string;
  epgId?: string;
  frequency?: string;
  country?: string;
  isAdult?: boolean;
}