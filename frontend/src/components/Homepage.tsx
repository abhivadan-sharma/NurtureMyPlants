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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-6 animate-bounce-subtle">
            <span className="text-4xl">🌱</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-green-800 bg-clip-text text-transparent mb-6">
            NurtureMyPlants
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover your plant's identity and unlock personalized care secrets with AI-powered botanical expertise
          </p>
        </div>

        {/* Main Upload Section */}
        <div className="max-w-lg mx-auto mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <ImageUpload onImageSelect={handleImageSelect} />
            
            {selectedImage && (
              <div className="mt-8 animate-slide-up">
                <button
                  onClick={handleIdentifyPlant}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  ✨ Identify My Plant
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Example Results Preview */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-4">
              Plant Care Made Simple
            </h2>
            <p className="text-sage-green text-lg">Everything you need to help your plants thrive</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/30 hover:transform hover:scale-105">
              <div className="text-5xl mb-6 group-hover:animate-bounce-subtle">🌿</div>
              <h3 className="font-display font-bold text-xl mb-4 text-gray-800">Plant Identification</h3>
              <p className="text-sage-green leading-relaxed">Get the exact name and species of your plant with scientific accuracy</p>
            </div>
            
            <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/30 hover:transform hover:scale-105 md:mt-8">
              <div className="text-5xl mb-6 group-hover:animate-bounce-subtle">💧</div>
              <h3 className="font-display font-bold text-xl mb-4 text-gray-800">Smart Care Guide</h3>
              <p className="text-sage-green leading-relaxed">Personalized watering, lighting, and feeding schedules tailored to your plant</p>
            </div>
            
            <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/30 hover:transform hover:scale-105">
              <div className="text-5xl mb-6 group-hover:animate-bounce-subtle">📱</div>
              <h3 className="font-display font-bold text-xl mb-4 text-gray-800">Save & Share</h3>
              <p className="text-sage-green leading-relaxed">Download beautiful PDF guides or share care tips with fellow plant lovers</p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 text-center">
          <p className="text-sage-green mb-6">Powered by advanced AI botanical recognition</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <span className="text-2xl">🤖</span>
            <span className="text-sage-green">•</span>
            <span className="text-2xl">🌍</span>
            <span className="text-sage-green">•</span>
            <span className="text-2xl">🔬</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;