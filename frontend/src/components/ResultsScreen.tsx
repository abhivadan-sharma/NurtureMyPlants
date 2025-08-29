import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { plantApi, type PlantAnalysisResponse } from '../services/api';

const ResultsScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('watering');
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isCreatingShare, setIsCreatingShare] = useState(false);

  const plantData: PlantAnalysisResponse | null = location.state?.plantData || null;
  const imageFile: File | null = location.state?.image || null;

  if (!plantData) {
    // If no plant data, redirect to home
    navigate('/');
    return null;
  }

  const { identification, carePlan } = plantData;

  const handleNewUpload = () => {
    navigate('/');
  };

  const handleCopySection = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      console.log('📄 Downloading PDF for:', identification.commonName);
      
      const pdfBlob = await plantApi.generatePdf(plantData);
      
      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${identification.commonName.replace(/[^a-zA-Z0-9]/g, '_')}_care_guide.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ PDF downloaded successfully');
    } catch (error) {
      console.error('❌ PDF download failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleCreateShareLink = async () => {
    try {
      setIsCreatingShare(true);
      console.log('🔗 Creating share link for:', identification.commonName);
      
      const shareData = await plantApi.createShareLink(plantData);
      
      // Copy share URL to clipboard
      await navigator.clipboard.writeText(shareData.shareUrl);
      
      alert(`Share link copied to clipboard!\n\nLink: ${shareData.shareUrl}\n\nExpires: ${new Date(shareData.expiresAt).toLocaleDateString()}`);
      
      console.log('✅ Share link created and copied');
    } catch (error) {
      console.error('❌ Share link creation failed:', error);
      alert('Failed to create share link. Please try again.');
    } finally {
      setIsCreatingShare(false);
    }
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
            <div><strong>Frequency:</strong> {carePlan.watering.frequency}</div>
            <div><strong>Amount:</strong> {carePlan.watering.amount}</div>
            <div><strong>Seasonal Notes:</strong> {carePlan.watering.seasonalNotes}</div>
          </div>
        );
      case 'light':
        return (
          <div className="space-y-4">
            <div><strong>Ideal:</strong> {carePlan.light.ideal}</div>
            <div><strong>Tolerates:</strong> {carePlan.light.tolerates}</div>
          </div>
        );
      case 'temperature':
        return (
          <div className="space-y-4">
            <div><strong>Optimal:</strong> {carePlan.temperature.optimal}</div>
            <div><strong>Minimum:</strong> {carePlan.temperature.minimum}</div>
            <div><strong>Humidity:</strong> {carePlan.humidity}</div>
          </div>
        );
      case 'soil':
        return (
          <div className="space-y-4">
            <div><strong>Type:</strong> {carePlan.soil.type}</div>
            <div><strong>pH:</strong> {carePlan.soil.pH}</div>
            <div><strong>Drainage:</strong> {carePlan.soil.drainage}</div>
          </div>
        );
      case 'fertilizing':
        return (
          <div className="space-y-4">
            <div><strong>Schedule:</strong> {carePlan.fertilizing.schedule}</div>
            <div><strong>Type:</strong> {carePlan.fertilizing.type}</div>
          </div>
        );
      case 'problems':
        return (
          <div className="space-y-4">
            {carePlan.commonProblems.map((problem, index) => (
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
            <div><strong>Pruning:</strong> {carePlan.maintenance.pruning}</div>
            <div><strong>Repotting:</strong> {carePlan.maintenance.repotting}</div>
          </div>
        );
      case 'tips':
        return (
          <ul className="space-y-2">
            {carePlan.tips.map((tip, index) => (
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
          {identification.commonName}
        </h1>
        <p className="text-gray-600 mb-4">
          {identification.scientificName}
        </p>

        {/* Image Preview */}
        {imageFile && (
          <div className="max-w-sm mx-auto mb-4">
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Your plant"
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
          </div>
        )}
        
        {/* Confidence indicator */}
        {identification.confidence !== 'high' && (
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            identification.confidence === 'medium' 
              ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}>
            {identification.confidence === 'medium' ? '⚠️ Medium confidence' : '❓ Low confidence'}
          </div>
        )}
        
        {/* Alternative identifications */}
        {identification.alternatives && identification.alternatives.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="font-medium text-blue-800 mb-2">Alternative possibilities:</p>
            <div className="text-sm text-blue-700">
              {identification.alternatives.map((alt, index) => (
                <span key={index}>
                  {alt.commonName} ({alt.scientificName})
                  {index < identification.alternatives!.length - 1 && ', '}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Identifying features */}
        {identification.identifyingFeatures && identification.identifyingFeatures.length > 0 && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="font-medium text-green-800 mb-2">Key identifying features:</p>
            <ul className="text-sm text-green-700 text-left">
              {identification.identifyingFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-md mx-auto">
        <button 
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            isGeneratingPdf
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-plant-green hover:bg-leaf-green text-white'
          }`}
        >
          {isGeneratingPdf ? '⏳ Generating...' : '📄 Download PDF'}
        </button>
        
        <button 
          onClick={handleCreateShareLink}
          disabled={isCreatingShare}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            isCreatingShare
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isCreatingShare ? '⏳ Creating...' : '🔗 Share Link'}
        </button>
        
        <button 
          onClick={handleNewUpload}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
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
              className={`px-3 py-1 text-sm rounded transition-colors duration-200 ${
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