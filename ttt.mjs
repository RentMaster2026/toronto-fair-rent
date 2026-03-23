/**
 * insert-toronto-reddit.mjs
 * Run from ~/toronto-fair-rent/:
 *   node insert-toronto-reddit.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Read .env manually — no dotenv needed
const env = {}
try {
  readFileSync('.env', 'utf8').split('\n').forEach(line => {
    const [k, ...v] = line.split('=')
    if (k && v.length) env[k.trim()] = v.join('=').trim()
  })
} catch {}

const url = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL
const key = env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Could not find VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
  process.exit(1)
}

const supabase = createClient(url, key)
const records = JSON.parse(readFileSync('./toronto_reddit_inserts.json', 'utf8'))

console.log(`Inserting ${records.length} records...`)

const BATCH = 10
let inserted = 0, failed = 0

for (let i = 0; i < records.length; i += BATCH) {
  const rows = records.slice(i, i + BATCH).map(r => ({
    city:               r.city,
    neighborhood:       r.neighborhood,
    unit_type:          r.unit_type,
    monthly_rent:       r.monthly_rent,
    move_in_year:       r.move_in_year,
    includes_parking:   r.includes_parking,
    includes_utilities: r.includes_utilities,
  }))

  const { error } = await supabase.from('rent_submissions').insert(rows)

  if (error) {
    console.error(`Batch ${Math.floor(i/BATCH)+1} failed:`, error.message)
    failed += rows.length
  } else {
    inserted += rows.length
    console.log(`Batch ${Math.floor(i/BATCH)+1}: OK — ${inserted}/${records.length} inserted`)
  }

  await new Promise(r => setTimeout(r, 200))
}

console.log(`\nDone. Inserted: ${inserted}  Failed: ${failed}`)

// Show new counts by neighbourhood
const { data } = await supabase
  .from('rent_submissions')
  .select('neighborhood')
  .eq('city', 'toronto')

if (data) {
  const tally = {}
  data.forEach(r => { tally[r.neighborhood] = (tally[r.neighborhood] || 0) + 1 })
  console.log('\nToronto submissions by neighbourhood (all time):')
  Object.entries(tally).sort((a,b) => b[1]-a[1])
    .forEach(([n,c]) => console.log(`  ${n.padEnd(28)} ${c}`))
}
