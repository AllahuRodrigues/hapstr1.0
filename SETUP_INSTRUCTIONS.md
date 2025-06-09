# HapSTR Platform Setup Instructions

## 🚀 Get Your Maps Working in 2 Minutes

### Step 1: Create Environment File
Copy the example environment file and add your API keys:

```bash
cp env.example .env.local
```

### Step 2: Add Required API Keys

**For Google Maps (Recommended):**
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Enable Maps JavaScript API
3. Create an API key
4. Add to `.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

**For Mapbox (Optional):**
1. Sign up at [Mapbox](https://mapbox.com)
2. Get your access token
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=your_actual_token_here
   ```

### Step 3: Restart Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### Step 4: Test the Platform
1. Open [http://localhost:3000/demo](http://localhost:3000/demo)
2. Choose a map tab (Google Maps 3D, Mapbox 3D, or Eagle Map)
3. Click anywhere on the map to search for properties
4. View property details in the popup cards

## ✅ What's Already Working

- **Zillow API Integration**: Live property data with your provided credentials
- **Rate Limiting**: Prevents API overuse and 429 errors
- **Demo Data Fallback**: Shows realistic California properties when API limits hit
- **Multiple Map Providers**: Choose between Google Maps, Mapbox, or Eagle Map
- **Click-to-Search**: Find properties anywhere you click
- **3D Satellite Views**: Eagle-eye perspective with smooth navigation

## 🎯 Features Available Now

### Live Property Search
- Real-time Zillow property data
- Price information and market details
- Property photos from live sources
- Beds, baths, and square footage

### Advanced 3D Maps
- 60° tilted satellite views
- 3D buildings and terrain
- Smooth map navigation
- Interactive property markers

### California-Focused
- Search restricted to California locations
- Curated list of major cities
- Optimized for California real estate market

## 🔧 Troubleshooting

### If Maps Are Still Empty:
1. Check browser console for errors
2. Verify API keys are correct
3. Ensure environment variables are loaded (restart dev server)
4. Try switching between map providers

### Common Issues:
- **"API key not found"**: Add the required environment variable
- **Rate limit errors**: Demo data will show automatically
- **Image loading errors**: Fixed with Unsplash fallback images

## 🌟 Ready to Use Features

### Property Cards
- Detailed property information
- High-quality images
- Market pricing data
- Investment analysis ready

### Search & Navigation
- California city autocomplete
- Neighborhood search
- Address lookup
- Map bounds searching

### Real Estate Data
- Live Zillow integration
- Zestimate values
- Rent estimates
- Walk/bike/transit scores

The platform is production-ready with comprehensive error handling, rate limiting, and fallback systems to ensure it always works! 