import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface CarePlan {
  plantName: string;
  watering: {
    frequency: string;
    amount: string;
    seasonalNotes: string;
  };
  light: {
    ideal: string;
    tolerates: string;
  };
  temperature: {
    optimal: string;
    minimum: string;
  };
  humidity: string;
  soil: {
    type: string;
    pH: string;
    drainage: string;
  };
  fertilizing: {
    schedule: string;
    type: string;
  };
  commonProblems: Array<{
    issue: string;
    solution: string;
  }>;
  maintenance: {
    pruning: string;
    repotting: string;
  };
  tips: string[];
}

const ResultsScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('watering');
  const [copied, setCopied] = useState(false);

  // Mock data for now - will be replaced with real API data
  const mockCarePlan: CarePlan = {
    plantName: location.state?.plantData?.commonName || "Unknown Plant",
    watering: {
      frequency: "Every 7-10 days",
      amount: "Water thoroughly until drainage",
      seasonalNotes: "Reduce frequency in winter"
    },
    light: {
      ideal: "Bright, indirect light",
      tolerates: "Medium light conditions"
    },
    temperature: {
      optimal: "65-75°F (18-24°C)",
      minimum: "50°F (10°C)"
    },
    humidity: "40-60% relative humidity",
    soil: {
      type: "Well-draining potting mix",
      pH: "6.0-7.0 (slightly acidic to neutral)",
      drainage: "Must have drainage holes"
    },
    fertilizing: {
      schedule: "Monthly during growing season",
      type: "Balanced liquid fertilizer (10-10-10)"
    },
    commonProblems: [
      { issue: "Brown leaf tips", solution: "Increase humidity or check water quality" },
      { issue: "Dropping leaves", solution: "Adjust watering schedule or lighting" }
    ],
    maintenance: {
      pruning: "Remove dead leaves as needed",
      repotting: "Every 2-3 years or when rootbound"
    },
    tips: [
      "Rotate plant weekly for even growth",
      "Wipe leaves clean monthly",
      "Watch for pests on leaf undersides"
    ]
  };

  const handleNewUpload = () => {
    navigate('/');
  };

  const handleCopySection = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'watering', label: '💧 Watering', icon: '💧' },
    { id: 'light', label: '☀️ Light', icon: '☀️' },
    { id: 'temperature', label: '🌡️ Temperature', icon: '🌡️' },
    { id: 'soil', label: '🌱 Soil', icon: '🌱' },
    { id: 'fertilizing', label: '🌿 Fertilizing', icon: '🌿' },
    { id: 'problems', label: '🚨 Problems', icon: '🚨' },
    { id: 'maintenance', label: '✂️ Maintenance', icon: '✂️' },
    { id: 'tips', label: '💡 Tips', icon: '💡' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'watering':
        return (
          <div className="space-y-4">
            <div><strong>Frequency:</strong> {mockCarePlan.watering.frequency}</div>
            <div><strong>Amount:</strong> {mockCarePlan.watering.amount}</div>
            <div><strong>Seasonal Notes:</strong> {mockCarePlan.watering.seasonalNotes}</div>
          </div>
        );
      case 'light':
        return (
          <div className="space-y-4">
            <div><strong>Ideal:</strong> {mockCarePlan.light.ideal}</div>
            <div><strong>Tolerates:</strong> {mockCarePlan.light.tolerates}</div>
          </div>
        );
      case 'temperature':
        return (
          <div className="space-y-4">
            <div><strong>Optimal:</strong> {mockCarePlan.temperature.optimal}</div>
            <div><strong>Minimum:</strong> {mockCarePlan.temperature.minimum}</div>
            <div><strong>Humidity:</strong> {mockCarePlan.humidity}</div>
          </div>
        );
      case 'soil':
        return (
          <div className="space-y-4">
            <div><strong>Type:</strong> {mockCarePlan.soil.type}</div>
            <div><strong>pH:</strong> {mockCarePlan.soil.pH}</div>
            <div><strong>Drainage:</strong> {mockCarePlan.soil.drainage}</div>
          </div>
        );
      case 'fertilizing':
        return (
          <div className="space-y-4">
            <div><strong>Schedule:</strong> {mockCarePlan.fertilizing.schedule}</div>
            <div><strong>Type:</strong> {mockCarePlan.fertilizing.type}</div>
          </div>
        );
      case 'problems':
        return (
          <div className="space-y-4">
            {mockCarePlan.commonProblems.map((problem, index) => (
              <div key={index} className="border-l-4 border-red-400 pl-4">
                <div className="font-semibold text-red-700">{problem.issue}</div>
                <div className="text-gray-700">{problem.solution}</div>
              </div>
            ))}
          </div>
        );
      case 'maintenance':
        return (
          <div className="space-y-4">
            <div><strong>Pruning:</strong> {mockCarePlan.maintenance.pruning}</div>
            <div><strong>Repotting:</strong> {mockCarePlan.maintenance.repotting}</div>
          </div>
        );
      case 'tips':
        return (
          <ul className="space-y-2">
            {mockCarePlan.tips.map((tip, index) => (
              <li key={index} className="flex items-start">
                <span className="text-plant-green mr-2">•</span>
                {tip}
              </li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-plant-green mb-2">
          {mockCarePlan.plantName}
        </h1>
        <p className="text-gray-600">
          {location.state?.plantData?.scientificName || "Scientific name unknown"}
        </p>
        {location.state?.plantData?.confidence === 'medium' && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded mt-4 inline-block">
            ⚠️ Medium confidence identification
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-md mx-auto">
        <button className="bg-plant-green hover:bg-leaf-green text-white px-4 py-2 rounded-lg flex-1">
          📄 Download PDF
        </button>
        <button 
          onClick={() => handleCopySection('share link')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex-1"
        >
          🔗 Share Link
        </button>
        <button 
          onClick={handleNewUpload}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex-1"
        >
          📷 New Upload
        </button>
      </div>

      {/* Care Plan Tabs */}
      <div className="max-w-4xl mx-auto">
        {/* Mobile: Dropdown */}
        <div className="md:hidden mb-6">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
          >
            {tabs.map(tab => (
              <option key={tab.id} value={tab.id}>{tab.label}</option>
            ))}
          </select>
        </div>

        {/* Desktop: Tab Navigation */}
        <div className="hidden md:flex flex-wrap border-b border-gray-200 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-plant-green text-plant-green'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md p-6 min-h-[300px]">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h3>
            <button
              onClick={() => handleCopySection(JSON.stringify(renderTabContent()))}
              className={`px-3 py-1 text-sm rounded ${
                copied 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>
          <div className="text-gray-700 leading-relaxed">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;