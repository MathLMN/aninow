
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

const supabaseUrl = 'https://ddbxghuhjssguklrdrkp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkYnhnaHVoanNzZ3VrbHJkcmtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNDg5ODIsImV4cCI6MjA2NzcyNDk4Mn0.K_2Afby3TV9bfnC3WxHYvzEBfikrnV-J6nr0BpRE--Y'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
