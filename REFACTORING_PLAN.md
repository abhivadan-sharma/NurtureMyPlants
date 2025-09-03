# API Code Consolidation Plan

## Problem Statement

Currently we maintain identical business logic in two separate locations:
- `backend/src/routes/identify.ts` (Express server for local development)
- `api/identify-plant.ts` (Vercel serverless function for production)

This creates several issues:
- **Code duplication** - Same logic exists in two files
- **Maintenance burden** - Changes must be made twice
- **Risk of inconsistency** - Easy to forget updating one location
- **Different frameworks** - Express vs Vercel functions have different HTTP signatures

## Current Architecture

**Local Development:**
- Frontend calls `/api/identify-plant`
- Vite dev server proxies to Express backend on port 3002
- Express routes handle plant identification logic

**Production:**
- Frontend calls `/api/identify-plant`
- Vercel serves frontend statically
- Vercel serverless functions in `/api/` folder handle requests

## Solution Options

### Option 1: Shared Core Logic (Recommended)

Create a shared library approach:

1. **Create shared modules:**
   ```
   shared/
   ├── plant-identification/
   │   ├── prompts.ts
   │   ├── claude-client.ts
   │   └── identification-logic.ts
   └── types/
       └── plant-types.ts
   ```

2. **Extract business logic:**
   - Plant identification prompts
   - Claude API interaction
   - Non-plant detection logic
   - Response formatting

3. **Update both implementations:**
   - Express routes import from shared modules
   - Vercel functions import from shared modules
   - Keep only HTTP handling (req/res) specific to each platform

**Pros:**
- DRY principle maintained
- Single source of truth for business logic
- Maintains flexibility of both environments
- Type safety across implementations

**Cons:**
- Requires initial refactoring effort
- Adds complexity with shared modules

### Option 2: Vercel Functions Only

Remove Express backend entirely:

1. **Remove backend folder**
2. **Use `vercel dev` for local development**
3. **Single codebase in `/api/` folder**

**Pros:**
- Single implementation
- Simpler deployment
- No duplication

**Cons:**
- Loses Express ecosystem benefits
- Less flexible for complex middleware
- Different local dev experience

### Option 3: Deploy Express Backend

Deploy Express backend to cloud platform:

1. **Deploy backend to Vercel/Railway/Render**
2. **Remove duplicate API functions**
3. **Frontend calls single backend URL**

**Pros:**
- Full Express capabilities
- Single backend implementation
- Familiar development model

**Cons:**
- More complex deployment
- Additional hosting costs
- Network latency for API calls

## Recommended Approach

**Option 1 - Shared Core Logic** provides the best balance of:
- Code reusability and maintainability
- Development flexibility
- Production optimization
- Type safety and consistency

## Implementation Steps

1. **Create shared folder structure**
2. **Extract business logic from both implementations**
3. **Create shared types and interfaces**
4. **Update Express routes to use shared logic**
5. **Update Vercel functions to use shared logic**
6. **Add tests for shared modules**
7. **Update documentation**

## Estimated Time to Completion

**1-2 hours** total implementation time

## Status

📋 **Planned** - Not currently being implemented, will be picked up at a later date.

## Benefits After Implementation

- ✅ Single source of truth for plant identification logic
- ✅ Easier to maintain and update features
- ✅ Reduced risk of inconsistencies
- ✅ Better code organization and reusability
- ✅ Improved type safety across implementations