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

## 🗺️ Map Implementation

### Mapbox Integration
The application uses Mapbox GL JS for 3D visualization with the following features:
- Custom 3D building layer
- Dynamic property markers
- Interactive property selection
- Real-time data updates
- Custom map styles and controls

### Google Maps Integration
Google Maps API is used for:
- Geocoding services
- Address validation
- Location search
- Reverse geocoding

## 🔐 Authentication System

The authentication system is built using Supabase Auth with the following features:

### Implementation Details
- Client-side authentication using `useAuth` hook
- Protected routes with middleware
- Session management
- Secure token handling
- Automatic session refresh

### Authentication Flow
1. User enters credentials
2. Supabase Auth validates credentials
3. JWT token is generated and stored
4. Session is maintained across page refreshes
5. Protected routes check for valid session

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