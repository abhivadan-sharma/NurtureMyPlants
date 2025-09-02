// In production, API calls go to /api/* (same domain, no CORS issues)
// In development, use the dev server proxy or environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || (
  window.location.hostname === 'localhost' ? 'http://localhost:3002' : ''
);

export interface PlantIdentification {
  commonName: string;
  scientificName: string;
  confidence: 'high' | 'medium' | 'low';
  identifyingFeatures: string[];
  alternatives: Array<{ commonName: string; scientificName: string }> | null;
}

export interface CarePlan {
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

export interface PlantAnalysisResponse {
  identification: PlantIdentification;
  carePlan: CarePlan;
  sessionId: string;
  timestamp: string;
}

export interface ApiError {
  error: string;
  message?: string;
}

// Convert File to base64 string
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Generate session ID
const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const plantApi = {
  // Identify plant and generate care plan
  identifyPlant: async (imageFile: File): Promise<PlantAnalysisResponse> => {
    try {
      const imageBase64 = await fileToBase64(imageFile);
      const sessionId = generateSessionId();

      const finalUrl = `${API_BASE_URL}/api/identify-plant`;
      
      console.log('🌱 Sending plant identification request...', {
        imageSize: imageFile.size,
        imageType: imageFile.type,
        sessionId,
        hostname: window.location.hostname,
        API_BASE_URL,
        finalUrl
      });

      const response = await fetch(finalUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64,
          sessionId
        }),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({ error: 'Network error' }));
        
        // Handle rate limiting specifically
        if (response.status === 429) {
          throw new Error(errorData.message || 'Too many requests. Please try again later.');
        }
        
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data: PlantAnalysisResponse = await response.json();
      console.log('✅ Plant identification successful:', data.identification.commonName);
      
      return data;
    } catch (error) {
      console.error('❌ Plant identification failed:', error);
      throw error;
    }
  },

  // Generate PDF
  generatePdf: async (plantData: PlantAnalysisResponse): Promise<Blob> => {
    try {
      console.log('📄 Generating PDF for:', plantData.identification.commonName);

      const response = await fetch(`${API_BASE_URL}/api/generate-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plantData,
          sessionId: plantData.sessionId
        }),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({ error: 'PDF generation failed' }));
        
        // Handle rate limiting specifically
        if (response.status === 429) {
          throw new Error(errorData.message || 'Too many PDF requests. Please try again later.');
        }
        
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const pdfBlob = await response.blob();
      console.log('✅ PDF generated successfully');
      
      return pdfBlob;
    } catch (error) {
      console.error('❌ PDF generation failed:', error);
      throw error;
    }
  },

  // Create share link
  createShareLink: async (plantData: PlantAnalysisResponse): Promise<{ shareCode: string; shareUrl: string; expiresAt: string }> => {
    try {
      console.log('🔗 Creating share link for:', plantData.identification.commonName);

      const response = await fetch(`${API_BASE_URL}/api/create-share-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plantData,
          sessionId: plantData.sessionId
        }),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({ error: 'Share link creation failed' }));
        
        // Handle rate limiting specifically  
        if (response.status === 429) {
          throw new Error(errorData.message || 'Too many share link requests. Please try again later.');
        }
        
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const shareData = await response.json();
      console.log('✅ Share link created:', shareData.shareCode);
      
      return shareData;
    } catch (error) {
      console.error('❌ Share link creation failed:', error);
      throw error;
    }
  },

  // Get shared plant data
  getSharedPlant: async (shareCode: string): Promise<{ plantData: PlantAnalysisResponse; createdAt: string; expiresAt: string }> => {
    try {
      console.log('📖 Fetching shared plant:', shareCode);

      const response = await fetch(`${API_BASE_URL}/api/plant/${shareCode}`);

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({ error: 'Shared plant not found' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const sharedData = await response.json();
      console.log('✅ Shared plant data retrieved:', sharedData.plantData.identification.commonName);
      
      return sharedData;
    } catch (error) {
      console.error('❌ Failed to fetch shared plant:', error);
      throw error;
    }
  }
};

export default plantApi;