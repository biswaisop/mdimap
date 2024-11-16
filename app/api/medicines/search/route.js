import Shop from '../../../models/Shop.js';
import connectMongo from '../../../lib/connectmongo.js';




export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const medicinesArray = searchParams.getAll('medicine');
  const userLocation = searchParams.get('location');

  if (!medicinesArray.length || !userLocation) {
    return new Response('Missing parameters', { status: 400 });
  }

  try {
    await connectMongo();
    const [longitude, latitude] = userLocation.split(',').map(Number);

    
    const shops = await Shop.find({
      inventory: {
        $all: medicinesArray.map((medicine) => ({
          $elemMatch: {
            medicine: { $regex: new RegExp(medicine, 'i') }, 
            available: true, 
          }
        }))
      },
      coordinates: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: 10000, 
        },
      },
    });

    return new Response(JSON.stringify(shops), { status: 200 });
  } catch (error) {
    return new Response('Error searching shops: ' + error.message, { status: 500 });
  }
}