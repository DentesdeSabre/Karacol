import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!url || !serviceRole) {
  // require env vars to be set in production
}

export const supabaseAdmin = createClient(url, serviceRole)

export default supabaseAdmin
