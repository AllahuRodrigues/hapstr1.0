"use client"
import { motion } from "framer-motion"

export default function CareersPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl text-center space-y-4 p-8">
        <h1 className="text-4xl font-bold">Careers at HapSTR</h1>
        <p className="text-gray-400">No openings right now – check back soon!</p>
      </motion.div>
    </div>
  )
} 