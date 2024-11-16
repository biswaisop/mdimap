import fs from 'fs';
import path from 'path';



export async function GET(request) {
  const bbox = '12.834054,77.453758,13.139816,77.760148'; 

  const overpassQuery = `
    [out:json];
    node["amenity"="pharmacy"](${bbox});
    out body;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(overpassQuery)}`,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data from Overpass API');
    }

    const data = await response.json();

    const pharmacies = data.elements.map((element) => ({
      name: element.tags.name || 'Unnamed Pharmacy',
      address: element.tags['addr:street'] || 'Unknown Address',
      coordinates: {
        latitude: element.lat,
        longitude: element.lon,
      },
    }));

    const filePath = path.join(process.cwd(), 'app/api/pharmacies/nearby', 'pharmacies.json');
    fs.writeFileSync(filePath, JSON.stringify(pharmacies, null, 2), 'utf8');

    return new Response(JSON.stringify(pharmacies), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
