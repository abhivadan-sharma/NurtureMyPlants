import { Router, Request, Response } from 'express';

const router = Router();

// In-memory store for MVP (replace with Redis in production)
const shareStore = new Map<string, any>();

// Generate 6-character share code
const generateShareCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

interface CreateShareLinkRequest {
  plantData: {
    identification: {
      commonName: string;
      scientificName: string;
      confidence: string;
    };
    carePlan: any;
  };
  sessionId: string;
}

router.post('/create-share-link', async (req: Request, res: Response) => {
  try {
    const { plantData, sessionId }: CreateShareLinkRequest = req.body;

    if (!plantData?.identification?.commonName) {
      return res.status(400).json({ error: 'Plant data is required' });
    }

    // Generate unique share code
    let shareCode = generateShareCode();
    while (shareStore.has(shareCode)) {
      shareCode = generateShareCode();
    }

    // Store plant data with expiration (7 days)
    const shareData = {
      ...plantData,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      sessionId
    };

    shareStore.set(shareCode, shareData);

    console.log(`🔗 Created share link ${shareCode} for ${plantData.identification.commonName}`);

    // Clean up expired links (simple cleanup)
    const now = new Date();
    shareStore.forEach((value, key) => {
      if (new Date(value.expiresAt) < now) {
        shareStore.delete(key);
      }
    });

    res.json({
      shareCode,
      shareUrl: `${req.protocol}://${req.get('host')}/plant/${shareCode}`,
      expiresAt: shareData.expiresAt
    });

  } catch (error) {
    console.error('Share link creation error:', error);
    res.status(500).json({ error: 'Failed to create share link' });
  }
});

router.get('/plant/:shareCode', async (req: Request, res: Response) => {
  try {
    const { shareCode } = req.params;

    const shareData = shareStore.get(shareCode.toUpperCase());

    if (!shareData) {
      return res.status(404).json({ error: 'Share link not found or expired' });
    }

    // Check expiration
    if (new Date() > new Date(shareData.expiresAt)) {
      shareStore.delete(shareCode.toUpperCase());
      return res.status(404).json({ error: 'Share link has expired' });
    }

    console.log(`📖 Accessing shared plant: ${shareData.identification.commonName}`);

    res.json({
      plantData: {
        identification: shareData.identification,
        carePlan: shareData.carePlan
      },
      createdAt: shareData.createdAt,
      expiresAt: shareData.expiresAt
    });

  } catch (error) {
    console.error('Share link access error:', error);
    res.status(500).json({ error: 'Failed to access shared plant' });
  }
});

export { router as shareRouter };