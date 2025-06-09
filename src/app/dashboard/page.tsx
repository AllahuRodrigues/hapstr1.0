"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Building2,
  Eye,
  MapPin,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Search,
  Filter,
  Download,
  Bell,
  Settings,
  BarChart3,
  PieChart,
  LineChart,
  Home,
  Camera,
  Navigation,
  Zap
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { ThreeBackground } from '@/components/three-background'

interface Property {
  id: string
  address: string
  borough: string
  price: number
  sqft: number
  bedrooms: number
  bathrooms: number
  yearBuilt: number
  zoning: string
  status: 'available' | 'sold' | 'pending'
  images: string[]
  coordinates: [number, number]
}

export default function DashboardPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBorough, setSelectedBorough] = useState('all')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Simulate fetching NYC properties data
    setTimeout(() => {
      setProperties([
        {
          id: '1',
          address: '123 Broadway, Manhattan',
          borough: 'Manhattan',
          price: 2500000,
          sqft: 1200,
          bedrooms: 2,
          bathrooms: 2,
          yearBuilt: 2018,
          zoning: 'R7A',
          status: 'available',
          images: ['/api/placeholder/400/300'],
          coordinates: [-73.9857, 40.7484]
        },
        {
          id: '2',
          address: '456 Park Ave, Brooklyn',
          borough: 'Brooklyn',
          price: 850000,
          sqft: 900,
          bedrooms: 1,
          bathrooms: 1,
          yearBuilt: 2020,
          zoning: 'R6',
          status: 'pending',
          images: ['/api/placeholder/400/300'],
          coordinates: [-73.9442, 40.6782]
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const stats = [
    {
      title: "Total Properties",
      value: "1.8M+",
      change: "+12.5%",
      icon: Building2,
      color: "text-blue-400"
    },
    {
      title: "Properties Viewed",
      value: "2,847",
      change: "+18.2%",
      icon: Eye,
      color: "text-green-400"
    },
    {
      title: "Avg Property Value",
      value: "$1.2M",
      change: "+5.8%",
      icon: DollarSign,
      color: "text-yellow-400"
    },
    {
      title: "Active Listings",
      value: "45,382",
      change: "+9.1%",
      icon: TrendingUp,
      color: "text-purple-400"
    }
  ]

  const boroughData = [
    { name: 'Manhattan', properties: 400000, avgPrice: 2500000, color: 'bg-red-500' },
    { name: 'Brooklyn', properties: 650000, avgPrice: 850000, color: 'bg-blue-500' },
    { name: 'Queens', properties: 550000, avgPrice: 675000, color: 'bg-green-500' },
    { name: 'Bronx', properties: 350000, avgPrice: 425000, color: 'bg-yellow-500' },
    { name: 'Staten Island', properties: 180000, avgPrice: 580000, color: 'bg-purple-500' }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <ThreeBackground />
      <Navbar />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  NYC Real Estate Dashboard
                </h1>
                <p className="text-gray-400">
                  Comprehensive property intelligence across all five boroughs
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button className="bg-white/10 hover:bg-white/20 border border-white/20">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button className="bg-white text-black hover:bg-gray-200">
                  <Search className="w-4 h-4 mr-2" />
                  Search Properties
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Rest of the component */}
          {/* ... (existing code) */}
        </div>
      </div>
    </div>
  )
} 