import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { plantApi } from '../services/api';

const ProcessingScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentFact, setCurrentFact] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState('Uploading image');

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

    let cancelled = false;

    const processPlantIdentification = async () => {
      try {
        // Start progress animation
        const progressInterval = setInterval(() => {
          if (cancelled) return;
          
          setProgress(prev => {
            if (prev >= 90) return prev; // Stop at 90% until API completes
            return prev + 1;
          });
        }, 100);

        // Update steps during processing
        setTimeout(() => {
          if (!cancelled) setCurrentStep('Analyzing plant features');
        }, 2000);
        
        setTimeout(() => {
          if (!cancelled) setCurrentStep('Generating care plan');
        }, 4000);

        // Make the API call
        const plantData = await plantApi.identifyPlant(location.state.image);
        
        if (cancelled) return;

        // Complete progress
        setProgress(100);
        setCurrentStep('Analysis complete');

        // Navigate to results after a brief pause
        setTimeout(() => {
          if (!cancelled) {
            navigate('/results', { 
              state: { 
                image: location.state.image,
                plantData: plantData
              } 
            });
          }
        }, 1000);

        clearInterval(progressInterval);

      } catch (error) {
        if (cancelled) return;
        
        console.error('Plant identification error:', error);
        setError(error instanceof Error ? error.message : 'Failed to identify plant');
        setProgress(0);
        setCurrentStep('Error occurred');
      }
    };

    processPlantIdentification();

    // Cycle through plant facts
    const factInterval = setInterval(() => {
      if (!cancelled) {
        setCurrentFact(prev => (prev + 1) % plantFacts.length);
      }
    }, 3000);

    return () => {
      cancelled = true;
      clearInterval(factInterval);
    };
  }, [location.state, navigate, plantFacts.length]);

  const handleCancel = () => {
    navigate('/');
  };

  const handleRetry = () => {
    setError(null);
    setProgress(0);
    setCurrentStep('Uploading image');
    // Trigger re-processing by updating the state
    window.location.reload();
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-8">
            Analysis Failed ❌
          </h1>
          
          <div className="bg-red-50 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-8">
            <p className="font-medium mb-2">Error:</p>
            <p className="text-sm">{error}</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleRetry}
              className="w-full bg-plant-green hover:bg-leaf-green text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
            
            <button
              onClick={handleCancel}
              className="w-full px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Upload Different Image
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              style={{ transition: 'stroke-dashoffset 0.3s ease' }}
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
            <div className={`w-4 h-4 rounded-full mr-3 ${progress > 10 ? 'bg-plant-green' : 'bg-gray-300'}`}></div>
            <span className={progress > 10 ? 'text-plant-green font-medium' : 'text-gray-500'}>
              Uploading image
            </span>
          </div>
          <div className="flex items-center mb-3">
            <div className={`w-4 h-4 rounded-full mr-3 ${progress > 40 ? 'bg-plant-green' : 'bg-gray-300'}`}></div>
            <span className={progress > 40 ? 'text-plant-green font-medium' : 'text-gray-500'}>
              Analyzing plant features
            </span>
          </div>
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-3 ${progress > 70 ? 'bg-plant-green' : 'bg-gray-300'}`}></div>
            <span className={progress > 70 ? 'text-plant-green font-medium' : 'text-gray-500'}>
              Generating care plan
            </span>
          </div>
        </div>

        {/* Current Step */}
        <div className="mb-8">
          <p className="text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg">
            {currentStep}...
          </p>
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