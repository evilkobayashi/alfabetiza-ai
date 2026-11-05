-- ============================================================================
-- MIGRAÇÃO DE CONFORMIDADE LGPD (Lei 13.709/2018), ECA DIGITAL (Lei 15.211/2025)
-- E DIREITO AO ESQUECIMENTO (Art. 18, VI) — ALFABETIZA AÍ
-- Data: 05/11/2026
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.lgpd_consent_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NULL,
    email TEXT NULL,
    product_name TEXT NOT NULL DEFAULT 'Alfabetiza AÍ',
    age_verified_18_or_guardian BOOLEAN NOT NULL DEFAULT true,
    terms_accepted BOOLEAN NOT NULL DEFAULT true,
    privacy_accepted BOOLEAN NOT NULL DEFAULT true,
    cookie_preference TEXT NOT NULL DEFAULT 'essential',
    consent_version TEXT NOT NULL DEFAULT 'v2.1-2026-11-05',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lgpd_unsubscribes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    product_name TEXT NOT NULL DEFAULT 'Alfabetiza AÍ',
    unsubscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
