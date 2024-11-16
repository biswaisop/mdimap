'use client';

import { useState, useRef } from 'react';

export default function Home() {
  const [medicine, setMedicine] = useState('');
  const [location, setLocation] = useState('');
  const [shops, setShops] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const medicineInputRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!medicine || !location) {
      setError('Please enter both medicine and location');
      return;
    }

    const medicinesArray = medicine.split(',').map((med) => med.trim());

    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      medicinesArray.forEach((med) => queryParams.append('medicine', med));
      queryParams.append('location', location);

      const response = await fetch(`/api/medicines/search?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch shops');
      }
      const data = await response.json();
      setShops(data);
      setError(null);

      medicineInputRef.current.focus();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`${longitude},${latitude}`);
      });
    } else {
      setError('Geolocation is not supported by this browser');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Medicine Locator</h1>

      <form onSubmit={handleSearch} className="mt-4 space-y-4">
        <div>
          <label htmlFor="medicine" className="block">Medicine(s)</label>
          <input
            id="medicine"
            type="text"
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
            ref={medicineInputRef}
            className="w-full p-2 border border-gray-300 rounded text-black"
            placeholder="Enter medicine names separated by commas (e.g., aspirin, paracetamol)"
          />
        </div>

        <div>
          <label htmlFor="location" className="block">Location</label>
          <div className="flex items-center space-x-2">
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-black"
              placeholder="Enter your location (long, lat)"
            />
            <button type="button" onClick={handleGetLocation} className="p-2 bg-blue-500 text-white rounded">
              Use my location
            </button>
          </div>
        </div>

        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {shops.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">
            {medicine} is/are found in:
          </h2>
          <ul>
            {shops.map((shop, index) => (
              <li key={index} className="border-b py-2">
                <h3 className="font-medium">{shop.name}</h3>
                <p>{shop.location}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
