"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"

const team = [
  {
    name: "Sarah Johnson",
    role: "CEO & Co-Founder",
    bio: "Former real estate tech executive with 15+ years of experience in property technology and market analysis.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  },
  {
    name: "Michael Chen",
    role: "CTO & Co-Founder",
    bio: "AR/VR expert with a background in computer vision and spatial computing. Previously led tech at a major AR startup.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  },
  {
    name: "David Rodriguez",
    role: "Lead Software Engineer",
    bio: "Full-stack developer specializing in 3D visualization and real-time data processing. Built several successful real estate platforms.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
  },
  {
    name: "Emily Martinez",
    role: "Senior Real Estate Agent",
    bio: "Top-producing agent in Los Angeles with expertise in luxury properties and market trends. 10+ years of experience.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
  },
]

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/50" />
        <video
          className="h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/real-estate-demo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="mb-4 text-5xl font-bold">About Hapstr</h1>
            <p className="text-xl">
              Revolutionizing Real Estate with Augmented Reality
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="mb-6 text-3xl font-bold">Our Mission</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Based in California, Hapstr is on a mission to transform how people
            experience and interact with real estate. We combine cutting-edge AR
            technology with comprehensive property data to create an immersive
            platform that makes property exploration intuitive and engaging.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Pushing the boundaries of what's possible in real estate
                  technology
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Providing clear, accurate information to empower better
                  decisions
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Accessibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Making property exploration accessible to everyone, anywhere
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* Team Section */}
      <section className="container py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-6xl"
        >
          <h2 className="mb-12 text-center text-3xl font-bold">Our Team</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="relative mb-4 aspect-square overflow-hidden rounded-lg">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="object-cover"
                      />
                    </div>
                    <CardTitle>{member.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {member.role}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Technology Section */}
      <section className="container py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="mb-6 text-3xl font-bold">Our Technology</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            We leverage state-of-the-art AR technology, 3D mapping, and real-time
            data processing to create an immersive property exploration
            experience. Our platform combines:
          </p>
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <Icons.spinner className="mb-4 h-8 w-8" />
                <CardTitle>AR Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Real-time property visualization with accurate measurements and
                  spatial awareness
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icons.spinner className="mb-4 h-8 w-8" />
                <CardTitle>Data Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Comprehensive property data from multiple sources, updated in
                  real-time
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>
    </div>
  )
} 