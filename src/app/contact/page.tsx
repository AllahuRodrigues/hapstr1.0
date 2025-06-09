"use client"
import { motion } from "framer-motion"

export default function ContactPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl text-center space-y-4 p-8">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="text-gray-400">
          Questions? Email&nbsp;
          <a href="mailto:hello@hapstr.ai" className="underline">hello@hapstr.ai</a>
        </p>
      </motion.div>
    </div>
  )
} 