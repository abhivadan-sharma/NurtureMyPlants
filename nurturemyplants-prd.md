# Product Requirements Document (PRD)
## NurtureMyPlants.com MVP

### 1. Product Overview

**Product Name:** NurtureMyPlants.com  
**Product Type:** Web Application (Mobile-First)  
**Primary Function:** Plant identification and care plan generation using LLM vision capabilities  
**Target Users:** Home gardeners and plant enthusiasts  
**Development Approach:** Claude Code as primary developer

### 2. Technical Stack & Dependencies

**Frontend:**
- React with TypeScript
- Tailwind CSS for styling
- Vite for build tooling

**Backend:**
- Node.js with Express and TypeScript
- Anthropic Claude API for plant identification and care plans
- PDFKit for PDF generation
- Redis for session storage (or in-memory for true MVP)

**Deployment:**
- Vercel for hosting
- Environment variables for API keys

### 3. Core Features Specification

#### 3.1 Image Upload & Processing
**User Flow:**
1. User lands on homepage with clear CTA: "Upload Plant Photo"
2. Click/tap opens file selector or enables drag-and-drop
3. Image preview shown after selection
4. "Identify Plant" button triggers processing

**Technical Requirements:**
- Accept JPEG, PNG, WebP formats
- Max file size: 10MB
- Client-side image compression to 1024x1024 before API call
- Loading state during processing
- Error handling for invalid files

**Implementation Notes:**
```typescript
// Image processing pipeline
1. Validate file type and size
2. Compress/resize using canvas API
3. Convert to base64
4. Send to backend endpoint
```

#### 3.2 LLM Plant Identification
**API Endpoint:** `POST /api/identify-plant`

**Request Payload:**
```typescript
{
  imageBase64: string,
  sessionId: string
}
```

**LLM Prompt Structure:**
```
You are a botanical expert. Analyze this plant image and provide:
1. Plant identification (common name and scientific name)
2. Confidence level (high/medium/low)
3. Key identifying features you observed
4. If uncertain, list top 2-3 possibilities

Return as JSON:
{
  "commonName": string,
  "scientificName": string,
  "confidence": "high" | "medium" | "low",
  "identifyingFeatures": string[],
  "alternatives": Array<{commonName: string, scientificName: string}> | null
}
```

**Error Handling:**
- Timeout after 30 seconds
- Retry logic (1 retry)
- Fallback message for failed identification

#### 3.3 Care Plan Generation
**Triggered After:** Successful plant identification

**LLM Prompt Structure:**
```
Generate a comprehensive care plan for [plant name]. Include:

1. Watering: frequency, amount, seasonal variations
2. Light: ideal conditions, tolerance range
3. Temperature & Humidity: optimal ranges
4. Soil: type, pH, drainage needs
5. Fertilizing: schedule, type
6. Common Problems: pests, diseases, solutions
7. Pruning & Maintenance: when and how
8. Special Care Tips: propagation, repotting

Format as JSON with clear, actionable advice for beginners.
```

**Response Format:**
```typescript
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
```

#### 3.4 Results Display
**Layout:**
- Plant name (large, prominent)
- Confidence indicator (if not high)
- Tabbed interface for care categories
- Mobile: Accordion-style sections
- Print-friendly CSS

**Interactive Elements:**
- Copy individual sections
- Expand/collapse sections
- Download as PDF button
- Generate shareable link

#### 3.5 PDF Generation
**Endpoint:** `POST /api/generate-pdf`

**PDF Contents:**
- Header with plant name and date
- All care information in readable format
- NurtureMyPlants.com branding (subtle)
- QR code linking back to web version

#### 3.6 Share Functionality
**Endpoint:** `POST /api/create-share-link`

**Implementation:**
- Generate unique 6-character code
- Store care plan in Redis with 7-day TTL
- URL format: `nurturemyplants.com/plant/ABC123`
- Read-only view of care plan

### 4. UI/UX Requirements

**Design Principles:**
- Clean, minimal interface
- Nature-inspired color palette (greens, earth tones)
- High contrast for outdoor use
- Large touch targets for mobile

**Key Screens:**
1. **Homepage**
   - Hero section with upload CTA
   - Brief explanation of service
   - Example results preview

2. **Processing Screen**
   - Animated loader
   - Fun plant facts during wait
   - Cancel option

3. **Results Screen**
   - Clear hierarchy of information
   - Visual indicators (icons) for each care category
   - Sticky action bar (Download/Share)

4. **Error States**
   - Friendly error messages
   - Suggested actions
   - Try again button

### 5. Performance Requirements

- Initial page load: < 3 seconds
- Image upload: < 2 seconds
- LLM response: < 15 seconds
- PDF generation: < 5 seconds
- Mobile score: > 90 on Lighthouse

### 6. Development Phases

**Phase 1: Foundation (Days 1-3)**
- Project setup with TypeScript
- Basic routing and components
- Image upload component
- Claude API integration test

**Phase 2: Core Flow (Days 4-10)**
- Complete upload → identify → care plan flow
- Error handling
- Loading states
- Results display

**Phase 3: Export Features (Days 11-14)**
- PDF generation
- Share link functionality
- Copy to clipboard

**Phase 4: Polish & Deploy (Days 15-18)**
- Responsive design refinement
- Performance optimization
- Deployment to Vercel
- Testing on real devices

### 7. API Rate Limiting & Cost Control

```typescript
// Rate limiting rules
- Per session: 10 identifications per hour
- Global: 1000 identifications per day
- Implement exponential backoff
- Cache common plant care plans
```

### 8. Monitoring & Analytics

**Track:**
- Daily API calls
- Successful vs failed identifications
- Popular plants
- Error rates
- User flow completion

**Tools:**
- Vercel Analytics
- Custom event logging
- API usage dashboard

### 9. Future Enhancements (Post-MVP)
- Plant health diagnosis from photos
- Care reminders (email/SMS)
- Community features
- Plant journal
- Multiple plant management

### 10. Success Criteria

- Successfully identify 80%+ of common houseplants
- Generate accurate care plans
- Mobile-friendly experience
- < $0.50 cost per identification
- 5-second total user journey

---

**Note for Claude Code:** Start with Phase 1, focusing on getting the basic React app structure in place with TypeScript. The image upload component and Claude API integration are the critical first pieces. All UI should be mobile-first with Tailwind CSS. Keep the codebase simple and well-commented for easy iteration.