import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
  name: String,
  location: String,
  coordinates: {
    type: { type: String, default: 'Point' },
    coordinates: [Number], 
  },
  inventory: [
    {
      medicine: String,
      available: Boolean,
    },
  ],
});

shopSchema.index({ coordinates: '2dsphere' });

const Shop = mongoose.models.Shop || mongoose.model('Shop', shopSchema);

export default Shop;
