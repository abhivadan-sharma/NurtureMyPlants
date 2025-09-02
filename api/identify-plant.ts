import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';

interface IdentifyRequest {
  imageBase64: string;
  sessionId: string;
}

interface PlantIdentification {
  commonName: string;
  scientificName: string;
  confidence: 'high' | 'medium' | 'low';
  identifyingFeatures: string[];
  alternatives: Array<{ commonName: string; scientificName: string }> | null;
}

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64, sessionId }: IdentifyRequest = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    console.log(`🔍 Processing plant identification for session: ${sessionId}`);
    
    const apiKey = process.env.ANTHROPIC_API_KEY;
    console.log('🔑 API Key available:', apiKey ? 'Yes' : 'No');
    
    if (!apiKey || apiKey === 'your-api-key-here') {
      console.error('❌ Invalid API key configuration');
      return res.status(500).json({ error: 'API configuration error' });
    }

    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    // Step 1: Identify the plant
    const identificationPrompt = `You are a botanical expert. Analyze this plant image and provide:
1. Plant identification (common name and scientific name)
2. Confidence level (high/medium/low)
3. Key identifying features you observed
4. If uncertain, list top 2-3 possibilities

Return as JSON only, no other text:
{
  "commonName": string,
  "scientificName": string,
  "confidence": "high" | "medium" | "low",
  "identifyingFeatures": string[],
  "alternatives": Array<{commonName: string, scientificName: string}> | null
}`;

    const identificationResponse = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: identificationPrompt },
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: imageBase64.replace(/^data:image\/[a-z]+;base64,/, ''),
              },
            },
          ],
        },
      ],
    });

    const identificationText = identificationResponse.content[0]?.type === 'text' 
      ? identificationResponse.content[0].text 
      : '';

    let plantIdentification: PlantIdentification;
    try {
      plantIdentification = JSON.parse(identificationText);
    } catch (error) {
      console.error('Failed to parse identification response:', identificationText);
      return res.status(500).json({ error: 'Failed to identify plant' });
    }

    console.log(`✅ Identified plant: ${plantIdentification.commonName}`);

    // Step 2: Generate care plan
    const carePlanPrompt = `Generate a comprehensive care plan for ${plantIdentification.commonName} (${plantIdentification.scientificName}). Include:

1. Watering: frequency, amount, seasonal variations
2. Light: ideal conditions, tolerance range
3. Temperature & Humidity: optimal ranges
4. Soil: type, pH, drainage needs
5. Fertilizing: schedule, type
6. Common Problems: pests, diseases, solutions
7. Pruning & Maintenance: when and how
8. Special Care Tips: propagation, repotting

Format as JSON only, no other text. Use clear, actionable advice for beginners:
{
  "plantName": "${plantIdentification.commonName}",
  "watering": {
    "frequency": string,
    "amount": string,
    "seasonalNotes": string
  },
  "light": {
    "ideal": string,
    "tolerates": string
  },
  "temperature": {
    "optimal": string,
    "minimum": string
  },
  "humidity": string,
  "soil": {
    "type": string,
    "pH": string,
    "drainage": string
  },
  "fertilizing": {
    "schedule": string,
    "type": string
  },
  "commonProblems": [
    {
      "issue": string,
      "solution": string
    }
  ],
  "maintenance": {
    "pruning": string,
    "repotting": string
  },
  "tips": [string]
}`;

    const carePlanResponse = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: carePlanPrompt,
        },
      ],
    });

    const carePlanText = carePlanResponse.content[0]?.type === 'text' 
      ? carePlanResponse.content[0].text 
      : '';

    let carePlan: CarePlan;
    try {
      carePlan = JSON.parse(carePlanText);
    } catch (error) {
      console.error('Failed to parse care plan response:', carePlanText);
      return res.status(500).json({ error: 'Failed to generate care plan' });
    }

    console.log(`📋 Generated care plan for ${carePlan.plantName}`);

    // Return combined response
    res.json({
      identification: plantIdentification,
      carePlan: carePlan,
      sessionId: sessionId,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Plant identification error:', error);
    
    if (error instanceof Error && error.message.includes('rate_limit')) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }
    
    res.status(500).json({ error: 'Failed to process plant identification' });
  }
}