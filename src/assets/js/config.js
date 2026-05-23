const fallbackConfig = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  STORAGE_BUCKET: import.meta.env.VITE_STORAGE_BUCKET || 'Carousel',
}

async function loadRuntimeConfig() {
  try {
    const response = await fetch('/app-config.json', { cache: 'no-store' })

    if (response.ok) {
      return {
        ...fallbackConfig,
        ...(await response.json()),
      }
    }
  } catch {
    // Local dev can run without a generated runtime config file.
  }

  return fallbackConfig
}

export const appConfig = Object.freeze(await loadRuntimeConfig())

window.APP_CONFIG = appConfig

if (!appConfig.SUPABASE_URL || !appConfig.SUPABASE_ANON_KEY) {
  console.warn('[APP_CONFIG] Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.')
}
