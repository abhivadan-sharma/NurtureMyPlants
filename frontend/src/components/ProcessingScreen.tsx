import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ProcessingScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentFact, setCurrentFact] = useState(0);

  const plantFacts = [
    "🌱 Did you know? Plants can communicate with each other through chemical signals!",
    "🌿 Some plants can live for thousands of years - the oldest known plant is over 4,000 years old!",
    "🍃 Plants produce oxygen as a byproduct of photosynthesis - thank them for every breath!",
    "🌸 There are over 400,000 known plant species on Earth, and scientists discover new ones every year!",
    "🌳 A single tree can absorb up to 48 pounds of CO2 per year!",
  ];

  useEffect(() => {
    if (!location.state?.image) {
      navigate('/');
      return;
    }

    // Simulate processing with progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Navigate to results after processing
          setTimeout(() => {
            navigate('/results', { 
              state: { 
                image: location.state.image,
                // Mock data for now - will be replaced with real API call
                plantData: {
                  commonName: "Fiddle Leaf Fig",
                  scientificName: "Ficus lyrata",
                  confidence: "high"
                }
              } 
            });
          }, 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 200);

    // Cycle through plant facts
    const factInterval = setInterval(() => {
      setCurrentFact(prev => (prev + 1) % plantFacts.length);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(factInterval);
    };
  }, [location.state, navigate]);

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto text-center">
        {/* Header */}
        <h1 className="text-3xl font-bold text-plant-green mb-8">
          Analyzing Your Plant 🔍
        </h1>

        {/* Progress Circle */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              className="text-plant-green"
              strokeDasharray={351.86}
              strokeDashoffset={351.86 - (progress / 100) * 351.86}
              style={{ transition: 'stroke-dashoffset 0.2s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-semibold text-gray-700">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Fun Plant Facts */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 min-h-[100px] flex items-center">
          <p className="text-gray-700 text-lg leading-relaxed">
            {plantFacts[currentFact]}
          </p>
        </div>

        {/* Processing Steps */}
        <div className="text-left mb-8">
          <div className="flex items-center mb-3">
            <div className={`w-4 h-4 rounded-full mr-3 ${progress > 20 ? 'bg-plant-green' : 'bg-gray-300'}`}></div>
            <span className={progress > 20 ? 'text-plant-green font-medium' : 'text-gray-500'}>
              Uploading image
            </span>
          </div>
          <div className="flex items-center mb-3">
            <div className={`w-4 h-4 rounded-full mr-3 ${progress > 50 ? 'bg-plant-green' : 'bg-gray-300'}`}></div>
            <span className={progress > 50 ? 'text-plant-green font-medium' : 'text-gray-500'}>
              Analyzing plant features
            </span>
          </div>
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-3 ${progress > 80 ? 'bg-plant-green' : 'bg-gray-300'}`}></div>
            <span className={progress > 80 ? 'text-plant-green font-medium' : 'text-gray-500'}>
              Generating care plan
            </span>
          </div>
        </div>

        {/* Cancel Button */}
        <button
          onClick={handleCancel}
          className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ProcessingScreen;