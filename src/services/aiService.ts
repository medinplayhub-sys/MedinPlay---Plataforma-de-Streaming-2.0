export interface AISearchResult {
  interpretation: string;
  keywords: string[];
  mood: string;
  suggestedGenres: string[];
  matchedContentIds: string[];
  aiRationale: string;
  deepAnalysis?: string;
}

export interface AIRecResult {
  recommendationTitle: string;
  moodDetected: string;
  curatedSuggestions: Array<{
    title: string;
    genre: string;
    matchReason: string;
    score: number;
  }>;
  curatorNote: string;
}

export interface AICompanionResult {
  answer: string;
  trivia: string;
  castHighlight?: string;
  suggestedFollowUps?: string[];
}

export const AIService = {
  async searchSemantic(query: string, catalogSummary?: string, useDeepThinking = false): Promise<AISearchResult> {
    try {
      const res = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, catalogSummary, useDeepThinking }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('AI Search fallback:', err);
      return {
        interpretation: `Búsqueda para: "${query}"`,
        keywords: [query],
        mood: 'Exploración',
        suggestedGenres: ['Acción', 'Ciencia Ficción'],
        matchedContentIds: ['m1', 's1', 'iptv-1'],
        aiRationale: 'Recomendaciones basadas en coincidencia de catálogo.',
      };
    }
  },

  async getRecommendations(params: {
    history: any[];
    favorites: any[];
    mood?: string;
    preferredGenres?: string[];
  }): Promise<AIRecResult> {
    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('AI Rec fallback:', err);
      return {
        recommendationTitle: 'Selección Inteligente Aether',
        moodDetected: params.mood || 'Inmersivo',
        curatedSuggestions: [
          {
            title: 'Cyberpulse: Neo Tokyo 2099',
            genre: 'Ciencia Ficción',
            matchReason: 'Coincide con tu preferencia por mundos futuristas y alta calidad 4K.',
            score: 99,
          },
          {
            title: 'Horizonte Singularity',
            genre: 'Misterio Espacial',
            matchReason: 'Aclamada por la crítica con giros impredecibles.',
            score: 97,
          },
        ],
        curatorNote: 'Disfruta de streaming de baja latencia con sonido espacial.',
      };
    }
  },

  async getStreamingCompanion(params: {
    contentTitle: string;
    contentType?: string;
    currentTimestamp?: string;
    userQuestion?: string;
    language?: string;
  }): Promise<AICompanionResult> {
    try {
      const res = await fetch('/api/ai/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('AI Companion fallback:', err);
      return {
        answer: `Información sobre "${params.contentTitle}": Una destacada producción con fotografía de vanguardia y dirección galardonada.`,
        trivia: 'Dato de producción: Filmada con tecnología de cámaras de ultra alta sensibilidad luminosa.',
        castHighlight: 'Actuaciones reconocidas a nivel internacional.',
        suggestedFollowUps: ['¿Quién compuso la banda sonora?', '¿Habrá continuación o spin-off?'],
      };
    }
  },
};
