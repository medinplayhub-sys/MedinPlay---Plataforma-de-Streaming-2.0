import {
  ContentItem,
  IPTVChannel,
  RadioStation,
  UserAccount,
  UserProfile,
  SubscriptionPlan,
  PushNotification,
  CommunityPost,
  LiveChatMessage,
  ContentReview,
  WatchPartyRoom,
  PlatformViewMode,
  AdBanner,
  CastDevice,
  AppDownloadOption,
} from '../types';

const STORAGE_KEYS = {
  ACCOUNT: 'medinplay_user_account_v3',
  VOD_CATALOG: 'medinplay_vod_catalog_v3',
  IPTV_CHANNELS: 'medinplay_iptv_channels_v3',
  RADIO_STATIONS: 'medinplay_radio_stations_v3',
  NOTIFICATIONS: 'medinplay_notifications_v3',
  COMMUNITY_POSTS: 'medinplay_community_posts_v3',
  PLANS: 'medinplay_subscription_plans_v3',
  SETTINGS: 'medinplay_platform_settings_v3',
  AD_BANNERS: 'medinplay_ad_banners_v3',
  CAST_DEVICES: 'medinplay_cast_devices_v3',
};

export const SEED_AD_BANNERS: AdBanner[] = [
  {
    id: 'ad-1',
    title: 'MedinPlay Ultra VIP 4K',
    subtitle: 'Desbloquea 6 pantallas simultáneas, Dolby Vision & 0 anuncios.',
    badge: 'OFERTA ESPECIAL',
    imageUrl: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=1200&auto=format&fit=crop&q=80',
    targetUrl: '#subscription',
    ctaText: 'Mejorar a VIP 4K',
    category: 'streaming',
    active: true,
    impressionsCount: 2450,
    clicksCount: 312,
    placement: 'all',
  },
  {
    id: 'ad-2',
    title: 'Fibra Óptica Simétrica 1 Gbps',
    subtitle: 'Streaming 4K HDR con 0ms de buffer y baja latencia garantizada.',
    badge: 'PATROCINADOR',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&auto=format&fit=crop&q=80',
    targetUrl: 'https://medinplay.tv/fibra',
    ctaText: 'Ver Cobertura',
    category: 'tech',
    active: true,
    impressionsCount: 1890,
    clicksCount: 174,
    placement: 'all',
  },
  {
    id: 'ad-3',
    title: 'Smart TV OLED 4K 120Hz',
    subtitle: 'Disfruta de la app nativa MedinPlay en pantalla gigante con HDR10+.',
    badge: 'HARDWARE RECOMENDADO',
    imageUrl: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=1200&auto=format&fit=crop&q=80',
    targetUrl: '#download-apps',
    ctaText: 'Descargar App TV',
    category: 'sponsor',
    active: true,
    impressionsCount: 3120,
    clicksCount: 420,
    placement: 'all',
  },
  {
    id: 'ad-4',
    title: 'Auriculares Hi-Fi Wireless Dolby Atmos',
    subtitle: 'Audio espacial inmersivo para cine, series y canales IPTV HD.',
    badge: 'AUDIO DE ÉLITE',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80',
    targetUrl: '#audio-gear',
    ctaText: 'Comprar con 25% OFF',
    category: 'audio',
    active: true,
    impressionsCount: 1420,
    clicksCount: 98,
    placement: 'radio',
  },
];

export const SEED_CAST_DEVICES: CastDevice[] = [
  {
    id: 'cast-1',
    name: 'Smart TV Samsung QLED 65" (Salón)',
    type: 'tizen',
    location: 'Sala de Estar',
    ip: '192.168.1.140',
    status: 'available',
    icon: 'tv',
  },
  {
    id: 'cast-2',
    name: 'Chromecast 4K con Google TV',
    type: 'chromecast',
    location: 'Dormitorio Principal',
    ip: '192.168.1.145',
    status: 'available',
    icon: 'cast',
  },
  {
    id: 'cast-3',
    name: 'Apple TV 4K AirPlay',
    type: 'airplay',
    location: 'Estudio / Oficina',
    ip: '192.168.1.152',
    status: 'available',
    icon: 'airplay',
  },
  {
    id: 'cast-4',
    name: 'LG OLED evo webOS TV',
    type: 'webos',
    location: 'Habitación de Huéspedes',
    ip: '192.168.1.160',
    status: 'available',
    icon: 'tv',
  },
];

export const SEED_APP_DOWNLOADS: AppDownloadOption[] = [
  {
    id: 'dl-android',
    platform: 'android',
    title: 'MedinPlay para Android Mobile & Tablet',
    version: 'v4.8.2',
    size: '38.4 MB',
    description: 'Compatible con teléfonos y tablets Samsung, Xiaomi, Motorola, Google Pixel con Android 8.0 o superior.',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://medinplay.app/download/android.apk',
    downloadUrl: 'https://medinplay.app/download/MedinPlay-v4.8.2.apk',
    packageType: 'APK (Arm64/v7a)',
    features: ['Reproducción Picture-in-Picture (PiP)', 'Descargas Offline 4K', 'Sincronización instantánea de cuenta', 'FLAG_SECURE Anti-grabación'],
  },
  {
    id: 'dl-ios',
    platform: 'ios',
    title: 'MedinPlay para iPhone & iPad (iOS 16+)',
    version: 'v4.8.0',
    size: '42.1 MB',
    description: 'Instalación directa PWA WebAPK o acceso vía TestFlight / App Store para dispositivos Apple.',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://medinplay.app/ios',
    downloadUrl: 'https://medinplay.app/download/ios-installer',
    packageType: 'IPA / TestFlight',
    features: ['AirPlay 2 con HDR10 y Dolby Atmos', 'Integración con Dynamic Island', 'Llavero seguro Keychain', 'Control por gestos táctiles'],
  },
  {
    id: 'dl-androidtv',
    platform: 'androidtv',
    title: 'MedinPlay para Android TV & Google TV',
    version: 'v3.5.1',
    size: '48.9 MB',
    description: 'Optimizada para control remoto D-pad, Fire TV Stick, Xiaomi Mi Box, Nvidia Shield y Google TV.',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://medinplay.app/download/androidtv.apk',
    downloadUrl: 'https://medinplay.app/download/MedinPlay-AndroidTV-v3.5.1.apk',
    packageType: 'TV APK',
    features: ['Interfaz 10-Foot 4K Ultra HD', 'Navegación nativa con control remoto', 'Cambio ultra rápido de canales IPTV', 'Buffer adaptativo de baja latencia'],
  },
  {
    id: 'dl-smarttv',
    platform: 'smarttv',
    title: 'MedinPlay para Samsung Tizen & LG webOS',
    version: 'v2.9.0',
    size: '22.0 MB',
    description: 'Compatible con Samsung Smart TV (Tizen 2018+) y LG Smart TV (webOS 4.0+).',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://medinplay.app/tv/pair',
    downloadUrl: 'https://medinplay.app/tv/installer',
    packageType: 'Tizen (.wgt)',
    features: ['Inicio instantáneo sin login (vía Código PIN TV)', 'Decodificación por hardware H.265/HEVC/AV1', 'Soporte de subtítulos integrados'],
  },
];

// Initial Seed VOD Catalog
export const SEED_VOD_CATALOG: ContentItem[] = [
  {
    id: 'm1',
    title: 'Cyberpulse: Neo Tokyo 2099',
    originalTitle: 'Cyberpulse 2099',
    type: 'movie',
    genre: ['Ciencia Ficción', 'Acción', 'Cyberpunk'],
    year: 2026,
    rating: 'PG-13',
    score: 9.4,
    matchPercentage: 99,
    duration: '2h 14m',
    durationSeconds: 8040,
    synopsis: 'En una megalópolis gobernada por inteligencias sintéticas, una hacker de élite y un ex-ciberpolicía descubren una conspiración que podría reiniciar la conciencia humana.',
    director: 'Kaito Takahashi',
    cast: ['Elena Rostova', 'Kenji Sato', 'Marcus Vance', 'Aria Chen'],
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1600&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    audioTracks: [
      { id: 'es-la', language: 'Español', label: 'Español Latino (5.1 Surround)', codec: 'E-AC3' },
      { id: 'es-es', language: 'Español', label: 'Español Castellano', codec: 'AAC' },
      { id: 'en-us', language: 'Inglés', label: 'English (Dolby Atmos)', codec: 'TrueHD' },
      { id: 'ja-jp', language: 'Japonés', label: '日本語 (Original)', codec: 'FLAC' },
    ],
    subtitleTracks: [
      { id: 'sub-es', language: 'Español', label: 'Español (Latinoamérica)' },
      { id: 'sub-en', language: 'English', label: 'English (CC)' },
      { id: 'sub-fr', language: 'Français', label: 'Français' },
      { id: 'sub-off', language: 'Desactivado', label: 'Desactivado' },
    ],
    isAdult: false,
    isExclusive: true,
    isTrending: true,
    isNewRelease: true,
    tags: ['4K Ultra HD', 'HDR10+', 'Baja Latencia', 'Dolby Atmos'],
    quality: '4K UHD',
    viewsCount: 1420800,
  },
  {
    id: 's1',
    title: 'Horizonte Singularity',
    originalTitle: 'Singularity Horizon',
    type: 'series',
    genre: ['Ciencia Ficción', 'Misterio', 'Drama'],
    year: 2025,
    rating: 'TV-MA',
    score: 9.6,
    matchPercentage: 98,
    seasonsCount: 2,
    synopsis: 'Una tripulación científica a bordo de una estación espacial en órbita a un agujero negro detecta ecos temporales del futuro que predicen el fin de la Tierra.',
    director: 'Dr. Sarah Lin',
    cast: ['David Oyelowo', 'Ana de Armas', 'Mads Mikkelsen'],
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    seasons: [
      {
        seasonNumber: 1,
        title: 'Temporada 1: El Eco del Horizonte',
        episodes: [
          {
            id: 's1-e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Contacto en el Vórtice',
            duration: '52m',
            durationSeconds: 3120,
            synopsis: 'La estación Kepler-9 recibe la primera transmisión cuántica invertida en el tiempo.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&auto=format&fit=crop&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            releaseDate: '2025-04-12',
          },
          {
            id: 's1-e2',
            episodeNumber: 2,
            seasonNumber: 1,
            title: 'Paradoja de Gravitones',
            duration: '48m',
            durationSeconds: 2880,
            synopsis: 'Las leyes de la física colapsan en el módulo experimental 4 mientras los tripulantes experimentan déjà vu continuo.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            releaseDate: '2025-04-19',
          },
          {
            id: 's1-e3',
            episodeNumber: 3,
            seasonNumber: 1,
            title: 'La Última Señal',
            duration: '56m',
            durationSeconds: 3360,
            synopsis: 'La tripulación debe tomar una decisión imposible antes de que la anomalía los absorba por completo.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            releaseDate: '2025-04-26',
          },
        ],
      },
      {
        seasonNumber: 2,
        title: 'Temporada 2: Más Allá del Colapso',
        episodes: [
          {
            id: 's2-e1',
            episodeNumber: 1,
            seasonNumber: 2,
            title: 'Renacimiento Dimensional',
            duration: '58m',
            durationSeconds: 3480,
            synopsis: 'Los supervivientes despiertan en un plano de realidad superpuesto donde la gravedad opera en dirección contraria.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            releaseDate: '2026-02-10',
          },
        ],
      },
    ],
    audioTracks: [
      { id: 'es-la', language: 'Español', label: 'Español Latino (5.1)', codec: 'E-AC3' },
      { id: 'en-us', language: 'Inglés', label: 'English (Atmos)', codec: 'TrueHD' },
    ],
    subtitleTracks: [
      { id: 'sub-es', language: 'Español', label: 'Español' },
      { id: 'sub-en', language: 'English', label: 'English' },
    ],
    isAdult: false,
    isExclusive: true,
    isTrending: true,
    isNewRelease: true,
    tags: ['Serie Original', '4K UHD', 'Alta Tensión'],
    quality: '4K UHD',
    viewsCount: 2310500,
  },
  {
    id: 'm2',
    title: 'Velocidad Límite: Formula Apex',
    originalTitle: 'Apex Drift: Tokyo Street',
    type: 'movie',
    genre: ['Acción', 'Deportes', 'Adrenalina'],
    year: 2026,
    rating: 'PG-13',
    score: 8.9,
    matchPercentage: 92,
    duration: '1h 55m',
    durationSeconds: 6900,
    synopsis: 'Pilotos clandestinos compiten con hypercars híbridos experimentales en las autopistas elevadas de Shinjuku a más de 400 km/h.',
    director: 'Guillermo Arana',
    cast: ['Lucas Rossi', 'Mia Toretto', 'Takeshi Kovacs'],
    posterUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1600&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    audioTracks: [
      { id: 'es-la', language: 'Español', label: 'Español Latino', codec: 'AAC' },
      { id: 'en-us', language: 'Inglés', label: 'English', codec: 'AAC' },
    ],
    subtitleTracks: [
      { id: 'sub-es', language: 'Español', label: 'Español' },
      { id: 'sub-en', language: 'English', label: 'English' },
    ],
    isAdult: false,
    isExclusive: false,
    isTrending: true,
    isNewRelease: true,
    tags: ['Velocidad', 'Coches', '60 FPS'],
    quality: '4K UHD',
    viewsCount: 980400,
  },
  {
    id: 'm3',
    title: 'Mundo Oculto: El Santuario del Dragón',
    originalTitle: 'Sintel: Dragon Chronicle',
    type: 'movie',
    genre: ['Animación', 'Fantasía', 'Aventura'],
    year: 2024,
    rating: 'PG',
    score: 9.1,
    matchPercentage: 95,
    duration: '1h 42m',
    durationSeconds: 6120,
    synopsis: 'Una joven guerrera cruza desiertos helados y ruinas ancestrales en busca de su fiel dragón robado por oscuros cazadores.',
    director: 'Colin Levy',
    cast: ['Halina Reijn', 'Thom Hoffman'],
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    audioTracks: [
      { id: 'es-la', language: 'Español', label: 'Español Latino', codec: 'AAC' },
      { id: 'en-us', language: 'Inglés', label: 'English (Original)', codec: 'AAC' },
    ],
    subtitleTracks: [
      { id: 'sub-es', language: 'Español', label: 'Español' },
      { id: 'sub-en', language: 'English', label: 'English' },
    ],
    isAdult: false,
    isExclusive: false,
    isTrending: false,
    isNewRelease: false,
    tags: ['Animación 3D', 'Familiar', 'Fantasía'],
    quality: '1080p',
    viewsCount: 750200,
  },
  {
    id: 'm4-adult',
    title: 'Sombra & Deseo: Hotel Midnight (+18)',
    originalTitle: 'Midnight Desire: Shadows of Velvet',
    type: 'movie',
    genre: ['Thriller Erótico', 'Drama Psicológico', 'Misterio'],
    year: 2025,
    rating: '18+',
    score: 8.7,
    matchPercentage: 88,
    duration: '1h 50m',
    durationSeconds: 6600,
    synopsis: '[CONTENIDO ADULTO +18] En un club privado de alta sociedad en Mónaco, un fotógrafo de moda se ve envuelto en un peligroso juego de seducción, secretos de poder y pasión prohibida.',
    director: 'Jean-Luc Moreau',
    cast: ['Camille Laurent', 'Valentin Cassel', 'Eva Green'],
    posterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1600&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    audioTracks: [
      { id: 'es-la', language: 'Español', label: 'Español Latino', codec: 'AAC' },
      { id: 'fr-fr', language: 'Français', label: 'Français Original', codec: 'AAC' },
      { id: 'en-us', language: 'Inglés', label: 'English', codec: 'AAC' },
    ],
    subtitleTracks: [
      { id: 'sub-es', language: 'Español', label: 'Español' },
      { id: 'sub-en', language: 'English', label: 'English' },
    ],
    isAdult: true,
    isExclusive: true,
    isTrending: false,
    isNewRelease: true,
    tags: ['Adultos +18', 'PIN Protegido', 'Modo Discreto', 'Sensual'],
    quality: '4K UHD',
    viewsCount: 420100,
  },
  {
    id: 's2-adult',
    title: 'Pecados de Seda: Temporada 1 (+18)',
    originalTitle: 'Silk & Sin: Chronicles',
    type: 'series',
    genre: ['Romance Adulto', 'Drama', 'Suspenso'],
    year: 2026,
    rating: '18+',
    score: 8.9,
    matchPercentage: 91,
    seasonsCount: 1,
    synopsis: '[CONTENIDO ADULTO +18] Serie exclusiva que explora las complejas dinámicas de poder, placer e intrigas íntimas entre los herederos de una dinastía de alta costura parisina.',
    director: 'Marcella De Rossi',
    cast: ['Chloe Dubois', 'Adriano Conti'],
    posterUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    seasons: [
      {
        seasonNumber: 1,
        title: 'Temporada 1: El Secreto de la Suite 7',
        episodes: [
          {
            id: 's2-e1-adult',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'La Máscara de Terciopelo',
            duration: '45m',
            durationSeconds: 2700,
            synopsis: 'La gala de apertura en Venecia desata una atracción incontrolable con consecuencias imprevistas.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            releaseDate: '2026-01-15',
          },
        ],
      },
    ],
    audioTracks: [
      { id: 'es-la', language: 'Español', label: 'Español Latino', codec: 'AAC' },
      { id: 'en-us', language: 'Inglés', label: 'English', codec: 'AAC' },
    ],
    subtitleTracks: [
      { id: 'sub-es', language: 'Español', label: 'Español' },
      { id: 'sub-en', language: 'English', label: 'English' },
    ],
    isAdult: true,
    isExclusive: true,
    isTrending: false,
    isNewRelease: true,
    tags: ['Adultos +18', 'Serie Exclusiva', 'Privacidad Blindada'],
    quality: '4K UHD',
    viewsCount: 310900,
  },
];

// Initial Seed IPTV Channels (Low Latency Live Streams)
export const SEED_IPTV_CHANNELS: IPTVChannel[] = [
  {
    id: 'iptv-1',
    channelNumber: 101,
    name: 'Aether Sports 4K Ultra Live',
    category: 'Deportes',
    logoUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&auto=format&fit=crop&q=80',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    quality: '4K 60fps',
    currentProgram: {
      id: 'epg-s1',
      title: 'UEFA Champions League 2026: Semifinal en Directo',
      category: 'Fútbol Internacional',
      startTime: '13:00',
      endTime: '15:30',
      description: 'Transmisión exclusiva con audio multicanal estadio y estadísticas en vivo con baja latencia.',
      progressPercentage: 65,
      isLive: true,
    },
    upcomingPrograms: [
      {
        id: 'epg-s2',
        title: 'Post-Partido: Análisis Táctico con IA',
        category: 'Debate',
        startTime: '15:30',
        endTime: '16:30',
        description: 'Repaso de las mejores jugadas y mapas de calor interactivos.',
        progressPercentage: 0,
        isLive: false,
      },
      {
        id: 'epg-s3',
        title: 'Formula 1: Previa Gran Premio de Mónaco',
        category: 'Automovilismo',
        startTime: '16:30',
        endTime: '18:00',
        description: 'Cámaras onboard exclusivas y telemetría en tiempo real.',
        progressPercentage: 0,
        isLive: false,
      },
    ],
    liveViewers: 34820,
    bitrateKbps: 18500,
    lowLatencyMs: 140,
    isAdult: false,
    isPremium: true,
    country: 'Internacional',
    audioLanguage: 'Español Latino / Inglés',
  },
  {
    id: 'iptv-2',
    channelNumber: 102,
    name: 'Mundo Noticias 24/7 Global',
    category: 'Noticias',
    logoUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=200&auto=format&fit=crop&q=80',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    quality: '1080p 60fps',
    currentProgram: {
      id: 'epg-n1',
      title: 'Cumbre de Innovación y Tecnología 2026',
      category: 'Noticias Globales',
      startTime: '13:30',
      endTime: '14:30',
      description: 'Cobertura en vivo de los últimos avances mundiales en inteligencia artificial y exploración espacial.',
      progressPercentage: 40,
      isLive: true,
    },
    upcomingPrograms: [
      {
        id: 'epg-n2',
        title: 'Economía y Mercados Financieros en Tiempo Real',
        category: 'Finanzas',
        startTime: '14:30',
        endTime: '15:30',
        description: 'Análisis de divisas, criptoactivos y bolsas mundiales.',
        progressPercentage: 0,
        isLive: false,
      },
    ],
    liveViewers: 12450,
    bitrateKbps: 9200,
    lowLatencyMs: 180,
    isAdult: false,
    isPremium: false,
    country: 'España / Latam',
    audioLanguage: 'Español',
  },
  {
    id: 'iptv-3',
    channelNumber: 103,
    name: 'CineMax Premieres HD',
    category: 'Cine & Series',
    logoUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&auto=format&fit=crop&q=80',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    quality: '4K 60fps',
    currentProgram: {
      id: 'epg-c1',
      title: 'Maratón Blockbuster: Trilogía Cybernetic',
      category: 'Cine Acción',
      startTime: '12:00',
      endTime: '16:00',
      description: 'Especial ininterrumpido sin cortes publicitarios en sonido envolvente 7.1.',
      progressPercentage: 50,
      isLive: true,
    },
    upcomingPrograms: [
      {
        id: 'epg-c2',
        title: 'Estreno Exclusivo: Sombras del Cosmos',
        category: 'Estreno',
        startTime: '16:00',
        endTime: '18:15',
        description: 'La película de ciencia ficción más galardonada del año.',
        progressPercentage: 0,
        isLive: false,
      },
    ],
    liveViewers: 28900,
    bitrateKbps: 16000,
    lowLatencyMs: 210,
    isAdult: false,
    isPremium: true,
    country: 'USA / Latam',
    audioLanguage: 'Dual (Español / Inglés)',
  },
  {
    id: 'iptv-4',
    channelNumber: 104,
    name: 'Discovery Wild & Science 4K',
    category: 'Documentales',
    logoUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&auto=format&fit=crop&q=80',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    quality: '4K 60fps',
    currentProgram: {
      id: 'epg-d1',
      title: 'Planeta Salvaje: Secretos de la Fosa de las Marianas',
      category: 'Naturaleza 4K',
      startTime: '13:00',
      endTime: '14:30',
      description: 'Expedición a las profundidades abisales con criaturas bioluminiscentes nunca antes filmadas.',
      progressPercentage: 70,
      isLive: true,
    },
    upcomingPrograms: [
      {
        id: 'epg-d2',
        title: 'Construyendo el Futuro: Ciudades Flotantes',
        category: 'Ingeniería',
        startTime: '14:30',
        endTime: '15:30',
        description: 'La nueva arquitectura climática sustentable.',
        progressPercentage: 0,
        isLive: false,
      },
    ],
    liveViewers: 8640,
    bitrateKbps: 14000,
    lowLatencyMs: 190,
    isAdult: false,
    isPremium: false,
    country: 'Global',
    audioLanguage: 'Español / Inglés / Francés',
  },
  {
    id: 'iptv-5-adult',
    channelNumber: 199,
    name: 'Velvet Midnight 24/7 (+18)',
    category: 'Adultos +18',
    logoUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=200&auto=format&fit=crop&q=80',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    quality: '1080p 60fps',
    currentProgram: {
      id: 'epg-a1',
      title: '[+18] Noches de Glamour & Pasión Exclusiva',
      category: 'Entretenimiento Adulto',
      startTime: '13:00',
      endTime: '15:00',
      description: 'Canal codificado con PIN parental y protección contra capturas accidentales.',
      progressPercentage: 45,
      isLive: true,
    },
    upcomingPrograms: [
      {
        id: 'epg-a2',
        title: '[+18] Festival Erotic Cinema Gold',
        category: 'Cine Adulto',
        startTime: '15:00',
        endTime: '17:00',
        description: 'Producciones internacionales premiadas.',
        progressPercentage: 0,
        isLive: false,
      },
    ],
    liveViewers: 15400,
    bitrateKbps: 11000,
    lowLatencyMs: 230,
    isAdult: true,
    isPremium: true,
    country: 'Europa / Latam',
    audioLanguage: 'Original / Español',
  },
];

// Initial Seed Live Radio Stations
export const SEED_RADIO_STATIONS: RadioStation[] = [
  {
    id: 'radio-1',
    name: 'Aether Chill & Lo-Fi Beats 24/7',
    genre: 'Lo-Fi / Chillhop / Ambient',
    frequency: '98.5 FM Digital',
    country: 'Tokio / Global',
    logoUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
    streamUrl: 'https://ice1.somafm.com/groovesalad-128-mp3',
    currentTrack: {
      title: 'Midnight Rain & Neon Reflections',
      artist: 'Komorebi Soundscapes ft. Nujabes Spirit',
      albumArt: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
      duration: '3:45',
    },
    listeners: 18450,
    bitrate: '320 kbps HD Audio',
    isLive: true,
    description: 'La mejor selección de ritmos relajantes, jazz hop y atmósferas envolventes para estudiar, trabajar o relajarse.',
  },
  {
    id: 'radio-2',
    name: 'Electro Wave & Cyber Synth',
    genre: 'Synthwave / Cyberpunk / EDM',
    frequency: '104.2 FM Digital',
    country: 'Londres / Berlín',
    logoUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80',
    streamUrl: 'https://ice2.somafm.com/defcon-128-mp3',
    currentTrack: {
      title: 'Turbocharged Highway 2088',
      artist: 'Kavinsky Resonance & The Midnight Club',
      albumArt: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&auto=format&fit=crop&q=80',
      duration: '4:12',
    },
    listeners: 14200,
    bitrate: '320 kbps Lossless',
    isLive: true,
    description: 'Sintetizadores analógicos, bajos profundos y energía retro-futurista sin pausas.',
  },
  {
    id: 'radio-3',
    name: 'Radio Éxitos Globales 2026',
    genre: 'Pop / Top Hits / Urbano',
    frequency: '101.1 FM Live',
    country: 'Miami / Madrid',
    logoUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&auto=format&fit=crop&q=80',
    streamUrl: 'https://ice1.somafm.com/poptron-128-mp3',
    currentTrack: {
      title: 'Solsticio Eterno',
      artist: 'Rosalía & The Weeknd',
      albumArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
      duration: '3:20',
    },
    listeners: 29800,
    bitrate: '256 kbps AAC',
    isLive: true,
    description: 'Los temas número 1 del mundo en español e inglés, entrevistas exclusivas y transmisiones de festivales.',
  },
  {
    id: 'radio-4',
    name: 'Jazz & Lounge Velvet Bar',
    genre: 'Smooth Jazz / Neo-Soul',
    frequency: '92.3 FM Smooth',
    country: 'París / Nueva York',
    logoUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&auto=format&fit=crop&q=80',
    streamUrl: 'https://ice4.somafm.com/secretagent-128-mp3',
    currentTrack: {
      title: 'Autumn Rain in Montmartre',
      artist: 'Miles Davis Tribute Ensemble',
      albumArt: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&auto=format&fit=crop&q=80',
      duration: '5:30',
    },
    listeners: 9100,
    bitrate: '320 kbps HD',
    isLive: true,
    description: 'Elegancia pura con saxofón cálido, piano acústico y ritmos de bossa nova y neo-soul.',
  },
];

// Initial Subscription Plans
export const SEED_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Plan Free con Anuncios',
    priceMonthly: 0,
    priceYearly: 0,
    currency: 'USD',
    features: [
      'Acceso a catálogo seleccionado VOD en 720p HD',
      'Canales de noticias y radio en vivo ilimitada',
      'Reproducción en 1 dispositivo simultáneo',
      'Búsqueda estándar por títulos y actores',
      'Contiene breves anuncios',
    ],
    maxDevices: 1,
    maxQuality: '720p HD',
    audioQuality: 'Stereo',
    aiAssistantAccess: false,
    iptvAccess: 'Básico',
    adult18Access: false,
    offlineDownloads: false,
  },
  {
    id: 'pro',
    name: 'Plan Pro Streaming',
    priceMonthly: 4.99,
    priceYearly: 49.99,
    currency: 'USD',
    badge: 'MÁS POPULAR',
    popular: true,
    features: [
      'Catálogo completo de películas y series sin anuncios',
      'Calidad Full HD 1080p a 60 FPS con baja latencia',
      'Todos los canales IPTV de deportes y cine',
      '2 pantallas simultáneas + sincronización multi-dispositivo',
      'Búsqueda inteligente con IA básica',
      'Radio en vivo en alta fidelidad 320 kbps',
    ],
    maxDevices: 2,
    maxQuality: '1080p FHD',
    audioQuality: '5.1 Surround',
    aiAssistantAccess: true,
    iptvAccess: 'Completo',
    adult18Access: true,
    offlineDownloads: true,
  },
  {
    id: 'ultra',
    name: 'Plan Ultra VIP 4K',
    priceMonthly: 9.99,
    priceYearly: 99.99,
    currency: 'USD',
    badge: 'MÁXIMA EXPERIENCIA',
    features: [
      'Resolución 4K Ultra HD + HDR10+ y Dolby Vision',
      'Audio espacial Dolby Atmos y multicanal 7.1',
      'IPTV Ultra Low-Latency (<150ms) en 4K 60fps',
      'Hasta 5 dispositivos simultáneos en cualquier lugar',
      'Asistente AI Cinematográfico Gemini con Pensamiento Profundo',
      'Acceso completo a Zona Segura +18 con control PIN',
      'Descargas ilimitadas para ver sin conexión en móvil',
      'Pase a estrenos exclusivos antes del lanzamiento general',
    ],
    maxDevices: 5,
    maxQuality: '4K UHD + HDR',
    audioQuality: 'Dolby Atmos',
    aiAssistantAccess: true,
    iptvAccess: 'VIP Ilimitado',
    adult18Access: true,
    offlineDownloads: true,
  },
  {
    id: 'family',
    name: 'Plan Familiar Premium',
    priceMonthly: 14.99,
    priceYearly: 139.99,
    currency: 'USD',
    features: [
      'Todo lo del Plan Ultra VIP 4K incluido',
      'Hasta 8 perfiles personalizados con Gmail individual',
      'Control parental inteligente y perfiles Kids blindados',
      'Hasta 6 pantallas simultáneas en streaming 4K',
      'Soporte técnico VIP prioritario 24/7',
    ],
    maxDevices: 6,
    maxQuality: '4K UHD + HDR',
    audioQuality: 'Dolby Atmos',
    aiAssistantAccess: true,
    iptvAccess: 'VIP Ilimitado',
    adult18Access: true,
    offlineDownloads: true,
  },
];

// Initial Seed Default User Account
export const SEED_USER_ACCOUNT: UserAccount = {
  email: 'medinplayhub@gmail.com',
  fullName: 'Alex Medina',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  authProvider: 'google',
  isAuthenticated: true,
  createdAt: '2026-01-10T10:00:00Z',
  subscription: {
    planId: 'ultra',
    planName: 'Plan Ultra VIP 4K',
    status: 'active',
    expiresAt: '2027-01-10T10:00:00Z',
    autoRenew: true,
    price: '$9.99/mes',
    maxScreens: 5,
  },
  activeProfileId: 'prof-1',
  profiles: [
    {
      id: 'prof-1',
      name: 'Alex Medina (Principal)',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      isKids: false,
      isAdultUnlocked: true,
      parentalPin: '1818',
      watchlist: ['m1', 's1', 'm2'],
      favorites: ['m1', 'iptv-1', 'radio-1'],
      history: [
        {
          contentId: 'm1',
          contentType: 'movie',
          title: 'Cyberpulse: Neo Tokyo 2099',
          posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
          backdropUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1600&auto=format&fit=crop&q=80',
          progressSeconds: 4200,
          totalDurationSeconds: 8040,
          lastWatchedAt: new Date(Date.now() - 3600000).toISOString(),
          completed: false,
        },
        {
          contentId: 's1',
          contentType: 'series',
          title: 'Horizonte Singularity',
          posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
          backdropUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&auto=format&fit=crop&q=80',
          seasonNumber: 1,
          episodeNumber: 1,
          episodeTitle: 'Contacto en el Vórtice',
          progressSeconds: 2900,
          totalDurationSeconds: 3120,
          lastWatchedAt: new Date(Date.now() - 86400000).toISOString(),
          completed: true,
        },
      ],
      customPlaylists: [
        {
          id: 'pl-1',
          title: 'Maratón Fin de Semana Cyber & Sci-Fi',
          description: 'Las mejores historias futuristas con mundos inmersivos y sintetizadores.',
          isPublic: true,
          itemIds: ['m1', 's1', 'm2'],
          createdAt: '2026-02-01',
          authorName: 'Alex Medina',
        },
      ],
      preferences: {
        preferredLanguage: 'Español',
        preferredSubtitles: 'Desactivado',
        autoPlayNext: true,
        lowLatencyStreaming: true,
        discreteAdultMode: false,
      },
    },
    {
      id: 'prof-2',
      name: 'Laura (Cineasta)',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      isKids: false,
      isAdultUnlocked: false,
      parentalPin: '1818',
      watchlist: ['s1', 'm3'],
      favorites: ['s1'],
      history: [],
      customPlaylists: [],
      preferences: {
        preferredLanguage: 'Inglés',
        preferredSubtitles: 'Español',
        autoPlayNext: true,
        lowLatencyStreaming: true,
        discreteAdultMode: true,
      },
    },
    {
      id: 'prof-3',
      name: 'Navegante Kids',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      isKids: true,
      isAdultUnlocked: false,
      watchlist: ['m3'],
      favorites: ['m3', 'iptv-4'],
      history: [],
      customPlaylists: [],
      preferences: {
        preferredLanguage: 'Español',
        preferredSubtitles: 'Desactivado',
        autoPlayNext: true,
        lowLatencyStreaming: false,
        discreteAdultMode: true,
      },
    },
  ],
  devices: [
    {
      id: 'dev-1',
      name: 'Google Chrome (MacBook Pro M3)',
      type: 'web',
      lastActive: 'Ahora mismo',
      isCurrent: true,
      ipLocation: 'Madrid, España',
      currentStreamingItemTitle: 'Cyberpulse: Neo Tokyo 2099',
    },
    {
      id: 'dev-2',
      name: 'Samsung Galaxy S24 Ultra (App Android)',
      type: 'android',
      lastActive: 'Hace 2 horas',
      isCurrent: false,
      ipLocation: 'Madrid, España',
      currentStreamingItemTitle: 'Aether Sports 4K Live',
    },
    {
      id: 'dev-3',
      name: 'iPhone 16 Pro Max (App iOS)',
      type: 'ios',
      lastActive: 'Ayer a las 21:30',
      isCurrent: false,
      ipLocation: 'Madrid, España',
    },
    {
      id: 'dev-4',
      name: 'LG OLED 65" 4K Smart TV',
      type: 'tv',
      lastActive: 'Hace 3 días',
      isCurrent: false,
      ipLocation: 'Salón Principal',
    },
  ],
  notifications: {
    newReleases: true,
    liveEvents: true,
    aiRecommendations: true,
    communityActivity: true,
    pushEnabled: true,
  },
};

// Initial Seed Community Posts
export const SEED_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    authorName: 'Carlos Vega (Cinefilo VIP)',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    authorBadge: 'VIP CRITIC',
    contentId: 'm1',
    contentTitle: 'Cyberpulse: Neo Tokyo 2099',
    contentType: 'movie',
    contentPoster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=80',
    text: '¡La secuencia de persecución aérea en el minuto 45 es una obra maestra absoluta de los efectos visuales modernos! La fidelidad en 4K HDR y sonido Dolby Atmos en esta plataforma es inigualable. 10/10 totalmente recomendada para amantes del cyberpunk.',
    rating: 5,
    likes: 342,
    userLiked: true,
    commentsCount: 28,
    comments: [
      {
        id: 'c-1',
        authorName: 'Elena G.',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        text: '¡Totalmente de acuerdo! La banda sonora con sintetizadores te sumerge al 100%.',
        createdAt: 'Hace 2 horas',
      },
    ],
    createdAt: 'Hace 4 horas',
    tags: ['Cyberpulse', 'Cyberpunk', 'Review', '4K'],
  },
  {
    id: 'post-2',
    authorName: 'Lucía Méndez',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    authorBadge: 'FAN',
    contentId: 'iptv-1',
    contentTitle: 'Aether Sports 4K Live',
    contentType: 'iptv',
    contentPoster: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&auto=format&fit=crop&q=80',
    text: 'La transmisión en vivo de la Champions no tiene ni medio segundo de retraso con respecto a la señal real. Increíble la baja latencia (140ms). Pude gritar los goles antes que mis vecinos jajaja.',
    rating: 5,
    likes: 512,
    userLiked: false,
    commentsCount: 45,
    createdAt: 'Ayer',
    tags: ['Deportes', 'BajaLatencia', 'ChampionsLeague'],
  },
];

// Initial Seed Push Notifications
export const SEED_NOTIFICATIONS: PushNotification[] = [
  {
    id: 'notif-1',
    title: '🔥 ¡Gran Estreno Exclusivo Disponible!',
    message: 'Cyberpulse: Neo Tokyo 2099 ya está disponible en 4K Ultra HD y Dolby Atmos para tu perfil.',
    type: 'premiere',
    timestamp: 'Hace 10 minutos',
    read: false,
    targetContentId: 'm1',
    targetContentType: 'movie',
    bannerUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'notif-2',
    title: '⚽ Transmisión en Directo: Champions League',
    message: 'El partido de semifinales ha comenzado en Aether Sports 4K. Entra con baja latencia y chat en vivo.',
    type: 'live',
    timestamp: 'Hace 30 minutos',
    read: false,
    targetContentId: 'iptv-1',
    targetContentType: 'iptv',
    bannerUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'notif-3',
    title: '✨ Recomendación de Inteligencia Artificial',
    message: 'Basado en tu historial con Horizonte Singularity, hemos preparado una selección sci-fi con 98% de coincidencia.',
    type: 'recommendation',
    timestamp: 'Hace 2 horas',
    read: true,
  },
];

// Unified Storage Helper with LocalStorage Persistence + PocketBase Sync
export const StorageService = {
  // User Account
  getAccount(): UserAccount {
    const raw = localStorage.getItem(STORAGE_KEYS.ACCOUNT);
    if (!raw) {
      this.saveAccount(SEED_USER_ACCOUNT);
      return SEED_USER_ACCOUNT;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_USER_ACCOUNT;
    }
  },

  saveAccount(account: UserAccount): void {
    localStorage.setItem(STORAGE_KEYS.ACCOUNT, JSON.stringify(account));
    this.syncWithBackend('users', account);
  },

  getActiveProfile(): UserProfile {
    const account = this.getAccount();
    const profile = account.profiles.find((p) => p.id === account.activeProfileId);
    return profile || account.profiles[0];
  },

  updateActiveProfile(updater: (p: UserProfile) => UserProfile): void {
    const account = this.getAccount();
    const index = account.profiles.findIndex((p) => p.id === account.activeProfileId);
    if (index !== -1) {
      account.profiles[index] = updater(account.profiles[index]);
      this.saveAccount(account);
    }
  },

  // VOD Catalog
  getCatalog(): ContentItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.VOD_CATALOG);
    if (!raw) {
      this.saveCatalog(SEED_VOD_CATALOG);
      return SEED_VOD_CATALOG;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_VOD_CATALOG;
    }
  },

  saveCatalog(items: ContentItem[]): void {
    localStorage.setItem(STORAGE_KEYS.VOD_CATALOG, JSON.stringify(items));
    this.syncWithBackend('content_vod', items);
  },

  // IPTV Channels
  getIPTVChannels(): IPTVChannel[] {
    const raw = localStorage.getItem(STORAGE_KEYS.IPTV_CHANNELS);
    if (!raw) {
      this.saveIPTVChannels(SEED_IPTV_CHANNELS);
      return SEED_IPTV_CHANNELS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_IPTV_CHANNELS;
    }
  },

  saveIPTVChannels(channels: IPTVChannel[]): void {
    localStorage.setItem(STORAGE_KEYS.IPTV_CHANNELS, JSON.stringify(channels));
    this.syncWithBackend('iptv_channels', channels);
  },

  // Radio Stations
  getRadioStations(): RadioStation[] {
    const raw = localStorage.getItem(STORAGE_KEYS.RADIO_STATIONS);
    if (!raw) {
      this.saveRadioStations(SEED_RADIO_STATIONS);
      return SEED_RADIO_STATIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_RADIO_STATIONS;
    }
  },

  saveRadioStations(stations: RadioStation[]): void {
    localStorage.setItem(STORAGE_KEYS.RADIO_STATIONS, JSON.stringify(stations));
    this.syncWithBackend('radio_stations', stations);
  },

  // Notifications
  getNotifications(): PushNotification[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) {
      this.saveNotifications(SEED_NOTIFICATIONS);
      return SEED_NOTIFICATIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_NOTIFICATIONS;
    }
  },

  saveNotifications(notifs: PushNotification[]): void {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },

  addNotification(notif: Omit<PushNotification, 'id' | 'timestamp' | 'read'>): PushNotification {
    const all = this.getNotifications();
    const newNotif: PushNotification = {
      ...notif,
      id: 'notif-' + Date.now(),
      timestamp: 'Ahora mismo',
      read: false,
    };
    this.saveNotifications([newNotif, ...all]);
    return newNotif;
  },

  // Community Posts
  getCommunityPosts(): CommunityPost[] {
    const raw = localStorage.getItem(STORAGE_KEYS.COMMUNITY_POSTS);
    if (!raw) {
      this.saveCommunityPosts(SEED_COMMUNITY_POSTS);
      return SEED_COMMUNITY_POSTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_COMMUNITY_POSTS;
    }
  },

  saveCommunityPosts(posts: CommunityPost[]): void {
    localStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(posts));
    this.syncWithBackend('community_posts', posts);
  },

  // Subscription Plans
  getPlans(): SubscriptionPlan[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PLANS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(SEED_SUBSCRIPTION_PLANS));
      return SEED_SUBSCRIPTION_PLANS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_SUBSCRIPTION_PLANS;
    }
  },

  // History & Watchlist Actions
  updateWatchProgress(item: ContentItem, progressSeconds: number, totalSeconds: number): void {
    this.updateActiveProfile((profile) => {
      const history = [...profile.history];
      const existingIdx = history.findIndex((h) => h.contentId === item.id);
      const isComplete = progressSeconds >= totalSeconds * 0.95;

      const historyItem: any = {
        contentId: item.id,
        contentType: item.type,
        title: item.title,
        posterUrl: item.posterUrl,
        backdropUrl: item.backdropUrl,
        progressSeconds,
        totalDurationSeconds: totalSeconds,
        lastWatchedAt: new Date().toISOString(),
        completed: isComplete,
      };

      if (existingIdx !== -1) {
        history[existingIdx] = historyItem;
      } else {
        history.unshift(historyItem);
      }

      return {
        ...profile,
        history: history.slice(0, 50),
      };
    });
  },

  toggleWatchlist(contentId: string): boolean {
    let isAdded = false;
    this.updateActiveProfile((profile) => {
      const exists = profile.watchlist.includes(contentId);
      isAdded = !exists;
      return {
        ...profile,
        watchlist: exists
          ? profile.watchlist.filter((id) => id !== contentId)
          : [...profile.watchlist, contentId],
      };
    });
    return isAdded;
  },

  toggleFavorite(contentId: string): boolean {
    let isFav = false;
    this.updateActiveProfile((profile) => {
      const exists = profile.favorites.includes(contentId);
      isFav = !exists;
      return {
        ...profile,
        favorites: exists
          ? profile.favorites.filter((id) => id !== contentId)
          : [...profile.favorites, contentId],
      };
    });
    return isFav;
  },

  // Background Sync Simulation with PocketBase/Server
  async syncWithBackend(collection: string, data: any): Promise<void> {
    try {
      await fetch('/api/pocketbase/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'push', collection, data }),
      });
    } catch {
      // Local offline fallback
    }
  },

  // Reviews
  getReviews(): ContentReview[] {
    const raw = localStorage.getItem('aether_reviews_v2');
    if (!raw) {
      const seedReviews: ContentReview[] = [
        {
          id: 'rev-1',
          contentId: 'm1',
          userId: 'prof-1',
          userName: 'Carlos Vega',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          rating: 5,
          comment: 'La calidad visual en 4K Ultra HD y sonido Dolby Atmos es simplemente impresionante. ¡Una experiencia de cine en casa!',
          createdAt: 'Hace 2 horas',
          likesCount: 24,
        },
        {
          id: 'rev-2',
          contentId: 's1',
          userId: 'prof-2',
          userName: 'Laura Cineasta',
          userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
          rating: 5,
          comment: 'La trama de Horizonte Singularity te atrapa desde el primer capítulo. Muy recomendada.',
          createdAt: 'Ayer',
          likesCount: 18,
        },
      ];
      this.saveReviews(seedReviews);
      return seedReviews;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveReviews(reviews: ContentReview[]): void {
    localStorage.setItem('aether_reviews_v2', JSON.stringify(reviews));
  },

  // Watch Parties
  getWatchParties(): WatchPartyRoom[] {
    const raw = localStorage.getItem('aether_watch_parties_v2');
    if (!raw) {
      const seedParties: WatchPartyRoom[] = [
        {
          id: 'party-1',
          title: 'Maratón Cyberpulse con Fans 🚀',
          contentId: 'm1',
          hostName: 'Alex Medina',
          participantsCount: 14,
          currentTimestampSeconds: 1200,
          isPlaying: true,
          isPrivate: false,
        },
        {
          id: 'party-2',
          title: 'Estreno Horizonte Singularity Cap 2 🌌',
          contentId: 's1',
          hostName: 'Laura Cineasta',
          participantsCount: 8,
          currentTimestampSeconds: 300,
          isPlaying: true,
          isPrivate: false,
        },
      ];
      this.saveWatchParties(seedParties);
      return seedParties;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveWatchParties(parties: WatchPartyRoom[]): void {
    localStorage.setItem('aether_watch_parties_v2', JSON.stringify(parties));
  },

  // Platform Mode
  getPlatformMode(): PlatformViewMode {
    const raw = localStorage.getItem('aether_platform_mode_v2');
    if (raw === 'android' || raw === 'ios' || raw === 'tv' || raw === 'tablet' || raw === 'web') {
      return raw;
    }
    return 'web';
  },

  savePlatformMode(mode: PlatformViewMode): void {
    localStorage.setItem('aether_platform_mode_v2', mode);
  },

  // Ad Banners Management
  getAdBanners(): AdBanner[] {
    const raw = localStorage.getItem(STORAGE_KEYS.AD_BANNERS);
    if (!raw) {
      this.saveAdBanners(SEED_AD_BANNERS);
      return SEED_AD_BANNERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_AD_BANNERS;
    }
  },

  saveAdBanners(banners: AdBanner[]): void {
    localStorage.setItem(STORAGE_KEYS.AD_BANNERS, JSON.stringify(banners));
  },

  recordAdImpression(adId: string): void {
    const banners = this.getAdBanners();
    const updated = banners.map((b) => (b.id === adId ? { ...b, impressionsCount: b.impressionsCount + 1 } : b));
    this.saveAdBanners(updated);
  },

  recordAdClick(adId: string): void {
    const banners = this.getAdBanners();
    const updated = banners.map((b) => (b.id === adId ? { ...b, clicksCount: b.clicksCount + 1 } : b));
    this.saveAdBanners(updated);
  },

  // Cast Devices
  getCastDevices(): CastDevice[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CAST_DEVICES);
    if (!raw) {
      this.saveCastDevices(SEED_CAST_DEVICES);
      return SEED_CAST_DEVICES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_CAST_DEVICES;
    }
  },

  saveCastDevices(devices: CastDevice[]): void {
    localStorage.setItem(STORAGE_KEYS.CAST_DEVICES, JSON.stringify(devices));
  },

  // App Downloads Options
  getAppDownloads(): AppDownloadOption[] {
    return SEED_APP_DOWNLOADS;
  },

  // Export Full Database as JSON
  exportFullDatabaseJSON(): string {
    const backup = {
      exportedAt: new Date().toISOString(),
      account: this.getAccount(),
      catalog: this.getCatalog(),
      iptv: this.getIPTVChannels(),
      radio: this.getRadioStations(),
      community: this.getCommunityPosts(),
      notifications: this.getNotifications(),
      adBanners: this.getAdBanners(),
    };
    return JSON.stringify(backup, null, 2);
  },

  // Reset to Factory Default
  resetToFactoryDefaults(): void {
    localStorage.clear();
    this.saveAccount(SEED_USER_ACCOUNT);
    this.saveCatalog(SEED_VOD_CATALOG);
    this.saveIPTVChannels(SEED_IPTV_CHANNELS);
    this.saveRadioStations(SEED_RADIO_STATIONS);
    this.saveNotifications(SEED_NOTIFICATIONS);
    this.saveCommunityPosts(SEED_COMMUNITY_POSTS);
    this.saveAdBanners(SEED_AD_BANNERS);
  },
};
