-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    pin_adult TEXT DEFAULT '0000',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Contenido (Películas, Series, IPTV, Radio)
CREATE TABLE IF NOT EXISTS content (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT CHECK(type IN ('movie', 'series', 'iptv', 'radio')) NOT NULL,
    category TEXT NOT NULL,
    poster_url TEXT,
    stream_url TEXT NOT NULL,
    is_adult BOOLEAN DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Banners Publicitarios (Cada 4 elementos)
CREATE TABLE IF NOT EXISTS banners (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    target_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    position_index INTEGER DEFAULT 4,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para Gestión de Versiones del APK
CREATE TABLE IF NOT EXISTS app_versions (
    id TEXT PRIMARY KEY,
    version_code TEXT NOT NULL,
    apk_file_url TEXT NOT NULL,
    release_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Favoritos e Historial de Usuarios
CREATE TABLE IF NOT EXISTS user_favorites (
    user_id TEXT REFERENCES users(id),
    content_id TEXT REFERENCES content(id),
    PRIMARY KEY (user_id, content_id)
);

CREATE TABLE IF NOT EXISTS user_history (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    content_id TEXT REFERENCES content(id),
    last_position_seconds INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);