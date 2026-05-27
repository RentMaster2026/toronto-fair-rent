// buildingData.js
// Known Toronto rental buildings for the building-name autocomplete field
// and the building ranking pages.
//
// All FairRent Canada Building Scores are either:
//   - Computed from real renter submissions (when MIN_SUBS_FOR_SCORE or more exist)
//   - Shown as "Limited data" or "Early score" when data is thin
//
// Privacy thresholds:
//   MIN_SUBS_FOR_AVG   = 3  — minimum to show a grouped average
//   MIN_SUBS_FOR_SCORE = 5  — minimum to publish a building score
//   MIN_SUBS_FOR_MED   = 8  — medium confidence
//   MIN_SUBS_FOR_HIGH  = 20 — high confidence
//
// Schema note: the Supabase rent_submissions table needs a building_name text column
// before building-level aggregation works. Run:
//   ALTER TABLE rent_submissions ADD COLUMN building_name text;
// Then set BUILDING_COLUMN_READY = true in App.jsx.

export const MIN_SUBS_FOR_AVG   = 3;
export const MIN_SUBS_FOR_SCORE = 5;
export const MIN_SUBS_FOR_MED   = 8;
export const MIN_SUBS_FOR_HIGH  = 20;

// Property type labels
export const PROPERTY_TYPE_LABELS = {
  "purpose-built": "Purpose-built rental",
  "condo":         "Condo",
  "student":       "Student housing",
  "converted":     "Converted house",
  "townhouse":     "Townhouse",
  "other":         "Other",
};

// Transit access labels
export const TRANSIT_LABELS = {
  excellent: "Excellent transit",
  good:      "Good transit",
  fair:      "Some transit",
  limited:   "Limited transit",
};

// Known large rental buildings in Toronto.
// Sources: publicly listed on Rentals.ca, Zumper, and PadMapper.
// All buildings are publicly known purpose-built or large condo rentals.
// Used for the building-name autocomplete field in the submission form.
export const TORONTO_BUILDINGS = [

  // Liberty Village
  {
    id: "150-east-liberty",
    name: "150 East Liberty",
    address: "150 East Liberty Street",
    neighbourhood: "libertyvillage",
    type: "condo",
    amenities: ["elevator", "gym", "pool", "concierge", "parking", "pet-friendly"],
    transit: "good",
    note: "Large condo-rental tower in the heart of Liberty Village.",
  },
  {
    id: "85-east-liberty",
    name: "85 East Liberty",
    address: "85 East Liberty Street",
    neighbourhood: "libertyvillage",
    type: "condo",
    amenities: ["elevator", "gym", "concierge", "parking", "storage"],
    transit: "good",
    note: "Modern condo-rental near King and Strachan.",
  },
  {
    id: "51-east-liberty",
    name: "51 East Liberty",
    address: "51 East Liberty Street",
    neighbourhood: "libertyvillage",
    type: "condo",
    amenities: ["elevator", "gym", "pool", "concierge", "parking"],
    transit: "good",
    note: "Liberty Village high-rise close to the 504 King streetcar.",
  },

  // King West
  {
    id: "770-king-west",
    name: "770 King West",
    address: "770 King Street West",
    neighbourhood: "kingwest",
    type: "purpose-built",
    amenities: ["elevator", "gym", "concierge", "parking", "pet-friendly"],
    transit: "excellent",
    note: "Purpose-built rental on the King Street West strip.",
  },
  {
    id: "550-wellington-w",
    name: "550 Wellington West",
    address: "550 Wellington Street West",
    neighbourhood: "kingwest",
    type: "condo",
    amenities: ["elevator", "gym", "pool", "concierge", "parking"],
    transit: "excellent",
    note: "Thompson Residences - upscale King West condo rental.",
  },
  {
    id: "8-charlotte",
    name: "8 Charlotte",
    address: "8 Charlotte Street",
    neighbourhood: "kingwest",
    type: "condo",
    amenities: ["elevator", "gym", "concierge", "parking", "storage"],
    transit: "excellent",
    note: "Entertainment District tower steps from King Street.",
  },

  // Queen West
  {
    id: "560-queen-w",
    name: "560 Queen West",
    address: "560 Queen Street West",
    neighbourhood: "queenswest",
    type: "condo",
    amenities: ["elevator", "gym", "parking"],
    transit: "good",
    note: "Mid-rise condo-rental in the Queen West strip.",
  },
  {
    id: "778-king-w",
    name: "Fashion House",
    address: "560 King Street West",
    neighbourhood: "queenswest",
    type: "condo",
    amenities: ["elevator", "gym", "concierge", "parking"],
    transit: "excellent",
    note: "Boutique condo-rental near Bathurst.",
  },

  // Annex
  {
    id: "1-spadina-rd",
    name: "1 Spadina Road",
    address: "1 Spadina Road",
    neighbourhood: "annex",
    type: "purpose-built",
    amenities: ["elevator", "laundry", "parking"],
    transit: "excellent",
    note: "Pre-war rental at the corner of Bloor and Spadina, steps from the subway.",
  },
  {
    id: "44-walmer",
    name: "44 Walmer Road",
    address: "44 Walmer Road",
    neighbourhood: "annex",
    type: "purpose-built",
    amenities: ["elevator", "laundry", "parking"],
    transit: "excellent",
    note: "Older Annex high-rise close to U of T.",
  },
  {
    id: "321-bloor-w",
    name: "321 Bloor West",
    address: "321 Bloor Street West",
    neighbourhood: "annex",
    type: "purpose-built",
    amenities: ["elevator", "laundry"],
    transit: "excellent",
    note: "Annex mid-rise on Bloor near St. George station.",
  },

  // Yorkville
  {
    id: "33-yorkville",
    name: "33 Yorkville",
    address: "33 Yorkville Avenue",
    neighbourhood: "yorkville",
    type: "condo",
    amenities: ["elevator", "gym", "pool", "concierge", "parking", "storage"],
    transit: "excellent",
    note: "Luxury condo-rental in the heart of Yorkville.",
  },
  {
    id: "55-scollard",
    name: "55 Scollard",
    address: "55 Scollard Street",
    neighbourhood: "yorkville",
    type: "condo",
    amenities: ["elevator", "gym", "concierge", "parking"],
    transit: "excellent",
    note: "High-end Yorkville condo-rental near Bay-Bloor.",
  },
  {
    id: "1-yorkville",
    name: "1 Yorkville",
    address: "1 Yorkville Avenue",
    neighbourhood: "yorkville",
    type: "condo",
    amenities: ["elevator", "gym", "pool", "concierge", "parking", "pet-friendly"],
    transit: "excellent",
    note: "Newer luxury tower at Yonge and Yorkville.",
  },

  // Distillery District
  {
    id: "70-distillery",
    name: "Pure Spirit",
    address: "70 Distillery Lane",
    neighbourhood: "distillery",
    type: "condo",
    amenities: ["elevator", "gym", "pool", "concierge", "parking"],
    transit: "good",
    note: "Condo-rental tower at the eastern edge of the Distillery District.",
  },
  {
    id: "390-cherry",
    name: "Clear Spirit",
    address: "390 Cherry Street",
    neighbourhood: "distillery",
    type: "condo",
    amenities: ["elevator", "gym", "concierge", "parking", "storage"],
    transit: "good",
    note: "Distillery District high-rise close to King streetcar.",
  },

  // Harbourfront
  {
    id: "10-yonge",
    name: "10 Yonge",
    address: "10 Yonge Street",
    neighbourhood: "harbourfront",
    type: "condo",
    amenities: ["elevator", "gym", "pool", "concierge", "parking"],
    transit: "excellent",
    note: "Iconic waterfront condo tower at Yonge and Queens Quay.",
  },
  {
    id: "33-harbour",
    name: "33 Harbour Square",
    address: "33 Harbour Square",
    neighbourhood: "harbourfront",
    type: "condo",
    amenities: ["elevator", "gym", "pool", "concierge", "parking", "pet-friendly"],
    transit: "excellent",
    note: "Established waterfront rental complex near Union Station.",
  },
  {
    id: "300-front-w",
    name: "300 Front West",
    address: "300 Front Street West",
    neighbourhood: "harbourfront",
    type: "condo",
    amenities: ["elevator", "gym", "concierge", "parking"],
    transit: "excellent",
    note: "Modern high-rise near the CN Tower.",
  },

  // St. Lawrence
  {
    id: "33-mill",
    name: "33 Mill Street",
    address: "33 Mill Street",
    neighbourhood: "stlawrence",
    type: "condo",
    amenities: ["elevator", "gym", "parking"],
    transit: "good",
    note: "Mid-rise rental near the St. Lawrence Market.",
  },
  {
    id: "168-king-e",
    name: "168 King East",
    address: "168 King Street East",
    neighbourhood: "stlawrence",
    type: "condo",
    amenities: ["elevator", "gym", "concierge", "parking"],
    transit: "excellent",
    note: "King East condo-rental walking distance to the Financial District.",
  },

  // Midtown
  {
    id: "155-balliol",
    name: "155 Balliol",
    address: "155 Balliol Street",
    neighbourhood: "midtown",
    type: "purpose-built",
    amenities: ["elevator", "laundry", "parking", "pool"],
    transit: "excellent",
    note: "Davisville-area purpose-built rental close to the subway.",
  },
  {
    id: "33-davisville",
    name: "33 Davisville",
    address: "33 Davisville Avenue",
    neighbourhood: "midtown",
    type: "purpose-built",
    amenities: ["elevator", "laundry", "parking"],
    transit: "excellent",
    note: "Older Yonge corridor rental, often rent-controlled.",
  },
  {
    id: "411-duplex",
    name: "411 Duplex",
    address: "411 Duplex Avenue",
    neighbourhood: "midtown",
    type: "purpose-built",
    amenities: ["elevator", "laundry", "parking", "pool"],
    transit: "good",
    note: "Midtown rental close to Eglinton.",
  },

  // North York
  {
    id: "5444-yonge",
    name: "5444 Yonge",
    address: "5444 Yonge Street",
    neighbourhood: "northyork",
    type: "condo",
    amenities: ["elevator", "gym", "pool", "concierge", "parking"],
    transit: "excellent",
    note: "North York Centre tower steps from the subway.",
  },
  {
    id: "23-sheppard-e",
    name: "23 Sheppard East",
    address: "23 Sheppard Avenue East",
    neighbourhood: "northyork",
    type: "condo",
    amenities: ["elevator", "gym", "concierge", "parking"],
    transit: "excellent",
    note: "Hullmark Centre - condo rental at Yonge and Sheppard.",
  },
  {
    id: "75-eglinton-e",
    name: "75 Eglinton East",
    address: "75 Eglinton Avenue East",
    neighbourhood: "northyork",
    type: "purpose-built",
    amenities: ["elevator", "laundry", "parking"],
    transit: "good",
    note: "Established Yonge-Eglinton corridor rental.",
  },

  // Scarborough
  {
    id: "10-tobermory",
    name: "10 Tobermory",
    address: "10 Tobermory Drive",
    neighbourhood: "scarborough",
    type: "purpose-built",
    amenities: ["elevator", "laundry", "parking"],
    transit: "fair",
    note: "Older purpose-built apartment complex in Scarborough.",
  },
  {
    id: "1900-sheppard-e",
    name: "1900 Sheppard East",
    address: "1900 Sheppard Avenue East",
    neighbourhood: "scarborough",
    type: "purpose-built",
    amenities: ["elevator", "laundry", "parking"],
    transit: "fair",
    note: "Scarborough mid-rise rental close to amenities.",
  },

  // Parkdale
  {
    id: "65-jameson",
    name: "65 Jameson",
    address: "65 Jameson Avenue",
    neighbourhood: "parkdale",
    type: "purpose-built",
    amenities: ["elevator", "laundry", "parking"],
    transit: "good",
    note: "Classic Parkdale high-rise rental, often rent-controlled.",
  },
  {
    id: "150-jameson",
    name: "150 Jameson",
    address: "150 Jameson Avenue",
    neighbourhood: "parkdale",
    type: "purpose-built",
    amenities: ["elevator", "laundry", "parking"],
    transit: "good",
    note: "Parkdale rental close to the Queen streetcar.",
  },

  // Etobicoke
  {
    id: "30-shore-breeze",
    name: "30 Shore Breeze",
    address: "30 Shore Breeze Drive",
    neighbourhood: "etobicoke",
    type: "condo",
    amenities: ["elevator", "gym", "pool", "concierge", "parking", "pet-friendly"],
    transit: "fair",
    note: "Humber Bay waterfront condo-rental tower.",
  },
  {
    id: "1-valhalla",
    name: "1 Valhalla Inn Road",
    address: "1 Valhalla Inn Road",
    neighbourhood: "etobicoke",
    type: "condo",
    amenities: ["elevator", "gym", "pool", "concierge", "parking"],
    transit: "good",
    note: "Etobicoke condo-rental complex near Islington station.",
  },

  // East York
  {
    id: "1245-dupont",
    name: "85 Thorncliffe Park",
    address: "85 Thorncliffe Park Drive",
    neighbourhood: "eastyork",
    type: "purpose-built",
    amenities: ["elevator", "laundry", "parking"],
    transit: "fair",
    note: "Large Thorncliffe Park rental complex.",
  },

  // Kensington Market
  {
    id: "188-spadina",
    name: "188 Spadina",
    address: "188 Spadina Avenue",
    neighbourhood: "kensingtonmarket",
    type: "purpose-built",
    amenities: ["elevator", "laundry"],
    transit: "excellent",
    note: "Mid-rise on Spadina at the eastern edge of the Market.",
  },

  // Roncesvalles
  {
    id: "65-howard-park",
    name: "65 Howard Park",
    address: "65 Howard Park Avenue",
    neighbourhood: "roncesvalles",
    type: "condo",
    amenities: ["elevator", "gym", "parking", "pet-friendly"],
    transit: "good",
    note: "Modern condo-rental at the eastern edge of Roncesvalles.",
  },

  // Cabbagetown
  {
    id: "260-wellesley-e",
    name: "260 Wellesley East",
    address: "260 Wellesley Street East",
    neighbourhood: "cabbagetown",
    type: "purpose-built",
    amenities: ["elevator", "laundry", "parking"],
    transit: "good",
    note: "Cabbagetown rental close to Sherbourne subway.",
  },

  // Leslieville
  {
    id: "1190-dundas-e",
    name: "1190 Dundas East",
    address: "1190 Dundas Street East",
    neighbourhood: "leslieville",
    type: "condo",
    amenities: ["elevator", "gym", "parking"],
    transit: "good",
    note: "Newer Leslieville mid-rise on the Dundas streetcar line.",
  },

  // Forest Hill
  {
    id: "411-spadina-rd",
    name: "411 Spadina Road",
    address: "411 Spadina Road",
    neighbourhood: "foresthill",
    type: "purpose-built",
    amenities: ["elevator", "laundry", "parking"],
    transit: "good",
    note: "Forest Hill rental close to St. Clair West.",
  },

];

// Get buildings for a specific neighbourhood key (matches hoodData.js keys)
export function getBuildingsForHood(hoodKey) {
  return TORONTO_BUILDINGS.filter(b => b.neighbourhood === hoodKey);
}

// Get buildings matching a neighbourhood name (from the dropdown value, e.g. "Annex").
// Returns empty array when no neighbourhood is selected to keep the dropdown clean.
// Returns all buildings with matching neighbourhood when one is selected.
export function getBuildingsForHoodName(hoodName) {
  if (!hoodName) return [];
  const match = HOOD_NAME_TO_KEY[hoodName] ?? null;
  if (!match) return [];
  return TORONTO_BUILDINGS.filter(b => b.neighbourhood === match);
}

// Maps the neighbourhood dropdown value (e.g. "Annex") to the hood key
// used in buildingData (e.g. "annex").
// These match the keys in TORONTO_HOODS from hoodData.js.
export const HOOD_NAME_TO_KEY = {
  "Annex":                  "annex",
  "Bloorcourt":             null,
  "Cabbagetown":            "cabbagetown",
  "Chinatown":              null,
  "Davisville":             "midtown",
  "Distillery District":    "distillery",
  "Downtown Core":          "stlawrence",
  "East End":               "eastyork",
  "East York":              "eastyork",
  "Etobicoke":              "etobicoke",
  "Forest Hill":            "foresthill",
  "Greektown":              null,
  "Harbourfront":           "harbourfront",
  "Junction":               null,
  "Kensington Market":      "kensingtonmarket",
  "King West":              "kingwest",
  "Lawrence Park":          null,
  "Leaside":                null,
  "Leslieville":            "leslieville",
  "Liberty Village":        "libertyvillage",
  "Little Italy":           null,
  "Midtown":                "midtown",
  "North York":             "northyork",
  "Parkdale":               "parkdale",
  "Queen West":             "queenswest",
  "Riverside":              "leslieville",
  "Roncesvalles":           "roncesvalles",
  "Rosedale":               null,
  "Scarborough":            "scarborough",
  "St. Lawrence":           "stlawrence",
  "Swansea":                null,
  "Weston":                 null,
  "Willowdale":             "northyork",
  "Yorkville":              "yorkville",
};

// Resolve the building name that should be stored in the submission.
// buildingMode: building id (from TORONTO_BUILDINGS), "other", "skip", or ""
// buildingText: free-text value when mode is "other"
export function resolveBuildingName(buildingMode, buildingText) {
  if (!buildingMode || buildingMode === "skip") return null;
  if (buildingMode === "other") return (buildingText || "").trim() || null;
  const found = TORONTO_BUILDINGS.find(b => b.id === buildingMode);
  return found ? `${found.name} - ${found.address}` : null;
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

  // 1. Rent fairness (35 pts)
  // Does not punish expensive buildings if they're fair vs similar luxury comps.
  // A building scoring high here pays fair rent for its type and neighbourhood.
  let rentFairness;
  if      (ratio <= 0.85) rentFairness = 35;
  else if (ratio <= 0.95) rentFairness = 30;
  else if (ratio <= 1.05) rentFairness = 24;
  else if (ratio <= 1.15) rentFairness = 16;
  else if (ratio <= 1.30) rentFairness = 9;
  else                    rentFairness = 4;

  // 2. Value for location (15 pts)
  const transitPts = { excellent: 15, good: 11, fair: 7, limited: 3 };
  const locationValue = transitPts[building.transit] ?? 8;

  // 3. Building features and amenities (15 pts)
  const amenPts = {
    elevator: 2, gym: 2, pool: 2, concierge: 2, parking: 2,
    laundry: 1, balcony: 1, storage: 1, "pet-friendly": 1, ac: 1,
  };
  const featuresScore = Math.min(15,
    (building.amenities || []).reduce((sum, a) => sum + (amenPts[a] ?? 0), 0)
  );

  // 4. Market competitiveness (15 pts)
  let marketComp;
  if      (ratio <= 0.90) marketComp = 15;
  else if (ratio <= 1.00) marketComp = 12;
  else if (ratio <= 1.10) marketComp = 8;
  else if (ratio <= 1.20) marketComp = 4;
  else                    marketComp = 2;

  // 5. Renter data confidence (10 pts)
  let confidence;
  if      (n >= MIN_SUBS_FOR_HIGH) confidence = 10;
  else if (n >= MIN_SUBS_FOR_MED)  confidence = 8;
  else if (n >= MIN_SUBS_FOR_SCORE)confidence = 5;
  else                             confidence = 2;

  // 6. Affordability pressure (10 pts)
  // Looks at whether the building is accessible for typical renter budgets.
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

// Score label for a building total score (out of 100)
export function getBuildingScoreLabel(score) {
  if (score >= 90) return { label: "Strong value",    color: "#1a5c34", bg: "#f0f7f2", border: "#a8d5b5" };
  if (score >= 80) return { label: "Good value",      color: "#1a5c34", bg: "#f0f7f2", border: "#a8d5b5" };
  if (score >= 70) return { label: "Fair - watch the price", color: "#7a4f00", bg: "#fdf8f0", border: "#e8c97a" };
  if (score >= 60) return { label: "Expensive vs. similar", color: "#b45309", bg: "#fffbeb", border: "#fde68a" };
  return               { label: "Limited value (early data)", color: "#8b1a1a", bg: "#fdf0f0", border: "#e8a8a8" };
}

// Confidence label for a building based on submission count
export function getBuildingConfidence(n) {
  if (n >= MIN_SUBS_FOR_HIGH)  return { label: "High confidence",   dot: "#1a5c34", text: "#1a5c34" };
  if (n >= MIN_SUBS_FOR_MED)   return { label: "Medium confidence", dot: "#7a4f00", text: "#7a4f00" };
  if (n >= MIN_SUBS_FOR_SCORE) return { label: "Low confidence",    dot: "#8b1a1a", text: "#8b1a1a" };
  if (n >= MIN_SUBS_FOR_AVG)   return { label: "Early score",       dot: "#9aa4af", text: "#6a7682" };
  return                              { label: "Limited data",       dot: "#9aa4af", text: "#6a7682" };
}
