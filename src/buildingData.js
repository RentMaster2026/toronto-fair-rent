// buildingData.js
// Toronto building seed database for the FairRent Canada rent calculator,
// submission flow, and building ranking pages.
//
// This is a seed list, not a complete index of every rental building in Toronto.
// The submission form must always let renters choose:
//   - Other building or address
//   - I prefer not to say
//
// Privacy thresholds:
//   MIN_SUBS_FOR_AVG   = 3   minimum to show a grouped average
//   MIN_SUBS_FOR_SCORE = 5   minimum to publish a building score
//   MIN_SUBS_FOR_MED   = 8   medium confidence label
//   MIN_SUBS_FOR_HIGH  = 20  high confidence label
//
// Schema note: the Supabase rent_submissions table needs a building_name text
// column for building-level aggregation to work. Until that migration runs,
// the BUILDING_COLUMN_READY flag in App.jsx stays false and building names
// are collected in the UI but not sent to the database.

export const MIN_SUBS_FOR_AVG   = 3;
export const MIN_SUBS_FOR_SCORE = 5;
export const MIN_SUBS_FOR_MED   = 8;
export const MIN_SUBS_FOR_HIGH  = 20;

// ─── Neighbourhood groups (canonical building-side labels) ────────────────────
//
// These map back to a TORONTO_HOODS key so the score engine and hood ranking
// pages keep working. Several building-side neighbourhoods may share a hood
// key because our market-rent benchmarks only break down at the broader
// hood level today.

export const TORONTO_NEIGHBOURHOODS = {
  "downtown":               { name: "Downtown",                hoodKey: "stlawrence" },
  "financial-district":     { name: "Financial District",      hoodKey: "stlawrence" },
  "entertainment-district": { name: "Entertainment District",  hoodKey: "kingwest" },
  "king-west":              { name: "King West",               hoodKey: "kingwest" },
  "queen-west":             { name: "Queen West",              hoodKey: "queenswest" },
  "fashion-district":       { name: "Fashion District",        hoodKey: "queenswest" },
  "cityplace":              { name: "CityPlace",               hoodKey: "harbourfront" },
  "harbourfront":           { name: "Harbourfront",            hoodKey: "harbourfront" },
  "waterfront":             { name: "Waterfront",              hoodKey: "harbourfront" },
  "st-lawrence":            { name: "St. Lawrence",            hoodKey: "stlawrence" },
  "corktown":               { name: "Corktown",                hoodKey: "stlawrence" },
  "distillery":             { name: "Distillery District",     hoodKey: "distillery" },
  "regent-park":            { name: "Regent Park",             hoodKey: "cabbagetown" },
  "cabbagetown":            { name: "Cabbagetown",             hoodKey: "cabbagetown" },
  "church-wellesley":       { name: "Church-Wellesley",        hoodKey: "cabbagetown" },
  "bay-street":             { name: "Bay Street Corridor",     hoodKey: "yorkville" },
  "yorkville":              { name: "Yorkville",               hoodKey: "yorkville" },
  "annex":                  { name: "Annex",                   hoodKey: "annex" },
  "university":             { name: "University",              hoodKey: "annex" },
  "kensington":             { name: "Kensington Market",       hoodKey: "kensingtonmarket" },
  "little-italy":           { name: "Little Italy",            hoodKey: "queenswest" },
  "trinity-bellwoods":      { name: "Trinity Bellwoods",       hoodKey: "queenswest" },
  "liberty-village":        { name: "Liberty Village",         hoodKey: "libertyvillage" },
  "fort-york":              { name: "Fort York",               hoodKey: "harbourfront" },
  "parkdale":               { name: "Parkdale",                hoodKey: "parkdale" },
  "roncesvalles":           { name: "Roncesvalles",            hoodKey: "roncesvalles" },
  "high-park":              { name: "High Park",               hoodKey: "roncesvalles" },
  "junction":               { name: "Junction",                hoodKey: "roncesvalles" },
  "bloor-west":             { name: "Bloor West Village",      hoodKey: "roncesvalles" },
  "midtown":                { name: "Midtown",                 hoodKey: "midtown" },
  "yonge-eglinton":         { name: "Yonge and Eglinton",      hoodKey: "midtown" },
  "davisville":             { name: "Davisville",              hoodKey: "midtown" },
  "mount-pleasant":         { name: "Mount Pleasant",          hoodKey: "midtown" },
  "yonge-st-clair":         { name: "Yonge and St. Clair",     hoodKey: "midtown" },
  "forest-hill":            { name: "Forest Hill",             hoodKey: "foresthill" },
  "cedarvale":              { name: "Cedarvale",               hoodKey: "foresthill" },
  "leaside":                { name: "Leaside",                 hoodKey: "midtown" },
  "east-york":              { name: "East York",               hoodKey: "eastyork" },
  "danforth":               { name: "Danforth",                hoodKey: "eastyork" },
  "beaches":                { name: "Beaches",                 hoodKey: "leslieville" },
  "leslieville":            { name: "Leslieville",             hoodKey: "leslieville" },
  "scarborough":            { name: "Scarborough",             hoodKey: "scarborough" },
  "scarborough-centre":     { name: "Scarborough Town Centre", hoodKey: "scarborough" },
  "agincourt":              { name: "Agincourt",               hoodKey: "scarborough" },
  "malvern":                { name: "Malvern",                 hoodKey: "scarborough" },
  "west-hill":              { name: "West Hill",               hoodKey: "scarborough" },
  "guildwood":              { name: "Guildwood",               hoodKey: "scarborough" },
  "north-york":             { name: "North York",              hoodKey: "northyork" },
  "yonge-sheppard":         { name: "Yonge and Sheppard",      hoodKey: "northyork" },
  "yonge-finch":            { name: "Yonge and Finch",         hoodKey: "northyork" },
  "bayview-village":        { name: "Bayview Village",         hoodKey: "northyork" },
  "don-mills":              { name: "Don Mills",               hoodKey: "northyork" },
  "downsview":              { name: "Downsview",               hoodKey: "northyork" },
  "yorkdale":               { name: "Yorkdale",                hoodKey: "northyork" },
  "york-university":        { name: "York University Heights", hoodKey: "northyork" },
  "etobicoke":              { name: "Etobicoke",               hoodKey: "etobicoke" },
  "islington":              { name: "Islington",               hoodKey: "etobicoke" },
  "kipling":                { name: "Kipling",                 hoodKey: "etobicoke" },
  "mimico":                 { name: "Mimico",                  hoodKey: "etobicoke" },
  "humber-bay":             { name: "Humber Bay Shores",       hoodKey: "etobicoke" },
  "long-branch":            { name: "Long Branch",             hoodKey: "etobicoke" },
  "rexdale":                { name: "Rexdale",                 hoodKey: "etobicoke" },
  "queensway":              { name: "The Queensway",           hoodKey: "etobicoke" },
};

// ─── Building seed list ───────────────────────────────────────────────────────
//
// Fields:
//   id            stable kebab-case slug
//   name          canonical display name
//   aliases       common alternate names / address forms — boost search recall
//   neighbourhood key from TORONTO_NEIGHBOURHOODS above
//   address       street address if known, otherwise null
//   type          "purpose-built" | "condo" | "student" | "townhouse" | "heritage" | "other"
//   priority      "high" | "medium" | "low"
//   sourceType    "verified" | "partial" | "unverified"

export const TORONTO_BUILDINGS = [

  // ─── King West / Entertainment District / Fashion District ─────────────────
  { id: "the-well",              name: "The Well",                       aliases: ["The Well Residences", "FourFifty The Well", "450 Front West", "470 Front West"], neighbourhood: "king-west",  address: "450 Front Street West", type: "purpose-built", priority: "high",   sourceType: "verified" },
  { id: "minto-775-king-west",   name: "Minto 775 King West",            aliases: ["775 King West"],                                                                neighbourhood: "king-west",  address: "775 King Street West",  type: "purpose-built", priority: "high",   sourceType: "verified" },
  { id: "minto-westside",        name: "Minto Westside",                 aliases: ["576 Front Street West", "576 Front West"],                                       neighbourhood: "king-west",  address: "576 Front Street West", type: "purpose-built", priority: "high",   sourceType: "verified" },
  { id: "king-portland-centre",  name: "King Portland Centre",           aliases: ["602 King West"],                                                                 neighbourhood: "king-west",  address: "602 King Street West",  type: "condo",         priority: "high",   sourceType: "verified" },
  { id: "fashion-house",         name: "Fashion House",                  aliases: ["560 King West"],                                                                 neighbourhood: "fashion-district", address: "560 King Street West", type: "condo", priority: "high", sourceType: "verified" },
  { id: "seventy5-portland",     name: "Seventy5 Portland",              aliases: ["75 Portland"],                                                                   neighbourhood: "king-west",  address: "75 Portland Street",    type: "condo",         priority: "medium", sourceType: "verified" },
  { id: "m5v",                   name: "M5V",                            aliases: ["375 King West"],                                                                 neighbourhood: "king-west",  address: "375 King Street West",  type: "condo",         priority: "high",   sourceType: "verified" },
  { id: "the-mercer",            name: "The Mercer",                     aliases: ["8 Mercer"],                                                                      neighbourhood: "entertainment-district", address: "8 Mercer Street", type: "condo",  priority: "high",   sourceType: "verified" },
  { id: "the-bond",              name: "The Bond",                       aliases: ["290 Adelaide West"],                                                             neighbourhood: "entertainment-district", address: "290 Adelaide Street West", type: "condo", priority: "medium", sourceType: "verified" },
  { id: "studio-condos",         name: "Studio Condos",                  aliases: ["199 Richmond West"],                                                             neighbourhood: "entertainment-district", address: "199 Richmond Street West", type: "condo", priority: "medium", sourceType: "verified" },
  { id: "the-picasso",           name: "The Picasso",                    aliases: ["318 Richmond West"],                                                             neighbourhood: "entertainment-district", address: "318 Richmond Street West", type: "condo", priority: "medium", sourceType: "verified" },
  { id: "tableau",               name: "Tableau",                        aliases: ["125 Peter"],                                                                     neighbourhood: "entertainment-district", address: "125 Peter Street", type: "condo", priority: "medium", sourceType: "verified" },
  { id: "peter-street-condos",   name: "Peter Street Condos",            aliases: ["101 Peter", "87 Peter"],                                                         neighbourhood: "entertainment-district", address: "101 Peter Street", type: "condo", priority: "medium", sourceType: "partial" },
  { id: "the-king-charlotte",    name: "The King Charlotte",             aliases: ["11 Charlotte"],                                                                  neighbourhood: "entertainment-district", address: "11 Charlotte Street", type: "condo", priority: "medium", sourceType: "verified" },
  { id: "charlie-condos",        name: "Charlie Condos",                 aliases: ["8 Charlotte"],                                                                   neighbourhood: "entertainment-district", address: "8 Charlotte Street", type: "condo", priority: "medium", sourceType: "verified" },
  { id: "victory-condos",        name: "Victory Condos",                 aliases: ["478 King West"],                                                                 neighbourhood: "king-west",  address: "478 King Street West",  type: "condo",         priority: "medium", sourceType: "partial" },
  { id: "sixty-colborne",        name: "Sixty Colborne",                 aliases: ["60 Colborne"],                                                                   neighbourhood: "st-lawrence", address: "60 Colborne Street",  type: "condo",         priority: "medium", sourceType: "verified" },
  { id: "theatre-park",          name: "Theatre Park",                   aliases: ["224 King West"],                                                                 neighbourhood: "entertainment-district", address: "224 King Street West", type: "condo", priority: "medium", sourceType: "verified" },
  { id: "festival-tower",        name: "Festival Tower",                 aliases: ["80 John"],                                                                       neighbourhood: "entertainment-district", address: "80 John Street", type: "condo", priority: "medium", sourceType: "verified" },

  // ─── Queen West / Trinity Bellwoods ─────────────────────────────────────────
  { id: "the-taylor",            name: "The Taylor",                     aliases: ["The Taylor Apartments", "57 Spadina", "The Taylor at Queen West"],               neighbourhood: "queen-west", address: "57 Spadina Avenue",     type: "purpose-built", priority: "high",   sourceType: "verified" },
  { id: "the-brixton",           name: "The Brixton",                    aliases: ["The Brixton Toronto", "Queen and Dufferin"],                                     neighbourhood: "parkdale",   address: null,                    type: "purpose-built", priority: "medium", sourceType: "partial" },
  { id: "the-morgan",            name: "The Morgan",                     aliases: ["438 Richmond West"],                                                             neighbourhood: "queen-west", address: "438 Richmond Street West", type: "condo",      priority: "medium", sourceType: "verified" },
  { id: "the-hudson",            name: "The Hudson",                     aliases: ["438 King West"],                                                                 neighbourhood: "king-west",  address: "438 King Street West",  type: "condo",         priority: "medium", sourceType: "verified" },
  { id: "edge-on-triangle",      name: "Edge on Triangle Park",          aliases: ["36 Lisgar"],                                                                     neighbourhood: "trinity-bellwoods", address: "36 Lisgar Street", type: "condo", priority: "medium", sourceType: "verified" },
  { id: "68-abell",              name: "68 Abell",                       aliases: [],                                                                                neighbourhood: "trinity-bellwoods", address: "68 Abell Street", type: "purpose-built", priority: "medium", sourceType: "partial" },
  { id: "westside-gallery-lofts",name: "Westside Gallery Lofts",         aliases: ["150 Sudbury"],                                                                   neighbourhood: "trinity-bellwoods", address: "150 Sudbury Street", type: "condo", priority: "medium", sourceType: "verified" },
  { id: "bohemian-embassy",      name: "The Bohemian Embassy",           aliases: ["1169 Queen West"],                                                               neighbourhood: "queen-west", address: "1169 Queen Street West", type: "condo",        priority: "medium", sourceType: "verified" },
  { id: "the-curve",             name: "The Curve",                      aliases: ["170 Sudbury"],                                                                   neighbourhood: "trinity-bellwoods", address: "170 Sudbury Street", type: "condo", priority: "medium", sourceType: "verified" },
  { id: "the-carnaby",           name: "The Carnaby",                    aliases: ["Carnaby Row", "20 Minowan Miikan"],                                              neighbourhood: "trinity-bellwoods", address: "20 Minowan Miikan Lane", type: "condo", priority: "medium", sourceType: "verified" },
  { id: "the-bridge",            name: "The Bridge",                     aliases: ["38 Joe Shuster"],                                                                neighbourhood: "trinity-bellwoods", address: "38 Joe Shuster Way", type: "condo", priority: "medium", sourceType: "verified" },

  // ─── Liberty Village / Fort York ────────────────────────────────────────────
  { id: "liberty-village-east-39", name: "39 East Liberty",              aliases: ["Liberty House"],                                                                 neighbourhood: "liberty-village", address: "39 East Liberty Street", type: "condo", priority: "high", sourceType: "verified" },
  { id: "liberty-village-east-49", name: "49 East Liberty",              aliases: [],                                                                                neighbourhood: "liberty-village", address: "49 East Liberty Street", type: "condo", priority: "high", sourceType: "verified" },
  { id: "liberty-village-east-59", name: "59 East Liberty",              aliases: [],                                                                                neighbourhood: "liberty-village", address: "59 East Liberty Street", type: "condo", priority: "high", sourceType: "verified" },
  { id: "150-east-liberty",      name: "150 East Liberty",               aliases: [],                                                                                neighbourhood: "liberty-village", address: "150 East Liberty Street", type: "condo", priority: "high", sourceType: "verified" },
  { id: "liberty-central",       name: "Liberty Central",                aliases: ["51 East Liberty"],                                                               neighbourhood: "liberty-village", address: "51 East Liberty Street", type: "condo", priority: "high", sourceType: "verified" },
  { id: "liberty-market-tower",  name: "Liberty Market Tower",           aliases: ["135 East Liberty"],                                                              neighbourhood: "liberty-village", address: "135 East Liberty Street", type: "condo", priority: "high", sourceType: "verified" },
  { id: "tower-at-king-west",    name: "The Tower at King West",         aliases: ["125 Western Battery"],                                                           neighbourhood: "liberty-village", address: "125 Western Battery Road", type: "condo", priority: "high", sourceType: "verified" },
  { id: "100-western-battery",   name: "100 Western Battery",            aliases: [],                                                                                neighbourhood: "liberty-village", address: "100 Western Battery Road", type: "condo", priority: "medium", sourceType: "partial" },
  { id: "dna-condos",            name: "DNA Condos",                     aliases: ["1 Shaw", "1005 King West"],                                                      neighbourhood: "liberty-village", address: "1 Shaw Street",          type: "condo", priority: "high", sourceType: "verified" },
  { id: "king-west-village",     name: "King West Village",              aliases: [],                                                                                neighbourhood: "liberty-village", address: null,                     type: "condo", priority: "medium", sourceType: "partial" },
  { id: "garrison-point",        name: "Garrison Point",                 aliases: ["30 Ordnance", "50 Ordnance"],                                                    neighbourhood: "fort-york",       address: "30 Ordnance Street",     type: "condo", priority: "high", sourceType: "verified" },
  { id: "fort-york-apts",        name: "Fort York Apartments",           aliases: ["170 Fort York", "215 Fort York", "219 Fort York", "231 Fort York"],              neighbourhood: "fort-york",       address: "170 Fort York Boulevard",type: "purpose-built", priority: "medium", sourceType: "partial" },
  { id: "15-iceboat",            name: "15 Iceboat",                     aliases: [],                                                                                neighbourhood: "fort-york",       address: "15 Iceboat Terrace",     type: "condo", priority: "medium", sourceType: "verified" },
  { id: "151-dan-leckie",        name: "151 Dan Leckie",                 aliases: [],                                                                                neighbourhood: "fort-york",       address: "151 Dan Leckie Way",     type: "condo", priority: "medium", sourceType: "verified" },
  { id: "17-bathurst",           name: "17 Bathurst",                    aliases: ["The Lakeshore"],                                                                  neighbourhood: "fort-york",       address: "17 Bathurst Street",     type: "condo", priority: "medium", sourceType: "verified" },

  // ─── CityPlace ──────────────────────────────────────────────────────────────
  { id: "cityplace-n1",          name: "N1",                             aliases: ["CityPlace N1"],                                                                  neighbourhood: "cityplace", address: null, type: "condo", priority: "high", sourceType: "verified" },
  { id: "cityplace-n2",          name: "N2",                             aliases: ["CityPlace N2"],                                                                  neighbourhood: "cityplace", address: null, type: "condo", priority: "high", sourceType: "verified" },
  { id: "cityplace-neo",         name: "Neo",                            aliases: ["CityPlace Neo"],                                                                 neighbourhood: "cityplace", address: null, type: "condo", priority: "high", sourceType: "verified" },
  { id: "cityplace-montage",     name: "Montage",                        aliases: ["CityPlace Montage"],                                                             neighbourhood: "cityplace", address: null, type: "condo", priority: "high", sourceType: "verified" },
  { id: "cityplace-luna",        name: "Luna",                           aliases: ["CityPlace Luna", "Luna Vista"],                                                  neighbourhood: "cityplace", address: null, type: "condo", priority: "high", sourceType: "verified" },
  { id: "cityplace-parade",      name: "Parade",                         aliases: ["CityPlace Parade", "Parade 2"],                                                  neighbourhood: "cityplace", address: null, type: "condo", priority: "high", sourceType: "verified" },
  { id: "cityplace-quartz",      name: "Quartz",                         aliases: ["CityPlace Quartz"],                                                              neighbourhood: "cityplace", address: null, type: "condo", priority: "high", sourceType: "verified" },
  { id: "cityplace-spectra",     name: "Spectra",                        aliases: ["CityPlace Spectra"],                                                             neighbourhood: "cityplace", address: null, type: "condo", priority: "high", sourceType: "verified" },
  { id: "infinity-condos",       name: "Infinity Condos",                aliases: ["30 Grand Trunk", "35 Mariner"],                                                  neighbourhood: "cityplace", address: "30 Grand Trunk Crescent",  type: "condo", priority: "high", sourceType: "verified" },
  { id: "harbour-view-estates",  name: "Harbour View Estates",           aliases: ["5 Mariner", "10 Navy Wharf"],                                                    neighbourhood: "cityplace", address: "5 Mariner Terrace",        type: "condo", priority: "medium", sourceType: "partial" },

  // ─── Harbourfront / Waterfront ──────────────────────────────────────────────
  { id: "maple-leaf-square",     name: "Maple Leaf Square",              aliases: ["55 Bremner", "65 Bremner"],                                                      neighbourhood: "harbourfront", address: "55 Bremner Boulevard",  type: "condo", priority: "high",   sourceType: "verified" },
  { id: "ice-condos",            name: "Ice Condos",                     aliases: ["12 York", "14 York"],                                                            neighbourhood: "harbourfront", address: "12 York Street",        type: "condo", priority: "high",   sourceType: "verified" },
  { id: "harbour-plaza",         name: "Harbour Plaza",                  aliases: ["88 Harbour", "100 Harbour"],                                                     neighbourhood: "harbourfront", address: "88 Harbour Street",     type: "condo", priority: "high",   sourceType: "verified" },
  { id: "ten-york",              name: "Ten York",                       aliases: ["10 York"],                                                                       neighbourhood: "harbourfront", address: "10 York Street",        type: "condo", priority: "high",   sourceType: "verified" },
  { id: "one-york",              name: "One York",                       aliases: [],                                                                                neighbourhood: "harbourfront", address: "1 York Street",         type: "condo", priority: "medium", sourceType: "partial" },
  { id: "waterclub",             name: "Waterclub",                      aliases: ["8 York", "18 York", "208 Queens Quay", "218 Queens Quay"],                       neighbourhood: "harbourfront", address: "8 York Street",         type: "condo", priority: "high",   sourceType: "verified" },
  { id: "the-riviera",           name: "The Riviera",                    aliases: ["228 Queens Quay", "230 Queens Quay"],                                            neighbourhood: "harbourfront", address: "228 Queens Quay West",  type: "condo", priority: "medium", sourceType: "verified" },
  { id: "queens-quay-terminal",  name: "Queens Quay Terminal",           aliases: ["10 Queens Quay"],                                                                neighbourhood: "harbourfront", address: "10 Queens Quay West",   type: "condo", priority: "medium", sourceType: "verified" },
  { id: "residences-wtc",        name: "Residences of the World Trade Centre", aliases: ["10 Yonge", "33 Bay", "33 Bay Residences"],                                  neighbourhood: "harbourfront", address: "10 Yonge Street",       type: "condo", priority: "medium", sourceType: "verified" },
  { id: "success-tower",         name: "Success Tower",                  aliases: ["16 Harbour", "18 Harbour"],                                                      neighbourhood: "harbourfront", address: "16 Harbour Street",     type: "condo", priority: "medium", sourceType: "verified" },
  { id: "sugar-wharf",           name: "Sugar Wharf",                    aliases: ["95 Lake Shore East", "138 Downes"],                                              neighbourhood: "waterfront",   address: "95 Lake Shore Boulevard East", type: "condo", priority: "high", sourceType: "verified" },
  { id: "lighthouse-east",       name: "Lighthouse East Tower",          aliases: ["20 Richardson"],                                                                 neighbourhood: "waterfront",   address: "20 Richardson Street",  type: "condo", priority: "medium", sourceType: "verified" },
  { id: "lighthouse-west",       name: "Lighthouse West Tower",          aliases: ["15 Lower Jarvis"],                                                               neighbourhood: "waterfront",   address: "15 Lower Jarvis Street", type: "condo", priority: "medium", sourceType: "verified" },
  { id: "queens-wharf",          name: "Queens Wharf Residences",        aliases: ["75 Queens Wharf"],                                                               neighbourhood: "waterfront",   address: "75 Queens Wharf Road",  type: "condo", priority: "medium", sourceType: "verified" },
  { id: "daniels-waterfront",    name: "The Daniels Waterfront",         aliases: ["130 Queens Quay East"],                                                          neighbourhood: "waterfront",   address: "130 Queens Quay East",  type: "condo", priority: "medium", sourceType: "verified" },
  { id: "aqualina",              name: "Aqualina",                       aliases: ["15 Merchants Wharf"],                                                            neighbourhood: "waterfront",   address: "15 Merchants Wharf",    type: "condo", priority: "medium", sourceType: "verified" },
  { id: "aquavista",             name: "Aquavista",                      aliases: ["1 Edgewater"],                                                                   neighbourhood: "waterfront",   address: "1 Edgewater Drive",     type: "condo", priority: "medium", sourceType: "verified" },
  { id: "aquabella",             name: "Aquabella",                      aliases: ["118 Merchants Wharf"],                                                           neighbourhood: "waterfront",   address: "118 Merchants Wharf",   type: "condo", priority: "medium", sourceType: "verified" },
  { id: "monde",                 name: "Monde",                          aliases: ["16 Bonnycastle"],                                                                neighbourhood: "waterfront",   address: "16 Bonnycastle Street", type: "condo", priority: "medium", sourceType: "verified" },

  // ─── St. Lawrence / Corktown ────────────────────────────────────────────────
  { id: "backstage",             name: "Backstage",                      aliases: ["1 The Esplanade"],                                                               neighbourhood: "st-lawrence", address: "1 The Esplanade",        type: "condo", priority: "high",   sourceType: "verified" },
  { id: "l-tower",               name: "L Tower",                        aliases: ["8 The Esplanade"],                                                               neighbourhood: "st-lawrence", address: "8 The Esplanade",        type: "condo", priority: "high",   sourceType: "verified" },
  { id: "berczy",                name: "Berczy",                         aliases: ["55 Front East", "75 The Esplanade"],                                             neighbourhood: "st-lawrence", address: "55 Front Street East",   type: "condo", priority: "medium", sourceType: "verified" },
  { id: "st-lawrence-condos",    name: "St Lawrence Condos",             aliases: ["158 Front East"],                                                                neighbourhood: "st-lawrence", address: "158 Front Street East",  type: "condo", priority: "medium", sourceType: "verified" },
  { id: "time-and-space",        name: "Time and Space",                 aliases: ["177 Front East", "158 Front"],                                                   neighbourhood: "st-lawrence", address: "177 Front Street East",  type: "condo", priority: "medium", sourceType: "verified" },
  { id: "london-on-esplanade",   name: "London on the Esplanade",        aliases: ["1 Scott", "25 The Esplanade"],                                                   neighbourhood: "st-lawrence", address: "1 Scott Street",         type: "condo", priority: "medium", sourceType: "verified" },
  { id: "market-wharf",          name: "Market Wharf",                   aliases: ["1 Market"],                                                                      neighbourhood: "st-lawrence", address: "1 Market Street",        type: "condo", priority: "medium", sourceType: "verified" },
  { id: "axiom-condos",          name: "Axiom Condos",                   aliases: ["Axiom", "460 Adelaide East"],                                                    neighbourhood: "corktown",    address: "460 Adelaide Street East", type: "condo", priority: "medium", sourceType: "verified" },
  { id: "east-united",           name: "East United",                    aliases: ["120 Parliament"],                                                                neighbourhood: "corktown",    address: "120 Parliament Street",  type: "condo", priority: "medium", sourceType: "verified" },
  { id: "ivory-on-adelaide",     name: "Ivory on Adelaide",              aliases: ["400 Adelaide East"],                                                             neighbourhood: "corktown",    address: "400 Adelaide Street East", type: "condo", priority: "medium", sourceType: "verified" },
  { id: "king-plus",             name: "King Plus",                      aliases: ["39 Sherbourne"],                                                                 neighbourhood: "corktown",    address: "39 Sherbourne Street",   type: "condo", priority: "medium", sourceType: "verified" },
  { id: "post-house",            name: "Post House",                     aliases: ["105 George"],                                                                    neighbourhood: "corktown",    address: "105 George Street",      type: "condo", priority: "medium", sourceType: "verified" },
  { id: "vu-condos",             name: "Vu Condos",                      aliases: ["112 George"],                                                                    neighbourhood: "corktown",    address: "112 George Street",      type: "condo", priority: "medium", sourceType: "verified" },
  { id: "mozo",                  name: "Mozo",                           aliases: ["333 Adelaide East"],                                                             neighbourhood: "corktown",    address: "333 Adelaide Street East", type: "condo", priority: "medium", sourceType: "verified" },
  { id: "the-richmond",          name: "The Richmond",                   aliases: ["313 Richmond East"],                                                             neighbourhood: "corktown",    address: "313 Richmond Street East", type: "condo", priority: "medium", sourceType: "verified" },
  { id: "rezen",                 name: "Rezen",                          aliases: ["205 Frederick"],                                                                 neighbourhood: "corktown",    address: "205 Frederick Street",   type: "condo", priority: "medium", sourceType: "verified" },
  { id: "river-city",            name: "River City",                     aliases: ["51 Trolley", "32 Trolley", "47 Lower River"],                                    neighbourhood: "corktown",    address: "51 Trolley Crescent",    type: "condo", priority: "high",   sourceType: "verified" },
  { id: "canary-district",       name: "Canary District",                aliases: ["Canary Park", "Canary Commons", "120 Bayview", "170 Bayview", "180 Mill", "475 Front East"], neighbourhood: "corktown", address: "120 Bayview Avenue", type: "condo", priority: "high",   sourceType: "verified" },
  { id: "wyatt",                 name: "The Wyatt",                      aliases: ["20 Tubman"],                                                                     neighbourhood: "corktown",    address: "20 Tubman Avenue",       type: "condo", priority: "medium", sourceType: "verified" },
  { id: "dueast",                name: "DuEast",                         aliases: ["225 Sumach", "225 Sackville"],                                                   neighbourhood: "regent-park", address: "225 Sumach Street",      type: "condo", priority: "high",   sourceType: "verified" },
  { id: "one-park-place",        name: "One Park Place",                 aliases: ["55 Regent Park", "170 Sumach"],                                                  neighbourhood: "regent-park", address: "55 Regent Park Boulevard", type: "condo", priority: "high",   sourceType: "verified" },
  { id: "one-cole",              name: "One Cole",                       aliases: ["1 Cole", "25 Cole"],                                                             neighbourhood: "regent-park", address: "1 Cole Street",          type: "condo", priority: "medium", sourceType: "verified" },
  { id: "artworks-tower",        name: "Artworks Tower",                 aliases: ["130 River"],                                                                     neighbourhood: "regent-park", address: "130 River Street",       type: "condo", priority: "medium", sourceType: "verified" },
  { id: "riverside-square",      name: "Riverside Square",               aliases: ["15 Baseball Place", "30 Baseball Place"],                                        neighbourhood: "leslieville", address: "15 Baseball Place",      type: "condo", priority: "medium", sourceType: "verified" },
  { id: "broadview-lofts",       name: "Broadview Lofts",                aliases: ["68 Broadview"],                                                                  neighbourhood: "leslieville", address: "68 Broadview Avenue",    type: "condo", priority: "medium", sourceType: "verified" },
  { id: "the-ninety",            name: "The Ninety",                     aliases: ["90 Broadview"],                                                                  neighbourhood: "leslieville", address: "90 Broadview Avenue",    type: "condo", priority: "medium", sourceType: "verified" },

  // ─── Distillery District ────────────────────────────────────────────────────
  { id: "pure-spirit",           name: "Pure Spirit",                    aliases: ["33 Mill"],                                                                       neighbourhood: "distillery", address: "33 Mill Street",         type: "condo", priority: "high",   sourceType: "verified" },
  { id: "clear-spirit",          name: "Clear Spirit",                   aliases: ["70 Distillery Lane"],                                                            neighbourhood: "distillery", address: "70 Distillery Lane",     type: "condo", priority: "high",   sourceType: "verified" },
  { id: "gooderham-condos",      name: "Gooderham Condos",               aliases: ["390 Cherry"],                                                                    neighbourhood: "distillery", address: "390 Cherry Street",      type: "condo", priority: "medium", sourceType: "verified" },

  // ─── Bay Street / Church-Wellesley / Downtown core ─────────────────────────
  { id: "motion",                name: "Motion",                         aliases: ["Motion Apartments", "570 Bay"],                                                  neighbourhood: "bay-street",  address: "570 Bay Street",         type: "purpose-built", priority: "high", sourceType: "verified" },
  { id: "100-wellesley",         name: "100 Wellesley",                  aliases: [],                                                                                neighbourhood: "church-wellesley", address: "100 Wellesley Street East", type: "purpose-built", priority: "medium", sourceType: "verified" },
  { id: "the-parker",            name: "The Parker",                     aliases: ["The Parker Toronto"],                                                            neighbourhood: "yonge-eglinton", address: null,                  type: "purpose-built", priority: "high", sourceType: "verified" },
  { id: "the-saint",             name: "The Saint",                      aliases: ["The Saint Toronto", "89 Church"],                                                neighbourhood: "st-lawrence", address: "89 Church Street",       type: "condo", priority: "high",   sourceType: "verified" },
  { id: "88-scott",              name: "88 Scott",                       aliases: [],                                                                                neighbourhood: "financial-district", address: "88 Scott Street",  type: "condo", priority: "medium", sourceType: "verified" },
  { id: "the-britt",             name: "The Britt",                      aliases: ["The Britt Condos", "955 Bay"],                                                   neighbourhood: "bay-street",  address: "955 Bay Street",         type: "condo", priority: "high",   sourceType: "verified" },
  { id: "1001-bay",              name: "1001 Bay",                       aliases: ["1001 Bay Condos"],                                                               neighbourhood: "bay-street",  address: "1001 Bay Street",        type: "condo", priority: "medium", sourceType: "verified" },
  { id: "u-condos",              name: "U Condos",                       aliases: ["1080 Bay", "65 St Mary"],                                                        neighbourhood: "bay-street",  address: "1080 Bay Street",        type: "condo", priority: "high",   sourceType: "verified" },
  { id: "nicholas-residences",   name: "Nicholas Residences",            aliases: ["75 St Nicholas"],                                                                neighbourhood: "bay-street",  address: "75 St Nicholas Street",  type: "condo", priority: "medium", sourceType: "verified" },
  { id: "casa-condos",           name: "Casa",                           aliases: ["Casa II", "Casa III", "33 Charles", "42 Charles", "50 Charles"],                 neighbourhood: "yorkville",   address: "33 Charles Street East", type: "condo", priority: "high",   sourceType: "verified" },
  { id: "x-condos",              name: "X Condos",                       aliases: ["110 Charles", "X2 Condos", "101 Charles"],                                       neighbourhood: "yorkville",   address: "110 Charles Street East",type: "condo", priority: "high",   sourceType: "verified" },
  { id: "chaz-yorkville",        name: "Chaz Yorkville",                 aliases: ["45 Charles"],                                                                    neighbourhood: "yorkville",   address: "45 Charles Street East", type: "condo", priority: "high",   sourceType: "verified" },
  { id: "minto-yorkville",       name: "Minto Yorkville",                aliases: ["61 Yorkville"],                                                                  neighbourhood: "yorkville",   address: "61 Yorkville Avenue",    type: "purpose-built", priority: "high", sourceType: "verified" },
  { id: "35-hayden",             name: "35 Hayden",                      aliases: ["Bloor Street Neighbourhood"],                                                    neighbourhood: "yorkville",   address: "35 Hayden Street",       type: "condo", priority: "medium", sourceType: "partial" },
  { id: "85-bloor",              name: "85 Bloor",                       aliases: ["85 Bloor Street East"],                                                          neighbourhood: "yorkville",   address: "85 Bloor Street East",   type: "condo", priority: "medium", sourceType: "verified" },
  { id: "crystal-blu",           name: "Crystal Blu",                    aliases: ["21 Balmuto"],                                                                    neighbourhood: "yorkville",   address: "21 Balmuto Street",      type: "condo", priority: "medium", sourceType: "verified" },
  { id: "one-bloor",             name: "One Bloor",                      aliases: ["1 Bloor East"],                                                                  neighbourhood: "yorkville",   address: "1 Bloor Street East",    type: "condo", priority: "high",   sourceType: "verified" },
  { id: "the-selby",             name: "The Selby",                      aliases: ["25 Selby"],                                                                      neighbourhood: "church-wellesley", address: "25 Selby Street",   type: "purpose-built", priority: "high", sourceType: "verified" },
  { id: "via-bloor",             name: "Via Bloor",                      aliases: ["575 Bloor East", "585 Bloor East"],                                              neighbourhood: "church-wellesley", address: "575 Bloor Street East", type: "condo", priority: "high", sourceType: "verified" },
  { id: "rosedale-on-bloor",     name: "Rosedale on Bloor",              aliases: ["395 Bloor East"],                                                                neighbourhood: "church-wellesley", address: "395 Bloor Street East", type: "condo", priority: "medium", sourceType: "verified" },
  { id: "james-cooper-mansion",  name: "James Cooper Mansion",           aliases: ["28 Linden"],                                                                     neighbourhood: "church-wellesley", address: "28 Linden Street",  type: "condo", priority: "medium", sourceType: "verified" },
  { id: "the-james",             name: "The James",                      aliases: ["390 Dufferin"],                                                                  neighbourhood: "parkdale",        address: "390 Dufferin Street", type: "purpose-built", priority: "medium", sourceType: "partial" },
  { id: "the-gloucester",        name: "The Gloucester",                 aliases: ["Gloucester on Yonge", "3 Gloucester"],                                           neighbourhood: "church-wellesley", address: "3 Gloucester Street", type: "condo", priority: "medium", sourceType: "verified" },
  { id: "the-clover",            name: "The Clover",                     aliases: ["595 Yonge"],                                                                     neighbourhood: "church-wellesley", address: "595 Yonge Street",  type: "condo", priority: "medium", sourceType: "verified" },
  { id: "halo-residences",       name: "Halo Residences",                aliases: ["480 Yonge"],                                                                     neighbourhood: "church-wellesley", address: "480 Yonge Street",  type: "condo", priority: "medium", sourceType: "verified" },
  { id: "teahouse-condos",       name: "TeaHouse Condos",                aliases: ["501 Yonge"],                                                                     neighbourhood: "church-wellesley", address: "501 Yonge Street",  type: "condo", priority: "high",   sourceType: "verified" },
  { id: "yc-condos",             name: "YC Condos",                      aliases: ["7 Grenville"],                                                                   neighbourhood: "church-wellesley", address: "7 Grenville Street", type: "condo", priority: "medium", sourceType: "verified" },
  { id: "karma-condos",          name: "Karma Condos",                   aliases: ["15 Grenville"],                                                                  neighbourhood: "church-wellesley", address: "15 Grenville Street", type: "condo", priority: "medium", sourceType: "verified" },
  { id: "aura",                  name: "Aura",                           aliases: ["386 Yonge"],                                                                     neighbourhood: "church-wellesley", address: "386 Yonge Street",  type: "condo", priority: "high",   sourceType: "verified" },
  { id: "college-park",          name: "College Park",                   aliases: ["761 Bay", "763 Bay"],                                                            neighbourhood: "bay-street",  address: "761 Bay Street",         type: "condo", priority: "medium", sourceType: "verified" },
  { id: "burano",                name: "Burano",                         aliases: ["832 Bay"],                                                                       neighbourhood: "bay-street",  address: "832 Bay Street",         type: "condo", priority: "medium", sourceType: "verified" },
  { id: "murano",                name: "Murano",                         aliases: ["37 Grosvenor", "38 Grenville"],                                                  neighbourhood: "bay-street",  address: "37 Grosvenor Street",    type: "condo", priority: "medium", sourceType: "verified" },
  { id: "wellesley-on-the-park", name: "Wellesley on the Park",          aliases: ["11 Wellesley"],                                                                  neighbourhood: "bay-street",  address: "11 Wellesley Street West", type: "condo", priority: "high", sourceType: "verified" },
  { id: "18-maitland-terrace",   name: "18 Maitland Terrace",            aliases: [],                                                                                neighbourhood: "church-wellesley", address: "18 Maitland Terrace", type: "condo", priority: "medium", sourceType: "partial" },
  { id: "massey-tower",          name: "Massey Tower",                   aliases: ["197 Yonge"],                                                                     neighbourhood: "downtown",    address: "197 Yonge Street",       type: "condo", priority: "high",   sourceType: "verified" },
  { id: "pantages-tower",        name: "Pantages Tower",                 aliases: ["210 Victoria"],                                                                  neighbourhood: "downtown",    address: "210 Victoria Street",    type: "condo", priority: "medium", sourceType: "verified" },
  { id: "opus",                  name: "Opus",                           aliases: ["220 Victoria"],                                                                  neighbourhood: "downtown",    address: "220 Victoria Street",    type: "condo", priority: "medium", sourceType: "verified" },
  { id: "axis-condos",           name: "Axis Condos",                    aliases: ["85 Wood"],                                                                       neighbourhood: "downtown",    address: "85 Wood Street",         type: "condo", priority: "medium", sourceType: "verified" },
  { id: "stanley-condos",        name: "Stanley Condos",                 aliases: ["403 Church"],                                                                    neighbourhood: "church-wellesley", address: "403 Church Street",  type: "condo", priority: "medium", sourceType: "verified" },
  { id: "grid-condos",           name: "Grid Condos",                    aliases: ["181 Dundas East"],                                                               neighbourhood: "downtown",    address: "181 Dundas Street East", type: "condo", priority: "medium", sourceType: "verified" },
  { id: "dundas-square-gardens", name: "Dundas Square Gardens",          aliases: ["251 Jarvis"],                                                                    neighbourhood: "downtown",    address: "251 Jarvis Street",      type: "condo", priority: "medium", sourceType: "verified" },
  { id: "social-condos",         name: "Social Condos",                  aliases: ["100 Dalhousie"],                                                                 neighbourhood: "downtown",    address: "100 Dalhousie Street",   type: "condo", priority: "medium", sourceType: "verified" },
  { id: "garden-district-condos",name: "Garden District Condos",         aliases: ["47 Mutual"],                                                                     neighbourhood: "downtown",    address: "47 Mutual Street",       type: "condo", priority: "medium", sourceType: "verified" },
  { id: "max-condos",            name: "Max Condos",                     aliases: ["77 Mutual"],                                                                     neighbourhood: "downtown",    address: "77 Mutual Street",       type: "condo", priority: "medium", sourceType: "verified" },
  { id: "pace-condos",           name: "Pace Condos",                    aliases: ["159 Dundas East"],                                                               neighbourhood: "downtown",    address: "159 Dundas Street East", type: "condo", priority: "medium", sourceType: "verified" },
  { id: "fleur-condos",          name: "Fleur Condos",                   aliases: ["60 Shuter"],                                                                     neighbourhood: "downtown",    address: "60 Shuter Street",       type: "condo", priority: "medium", sourceType: "verified" },

  // ─── Yonge and Eglinton / Midtown / Davisville ──────────────────────────────
  { id: "minto-roehampton",      name: "Minto Roehampton",               aliases: ["150 Roehampton", "The Roe", "The Roehampton"],                                   neighbourhood: "yonge-eglinton", address: "150 Roehampton Avenue", type: "purpose-built", priority: "high", sourceType: "verified" },
  { id: "minto-30-roe",          name: "Minto 30 Roe",                   aliases: ["30 Roehampton"],                                                                 neighbourhood: "yonge-eglinton", address: "30 Roehampton Avenue",  type: "purpose-built", priority: "high", sourceType: "verified" },
  { id: "minto-midtown",         name: "Minto Midtown",                  aliases: ["Quantum", "Quantum North", "Quantum South", "2191 Yonge", "2181 Yonge"],         neighbourhood: "yonge-eglinton", address: "2191 Yonge Street",     type: "purpose-built", priority: "high", sourceType: "verified" },
  { id: "minto-garden-towers",   name: "Minto Garden Towers",            aliases: ["33 Davisville"],                                                                 neighbourhood: "davisville",     address: "33 Davisville Avenue",  type: "purpose-built", priority: "high", sourceType: "verified" },
  { id: "the-republic",          name: "The Republic",                   aliases: ["70 Roehampton"],                                                                 neighbourhood: "yonge-eglinton", address: "70 Roehampton Avenue",  type: "condo",         priority: "medium", sourceType: "verified" },
  { id: "the-dunfield",          name: "The Dunfield",                   aliases: ["Dunfield Apartments", "77 Dunfield"],                                            neighbourhood: "yonge-eglinton", address: "77 Dunfield Avenue",    type: "purpose-built", priority: "medium", sourceType: "verified" },
  { id: "lillian-park",          name: "Lillian Park",                   aliases: ["45 Dunfield"],                                                                   neighbourhood: "yonge-eglinton", address: "45 Dunfield Avenue",    type: "condo",         priority: "medium", sourceType: "verified" },
  { id: "the-montgomery",        name: "The Montgomery",                 aliases: ["Yonge Eglinton Apartments", "Yonge and Eglinton Apartments"],                    neighbourhood: "yonge-eglinton", address: null,                    type: "purpose-built", priority: "medium", sourceType: "partial" },
  { id: "e-condos",              name: "E Condos",                       aliases: ["E2 Condos", "E2 Rentals", "E Central", "8 Eglinton", "8 Eglinton East"],         neighbourhood: "yonge-eglinton", address: "8 Eglinton Avenue East", type: "condo",        priority: "high",   sourceType: "verified" },
  { id: "200-redpath",           name: "200 Redpath",                    aliases: [],                                                                                neighbourhood: "yonge-eglinton", address: "200 Redpath Avenue",    type: "condo",         priority: "medium", sourceType: "verified" },
  { id: "150-redpath",           name: "150 Redpath",                    aliases: [],                                                                                neighbourhood: "yonge-eglinton", address: "150 Redpath Avenue",    type: "condo",         priority: "medium", sourceType: "verified" },
  { id: "160-redpath",           name: "160 Redpath",                    aliases: [],                                                                                neighbourhood: "yonge-eglinton", address: "160 Redpath Avenue",    type: "condo",         priority: "medium", sourceType: "verified" },
  { id: "155-redpath",           name: "155 Redpath",                    aliases: ["155 Redpath Condos"],                                                            neighbourhood: "yonge-eglinton", address: "155 Redpath Avenue",    type: "condo",         priority: "medium", sourceType: "verified" },
  { id: "195-redpath",           name: "195 Redpath",                    aliases: [],                                                                                neighbourhood: "yonge-eglinton", address: "195 Redpath Avenue",    type: "condo",         priority: "medium", sourceType: "verified" },
  { id: "18-erskine",            name: "18 Erskine",                     aliases: [],                                                                                neighbourhood: "yonge-eglinton", address: "18 Erskine Avenue",     type: "condo",         priority: "medium", sourceType: "verified" },
  { id: "101-erskine",           name: "101 Erskine",                    aliases: [],                                                                                neighbourhood: "yonge-eglinton", address: "101 Erskine Avenue",    type: "condo",         priority: "medium", sourceType: "verified" },
  { id: "2221-yonge",            name: "2221 Yonge",                     aliases: ["2221 Yonge Condos"],                                                             neighbourhood: "yonge-eglinton", address: "2221 Yonge Street",     type: "condo",         priority: "medium", sourceType: "verified" },
  { id: "whitehaus",             name: "Whitehaus",                      aliases: ["2360 Yonge"],                                                                    neighbourhood: "yonge-eglinton", address: "2360 Yonge Street",     type: "condo",         priority: "medium", sourceType: "verified" },
  { id: "citylights",            name: "Citylights on Broadway",         aliases: ["99 Broadway"],                                                                   neighbourhood: "yonge-eglinton", address: "99 Broadway Avenue",    type: "condo",         priority: "medium", sourceType: "verified" },
  { id: "art-shoppe-lofts",      name: "Art Shoppe Lofts",               aliases: ["2131 Yonge"],                                                                    neighbourhood: "yonge-eglinton", address: "2131 Yonge Street",     type: "condo",         priority: "medium", sourceType: "verified" },

  // ─── Yonge and St. Clair / Forest Hill ──────────────────────────────────────
  { id: "the-heathview",         name: "The Heathview",                  aliases: ["320 Tweedsmuir"],                                                                neighbourhood: "yonge-st-clair", address: "320 Tweedsmuir Avenue", type: "purpose-built", priority: "high",   sourceType: "verified" },
  { id: "tower-hill",            name: "The Tower Hill",                 aliases: ["222 St Clair"],                                                                  neighbourhood: "yonge-st-clair", address: "222 St Clair Avenue West", type: "purpose-built", priority: "medium", sourceType: "partial" },
  { id: "delisle-court",         name: "Delisle Court",                  aliases: ["40 Delisle"],                                                                    neighbourhood: "yonge-st-clair", address: "40 Delisle Avenue",     type: "purpose-built", priority: "medium", sourceType: "verified" },
  { id: "granite-place",         name: "Granite Place",                  aliases: ["61 St Clair", "63 St Clair"],                                                    neighbourhood: "yonge-st-clair", address: "61 St Clair Avenue West", type: "purpose-built", priority: "medium", sourceType: "verified" },
  { id: "blue-diamond",          name: "Blue Diamond",                   aliases: ["99 Foxbar"],                                                                     neighbourhood: "yonge-st-clair", address: "99 Foxbar Road",        type: "condo",         priority: "medium", sourceType: "verified" },
  { id: "imperial-plaza",        name: "Imperial Plaza",                 aliases: ["The Imperial", "111 St Clair", "111 St Clair West"],                             neighbourhood: "yonge-st-clair", address: "111 St Clair Avenue West", type: "condo",     priority: "high",   sourceType: "verified" },
  { id: "the-forest-hill",       name: "The Forest Hill",                aliases: ["859 Eglinton"],                                                                  neighbourhood: "forest-hill", address: "859 Eglinton Avenue West", type: "purpose-built", priority: "high",  sourceType: "verified" },
  { id: "the-stack",             name: "The Stack",                      aliases: ["730 Hillsdale"],                                                                 neighbourhood: "mount-pleasant", address: "730 Hillsdale Avenue East", type: "purpose-built", priority: "medium", sourceType: "verified" },

  // ─── Annex / University / Bay-Bloor student ─────────────────────────────────
  { id: "the-waverley",          name: "The Waverley",                   aliases: ["The Waverley Toronto", "College and Spadina"],                                   neighbourhood: "university",  address: null,                     type: "purpose-built", priority: "medium", sourceType: "partial" },
  { id: "theory-condos",         name: "Theory Condos",                  aliases: ["Theory Rentals", "203 College"],                                                 neighbourhood: "university",  address: "203 College Street",     type: "condo", priority: "high",   sourceType: "verified" },
  { id: "campusone",             name: "CampusOne",                      aliases: ["253 College"],                                                                   neighbourhood: "university",  address: "253 College Street",     type: "student", priority: "high",   sourceType: "verified" },
  { id: "parkside-student",      name: "Parkside Student Residence",     aliases: ["111 Carlton"],                                                                   neighbourhood: "university",  address: "111 Carlton Street",     type: "student", priority: "high",   sourceType: "verified" },
  { id: "avant-toronto",         name: "Avant Toronto",                  aliases: ["50 Gerrard East"],                                                               neighbourhood: "downtown",    address: "50 Gerrard Street East", type: "student", priority: "high",   sourceType: "verified" },
  { id: "hoem-jarvis",           name: "HOEM on Jarvis",                 aliases: ["HOEM Toronto", "186 Jarvis"],                                                    neighbourhood: "downtown",    address: "186 Jarvis Street",      type: "student", priority: "high",   sourceType: "verified" },
  { id: "the-livmore",           name: "The Livmore",                    aliases: ["The Livmore Bay and Gerrard", "55 Gerrard", "55 Gerrard West"],                  neighbourhood: "bay-street",  address: "55 Gerrard Street West", type: "purpose-built", priority: "high",   sourceType: "verified" },
  { id: "livmore-high-park",     name: "Livmore High Park",              aliases: ["The Livmore High Park"],                                                         neighbourhood: "high-park",   address: null,                     type: "purpose-built", priority: "high",   sourceType: "verified" },

  // ─── Galleria / Dufferin Grove ──────────────────────────────────────────────
  { id: "galleria-on-the-park",  name: "Galleria on the Park",           aliases: ["Galleria 01", "Galleria 02", "Galleria 03", "Galleria Rentals", "Dufferin Grove Village"], neighbourhood: "little-italy", address: null,                  type: "condo", priority: "high",   sourceType: "verified" },
  { id: "foundry-lofts",         name: "Foundry Lofts",                  aliases: ["1100 Lansdowne"],                                                                neighbourhood: "junction",    address: "1100 Lansdowne Avenue",  type: "condo", priority: "medium", sourceType: "verified" },
  { id: "fuse-condos",           name: "Fuse Condos",                    aliases: ["1410 Dupont", "1420 Dupont"],                                                    neighbourhood: "junction",    address: "1410 Dupont Street",     type: "condo", priority: "medium", sourceType: "verified" },

  // ─── High Park / Bloor West / Roncesvalles / Junction ──────────────────────
  { id: "minto-high-park",       name: "Minto High Park Village",        aliases: ["111 Pacific", "High Park Village", "Grenadier Square", "65 High Park", "77 Quebec"], neighbourhood: "high-park", address: "111 Pacific Avenue", type: "purpose-built", priority: "high", sourceType: "verified" },
  { id: "the-crossways",         name: "The Crossways",                  aliases: ["2340 Dundas West", "2360 Dundas West"],                                          neighbourhood: "high-park",   address: "2340 Dundas Street West", type: "purpose-built", priority: "medium", sourceType: "verified" },
  { id: "robert-watson-lofts",   name: "Robert Watson Lofts",            aliases: ["369 Sorauren"],                                                                  neighbourhood: "roncesvalles",address: "369 Sorauren Avenue",     type: "condo", priority: "medium", sourceType: "verified" },
  { id: "howard-park-residences",name: "Howard Park Residences",         aliases: ["38 Howard Park"],                                                                neighbourhood: "roncesvalles",address: "38 Howard Park Avenue",   type: "condo", priority: "medium", sourceType: "verified" },
  { id: "high-park-residences",  name: "High Park Residences",           aliases: ["1830 Bloor West"],                                                               neighbourhood: "bloor-west",  address: "1830 Bloor Street West",  type: "condo", priority: "medium", sourceType: "verified" },
  { id: "junction-house",        name: "Junction House",                 aliases: ["2720 Dundas West"],                                                              neighbourhood: "junction",    address: "2720 Dundas Street West", type: "condo", priority: "medium", sourceType: "verified" },
  { id: "the-keeley",            name: "The Keeley",                     aliases: ["3100 Keele"],                                                                    neighbourhood: "downsview",   address: "3100 Keele Street",       type: "condo", priority: "medium", sourceType: "verified" },
  { id: "stockyards-residences", name: "Stockyards District Residences", aliases: ["Junction Factory", "2306 St Clair West", "2306 St Clair"],                       neighbourhood: "junction",    address: "2306 St Clair Avenue West", type: "condo", priority: "medium", sourceType: "verified" },

  // ─── East End / Danforth / East York / Beaches ──────────────────────────────
  { id: "main-square",           name: "Main Square",                    aliases: ["Main Square Apartments", "177 Main Street", "177 Main"],                         neighbourhood: "danforth",    address: "177 Main Street",          type: "purpose-built", priority: "high",   sourceType: "verified" },
  { id: "crescent-town",         name: "Crescent Town",                  aliases: [],                                                                                neighbourhood: "east-york",   address: null,                       type: "purpose-built", priority: "medium", sourceType: "partial" },
  { id: "massey-square",         name: "Massey Square",                  aliases: [],                                                                                neighbourhood: "east-york",   address: null,                       type: "purpose-built", priority: "medium", sourceType: "partial" },
  { id: "leaside-towers",        name: "Leaside Towers",                 aliases: ["85 Thorncliffe Park", "95 Thorncliffe Park"],                                    neighbourhood: "leaside",     address: "85 Thorncliffe Park Drive", type: "purpose-built", priority: "high",   sourceType: "verified" },
  { id: "minto-skyy",            name: "Minto Skyy",                     aliases: ["1048 Broadview"],                                                                neighbourhood: "east-york",   address: "1048 Broadview Avenue",    type: "purpose-built", priority: "medium", sourceType: "verified" },
  { id: "livlofts",              name: "LivLofts",                       aliases: ["75 The Donway"],                                                                 neighbourhood: "don-mills",   address: "75 The Donway West",       type: "purpose-built", priority: "medium", sourceType: "verified" },
  { id: "reflections",           name: "Reflections Residences",         aliases: ["Don Mills"],                                                                     neighbourhood: "don-mills",   address: null,                       type: "purpose-built", priority: "medium", sourceType: "partial" },
  { id: "sonic-condos",          name: "Sonic Condos",                   aliases: ["2 Sonic Way", "6 Sonic Way"],                                                    neighbourhood: "don-mills",   address: "2 Sonic Way",              type: "condo", priority: "medium", sourceType: "verified" },

  // ─── North York: Yonge-Sheppard / Yonge-Finch / Bayview Village ────────────
  { id: "yonge-sheppard-centre", name: "Yonge Sheppard Centre",          aliases: ["2 Anndale", "5 Sheppard East"],                                                  neighbourhood: "yonge-sheppard", address: "2 Anndale Drive",     type: "condo", priority: "high",   sourceType: "verified" },
  { id: "hullmark-centre",       name: "Hullmark Centre",                aliases: [],                                                                                neighbourhood: "yonge-sheppard", address: "4789 Yonge Street",    type: "condo", priority: "high",   sourceType: "verified" },
  { id: "emerald-park",          name: "Emerald Park",                   aliases: ["9 Bogert", "11 Bogert"],                                                         neighbourhood: "yonge-sheppard", address: "9 Bogert Avenue",      type: "condo", priority: "high",   sourceType: "verified" },
  { id: "avondale",              name: "Avondale",                       aliases: ["80 Harrison Garden", "88 Sheppard", "88 Sheppard East"],                         neighbourhood: "yonge-sheppard", address: "80 Harrison Garden Boulevard", type: "condo", priority: "medium", sourceType: "verified" },
  { id: "minto-gardens",         name: "Minto Gardens",                  aliases: ["Cosmo Residences", "23 Sheppard", "31 Bales", "35 Bales"],                       neighbourhood: "yonge-sheppard", address: "23 Sheppard Avenue East", type: "purpose-built", priority: "high", sourceType: "verified" },
  { id: "meridian",              name: "Meridian",                       aliases: ["15 Greenview", "25 Greenview"],                                                  neighbourhood: "yonge-finch",    address: "15 Greenview Avenue",  type: "condo", priority: "medium", sourceType: "verified" },
  { id: "pulse",                 name: "Pulse",                          aliases: ["5500 Yonge"],                                                                    neighbourhood: "yonge-finch",    address: "5500 Yonge Street",    type: "condo", priority: "medium", sourceType: "verified" },
  { id: "gibson-square",         name: "Gibson Square",                  aliases: ["5162 Yonge", "5168 Yonge"],                                                      neighbourhood: "yonge-sheppard", address: "5162 Yonge Street",    type: "condo", priority: "high",   sourceType: "verified" },
  { id: "princess-place",        name: "Princess Place",                 aliases: ["20 Olive", "26 Olive", "28 Olive"],                                              neighbourhood: "yonge-finch",    address: "20 Olive Avenue",      type: "condo", priority: "medium", sourceType: "verified" },
  { id: "pearl-place",           name: "Pearl Place",                    aliases: ["35 Finch", "Yonge Finch Apartments", "Yonge and Finch Apartments"],              neighbourhood: "yonge-finch",    address: "35 Finch Avenue East", type: "condo", priority: "medium", sourceType: "verified" },
  { id: "the-palm",              name: "The Palm",                       aliases: ["5740 Yonge"],                                                                    neighbourhood: "yonge-finch",    address: "5740 Yonge Street",    type: "condo", priority: "medium", sourceType: "verified" },
  { id: "world-on-yonge",        name: "World on Yonge",                 aliases: ["7161 Yonge"],                                                                    neighbourhood: "yonge-finch",    address: "7161 Yonge Street",    type: "condo", priority: "medium", sourceType: "verified" },
  { id: "parkside-tower",        name: "Parkside Tower",                 aliases: ["7165 Yonge"],                                                                    neighbourhood: "yonge-finch",    address: "7165 Yonge Street",    type: "condo", priority: "medium", sourceType: "verified" },
  { id: "arc-condos",            name: "Arc Condos",                     aliases: ["2885 Bayview"],                                                                  neighbourhood: "bayview-village", address: "2885 Bayview Avenue", type: "condo", priority: "medium", sourceType: "verified" },
  { id: "ny-place",              name: "NY Place",                       aliases: ["17 Kenaston Gardens"],                                                          neighbourhood: "bayview-village", address: "17 Kenaston Gardens", type: "condo", priority: "medium", sourceType: "verified" },
  { id: "concord-park-place",    name: "Concord Park Place",             aliases: ["Discovery", "Omega on the Park", "Opus Concord", "Tango"],                       neighbourhood: "bayview-village", address: null,                  type: "condo", priority: "high",   sourceType: "verified" },
  { id: "emerald-city",          name: "Emerald City",                   aliases: ["Fairview Mall Apartments"],                                                      neighbourhood: "don-mills",    address: null,                    type: "condo", priority: "medium", sourceType: "partial" },
  { id: "tretti-condos",         name: "Tretti Condos",                  aliases: ["30 Tretti"],                                                                     neighbourhood: "downsview",    address: "30 Tretti Way",         type: "condo", priority: "medium", sourceType: "verified" },

  // ─── Scarborough ────────────────────────────────────────────────────────────
  { id: "equinox",               name: "Equinox",                        aliases: ["50 Brian Harrison", "60 Brian Harrison", "Monarch Equinox"],                     neighbourhood: "scarborough-centre", address: "50 Brian Harrison Way", type: "condo", priority: "high", sourceType: "verified" },
  { id: "metrogate",             name: "Metrogate",                      aliases: ["125 Village Green", "135 Village Green", "151 Village Green", "Ventus", "181 Village Green", "Tridel Metrogate"], neighbourhood: "scarborough-centre", address: "125 Village Green Square", type: "condo", priority: "high", sourceType: "verified" },
  { id: "avani",                 name: "Avani",                          aliases: ["255 Village Green", "275 Village Green"],                                        neighbourhood: "scarborough-centre", address: "255 Village Green Square", type: "condo", priority: "medium", sourceType: "verified" },
  { id: "consilium-place",       name: "Consilium Place Apartments",     aliases: [],                                                                                neighbourhood: "scarborough-centre", address: null, type: "purpose-built", priority: "medium", sourceType: "partial" },

  // ─── Etobicoke / Humber Bay Shores ──────────────────────────────────────────
  { id: "bloor-islington-place", name: "Bloor Islington Place",          aliases: ["Islington Terrace", "7 Mabelle", "9 Mabelle", "Mabelle Tower"],                  neighbourhood: "islington",   address: "7 Mabelle Avenue",       type: "condo", priority: "high",   sourceType: "verified" },
  { id: "kip-district",          name: "Kip District",                   aliases: ["20 Thomas Riley", "30 Samuel Wood"],                                             neighbourhood: "kipling",     address: "20 Thomas Riley Road",   type: "condo", priority: "high",   sourceType: "verified" },
  { id: "palace-pier",           name: "Palace Pier",                    aliases: ["1 Palace Pier", "2045 Lake Shore", "2045 Lake Shore Boulevard West"],            neighbourhood: "humber-bay",  address: "2045 Lake Shore Boulevard West", type: "condo", priority: "high", sourceType: "verified" },
  { id: "palace-place",          name: "Palace Place",                   aliases: ["1 Palace Pier Court"],                                                           neighbourhood: "humber-bay",  address: "1 Palace Pier Court",    type: "condo", priority: "high",   sourceType: "verified" },
  { id: "nautilus",              name: "Nautilus",                       aliases: ["16 Brookers Lane"],                                                              neighbourhood: "humber-bay",  address: "16 Brookers Lane",       type: "condo", priority: "medium", sourceType: "verified" },
  { id: "waterscapes",           name: "Waterscapes",                    aliases: ["80 Marine Parade"],                                                              neighbourhood: "humber-bay",  address: "80 Marine Parade Drive", type: "condo", priority: "medium", sourceType: "verified" },
  { id: "ocean-club",            name: "Ocean Club",                     aliases: ["59 Annie Craig", "60 Annie Craig"],                                              neighbourhood: "humber-bay",  address: "59 Annie Craig Drive",   type: "condo", priority: "medium", sourceType: "verified" },
  { id: "lago",                  name: "Lago",                           aliases: ["56 Annie Craig"],                                                                neighbourhood: "humber-bay",  address: "56 Annie Craig Drive",   type: "condo", priority: "medium", sourceType: "verified" },
  { id: "riva-del-lago",         name: "Riva Del Lago",                  aliases: ["110 Marine Parade"],                                                             neighbourhood: "humber-bay",  address: "110 Marine Parade Drive",type: "condo", priority: "medium", sourceType: "verified" },
  { id: "jade-waterfront",       name: "Jade Waterfront",                aliases: ["33 Shore Breeze"],                                                               neighbourhood: "humber-bay",  address: "33 Shore Breeze Drive",  type: "condo", priority: "medium", sourceType: "verified" },
  { id: "eau-du-soleil",         name: "Eau Du Soleil",                  aliases: ["20 Shore Breeze", "30 Shore Breeze"],                                            neighbourhood: "humber-bay",  address: "20 Shore Breeze Drive",  type: "condo", priority: "high",   sourceType: "verified" },
  { id: "vita-on-the-lake",      name: "Vita on the Lake",               aliases: ["70 Annie Craig"],                                                                neighbourhood: "humber-bay",  address: "70 Annie Craig Drive",   type: "condo", priority: "high",   sourceType: "verified" },
  { id: "beyond-the-sea",        name: "Beyond the Sea",                 aliases: ["15 Legion", "2230 Lake Shore"],                                                  neighbourhood: "humber-bay",  address: "15 Legion Road",         type: "condo", priority: "medium", sourceType: "verified" },
  { id: "westlake-village",      name: "Westlake Village",               aliases: ["2200 Lake Shore"],                                                               neighbourhood: "humber-bay",  address: "2200 Lake Shore Boulevard West", type: "condo", priority: "medium", sourceType: "verified" },
  { id: "minto-longbranch",      name: "Minto Longbranch",               aliases: ["Longbranch Apartments"],                                                         neighbourhood: "long-branch", address: null,                     type: "purpose-built", priority: "medium", sourceType: "partial" },

];

// ─── Search and helpers ───────────────────────────────────────────────────────
//
// The search step normalizes both the query and the candidate text:
//   strip diacritics, lowercase, replace runs of non-alphanumeric with a space.
// Then substring-match the normalized query against each building's combined
// searchable text (name + aliases + address + neighbourhood label).

export function normalize(s) {
  if (!s) return "";
  return String(s)
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function priorityWeight(p) {
  return p === "high" ? 3 : p === "medium" ? 2 : 1;
}

function buildSearchableText(b) {
  const hood = TORONTO_NEIGHBOURHOODS[b.neighbourhood];
  return normalize([
    b.name,
    ...(b.aliases || []),
    b.address || "",
    hood?.name || b.neighbourhood,
  ].join(" "));
}

// Search buildings by free-text query. Returns up to `limit` matches.
// If `neighbourhoodKey` is provided, buildings in that neighbourhood are
// boosted to the top. Empty query returns top-priority buildings in the
// selected neighbourhood (or top-priority overall if none selected).
export function searchBuildings(query, neighbourhoodKey, limit = 10) {
  const q = normalize(query);

  if (!q) {
    let pool = TORONTO_BUILDINGS;
    if (neighbourhoodKey) {
      pool = pool.filter(b => b.neighbourhood === neighbourhoodKey);
      if (pool.length === 0) pool = TORONTO_BUILDINGS;
    }
    return [...pool]
      .sort((a, b) => priorityWeight(b.priority) - priorityWeight(a.priority))
      .slice(0, limit);
  }

  const matches = [];
  for (const b of TORONTO_BUILDINGS) {
    const hay = buildSearchableText(b);
    if (!hay.includes(q)) continue;

    let score = priorityWeight(b.priority);
    if (normalize(b.name).startsWith(q)) score += 10;
    if ((b.aliases || []).some(a => normalize(a).startsWith(q))) score += 6;
    if (b.address && normalize(b.address).includes(q)) score += 4;
    if (neighbourhoodKey && b.neighbourhood === neighbourhoodKey) score += 5;

    matches.push({ b, score });
  }

  matches.sort((x, y) => y.score - x.score);
  return matches.slice(0, limit).map(m => m.b);
}

export function getBuildingById(id) {
  return TORONTO_BUILDINGS.find(b => b.id === id) || null;
}

export function getBuildingsForNeighbourhood(key) {
  if (!key) return [];
  return TORONTO_BUILDINGS.filter(b => b.neighbourhood === key);
}

// Resolve the canonical building name string to store in a submission.
// mode: "select" | "other" | "skip" | ""
// id:   building id (when mode === "select")
// text: free-text (when mode === "other")
export function resolveBuildingName(mode, id, text) {
  if (!mode || mode === "skip") return null;
  if (mode === "other") return (text || "").trim() || null;
  if (mode === "select") {
    const b = getBuildingById(id);
    if (!b) return null;
    return b.address ? `${b.name} - ${b.address}` : b.name;
  }
  return null;
}

// ─── Backward-compat for older callers ────────────────────────────────────────
//
// HOOD_NAME_TO_KEY maps the calculator's neighbourhood dropdown values
// (e.g. "Yorkville") to the building-side neighbourhood key (e.g. "yorkville").
// Returns null for hood dropdown values that don't map to a known building
// neighbourhood — in that case the autocomplete shows results from all
// neighbourhoods, ranked by priority.

export const HOOD_NAME_TO_KEY = {
  "Annex":                  "annex",
  "Bloorcourt":             null,
  "Cabbagetown":            "cabbagetown",
  "Chinatown":              null,
  "Davisville":             "davisville",
  "Distillery District":    "distillery",
  "Downtown Core":          "downtown",
  "East End":               "east-york",
  "East York":              "east-york",
  "Etobicoke":              "etobicoke",
  "Forest Hill":            "forest-hill",
  "Greektown":              "danforth",
  "Harbourfront":           "harbourfront",
  "Junction":               "junction",
  "Kensington Market":      "kensington",
  "King West":              "king-west",
  "Lawrence Park":          null,
  "Leaside":                "leaside",
  "Leslieville":            "leslieville",
  "Liberty Village":        "liberty-village",
  "Little Italy":           "little-italy",
  "Midtown":                "midtown",
  "North York":             "north-york",
  "Parkdale":               "parkdale",
  "Queen West":             "queen-west",
  "Riverside":              "leslieville",
  "Roncesvalles":           "roncesvalles",
  "Rosedale":               null,
  "Scarborough":            "scarborough",
  "St. Lawrence":           "st-lawrence",
  "Swansea":                null,
  "Weston":                 null,
  "Willowdale":             "yonge-finch",
  "Yorkville":              "yorkville",
};

// Legacy helper retained for any callers still using the older
// `getBuildingsForHoodName("Yorkville")` pattern.
export function getBuildingsForHoodName(hoodName) {
  if (!hoodName) return [];
  const key = HOOD_NAME_TO_KEY[hoodName];
  if (!key) return [];
  return getBuildingsForNeighbourhood(key);
}

// ─── Building Score Engine ────────────────────────────────────────────────────
//
// FairRent Canada Building Score is out of 100.
// Categories and weights:
//   1. Rent fairness          35 pts
//   2. Value for location     15 pts
//   3. Building features      15 pts
//   4. Market competitiveness 15 pts
//   5. Renter data confidence 10 pts
//   6. Affordability pressure 10 pts

export function calcBuildingScore({ building, submissions, cityBaseBedroom, hoodMult }) {
  const n = submissions.length;
  if (n < MIN_SUBS_FOR_SCORE) return null;

  const rents   = submissions.map(s => s.monthly_rent);
  const avgRent = rents.reduce((a, b) => a + b, 0) / rents.length;
  const bench   = Math.round(cityBaseBedroom * hoodMult);
  const ratio   = avgRent / bench;

  let rentFairness;
  if      (ratio <= 0.85) rentFairness = 35;
  else if (ratio <= 0.95) rentFairness = 30;
  else if (ratio <= 1.05) rentFairness = 24;
  else if (ratio <= 1.15) rentFairness = 16;
  else if (ratio <= 1.30) rentFairness = 9;
  else                    rentFairness = 4;

  const transitPts = { excellent: 15, good: 11, fair: 7, limited: 3 };
  const locationValue = transitPts[building.transit] ?? 8;

  const amenPts = {
    elevator: 2, gym: 2, pool: 2, concierge: 2, parking: 2,
    laundry: 1, balcony: 1, storage: 1, "pet-friendly": 1, ac: 1,
  };
  const featuresScore = Math.min(15,
    (building.amenities || []).reduce((sum, a) => sum + (amenPts[a] ?? 0), 0)
  );

  let marketComp;
  if      (ratio <= 0.90) marketComp = 15;
  else if (ratio <= 1.00) marketComp = 12;
  else if (ratio <= 1.10) marketComp = 8;
  else if (ratio <= 1.20) marketComp = 4;
  else                    marketComp = 2;

  let confidence;
  if      (n >= MIN_SUBS_FOR_HIGH) confidence = 10;
  else if (n >= MIN_SUBS_FOR_MED)  confidence = 8;
  else if (n >= MIN_SUBS_FOR_SCORE)confidence = 5;
  else                             confidence = 2;

  let affordability;
  if      (ratio <= 0.85) affordability = 10;
  else if (ratio <= 0.95) affordability = 8;
  else if (ratio <= 1.05) affordability = 6;
  else if (ratio <= 1.15) affordability = 4;
  else                    affordability = 2;

  const total = Math.min(100, Math.max(0,
    rentFairness + locationValue + featuresScore + marketComp + confidence + affordability
  ));

  return {
    total: Math.round(total),
    breakdown: { rentFairness, locationValue, featuresScore, marketComp, confidence, affordability },
    avgRent: Math.round(avgRent),
    bench,
    rentRatio: ratio,
    submissions: n,
  };
}

export function getBuildingScoreLabel(score) {
  if (score >= 90) return { label: "Strong value",                color: "#1a5c34", bg: "#f0f7f2", border: "#a8d5b5" };
  if (score >= 80) return { label: "Good value",                  color: "#1a5c34", bg: "#f0f7f2", border: "#a8d5b5" };
  if (score >= 70) return { label: "Fair - watch the price",      color: "#7a4f00", bg: "#fdf8f0", border: "#e8c97a" };
  if (score >= 60) return { label: "Expensive vs. similar",       color: "#b45309", bg: "#fffbeb", border: "#fde68a" };
  return               { label: "Limited value (early data)",      color: "#8b1a1a", bg: "#fdf0f0", border: "#e8a8a8" };
}

export function getBuildingConfidence(n) {
  if (n >= MIN_SUBS_FOR_HIGH)  return { label: "High confidence",   dot: "#1a5c34", text: "#1a5c34" };
  if (n >= MIN_SUBS_FOR_MED)   return { label: "Medium confidence", dot: "#7a4f00", text: "#7a4f00" };
  if (n >= MIN_SUBS_FOR_SCORE) return { label: "Low confidence",    dot: "#8b1a1a", text: "#8b1a1a" };
  if (n >= MIN_SUBS_FOR_AVG)   return { label: "Early score",       dot: "#9aa4af", text: "#6a7682" };
  return                              { label: "Limited data",      dot: "#9aa4af", text: "#6a7682" };
}
