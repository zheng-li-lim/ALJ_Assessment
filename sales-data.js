// sales-data.js — European car sales data
// Source: best-selling-cars.com (ACEA-based) · EU + EFTA + UK
// Passenger vehicles only. No estimates — only figures confirmed from source.
// Confirmed years: 2023, 2024, 2025.

export const SALES_YEARS = [2023, 2024, 2025];

export const MARKET_TOTAL = {
  2023: 12847481,
  2024: 12963614,
  2025: 13271270,
};

// 'Others' is computed dynamically in app.js as MARKET_TOTAL[y] − sum of named groups.
// BYD 2023 was below reporting threshold on the source page; stored as 0.
export const BRAND_SALES = {
  'VW Group':      { 2023: 3324705, 2024: 3407242, 2025: 3571429 },
  'Stellantis':    { 2023: 2128625, 2024: 1969594, 2025: 1892556 },
  'Renault Group': { 2023: 1242293, 2024: 1282453, 2025: 1358242 },
  'Hyundai Group': { 2023: 1106467, 2024: 1063517, 2025: 1042509 },
  'BMW Group':     { 2023:  913955, 2024:  923202, 2025:  970279 },
  'Toyota Group':  { 2023:  888770, 2024: 1006073, 2025:  931051 },
  'Mercedes-Benz': { 2023:  710433, 2024:  696907, 2025:  680830 },
  'Ford':          { 2023:  518371, 2024:  426307, 2025:  426459 },
  'Tesla':         { 2023:  366326, 2024:  327034, 2025:  238656 },
  'Nissan':        { 2023:  293476, 2024:  307276, 2025:  291920 },
  'Volvo Cars':    { 2023:  287150, 2024:  369689, 2025:  333129 },
  'SAIC Motor':    { 2023:  232721, 2024:  244595, 2025:  305717 },
  'BYD':           { 2023:       0, 2024:   50912, 2025:  187657 },
};

export const NAMED_BRANDS = Object.keys(BRAND_SALES);
export const BRANDS = [...NAMED_BRANDS, 'Others'];

export const BRAND_COLORS = {
  'Toyota Group':  '#2dccd3',
  'VW Group':      '#002B5C',
  'Stellantis':    '#C8102E',
  'Renault Group': '#E07B00',
  'Hyundai Group': '#4A6F8A',
  'BMW Group':     '#BCA26A',
  'Mercedes-Benz': '#5b6770',
  'Ford':          '#2E7D32',
  'Tesla':         '#9E9E9E',
  'Nissan':        '#7B1FA2',
  'Volvo Cars':    '#1565C0',
  'SAIC Motor':    '#00838F',
  'BYD':           '#E65100',
  'Others':        '#d0cfc9',
};

export const COUNTRY_SALES = {
  'Germany':        { 2023: 2844609, 2024: 2817331, 2025: 2857591 },
  'France':         { 2023: 1774723, 2024: 1718412, 2025: 1632152 },
  'United Kingdom': { 2023: 1903054, 2024: 1952778, 2025: 2020523 },
  'Italy':          { 2023: 1565331, 2024: 1559229, 2025: 1524843 },
  'Spain':          { 2023:  949359, 2024: 1016885, 2025: 1148650 },
  'Poland':         { 2023:  475032, 2024:  551568, 2025:  597435 },
  'Belgium':        { 2023:  476675, 2024:  448277, 2025:  414770 },
  'Netherlands':    { 2023:  369791, 2024:  381227, 2025:  388024 },
  'Sweden':         { 2023:  289827, 2024:  269582, 2025:  272998 },
  'Austria':        { 2023:  239150, 2024:  253789, 2025:  284978 },
  'Switzerland':    { 2023:  252215, 2024:  239535, 2025:  233737 },
  'Czechia':        { 2023:  221419, 2024:  231597, 2025:  248719 },
  'Denmark':        { 2023:  172798, 2024:  173114, 2025:  184641 },
  'Portugal':       { 2023:  199623, 2024:  209715, 2025:  225039 },
  'Romania':        { 2023:  144611, 2024:  151105, 2025:  156803 },
  'Norway':         { 2023:  126955, 2024:  128687, 2025:  179632 },
  'Greece':         { 2023:  134484, 2024:  137075, 2025:  144199 },
  'Hungary':        { 2023:  107720, 2024:  121611, 2025:  129440 },
  'Ireland':        { 2023:  122310, 2024:  121196, 2025:  124954 },
  'Slovakia':       { 2023:   88003, 2024:   93409, 2025:   93103 },
  'Finland':        { 2023:   87502, 2024:   74064, 2025:   71881 },
  'Croatia':        { 2023:   57694, 2024:   65020, 2025:   69841 },
  'Luxembourg':     { 2023:   49151, 2024:   46659, 2025:   47158 },
  'Bulgaria':       { 2023:   37724, 2024:   42941, 2025:   49419 },
  'Slovenia':       { 2023:   48809, 2024:   53018, 2025:   57556 },
  'Lithuania':      { 2023:   27528, 2024:   30122, 2025:   41974 },
  'Estonia':        { 2023:   22820, 2024:   25386, 2025:   13055 },
  'Latvia':         { 2023:   19083, 2024:   17329, 2025:   22506 },
  'Iceland':        { 2023:   17541, 2024:   10233, 2025:   14547 },
  'Cyprus':         { 2023:   14740, 2024:   15057, 2025:   14634 },
  'Malta':          { 2023:    7200, 2024:    7663, 2025:    6468 },
};

// BEV data 2025 only — 2024 source page returned 404, 2023 not available
export const BEV_2025 = {
  'Germany':        { units:  545142, sharePct: 19.1 },
  'France':         { units:  326922, sharePct: 20.0 },
  'United Kingdom': { units:  473348, sharePct: 23.4 },
  'Italy':          { units:   94624, sharePct:  6.2 },
  'Spain':          { units:  101627, sharePct:  8.8 },
  'Poland':         { units:   43311, sharePct:  7.2 },
  'Belgium':        { units:  143849, sharePct: 34.7 },
  'Netherlands':    { units:  156139, sharePct: 40.2 },
  'Sweden':         { units:   99723, sharePct: 36.5 },
  'Austria':        { units:   60651, sharePct: 21.3 },
  'Switzerland':    { units:   53250, sharePct: 22.8 },
  'Czechia':        { units:   13806, sharePct:  5.6 },
  'Denmark':        { units:  126542, sharePct: 68.5 },
  'Portugal':       { units:   52256, sharePct: 23.2 },
  'Romania':        { units:    8849, sharePct:  5.6 },
  'Norway':         { units:  172231, sharePct: 95.9 },
  'Greece':         { units:    8892, sharePct:  6.2 },
  'Hungary':        { units:   11002, sharePct:  8.5 },
  'Ireland':        { units:   23601, sharePct: 18.9 },
  'Slovakia':       { units:    4377, sharePct:  4.7 },
  'Finland':        { units:   26745, sharePct: 37.2 },
  'Croatia':        { units:    1266, sharePct:  1.8 },
  'Luxembourg':     { units:   12663, sharePct: 26.9 },
  'Bulgaria':       { units:    2420, sharePct:  4.9 },
  'Slovenia':       { units:    6419, sharePct: 11.2 },
  'Lithuania':      { units:    3150, sharePct:  7.5 },
  'Estonia':        { units:     868, sharePct:  6.6 },
  'Latvia':         { units:    1602, sharePct:  7.1 },
  'Iceland':        { units:    5988, sharePct: 41.2 },
  'Cyprus':         { units:    1474, sharePct: 10.1 },
  'Malta':          { units:    2450, sharePct: 37.9 },
};

export const COUNTRIES = Object.keys(COUNTRY_SALES);

export const COUNTRY_COLORS = {
  'Germany':        '#002B5C',
  'France':         '#2dccd3',
  'United Kingdom': '#C8102E',
  'Italy':          '#BCA26A',
  'Spain':          '#E07B00',
  'Poland':         '#4A6F8A',
  'Belgium':        '#7B5EA7',
  'Netherlands':    '#2E7D32',
  'Sweden':         '#00838F',
  'Austria':        '#8B4513',
  'Switzerland':    '#1565C0',
  'Czechia':        '#546E7A',
  'Denmark':        '#AD1457',
  'Portugal':       '#558B2F',
  'Romania':        '#6D4C41',
  'Norway':         '#0277BD',
  'Greece':         '#E65100',
  'Hungary':        '#4527A0',
  'Ireland':        '#2E7D32',
  'Slovakia':       '#37474F',
  'Finland':        '#00695C',
  'Croatia':        '#827717',
  'Luxembourg':     '#4E342E',
  'Bulgaria':       '#283593',
  'Slovenia':       '#558B2F',
  'Lithuania':      '#BF360C',
  'Estonia':        '#1A237E',
  'Latvia':         '#880E4F',
  'Iceland':        '#006064',
  'Cyprus':         '#33691E',
  'Malta':          '#4A148C',
};
