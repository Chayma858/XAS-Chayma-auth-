import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const supabaseURL = 'https://jmpytjdjpmgboafrazeb.supabase.co'
const supabseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptcHl0amRqcG1nYm9hZnJhemViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0OTgwMjEsImV4cCI6MjA4NjA3NDAyMX0.lFnU16pfv8D6YFhPRTpf0yXrVF4_qCVuqU3RrliJsp4'

const supabase =createClient(supabaseURL,supabseKey)

export default supabase