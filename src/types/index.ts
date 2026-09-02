export type ContentType = 'movie' | 'series' | 'iptv' | 'radio';

export interface Episode {
  id: string;
  episodeNumber: number;
  seasonNumber: number;
  title: string;
  duration: string;
  durationSeconds: number;
  synopsis: string;
  thumbnailUrl: string;
  videoUrl: string;
  releaseDate: string;
}

export interface Season {
  seasonNumber: number;
  title: string;
  episodes: Episode[];
}

export interface AudioTrack {
  id: string;
  language: string;
  label: string;
  codec: string;
}

export interface SubtitleTrack {
  id: string;
  language: string;
  label: string;
  src?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  originalTitle?: string;
  type: 'movie' | 'series';
  genre: string[];
  year: number;
  rating: string; // e.g. "PG-13", "TV-MA", "18+"
  score: number; // 0 - 10
  matchPercentage: number;
  duration?: string; // for movies e.g. "2h 18m"
  durationSeconds?: number;
  seasonsCount?: number; // for series
  seasons?: Season[];
  synopsis: string;
  director?: string;
  cast: string[];
  posterUrl: string;
  backdropUrl: string;
  videoUrl: string;
  trailerUrl?: string;
  audioTracks: AudioTrack[];
  subtitleTracks: SubtitleTrack[];
  isAdult: boolean;
  isExclusive: boolean;
  isTrending: boolean;
  isNewRelease: boolean;
  tags: string[];
  quality: '4K UHD' | '1080p' | '720p' | '8K HDR';
  viewsCount: number;
  sequelContentId?: string; // ID of sequel/related movie
  prequelContentId?: string; // ID of prequel
  sagaName?: string; // Saga / Universe name (e.g. "Dune Saga", "Marvel")
  streamFormat?: 'auto' | 'mp4' | 'hls' | 'dash' | 'youtube' | 'webm' | 'm3u8';
}

export interface EPGProgram {
  id: string;
  title: string;
  category: string;
  startTime: string; // "14:00"
  endTime: string; // "16:30"
  description: string;
  progressPercentage: number;
  isLive: boolean;
}

export interface IPTVChannel {
  id: string;
  channelNumber: number;
  name: string;
  category: 'Deportes' | 'Noticias' | 'Cine & Series' | 'Entretenimiento' | 'Documentales' | 'Música' | 'Infantil' | 'Adultos +18';
  logoUrl: string;
  streamUrl: string;
  backupStreamUrl?: string;
  quality: '4K 60fps' | '1080p 60fps' | '720p';
  currentProgram: EPGProgram;
  upcomingPrograms: EPGProgram[];
  liveViewers: number;
  bitrateKbps: number;
  lowLatencyMs: number;
  isAdult: boolean;
  isPremium: boolean;
  country: string;
  audioLanguage: string;
}

export interface RadioStation {
  id: string;
  name: string;
  genre: string;
  frequency?: string;
  country: string;
  logoUrl: string;
  streamUrl: string;
  currentTrack: {
    title: string;
    artist: string;
    albumArt: string;
    duration?: string;
  };
  listeners: number;
  bitrate: string;
  isLive: boolean;
  description: string;
}

export interface WatchHistoryItem {
  contentId: string;
  contentType: 'movie' | 'series' | 'iptv' | 'radio';
  title: string;
  posterUrl: string;
  backdropUrl: string;
  seasonNumber?: number;
  episodeNumber?: number;
  episodeTitle?: string;
  progressSeconds: number;
  totalDurationSeconds: number;
  lastWatchedAt: string; // ISO String
  completed: boolean;
}

export interface CustomPlaylist {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  itemIds: string[];
  createdAt: string;
  authorName: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  isKids: boolean;
  isAdultUnlocked: boolean;
  parentalPin?: string;
  watchlist: string[]; // content IDs
  favorites: string[]; // content IDs
  history: WatchHistoryItem[];
  customPlaylists: CustomPlaylist[];
  preferences: {
    preferredLanguage: string;
    preferredSubtitles: string;
    autoPlayNext: boolean;
    lowLatencyStreaming: boolean;
    discreteAdultMode: boolean;
  };
}

export interface DeviceInfo {
  id: string;
  name: string;
  type: 'web' | 'android' | 'ios' | 'tv' | 'tablet';
  lastActive: string;
  isCurrent: boolean;
  ipLocation: string;
  currentStreamingItemTitle?: string;
}

export interface UserAccount {
  firebaseUid?: string;
  email: string;
  fullName: string;
  displayName?: string;
  isAuthenticated: boolean;
  avatarUrl: string;
  authProvider: 'google' | 'email';
  createdAt: string;
  subscription: {
    planId: 'free' | 'pro' | 'ultra' | 'family';
    planName: string;
    status: 'active' | 'trial' | 'expired';
    expiresAt: string;
    autoRenew: boolean;
    price: string;
    maxScreens: number;
  };
  profiles: UserProfile[];
  activeProfileId: string;
  devices: DeviceInfo[];
  notifications: {
    newReleases: boolean;
    liveEvents: boolean;
    aiRecommendations: boolean;
    communityActivity: boolean;
    pushEnabled: boolean;
  };
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly?: number;
  currency: string;
  badge?: string;
  popular?: boolean;
  isPopular?: boolean;
  features: string[];
  maxDevices?: number;
  maxScreens?: number;
  maxQuality: string;
  audioQuality?: string;
  aiAssistantAccess?: boolean;
  iptvAccess?: string;
  adult18Access?: boolean;
  offlineDownloads?: boolean;
  hasLowLatency?: boolean;
  hasOfflineDownload?: boolean;
  hasAdultZone?: boolean;
  hasFullIPTV?: boolean;
}

export type UserSubscription = UserAccount['subscription'] & {
  paymentMethod?: string;
};

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  type: 'premiere' | 'live' | 'recommendation' | 'system' | 'community';
  timestamp: string;
  read: boolean;
  targetContentId?: string;
  targetContentType?: ContentType;
  bannerUrl?: string;
  actionUrl?: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorBadge?: string;
  contentId?: string;
  contentTitle?: string;
  contentType?: ContentType;
  contentPoster?: string;
  text: string;
  rating?: number; // 1-5
  likes: number;
  userLiked: boolean;
  commentsCount: number;
  comments?: Array<{
    id: string;
    authorName: string;
    authorAvatar: string;
    text: string;
    createdAt: string;
  }>;
  createdAt: string;
  tags: string[];
}

export interface LiveChatMessage {
  id: string;
  user: string;
  avatar: string;
  badge?: 'VIP' | 'MOD' | 'FAN' | 'PREMIUM' | 'AI';
  text: string;
  timestamp: string;
  color?: string;
  reaction?: string;
}

export interface ContentReview {
  id: string;
  contentId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
  likesCount: number;
}

export interface WatchPartyRoom {
  id: string;
  title: string;
  contentId: string;
  hostName: string;
  participantsCount: number;
  currentTimestampSeconds: number;
  isPlaying: boolean;
  isPrivate: boolean;
  passcode?: string;
}

export interface AdBanner {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  imageUrl: string;
  targetUrl: string;
  ctaText: string;
  category: 'streaming' | 'tech' | 'gaming' | 'audio' | 'sponsor';
  active: boolean;
  impressionsCount: number;
  clicksCount: number;
  placement: 'all' | 'vod' | 'iptv' | 'radio' | 'adult';
}

export interface CastDevice {
  id: string;
  name: string;
  type: 'chromecast' | 'airplay' | 'tizen' | 'webos' | 'androidtv' | 'dlna';
  location: string;
  ip: string;
  status: 'available' | 'connected' | 'busy';
  icon: string;
}

export interface AppDownloadOption {
  id: string;
  platform: 'android' | 'ios' | 'androidtv' | 'smarttv' | 'windows' | 'macos';
  title: string;
  version: string;
  size: string;
  description: string;
  qrCodeUrl: string;
  downloadUrl: string;
  packageType: 'APK (Arm64/v7a)' | 'IPA / TestFlight' | 'TV APK' | 'Tizen (.wgt)' | 'webOS (.ipk)' | 'EXE / DMG';
  features: string[];
}

export type ViewLayoutMode = 'grid' | 'list';
export type SortOrderOption = 'popular' | 'rating' | 'recent' | 'title';

export type PushNotificationItem = PushNotification;

export type PlatformViewMode = 'web' | 'android' | 'ios' | 'tv' | 'tablet';
export type DeviceType = 'web' | 'android' | 'ios' | 'smart_tv';
export type AppSection = 'home' | 'movies' | 'series' | 'iptv' | 'radio' | 'adult18' | 'community' | 'profile' | 'admin';
