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
    <div className="min-h-screen bg-gradient-to-br from-soft-mint via-white to-nature-beige">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block p-3 bg-white rounded-full shadow-lg mb-4">
            <span className="text-3xl">🌿</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold bg-gradient-to-r from-plant-green via-leaf-green to-forest-green bg-clip-text text-transparent mb-3">
            {identification.commonName}
          </h1>
          <p className="text-sage-green text-lg italic mb-6 font-medium">
            {identification.scientificName}
          </p>

        {/* Image Preview */}
        {imageFile && (
          <div className="max-w-xs mx-auto mb-6">
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Your plant"
              className="w-full h-40 object-cover rounded-xl shadow-lg ring-2 ring-green-100"
            />
          </div>
        )}
        
          {/* Confidence indicator */}
          {identification.confidence !== 'high' && (
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm border ${
              identification.confidence === 'medium' 
                ? 'bg-amber-100/80 text-amber-800 border-amber-200'
                : 'bg-red-100/80 text-red-800 border-red-200'
            }`}>
              {identification.confidence === 'medium' ? '⚠️ Medium Confidence' : '❓ Low Confidence'}
            </div>
          )}
        
          {/* Alternative identifications */}
          {identification.alternatives && identification.alternatives.length > 0 && (
            <div className="mt-6 p-5 bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-2xl">
              <p className="font-display font-semibold text-blue-800 mb-3">Alternative possibilities:</p>
              <div className="text-blue-700">
                {identification.alternatives.map((alt, index) => (
                  <span key={index} className="inline-block bg-white/70 rounded-full px-3 py-1 text-sm mr-2 mb-2">
                    {alt.commonName} <em className="text-blue-600">({alt.scientificName})</em>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Identifying features */}
          {identification.identifyingFeatures && identification.identifyingFeatures.length > 0 && (
            <div className="mt-6 p-5 bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-2xl">
              <p className="font-display font-semibold text-green-800 mb-4">Key identifying features:</p>
              <ul className="text-green-700 text-left space-y-2">
                {identification.identifyingFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-plant-green mr-3 text-lg">•</span>
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 max-w-2xl mx-auto animate-slide-up">
          <button 
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
              isGeneratingPdf
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-plant-green to-leaf-green hover:from-leaf-green hover:to-forest-green text-white hover:shadow-xl transform hover:scale-105'
            }`}
          >
            {isGeneratingPdf ? '⏳ Generating...' : '📄 Download PDF'}
          </button>
          
          <button 
            onClick={handleCreateShareLink}
            disabled={isCreatingShare}
            className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
              isCreatingShare
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white hover:shadow-xl transform hover:scale-105'
            }`}
          >
            {isCreatingShare ? '⏳ Creating...' : '🔗 Share Link'}
          </button>
          
          <button 
            onClick={handleNewUpload}
            className="flex-1 bg-gradient-to-r from-sage-green to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            📷 New Upload
          </button>
        </div>

        {/* Care Plan Tabs */}
        <div className="max-w-6xl mx-auto">
          {/* Mobile: Modern Dropdown */}
          <div className="md:hidden mb-8">
            <div className="relative">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full p-5 pr-12 border-2 border-green-200 rounded-2xl bg-gradient-to-r from-white to-green-50 backdrop-blur-sm text-gray-800 font-semibold text-lg shadow-xl focus:ring-4 focus:ring-green-300 focus:border-green-400 transition-all duration-300 appearance-none cursor-pointer hover:shadow-2xl"
              >
                {tabs.map(tab => (
                  <option key={tab.id} value={tab.id} className="p-4 text-lg font-medium">
                    {tab.label}
                  </option>
                ))}
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Desktop: Modern Tab Navigation */}
          <div className="hidden md:flex flex-wrap justify-center bg-white/60 backdrop-blur-sm rounded-2xl p-2 mb-8 border border-white/30">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium text-sm rounded-xl transition-all duration-300 mx-1 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-plant-green to-leaf-green text-white shadow-lg transform scale-105'
                    : 'text-sage-green hover:text-gray-800 hover:bg-white/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 min-h-[350px] border border-white/30">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-display font-bold text-gray-800">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h3>
              <button
                onClick={() => handleCopySection(JSON.stringify(renderTabContent()))}
                className={`px-4 py-2 text-sm rounded-xl transition-all duration-300 font-medium ${
                  copied 
                    ? 'bg-green-100 text-green-700 shadow-inner' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-md hover:shadow-lg transform hover:scale-105'
                }`}
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>
            <div className="text-gray-700 leading-relaxed text-lg">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;