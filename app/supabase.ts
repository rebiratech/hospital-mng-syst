import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://smkkboikidmocaxvtcap.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNta2tib2lraWRtb2NheHZ0Y2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3MzA4NjAsImV4cCI6MjEwNzMwNjg2MH0.RIiiL9FBOypnaX-DMCV0guUc5rghts2unm-sKABEKWY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)