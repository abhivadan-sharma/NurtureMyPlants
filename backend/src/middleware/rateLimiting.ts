import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// Rate limiting based on PRD requirements:
// - Per session: 10 identifications per hour  
// - Global: 1000 identifications per day

export const plantIdentificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 10, // Limit each IP to 10 requests per hour
  message: {
    error: 'Too many plant identifications',
    message: 'You have exceeded the limit of 10 plant identifications per hour. Please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    console.log(`🚫 Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many plant identifications',
      message: 'You have exceeded the limit of 10 plant identifications per hour. Please try again later.',
      retryAfter: '1 hour'
    });
  }
});

export const globalApiLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hour window (1 day)
  max: 1000, // Limit all requests to 1000 per day globally
  message: {
    error: 'Daily API limit exceeded',
    message: 'The daily limit of 1000 plant identifications has been reached. Please try again tomorrow.',
    retryAfter: '24 hours'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.log(`🚫 Global daily limit exceeded. Current time: ${new Date().toISOString()}`);
    res.status(429).json({
      error: 'Daily API limit exceeded',
      message: 'The daily limit of 1000 plant identifications has been reached. Please try again tomorrow.',
      retryAfter: '24 hours'
    });
  }
});

// General API rate limiter for other endpoints (more lenient)
export const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  message: {
    error: 'Too many requests',
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// PDF generation rate limiter (less restrictive since it uses existing data)
export const pdfGenerationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 PDF generations per hour per IP
  message: {
    error: 'Too many PDF requests',
    message: 'You have exceeded the limit for PDF generation. Please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Share link creation rate limiter
export const shareLinkLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour  
  max: 20, // 20 share links per hour per IP
  message: {
    error: 'Too many share link requests',
    message: 'You have exceeded the limit for creating share links. Please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false
});