import connectMongo from "./connectmongo.js";
import Shop from "../models/Shop.js";

async function seedDatabase() {
  await connectMongo();

  const shops = [
    {
      name: "Pharmacy A",
      location: "Street 1",
      coordinates: {
        type: "Point",
        coordinates: [12.786263348234435, 77.5209808706625],
      },
      inventory: [{ medicine: "jelly", available: true }],
    },
    {
      name: "Pharmacy B",
      location: "Street 2",
      coordinates: { type: "Point", coordinates: [77.5946, 12.975] },
      inventory: [{ medicine: "Tylenol", available: true }],
    },
  ];

  await Shop.insertMany(shops);
  console.log("Database seeded!");
}

seedDatabase().catch(console.error);
