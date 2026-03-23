/**
 * insert-toronto-reddit.js
 * 
 * Run from any of the city repo directories where .env exists:
 *   node insert-toronto-reddit.js
 * 
 * Or set env vars directly:
 *   VITE_SUPABASE_URL=https://xxx.supabase.co \
 *   VITE_SUPABASE_ANON_KEY=your_key \
 *   node insert-toronto-reddit.js
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { config } from 'dotenv'

// Load .env from current directory
config()

const url = process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
  console.error('Run from a project directory that has a .env file, or set the vars manually.')
  process.exit(1)
}

const supabase = createClient(url, key)

const records = JSON.parse(readFileSync('./toronto_reddit_inserts.json', 'utf8'))

console.log(`Inserting ${records.length} records into rent_submissions...`)
console.log()

// Insert in batches of 10 to avoid rate limits
const BATCH = 10
let inserted = 0
let failed = 0

for (let i = 0; i < records.length; i += BATCH) {
  const batch = records.slice(i, i + BATCH)
  
  // Remove source field if column doesn't exist in your schema
  // If you want to keep it for tracking, add a "source" text column to rent_submissions first
  const rows = batch.map(r => ({
    city:               r.city,
    neighborhood:       r.neighborhood,
    unit_type:          r.unit_type,
    monthly_rent:       r.monthly_rent,
    move_in_year:       r.move_in_year,
    includes_parking:   r.includes_parking,
    includes_utilities: r.includes_utilities,
  }))

  const { data, error } = await supabase
    .from('rent_submissions')
    .insert(rows)

  if (error) {
    console.error(`Batch ${Math.floor(i/BATCH)+1} error:`, error.message)
    failed += batch.length
  } else {
    inserted += batch.length
    console.log(`Batch ${Math.floor(i/BATCH)+1}: inserted ${batch.length} records (${inserted}/${records.length} total)`)
  }

  // Small delay between batches
  await new Promise(r => setTimeout(r, 200))
}

console.log()
console.log(`Done. Inserted: ${inserted}  Failed: ${failed}`)
console.log()

// Verify counts by neighbourhood
const { data: counts } = await supabase
  .from('rent_submissions')
  .select('neighborhood', { count: 'exact', head: false })
  .eq('city', 'toronto')

if (counts) {
  const tally = {}
  counts.forEach(r => { tally[r.neighborhood] = (tally[r.neighborhood] || 0) + 1 })
  console.log('Toronto submission counts by neighbourhood (all time):')
  Object.entries(tally).sort((a,b) => b[1]-a[1]).forEach(([n,c]) => {
    console.log(`  ${n.padEnd(25)} ${c}`)
  })
}
