import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUpload from './ImageUpload';

const Homepage = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
  };

  const handleIdentifyPlant = () => {
    if (selectedImage) {
      navigate('/processing', { state: { image: selectedImage } });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-plant-green mb-4">
          🌱 NurtureMyPlants
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
          Upload a photo of your plant and get personalized care instructions powered by AI
        </p>
      </div>

      {/* Main Upload Section */}
      <div className="max-w-md mx-auto">
        <ImageUpload onImageSelect={handleImageSelect} />
        
        {selectedImage && (
          <div className="mt-6">
            <button
              onClick={handleIdentifyPlant}
              className="w-full bg-plant-green hover:bg-leaf-green text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-lg"
            >
              Identify My Plant 🔍
            </button>
          </div>
        )}
      </div>

      {/* Example Results Preview */}
      <div className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
          See What You'll Get
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">🌿</div>
            <h3 className="font-semibold text-lg mb-2">Plant Identification</h3>
            <p className="text-gray-600">Get the exact name and species of your plant</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">💧</div>
            <h3 className="font-semibold text-lg mb-2">Care Instructions</h3>
            <p className="text-gray-600">Watering, lighting, and feeding schedules</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-semibold text-lg mb-2">Save & Share</h3>
            <p className="text-gray-600">Download PDF or share with friends</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;