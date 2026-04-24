import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = 'https://wdqjjwfsrylsjoevkpoi.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkcWpqd2Zzcnlsc2pvZXZrcG9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMjU3MjcsImV4cCI6MjA5MjYwMTcyN30.ENY8SsObKnz4uxonZqhZ73sr4D9tY4Xv498hcq5x010'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)
