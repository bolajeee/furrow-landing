// Grower regions shown on the globe. lat/lon place the pin; `headline` feeds the
// scroll-driven stat queue next to the globe; `comment` is what the tooltip shows
// when a visitor clicks that pin directly.
//
// These are placeholder figures for the portfolio build — replace with real
// community counts before this goes anywhere production-facing.
export interface Region {
  name: string;
  country: string;
  lat: number;
  lon: number;
  headline: string;
  comment: string;
}

export const regions: Region[] = [
  {
    name: 'Kaduna',
    country: 'Nigeria',
    lat: 10.5,
    lon: 7.4,
    headline: '2,400 growers tracking maize & sorghum planting windows',
    comment:
      '"We compared sowing dates in the circle before the rains came — saved my second plot." — Amina',
  },
  {
    name: 'Nakuru',
    country: 'Kenya',
    lat: -0.3,
    lon: 36.1,
    headline: '1,150 growers comparing dairy fodder rotations',
    comment: '"Switched fodder rotation after seeing what worked two farms over." — Wanjiru',
  },
  {
    name: 'Punjab',
    country: 'India',
    lat: 31.1,
    lon: 75.3,
    headline: '3,800 growers timing wheat irrigation together',
    comment:
      '"The irrigation timing tips from this circle cut our water use noticeably." — Gurpreet',
  },
  {
    name: 'Cebu',
    country: 'Philippines',
    lat: 10.3,
    lon: 123.9,
    headline: '690 growers comparing rice planting calendars',
    comment: '"Lined up our planting calendar with three neighboring farms this season." — Marites',
  },
  {
    name: 'Oaxaca',
    country: 'Mexico',
    lat: 17.1,
    lon: -96.7,
    headline: '540 growers logging maize intercropping results',
    comment: '"Intercropping notes from the group changed how I lay out my maize rows." — Fidel',
  },
  {
    name: 'Volta Region',
    country: 'Ghana',
    lat: 6.6,
    lon: 0.5,
    headline: '980 growers tracking cassava yield notes',
    comment: '"Yield logging here showed me which plot was actually underperforming." — Kwabena',
  },
];
