# Sample Plant Images for Testing

This folder contains sample plant images you can use to test the NurtureMyPlants application.

## Testing Instructions

1. **Navigate to:** http://localhost:5174 (or your frontend URL)
2. **Upload any image** from this folder using:
   - Click the upload area and select a file
   - Drag and drop an image onto the upload area

## Supported Formats
- ✅ JPEG (.jpg, .jpeg)  
- ✅ PNG (.png)
- ✅ WebP (.webp)
- ❌ HEIC (.heic, .heif) - Not supported yet
- ❌ Other formats will show an error

## File Size Limit
- Maximum: 10MB per image
- Images are automatically compressed to 1024x1024 pixels

## What to Test

### Image Upload Component
- [ ] Click to upload functionality
- [ ] Drag and drop functionality  
- [ ] File format validation (try unsupported formats)
- [ ] File size validation (try very large files)
- [ ] Image preview after selection
- [ ] Remove image functionality

### User Flow
- [ ] Upload → Processing screen with animated progress
- [ ] Processing → Results screen with plant identification
- [ ] Results → Tabbed care plan interface
- [ ] Mobile responsiveness on different screen sizes

## Note
Currently using **mock data** in Phase 1. The actual Claude API integration will be implemented in Phase 2, so all uploads will show the same sample plant identification (Fiddle Leaf Fig) regardless of the actual image uploaded.

## Add Your Own Images
Feel free to add your own plant photos to this folder for testing! Just make sure they're:
- Common houseplants or outdoor plants
- Clear, well-lit photos
- Close-up shots showing plant details
- Under 10MB file size