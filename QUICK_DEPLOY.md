# 🚀 Quick Deploy - Medin Play a Cloudflare Pages

## ⚡ Deploy Rápido (3 pasos)

### Paso 1: Autentícate con Cloudflare
```bash
npm run wrangler:login
```
*Se abrirá tu navegador para iniciar sesión en Cloudflare*

---

### Paso 2: Crea el proyecto y recursos
```bash
# Crear proyecto Pages
npm run pages:project:create

# Crear base de datos D1
npm run d1:create

# Crear bucket R2 para APKs
npm run r2:create
```

*Guarda los IDs que te muestren (database_id, etc.)*

---

### Paso 3: ¡Deploy!
```bash
# Para verificar cambios (URL temporal)
npm run deploy

# O para producción directa
npm run deploy:prod
```

---

## 🎯 URLs que obtendrás

- **Preview**: `https://<commit-hash>-medin-play.cloudflareapps.com`
- **Producción**: `https://medin-play.pages.dev`

---

## 📝 Flujo de Trabajo Diario

Cada vez que hagas un cambio y quieras verificarlo:

```bash
git add .
git commit -m "Descripción del cambio"
npm run deploy
```

¡Listo! Recibirás una URL única para verificar ese cambio específico.

---

## 🔗 Comandos Útiles

| Para... | Ejecuta |
|---------|---------|
| Verificar autenticación | `npm run wrangler:whoami` |
| Build local | `npm run build` |
| Preview local | `npm run preview` |
| Deploy preview | `npm run deploy` |
| Deploy producción | `npm run deploy:prod` |

---

## ✨ ¡Eso es todo!

Ahora puedes hacer cambios y verificarlos al instante en Cloudflare Pages.

**¿Problemas?** Revisa `CLOUDFLARE_PAGES_SETUP.md` para la guía completa.
