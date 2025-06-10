# HapSTR - NYC Property Analytics Platform

HapSTR is a modern web application that provides real-time property analytics and visualization for New York City properties. Built with Next.js 15, it combines multiple mapping technologies, real-time data, and a beautiful user interface to deliver an immersive property exploration experience.

## 🌟 Features

- **Interactive 3D Map Visualization**
  - Real-time property data visualization
  - 3D building rendering with Mapbox GL JS
  - Eagle-eye view for better property context
  - Dynamic property markers and clustering

- **Advanced Property Analytics**
  - Real-time property value tracking
  - Historical data analysis
  - Borough-wise statistics
  - Property type distribution
  - Investment potential indicators

- **Authentication System**
  - Secure Supabase authentication
  - Email/password authentication
  - Social login integration (coming soon)
  - Protected routes and middleware

- **Modern UI/UX**
  - Responsive design
  - Dark mode support
  - Smooth animations with Framer Motion
  - Interactive data visualizations

## 🛠️ Technology Stack

- **Frontend Framework**: Next.js 15.3.3
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Authentication**: Supabase Auth
- **Maps**: 
  - Mapbox GL JS (3D visualization)
  - Google Maps API (geocoding)
- **UI Components**: Custom shadcn/ui components
- **Animations**: Framer Motion
- **Type Safety**: TypeScript

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hapstr10.git
cd hapstr10
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
pnpm dev
```

## 🗺️ Detailed Map Implementation Guide

### Understanding the Map System

The application uses two mapping systems working together:

1. **Mapbox GL JS** (Primary Map)
   - A powerful JavaScript library for interactive maps
   - Provides 3D building visualization
   - Handles real-time property data display
   - Manages user interactions and map controls

2. **Google Maps API** (Supporting Services)
   - Handles address lookups and geocoding
   - Provides location search functionality
   - Validates addresses and coordinates
   - Converts between addresses and coordinates

### How the Map Works

#### 1. Mapbox Setup and Configuration
```typescript
// Initialize Mapbox with your access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Create a new map instance
const map = new mapboxgl.Map({
  container: 'map', // HTML element ID
  style: 'mapbox://styles/mapbox/dark-v11', // Map style
  center: [-74.006, 40.7128], // NYC coordinates
  zoom: 12,
  pitch: 60, // 3D tilt
  bearing: 0
});
```

#### 2. 3D Building Layer
```typescript
// Add 3D building layer
map.addLayer({
  'id': '3d-buildings',
  'source': 'composite',
  'source-layer': 'building',
  'filter': ['==', 'extrude', 'true'],
  'type': 'fill-extrusion',
  'minzoom': 15,
  'paint': {
    'fill-extrusion-color': '#aaa',
    'fill-extrusion-height': [
      'interpolate',
      ['linear'],
      ['zoom'],
      15,
      0,
      15.05,
      ['get', 'height']
    ],
    'fill-extrusion-base': [
      'interpolate',
      ['linear'],
      ['zoom'],
      15,
      0,
      15.05,
      ['get', 'min_height']
    ],
    'fill-extrusion-opacity': 0.6
  }
});
```

#### 3. Property Markers
```typescript
// Add property markers
properties.forEach(property => {
  const marker = new mapboxgl.Marker({
    color: getBoroughColor(property.borough)
  })
    .setLngLat([property.longitude, property.latitude])
    .setPopup(new mapboxgl.Popup().setHTML(`
      <h3>${property.address}</h3>
      <p>Value: $${property.assessland}</p>
    `))
    .addTo(map);
});
```

### Map Features in Detail

1. **3D Building Visualization**
   - Buildings are rendered in 3D using height data
   - Color-coded based on property value or type
   - Interactive hover and click effects
   - Smooth transitions and animations

2. **Property Markers**
   - Dynamic clustering for dense areas
   - Color-coded by borough
   - Interactive popups with property details
   - Smooth animations on hover/click

3. **Map Controls**
   - Zoom in/out buttons
   - Compass for rotation
   - 3D building toggle
   - Map style switcher
   - Fullscreen mode

4. **User Interactions**
   - Click to select properties
   - Hover for quick info
   - Drag to pan
   - Pinch/scroll to zoom
   - Double-click to zoom in

## 🔌 API Integration Guide

### 1. NYC Open Data API

The application fetches property data from NYC's Open Data API:

```typescript
// Fetch property data
const fetchProperties = async () => {
  const response = await fetch(
    'https://data.cityofnewyork.us/resource/64uk-42ks.json'
  );
  const data = await response.json();
  return data.map(formatProperty);
};
```

#### Property Data Structure
```typescript
interface Property {
  borough: string;
  block: number;
  lot: number;
  address: string;
  latitude: number;
  longitude: number;
  assessland: number;
  assesstot: number;
  exempttot: number;
  yearbuilt: number;
  landuse: string;
  ownername: string;
}
```

### 2. Mapbox API

#### Authentication
```typescript
// Initialize Mapbox
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
```

#### Map Styles
- Dark theme: `mapbox://styles/mapbox/dark-v11`
- Satellite: `mapbox://styles/mapbox/satellite-v9`
- Streets: `mapbox://styles/mapbox/streets-v12`

#### Custom Map Controls
```typescript
// Add navigation controls
map.addControl(new mapboxgl.NavigationControl(), 'top-right');

// Add geolocation control
map.addControl(new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  },
  trackUserLocation: true
}));
```

### 3. Google Maps API

#### Geocoding Service
```typescript
// Convert address to coordinates
const geocodeAddress = async (address: string) => {
  const geocoder = new google.maps.Geocoder();
  const result = await geocoder.geocode({ address });
  return result.results[0].geometry.location;
};
```

#### Reverse Geocoding
```typescript
// Convert coordinates to address
const reverseGeocode = async (lat: number, lng: number) => {
  const geocoder = new google.maps.Geocoder();
  const result = await geocoder.geocode({
    location: { lat, lng }
  });
  return result.results[0].formatted_address;
};
```

### 4. Supabase Authentication

#### User Authentication Flow
```typescript
// Sign in function
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data;
};
```

#### Session Management
```typescript
// Check authentication status
const checkAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};
```

## 📊 Data Visualization

### Property Analytics
```typescript
// Calculate borough statistics
const calculateBoroughStats = (properties: Property[]) => {
  return properties.reduce((stats, property) => {
    const borough = property.borough;
    if (!stats[borough]) {
      stats[borough] = {
        totalProperties: 0,
        totalValue: 0,
        averageValue: 0
      };
    }
    stats[borough].totalProperties++;
    stats[borough].totalValue += property.assessland;
    return stats;
  }, {});
};
```

### Real-time Updates
```typescript
// Subscribe to property updates
const subscribeToUpdates = () => {
  const subscription = supabase
    .channel('property_updates')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'properties'
    }, (payload) => {
      updatePropertyOnMap(payload.new);
    })
    .subscribe();
};
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # UI components
│   ├── map/              # Map-related components
│   └── auth/             # Auth-related components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
└── middleware.ts         # Next.js middleware
```

## 🚀 Key Components

### ThreeBackground
- 3D star field animation
- Interactive particle system
- Performance optimized rendering

### EagleMap
- Mapbox GL JS integration
- Property data visualization
- Interactive markers
- Real-time updates

### PropertyCard
- Property information display
- Interactive elements
- Responsive design
- Loading states

## 🔄 Data Flow

1. **Property Data**
   - NYC Open Data API integration
   - Real-time property updates
   - Caching for performance
   - Error handling

2. **User Data**
   - Supabase database integration
   - Real-time updates
   - Secure data handling
   - Optimistic updates

## 🎨 UI/UX Features

- **Responsive Design**
  - Mobile-first approach
  - Adaptive layouts
  - Touch-friendly interactions

- **Animations**
  - Page transitions
  - Loading states
  - Interactive elements
  - Smooth scrolling

- **Theme Support**
  - Dark mode
  - Custom color schemes
  - Consistent styling

## 🔒 Security Features

- JWT-based authentication
- Protected API routes
- Secure environment variables
- CORS configuration
- Rate limiting

## 🚀 Deployment

The application can be deployed to any platform that supports Next.js:

1. Build the application:
```bash
pnpm build
```

2. Start the production server:
```bash
pnpm start
```

## 📈 Performance Optimizations

- Dynamic imports
- Image optimization
- Code splitting
- Caching strategies
- Lazy loading

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- NYC Open Data for property information
- Mapbox for mapping services
- Google Maps for geocoding
- Supabase for authentication
- Next.js team for the amazing framework 