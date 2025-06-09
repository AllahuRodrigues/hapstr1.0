"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"

export function Newsletter() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [email, setEmail] = React.useState("")

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    setEmail("")
  }

  return (
    <div className="relative isolate overflow-hidden bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Stay up to date
          </h2>
          <p className="mt-2 text-lg leading-8 text-muted-foreground">
            Get the latest updates on new properties and features.
          </p>
        </div>
        <form onSubmit={onSubmit} className="mx-auto mt-10 max-w-md">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <Label htmlFor="email" className="sr-only">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Subscribe
            </Button>
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            We care about your data. Read our{" "}
            <a href="#" className="font-medium underline underline-offset-4">
              privacy policy
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  )
} 