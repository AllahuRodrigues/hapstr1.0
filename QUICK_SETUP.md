# Quick Setup Guide - HapSTR NYC Maps

## 🚀 Getting the NYC Maps to Work

The platform uses **Mapbox 3D** with live NYC PLUTO data for comprehensive property information.

### **Mapbox 3D** (Recommended)
- **Status**: ✅ Ready to use with token
- **Features**: 3D buildings, satellite view, smooth navigation, NYC-focused
- **Required**: `NEXT_PUBLIC_MAPBOX_TOKEN`
- **Data Source**: Live NYC PLUTO API ([data.cityofnewyork.us](https://data.cityofnewyork.us/resource/64uk-42ks.json))

## ⚡ Quick Start

### Setup Mapbox
1. Get token from [Mapbox](https://mapbox.com) (free tier available)
2. Add to `.env.local`:
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here
   ```
3. Restart dev server
4. Go to `/demo` to explore NYC properties

## 🎯 What Works Right Now

✅ **NYC PLUTO API Integration** - Live city property data  
✅ **Click-to-Explore** - Click anywhere on the map to find properties  
✅ **Property Details** - Zoning, assessed values, building characteristics  
✅ **3D Navigation** - 60° tilted satellite view with smooth 3D buildings  
✅ **Interactive Maps** - Mapbox-powered with NYC focus  
✅ **Responsive Design** - Works on desktop and mobile  
✅ **All 5 Boroughs** - Manhattan, Brooklyn, Queens, Bronx, Staten Island

## 🔧 If Map is Empty

**Likely causes:**
1. Missing Mapbox token (see above)
2. Need to restart development server
3. Browser console errors (check dev tools)

**Quick fixes:**
1. Copy `env.example` to `.env.local`
2. Add Mapbox token
3. Restart with `npm run dev`

## 📊 NYC Data Features

**Live PLUTO Data includes:**
- Building classifications
- Zoning information  
- Assessed land and total values
- Building dimensions and floor counts
- Land use categories
- Year built and alterations
- Residential/commercial unit counts
- Borough, block, and lot numbers
- Council and community districts

**API Endpoint:**

## 📍 Demo URLs

- **Main Demo**: `/demo` - Choose between 3 map types
- **Direct Mapbox**: Use Mapbox 3D tab  

## 🎮 How to Use

1. **Navigate to** `/demo`
2. **Choose a map tab** (Mapbox)
3. **Click anywhere** on the map
4. **View property details** in the popup card
5. **Close card** and click elsewhere to search again

## 🛠 Development Notes

- All maps have fallback systems
- Property search works in real-time
- California-focused for real estate data 