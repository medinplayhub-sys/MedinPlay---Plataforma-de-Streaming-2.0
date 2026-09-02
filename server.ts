import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Gemini features will return fallback content.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "AetherStream API Backend",
    version: "2.5.0",
  });
});

// AI Semantic Search Endpoint
app.post("/api/ai/search", async (req, res) => {
  try {
    const { query, catalogSummary, useDeepThinking } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        interpretation: `Búsqueda semántica para: "${query}"`,
        keywords: [query],
        mood: "General",
        suggestedGenres: ["Acción", "Ciencia Ficción"],
        matchedContentIds: ["m1", "s1", "iptv1"],
        aiRationale: "Mostrando los resultados más relevantes según coincidencia directa.",
        deepAnalysis: null,
      });
    }

    // Check if deep thinking mode requested
    if (useDeepThinking) {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `Eres el motor de búsqueda e inteligencia cinematográfica de AetherStream (plataforma de streaming VOD, IPTV y Radio).
Analiza la siguiente consulta del usuario y el catálogo disponible.

Consulta del usuario: "${query}"

Catálogo disponible (resumen de títulos):
${catalogSummary || "Películas: Interstellar, Cyberpulse 2099, Dune Parte 2, El Padrino, Neon Tokyo. Series: Stranger Things, The Last of Us, Dark, Breaking Bad. Canales IPTV: ESPN Deportes, CNN Noticias, HBO Cine 24/7, Discovery."}

Devuelve una respuesta JSON estricta con el siguiente formato:
{
  "interpretation": "Explicación concisa y elegante de lo que el usuario busca (máximo 2 líneas)",
  "keywords": ["tag1", "tag2", "tag3"],
  "mood": "Estado de ánimo detectado (ej. Adrenalina, Nostalgia, Misterio, etc.)",
  "suggestedGenres": ["Género1", "Género2"],
  "matchedContentIds": ["id1", "id2"],
  "aiRationale": "Por qué estos contenidos encajan exactamente con el deseo del espectador",
  "deepAnalysis": "Análisis cinematográfico profundo del estilo narrativo, ritmo o tono solicitado."
}`,
        config: {
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
          responseMimeType: "application/json",
          systemInstruction: "Eres un curador de cine y streaming de élite que devuelve JSON estructurado.",
        },
      });

      const text = response.text || "{}";
      try {
        const parsed = JSON.parse(text);
        return res.json(parsed);
      } catch {
        return res.json({
          interpretation: text,
          keywords: [query],
          mood: "Personalizado",
          suggestedGenres: [],
          matchedContentIds: [],
          aiRationale: text,
        });
      }
    } else {
      // Standard Fast Semantic Search
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: `Analiza la consulta de búsqueda para una plataforma de streaming: "${query}".
Catálogo de referencia: ${catalogSummary || "Películas de ciencia ficción, acción, anime, dramas, deportes IPTV y radio."}

Devuelve un JSON estructurado:
{
  "interpretation": "Resumen claro de lo buscado",
  "keywords": ["palabra1", "palabra2"],
  "mood": "Tono emocional o ritmo",
  "suggestedGenres": ["Género1", "Género2"],
  "matchedContentIds": ["id1", "id2"],
  "aiRationale": "Breve explicación de la recomendación"
}`,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text || "{}";
      try {
        const parsed = JSON.parse(text);
        return res.json(parsed);
      } catch {
        return res.json({
          interpretation: text,
          keywords: [query],
          mood: "Cine",
          suggestedGenres: [],
          matchedContentIds: [],
          aiRationale: text,
        });
      }
    }
  } catch (error: any) {
    console.error("AI Search Error:", error);
    res.status(500).json({ error: error?.message || "Error procesando búsqueda con IA" });
  }
});

// AI Personalized Recommendations Endpoint
app.post("/api/ai/recommend", async (req, res) => {
  try {
    const { history, favorites, mood, preferredGenres } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        recommendationTitle: "Selección Especial para Ti",
        moodDetected: mood || "Relajado",
        curatedSuggestions: [
          {
            title: "Cyberpulse 2099",
            genre: "Ciencia Ficción",
            matchReason: "Basado en tu gusto por historias futuristas e inmersivas.",
            score: 99,
          },
          {
            title: "Crónicas del Abismo",
            genre: "Suspenso / Terror",
            matchReason: "Perfecto para el estado de ánimo actual con giros inesperados.",
            score: 95,
          },
        ],
        curatorNote: "Disfruta de streaming en calidad 4K UHD con baja latencia.",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Eres el motor de recomendación predictiva de AetherStream.
Datos del perfil del usuario:
- Historial reciente: ${JSON.stringify(history || [])}
- Favoritos: ${JSON.stringify(favorites || [])}
- Estado de ánimo seleccionado: ${mood || "Sorpréndeme"}
- Géneros preferidos: ${JSON.stringify(preferredGenres || ["Ciencia Ficción", "Acción", "Suspenso"])}

Genera recomendaciones ultra personalizadas en formato JSON:
{
  "recommendationTitle": "Título creativo y atractivo de la colección (ej. 'Inmersión Cyberpunk de Medianoche')",
  "moodDetected": "${mood || "Aventurero"}",
  "curatedSuggestions": [
    {
      "title": "Nombre de la película o serie",
      "genre": "Género",
      "matchReason": "Razón detallada y persuasiva de por qué le encantará según su historial",
      "score": 98
    }
  ],
  "curatorNote": "Consejo personalizado para la sesión de streaming"
}`,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    try {
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch {
      res.json({
        recommendationTitle: "Recomendaciones de Hoy",
        moodDetected: mood || "General",
        curatedSuggestions: [],
        curatorNote: text,
      });
    }
  } catch (error: any) {
    console.error("AI Recommend Error:", error);
    res.status(500).json({ error: error?.message || "Error al generar recomendaciones" });
  }
});

// AI Streaming Companion & Live Trivia Endpoint
app.post("/api/ai/companion", async (req, res) => {
  try {
    const { contentTitle, contentType, currentTimestamp, userQuestion, language } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        answer: `Información sobre ${contentTitle}: Esta producción destaca por su cinematografía de vanguardia, banda sonora inmersiva y dirección visual impecable.`,
        trivia: "Dato curioso: Esta producción utilizó cámaras IMAX especializadas para tomas de baja iluminación.",
        castHighlight: "Reparto estelar con actuaciones aclamadas por la crítica internacional.",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Eres el Asistente AI en Vivo integrado en el reproductor de AetherStream.
El usuario está reproduciendo: "${contentTitle}" (${contentType || "película"}).
Minuto actual de reproducción: ${currentTimestamp || "00:15:30"}.
Pregunta o interacción del espectador: "${userQuestion || "¿Qué curiosidades tiene esta escena y quién es el director?"}"
Idioma preferido: ${language || "Español"}.

Responde en formato JSON:
{
  "answer": "Respuesta directa, entretenida y sin spoilers mayores",
  "trivia": "Un dato curioso o detrás de cámaras fascinante sobre la producción",
  "castHighlight": "Nota sobre el elenco o la música en este momento",
  "suggestedFollowUps": ["Pregunta sugerida 1", "Pregunta sugerida 2"]
}`,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    try {
      res.json(JSON.parse(text));
    } catch {
      res.json({
        answer: text,
        trivia: "Producción destacada de alta fidelidad.",
        castHighlight: "",
        suggestedFollowUps: [],
      });
    }
  } catch (error: any) {
    console.error("AI Companion Error:", error);
    res.status(500).json({ error: error?.message || "Error en el asistente AI" });
  }
});

// PocketBase / Embedded DB sync endpoint
let databaseState: Record<string, any> = {
  lastSyncedAt: new Date().toISOString(),
  serverVersion: "PocketBase-Embedded v0.24.1",
};

app.post("/api/pocketbase/sync", (req, res) => {
  const { collection, data, action } = req.body;
  if (action === "push" && collection && data) {
    databaseState[collection] = data;
    databaseState.lastSyncedAt = new Date().toISOString();
    return res.json({ success: true, message: `Collection ${collection} synchronized successfully.` });
  }
  res.json({ success: true, databaseState });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AetherStream server running on http://localhost:${PORT}`);
  });
}

startServer();
