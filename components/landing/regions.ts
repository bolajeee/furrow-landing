// Example grower circles shown on the globe. lat/lon place the pin; `headline` is the
// line under the comment in the region card; `comment` is what the tooltip shows when a
// visitor clicks that pin directly.
//
// All of this is illustrative, and the page labels it so. Do not add member counts or
// harvest figures here until they come from real pilot data.
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
    name: 'Lagos',
    country: 'Nigeria',
    lat: 6.52,
    lon: 3.38,
    headline: 'Example circle: balcony growers working 9-to-5',
    comment: '"Tasks only land on my Saturday mornings, so I actually do them." — Tolu',
  },
  {
    name: 'Abuja',
    country: 'Nigeria',
    lat: 9.06,
    lon: 7.49,
    headline: 'Example circle: compound gardens in shared estates',
    comment: '"The materials check told me which of my old containers were safe for food." — Hauwa',
  },
  {
    name: 'Kano',
    country: 'Nigeria',
    lat: 12.0,
    lon: 8.52,
    headline: 'Example circle: rooftop pots in the dry season',
    comment: '"Mulch and a clay pot in the soil kept my pots going through the hot weeks." — Musa',
  },
  {
    name: 'Kaduna',
    country: 'Nigeria',
    lat: 10.52,
    lon: 7.44,
    headline: 'Example circle: first-time growers starting together',
    comment: '"Seeing the others post their setups is what kept me going in week three." — Amina',
  },
  {
    name: 'Enugu',
    country: 'Nigeria',
    lat: 6.46,
    lon: 7.55,
    headline: 'Example circle: sack and bucket growers',
    comment: '"I asked the circle before I reused a bucket. Glad I did." — Ngozi',
  },
  {
    name: 'Port Harcourt',
    country: 'Nigeria',
    lat: 4.82,
    lon: 7.03,
    headline: 'Example circle: households who travel for work',
    comment: '"Away mode and a bottle drip got my peppers through a four-day trip." — Ebi',
  },
];
