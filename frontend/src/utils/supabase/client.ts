import { createBrowserClient } from '@supabase/ssr'

function getValidUrl(url?: string): string {
  if (url && (url.startsWith('http://') || url.startsWith('https://')) && !url.includes('placeholder')) {
    return url
  }
  return 'https://ueybwjekfxxoyqjisfsj.supabase.co'
}

function getValidKey(key?: string): string {
  if (key && key.length > 20 && !key.includes('placeholder') && !key.includes('[SENSITIVE]')) {
    return key
  }
  return 'sb_publishable_KIyib5jaW95brAa2OZne8Q_LVGhYlAV'
}

const SUPABASE_URL = getValidUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)
const SUPABASE_ANON_KEY = getValidKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export function createClient() {
  return createBrowserClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  )
}
