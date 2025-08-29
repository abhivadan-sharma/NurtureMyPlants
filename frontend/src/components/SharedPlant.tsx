import { useParams } from 'react-router-dom';

const SharedPlant = () => {
  const { shareId } = useParams<{ shareId: string }>();

  // This will be replaced with actual API call to fetch shared plant data
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-plant-green mb-4">
          Shared Plant Care Guide
        </h1>
        <p className="text-gray-600 mb-8">
          Share ID: {shareId}
        </p>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          🚧 Shared plant feature coming soon! 
          <br />
          This will display the care plan for shared plants.
        </div>
        <div className="mt-8">
          <a 
            href="/" 
            className="bg-plant-green hover:bg-leaf-green text-white px-6 py-3 rounded-lg inline-block"
          >
            Upload Your Own Plant
          </a>
        </div>
      </div>
    </div>
  );
};

export default SharedPlant;