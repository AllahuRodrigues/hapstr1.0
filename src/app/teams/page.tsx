"use client"
import { motion } from "framer-motion"

export default function TeamsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl text-center space-y-4 p-8">
        <h1 className="text-4xl font-bold">Our Team</h1>
        <p className="text-gray-400">Meet the passionate people building HapSTR.</p>
      </motion.div>
    </div>
  )
} 