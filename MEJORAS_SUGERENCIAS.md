# 🎬 Medin Play - Plan de Mejoras y Migración a Cloudflare

## 📋 Resumen Ejecutivo

Plataforma de streaming integral con arquitectura centrada en **Cloudflare** (D1, Pages, R2), diseñada para ofrecer experiencia fluida en web y app nativa Android (.apk descargable desde la web).

---

## 🎨 Paleta de Colores Actualizada

### Colores Principales
- **Negro Profundo**: `#050505` (fondos principales)
- **Negro Suave**: `#0d0d0d` (paneles secundarios)
- **Dorado Premium**: `#D4AF37` (acentos principales, botones CTAs)
- **Dorado Brillante**: `#F4C430` (hover, estados activos)
- **Morado Real**: `#6B21A8` (gradientes, efectos glow)
- **Morado Intenso**: `#9333EA` (highlights, badges)
- **Blanco Puro**: `#FFFFFF` (texto principal)
- **Blanco Humo**: `#F5F5F5` (texto secundario)

### Gradientes Signature
```css
/* Gradiente Dorado */
background: linear-gradient(135deg, #D4AF37 0%, #F4C430 50%, #D4AF37 100%);

/* Gradiente Morado */
background: linear-gradient(135deg, #6B21A8 0%, #9333EA 100%);

/* Gradiente Premium (Dorado + Morado) */
background: linear-gradient(135deg, #D4AF37 0%, #9333EA 100%);

/* Glow Dorado */
box-shadow: 0 0 30px rgba(212, 175, 55, 0.4);

/* Glow Morado */
box-shadow: 0 0 30px rgba(147, 51, 234, 0.4);
```

---

## 🏗️ Arquitectura Cloudflare

### 1. **Cloudflare Pages** (Deploy)
- Hosting de la aplicación web frontend
- Deploy automático desde GitHub
- Edge Functions para lógica server-side ligera

### 2. **Cloudflare D1** (Base de Datos + Autenticación)
```sql
-- Esquema de usuarios
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_plan TEXT DEFAULT 'free',
  created_at INTEGER NOT NULL,
  last_login INTEGER
);

-- Perfiles por usuario
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  avatar_url TEXT,
  is_kids BOOLEAN DEFAULT FALSE,
  parental_pin TEXT,
  created_at INTEGER NOT NULL
);

-- Catálogo de contenido
CREATE TABLE content (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT CHECK(type IN ('movie', 'series')) NOT NULL,
  synopsis TEXT,
  genre TEXT,
  year INTEGER,
  score REAL,
  poster_url TEXT,
  backdrop_url TEXT,
  video_url TEXT,
  trailer_url TEXT,
  cast TEXT, -- JSON array
  seasons TEXT, -- JSON para series
  is_adult BOOLEAN DEFAULT FALSE,
  created_at INTEGER NOT NULL
);

-- Canales IPTV
CREATE TABLE iptv_channels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  logo_url TEXT,
  stream_url TEXT NOT NULL,
  epg_data TEXT, -- JSON
  low_latency_ms INTEGER DEFAULT 140,
  position INTEGER
);

-- Historial de visualización
CREATE TABLE watch_history (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles(id),
  content_id TEXT NOT NULL,
  progress_seconds INTEGER DEFAULT 0,
  total_duration_seconds INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  last_watched_at INTEGER NOT NULL
);

-- Favoritos y Watchlist
CREATE TABLE user_lists (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles(id),
  content_id TEXT NOT NULL,
  list_type TEXT CHECK(list_type IN ('favorite', 'watchlist')) NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(profile_id, content_id, list_type)
);
```

### 3. **Cloudflare R2** (Respaldo y Almacenamiento)
- **Bucket**: `medinplay-assets`
  - `/posters/` - Carteles de películas/series
  - `/backdrops/` - Fondos panorámicos
  - `/logos/` - Logos de canales IPTV
  - `/avatars/` - Avatares de usuarios
  - `/videos/` - Contenido de video (opcional, si no se usa CDN externo)
  - `/apks/` - Archivo APK de la app Android
  - `/backups/` - Backups automáticos de D1

---

## 🔐 Sistema de Autenticación (D1 + JWT)

### Flujo de Autenticación
1. **Registro/Login**: Formulario en web → API Route en Pages Function
2. **Validación**: Credentials verificadas contra D1
3. **Token JWT**: Generado con firma secreta (Cloudflare Secrets)
4. **Session**: Token almacenado en cookie HTTP-only segura
5. **Refresh**: Token de refresco válido por 7 días

### Endpoints de Auth
```typescript
// POST /api/auth/register
// POST /api/auth/login
// POST /api/auth/logout
// POST /api/auth/refresh
// GET /api/auth/me (validar sesión)
```

---

## 📱 App Android (.apk)

### Estrategia de Distribución
1. **Descarga directa** desde la web (`/download/apk`)
2. **Archivo alojado en R2** con URL firmada temporal
3. **QR Code** generado dinámicamente para descarga móvil
4. **Actualizaciones OTA** (Over-The-Air) detectadas desde la app

### Características de la App
- **WebView nativa** con mejoras:
  - Cache inteligente de assets
  - Notificaciones push (Firebase Cloud Messaging)
  - Soporte para Chromecast integrado
  - Picture-in-Picture nativo
  - Background audio para radio
- **Deep linking**: `medinplay://content/{id}`
- **Offline mode**: Descarga de contenido (si la licencia lo permite)

### Build del APK
```bash
# Usar Capacitor o similar para empaquetar la PWA
npm run build:android
# Output: medinplay-v1.0.0.apk en R2
```

---

## 🖥️ Panel Administrativo Web

### Secciones del Dashboard

#### 1. **Dashboard General**
- Métricas en tiempo real:
  - Usuarios activos (últimas 24h)
  - Reproducciones totales
  - Ancho de banda consumido
  - Nuevos registros
- Gráficos de tendencia (Chart.js o Recharts)

#### 2. **Gestión de Contenido**
- **CRUD Completo** para Películas/Series:
  - Subida de posters/backdrops a R2
  - Metadatos (título, sinopsis, género, año, rating)
  - Asociación de videos (URLs o archivos en R2)
  - Gestión de temporadas/episodios para series
  - Etiquetado +18
  - Enlace a secuelas

#### 3. **Gestión IPTV**
- Lista de canales con ordenamiento
- URLs de streams (HLS, DASH, RTMP)
- EPG (Guía Electrónica de Programas)
- Categorización (Deportes, Noticias, Entretenimiento, etc.)
- Estado del canal (online/offline checker)

#### 4. **Gestión de Usuarios**
- Lista de usuarios registrados
- Detalles por usuario (perfiles, historial, suscripción)
- Baneo/suspensión
- Reset de contraseñas
- Exportación de datos (GDPR)

#### 5. **Suscripciones y Pagos**
- Planes disponibles (Free, Premium, Ultra)
- Integración con Stripe/PayPal
- Historial de transacciones
- Renovaciones automáticas
- Códigos promocionales

#### 6. **Configuración de Plataforma**
- Personalización de colores
- Banners publicitarios
- Notificaciones push masivas
- Mantenimiento programado
- Variables de entorno

#### 7. **Backups y R2**
- Backup manual/automático de D1
- Explorador de archivos en R2
- Restauración de backups
- Límites de almacenamiento

---

## 🎮 Experiencia de Usuario (UX)

### 1. **Menú Lateral Izquierdo en Pantalla Máxima**

En modo fullscreen del reproductor, implementar sidebar colapsable:

```tsx
// Componente QuickSwitchSidebar
- Lista vertical de elementos de la sección actual
- Miniaturas pequeñas (60x90px)
- Scroll suave con rueda del mouse
- Hover muestra preview al pasar cursor
- Click cambia inmediatamente al elemento
- Accesible con tecla rápida (ej: 'L')
- Auto-oculta después de 3s de inactividad
```

### 2. **Picture-in-Picture (PiP)**

Ya implementado, pero mejorar con:
- Botón visible siempre en controles
- Atajo de teclado (`P`)
- PiP persistente al navegar entre secciones
- Controles mínimos en ventana PiP (play/pause, close)

### 3. **Cast a Pantallas Externas**

Implementar en TODAS las secciones:
- **Botón universal** en navbar (siempre visible)
- **Detección automática** de dispositivos Chromecast/AirPlay
- **Modal de selección** con:
  - Dispositivos disponibles
  - PIN de emparejamiento (si requiere)
  - Estado de conexión
- **Controles remotos** desde el dispositivo origen:
  - Play/Pause
  - Volumen
  - Seek bar
  - Subtítulos/Audio

### 4. **Navegación Fluida y Responsive**

#### Desktop
- Navbar superior fija con blur backdrop
- Sidebar lateral para categorías principales
- Grid responsive de cards (4-5 columnas)
- Hover effects con transiciones suaves (200ms)

#### Tablet
- Navbar colapsable
- Grid 2-3 columnas
- Gestos de swipe para navegación

#### Móvil
- Bottom navigation bar (Home, Buscar, Mi Lista, Perfil)
- Swipe horizontal entre categorías
- Cards en 1-2 columnas
- Pull-to-refresh

---

## 🔔 Sistema de Alertas y Notificaciones

### Tipos de Alertas

#### 1. **Toast Notifications** (Esquina superior derecha)
```tsx
// Éxito
bg-emerald-500/90 border border-emerald-400 text-white
icon: CheckCircle

// Error
bg-rose-500/90 border border-rose-400 text-white
icon: XCircle

// Advertencia
bg-amber-500/90 border border-amber-400 text-black
icon: AlertTriangle

// Información
bg-indigo-500/90 border border-indigo-400 text-white
icon: Info
```

#### 2. **Modales de Confirmación**
- Fondo oscuro con blur (`bg-black/85 backdrop-blur-md`)
- Borde dorado sutil (`border-amber-500/30`)
- Botones: Primario (dorado), Secundario (gris)

#### 3. **Notificaciones Push**
- Servicio Worker registrado
- Suscripción del usuario
- Envío desde panel admin
- Badge en icono de campana

### Diseño de Alertas
```tsx
interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number; // ms, default 4000
  action?: { label: string; onClick: () => void };
}
```

---

## 🚀 Optimizaciones de Rendimiento

### 1. **Lazy Loading**
- Components: React.lazy + Suspense
- Images: Loading="lazy" + placeholder blur
- Routes: Code splitting por sección

### 2. **Cache Estratégico**
- Service Worker (ya implementado)
- Cache de imágenes en R2 con CDN de Cloudflare
- Prefetch de siguiente episodio/película

### 3. **Compresión**
- Brotli/Gzip en Cloudflare Pages
- Imágenes en WebP/AVIF
- Videos con codecs modernos (HEVC, AV1)

### 4. **Edge Caching**
- Reglas de cache en Cloudflare
- Stale-while-revalidate para contenido dinámico
- Cache HTML: 1h, CSS/JS: 1 año, Imágenes: 1 mes

---

## 📊 SEO y Metadatos

### Implementar por cada página:
```tsx
<title>{content.title} - Ver en MedinPlay</title>
<meta name="description" content={content.synopsis} />
<meta property="og:title" content={content.title} />
<meta property="og:image" content={content.posterUrl} />
<meta property="og:type" content="video.movie" />
<link rel="canonical" href={`https://medinplay.com/content/${content.id}`} />
```

### Schema.org Markup
```json
{
  "@context": "https://schema.org",
  "@type": "Movie",
  "name": "Título",
  "image": "poster.jpg",
  "genre": ["Acción", "Ciencia Ficción"],
  "datePublished": "2024",
  "director": {...},
  "actor: [...]
}
```

---

## 🔒 Seguridad

### Medidas Implementadas
1. **HTTPS obligatorio** (Cloudflare SSL)
2. **Cookies HTTP-only** para tokens
3. **Rate limiting** en APIs (Cloudflare Workers)
4. **Validación de inputs** en frontend y backend
5. **CSP (Content Security Policy)** headers
6. **Protección DDoS** (Cloudflare)
7. **WAF (Web Application Firewall)** reglas personalizadas

### Para Contenido +18
- PIN parental obligatorio
- Blur inicial hasta verificar edad
- Modo discreto (blur total de pantalla)
- No mostrar en perfiles Kids

---

## 📈 Analytics y Monitoreo

### Integrar:
1. **Cloudflare Web Analytics** (privado, sin cookies)
2. **Logs de reproducción**:
   - Inicio, pausa, completion
   - Tiempo promedio de visualización
   - Dispositivos más usados
3. **Errores y crashes** (Sentry opcional)
4. **Performance metrics** (Core Web Vitals)

---

## 🧪 Testing

### Estrategia:
1. **Unit Tests**: Vitest para funciones utilitarias
2. **Component Tests**: React Testing Library
3. **E2E Tests**: Playwright o Cypress
4. **Testing en dispositivos reales**:
   - Android (múltiples versiones)
   - iOS Safari
   - Smart TVs (navegadores integrados)

---

## 📅 Roadmap de Implementación

### Fase 1: Migración a Cloudflare (2-3 semanas)
- [ ] Configurar D1 con schema
- [ ] Migrar datos de Firebase a D1
- [ ] Implementar auth con JWT
- [ ] Deploy en Cloudflare Pages
- [ ] Configurar R2 para assets

### Fase 2: Panel Administrativo (2 semanas)
- [ ] Dashboard de métricas
- [ ] CRUD de contenido
- [ ] Gestión IPTV
- [ ] Administración de usuarios

### Fase 3: Mejoras de UX (1-2 semanas)
- [ ] Menú lateral en fullscreen
- [ ] Cast universal en todas las secciones
- [ ] Mejoras en PiP
- [ ] Animaciones y transiciones

### Fase 4: App Android (1-2 semanas)
- [ ] Empaquetar con Capacitor
- [ ] Integrar notificaciones push
- [ ] Subir APK a R2
- [ ] Página de descarga con QR

### Fase 5: Pulido Final (1 semana)
- [ ] Testing exhaustivo
- [ ] Optimización de performance
- [ ] Documentación
- [ ] Lanzamiento oficial

---

## 🛠️ Stack Tecnológico Final

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| UI | TailwindCSS 4 + Lucide Icons |
| Hosting | Cloudflare Pages |
| DB + Auth | Cloudflare D1 |
| Storage | Cloudflare R2 |
| CDN | Cloudflare Network |
| Video Player | HTML5 nativo + Hls.js |
| App Android | Capacitor + WebView |
| State Management | React Context + localStorage |
| Forms | React Hook Form |
| Validation | Zod |

---

## 📞 Soporte y Contacto

- Email: soporte@medinplay.com
- Documentación: /docs
- Status Page: status.medínplay.com

---

**© 2025 Medin Play - Todos los derechos reservados**
