import mongoose from 'mongoose';
import connectMongo from '../../../lib/connectmongo.js';
import Shop from '../../../models/Shop.js';


import pharmaciesData from './filtered_pharmacies.json' assert { type: 'json' };
import medData from './meds.json' assert { type: 'json' };


const randomAvailability = () => Math.random() < 0.5;


const formatPharmacyData = (pharmacies, meds) => {
  return pharmacies.map(pharmacy => ({
    name: pharmacy.name,
    location: pharmacy.address,
    coordinates: {
      type: 'Point',
      coordinates: [pharmacy.coordinates.longitude, pharmacy.coordinates.latitude],
    },
    
    inventory: meds.map(med => ({
      medicine: med.name,
      available: randomAvailability(),
    }))
  }));
};


const seedDatabase = async () => {
  try {
    await connectMongo();

    const formattedPharmacies = formatPharmacyData(pharmaciesData, medData);

    await Shop.deleteMany({});

    await Shop.insertMany(formattedPharmacies);

    console.log('Database seeded successfully with filtered pharmacies!');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding the database:', err);
  }
};

seedDatabase();
