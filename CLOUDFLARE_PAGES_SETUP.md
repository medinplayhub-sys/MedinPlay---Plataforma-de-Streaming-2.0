# 🚀 Guía de Implementación Cloudflare Pages - Medin Play

## ✅ Configuración Completada

Tu proyecto ya está configurado para Cloudflare Pages. Sigue estos pasos:

---

## 📋 Paso 1: Autenticación con Cloudflare

```bash
npm run wrangler:login
```

Esto abrirá una ventana del navegador para que inicies sesión en tu cuenta de Cloudflare.

---

## 📋 Paso 2: Crear Proyecto en Cloudflare Pages

### Opción A: Desde la CLI (Recomendado)
```bash
npm run pages:project:create
```

### Opción B: Desde el Dashboard Web
1. Ve a [dash.cloudflare.com](https://dash.cloudflare.com)
2. Selecciona **Workers & Pages** → **Create Application**
3. Elige **Pages** → **Connect to Git** o **Direct Upload**
4. Nombre del proyecto: `medin-play`
5. Branch de producción: `main`

---

## 📋 Paso 3: Configurar Base de Datos D1

```bash
npm run d1:create
```

Esto creará una base de datos llamada `medin-play-db`. Copia el `database_id` que te mostrarán.

Luego edita `wrangler.toml` y descomenta:

```toml
[[d1_databases]]
binding = "DB"
database_name = "medin-play-db"
database_id = "PEGA_AQUI_TU_DATABASE_ID"
```

---

## 📋 Paso 4: Configurar Almacenamiento R2

```bash
npm run r2:create
```

Esto creará un bucket llamado `medin-play-assets`.

Edita `wrangler.toml` y descomenta:

```toml
[[r2_buckets]]
binding = "BUCKET"
bucket_name = "medin-play-assets"
```

---

## 📋 Paso 5: Deploy a Cloudflare Pages

### Deploy de Desarrollo (Preview)
```bash
npm run deploy
```

Esto subirá tu proyecto a una URL temporal de preview.

### Deploy a Producción
```bash
npm run deploy:prod
```

Esto desplegará en la rama `main` y estará disponible en:
- **Producción**: `https://medin-play.pages.dev`
- **Preview**: `https://<commit-hash>.medin-play.pages.dev`

---

## 🔧 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo local (Vite) |
| `npm run build` | Compilar para producción |
| `npm run preview` | Vista previa local del build |
| `npm run deploy` | Deploy a Cloudflare Pages (preview) |
| `npm run deploy:prod` | Deploy a producción (rama main) |
| `npm run wrangler:login` | Autenticar con Cloudflare |
| `npm run wrangler:whoami` | Verificar usuario autenticado |
| `npm run d1:create` | Crear base de datos D1 |
| `npm run r2:create` | Crear bucket R2 |
| `npm run pages:project:create` | Crear proyecto Pages |

---

## 🎯 Flujo de Trabajo Recomendado

### Para cada cambio que quieras verificar:

1. **Haz tus cambios** en el código
2. **Ejecuta**: `npm run deploy`
3. **Recibe una URL** de preview tipo: `https://abc123def.medin-play.pages.dev`
4. **Verifica los cambios** en esa URL
5. Si todo está bien, haz **merge a main** y ejecuta: `npm run deploy:prod`

---

## 🔗 Integración con GitHub (Opcional pero Recomendado)

Para deploys automáticos:

1. Conecta tu repositorio GitHub a Cloudflare Pages
2. Configura el build:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. Cada push a `main` desplegará automáticamente

---

## ⚙️ Variables de Entorno en Cloudflare

Configura estas variables en el dashboard de Cloudflare Pages:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `ENVIRONMENT` | `production` | Entorno actual |
| `APP_NAME` | `Medin Play` | Nombre de la app |
| `D1_DATABASE_ID` | *(tu database_id)* | ID de la BD D1 |
| `R2_BUCKET_NAME` | `medin-play-assets` | Nombre del bucket |

---

## 📱 APK en R2

Una vez tengas R2 configurado:

1. Sube tu APK al bucket:
```bash
wrangler r2 object put medin-play-assets/apk/medin-play-v1.apk --file=./path/to/app.apk
```

2. Hazlo público o genera URLs firmadas para descarga

---

## 🐛 Solución de Problemas

### Error: "Not authenticated"
```bash
npm run wrangler:login
```

### Error: "Project already exists"
Elige otro nombre en `wrangler.toml` o usa el dashboard para eliminar el proyecto existente.

### Error: "Build failed"
Verifica que `npm run build` funcione localmente primero.

---

## 📊 Monitoreo

Una vez desplegado:
- Ve al dashboard de Cloudflare Pages
- Selecciona tu proyecto `medin-play`
- Revisa: **Deployments**, **Analytics**, **Settings**

---

## ✨ ¡Listo!

Ahora cada vez que ejecutes `npm run deploy`, tendrás una URL única para verificar tus cambios antes de llevarlos a producción.

**URLs típicas:**
- Preview: `https://<commit-hash>-medin-play.cloudflareapps.com`
- Producción: `https://medin-play.pages.dev`
