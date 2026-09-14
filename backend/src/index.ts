export interface Env {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // Cabeceras CORS para permitir peticiones desde la App Android y Web Client
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Endpoint: Registro de Usuario
      if (pathname === '/api/auth/register' && request.method === 'POST') {
        const { username, email, password } = await request.json() as any;
        const userId = crypto.randomUUID();

        await env.DB.prepare(
          'INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)'
        ).bind(userId, username, email, password).run();

        return new Response(JSON.stringify({ success: true, message: 'Usuario registrado con éxito', userId }), { headers: corsHeaders });
      }

      // Endpoint: Obtener Catálogo de Contenido con Banners cada 4 elementos
      if (pathname === '/api/content' && request.method === 'GET') {
        const { results: contentList } = await env.DB.prepare('SELECT * FROM content ORDER BY created_at DESC').all();
        const { results: bannerList } = await env.DB.prepare('SELECT * FROM banners WHERE is_active = 1').all();

        // Inyección de Banners Publicitarios cada 4 elementos
        const feedWithBanners: any[] = [];
        let bannerIndex = 0;

        contentList.forEach((item, index) => {
          feedWithBanners.push({ type_item: 'content', data: item });
          
          if ((index + 1) % 4 === 0 && bannerList.length > 0) {
            const currentBanner = bannerList[bannerIndex % bannerList.length];
            feedWithBanners.push({ type_item: 'banner', data: currentBanner });
            bannerIndex++;
          }
        });

        return new Response(JSON.stringify({ success: true, items: feedWithBanners }), { headers: corsHeaders });
      }

      // Endpoint: Obtener última versión del APK para descarga directa
      if (pathname === '/api/app/latest-apk' && request.method === 'GET') {
        const apk = await env.DB.prepare('SELECT * FROM app_versions ORDER BY created_at DESC LIMIT 1').first();
        return new Response(JSON.stringify({ success: true, apk }), { headers: corsHeaders });
      }

      return new Response(JSON.stringify({ error: 'Ruta no encontrada' }), { status: 404, headers: corsHeaders });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
    }
  },
};