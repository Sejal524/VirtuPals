"use client"

import { useGame } from "@/contexts/game-context"
import { PetSelector } from "@/components/pet-selector"
import { Navbar } from "@/components/navbar"
import { PetDisplay } from "@/components/pet-display"
import { CareActions } from "@/components/care-actions"
import { AIChatbot } from "@/components/ai-chatbot"
import { ActivityLog } from "@/components/activity-log"
import Link from "next/link"
import { Wallet, TrendingUp, ShoppingBag } from "lucide-react"

export default function HomePage() {
  const { pet, hasCompletedSetup, wallet, savings, totalEarned, totalSpent } = useGame()

  if (!hasCompletedSetup || !pet) {
    return <PetSelector />
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">{pet.name} is waiting for you. How will you care for them today?</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Wallet className="w-4 h-4" />
              <span className="text-sm">Wallet</span>
            </div>
            <p className="text-2xl font-bold text-foreground">${wallet.toFixed(2)}</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Savings</span>
            </div>
            <p className="text-2xl font-bold text-primary">${savings.toFixed(2)}</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <span className="text-sm">Total Earned</span>
            </div>
            <p className="text-2xl font-bold text-green-600">${totalEarned.toFixed(2)}</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <span className="text-sm">Total Spent</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">${totalSpent.toFixed(2)}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pet Display */}
          <div className="bg-card rounded-2xl p-8 border border-border shadow-lg">
            <PetDisplay size="lg" showStats={true} />
          </div>

          {/* Actions & Quick Links */}
          <div className="space-y-6">
            {/* Care Actions */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
              <CareActions />
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-3 gap-3">
              <Link
                href="/wallet"
                className="flex flex-col items-center p-3 bg-secondary/50 hover:bg-secondary rounded-xl transition-colors group"
              >
                <span className="text-2xl mb-1">💰</span>
                <p className="font-bold text-secondary-foreground text-sm">Wallet</p>
              </Link>
              <Link
                href="/tasks"
                className="flex flex-col items-center p-3 bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors group"
              >
                <span className="text-2xl mb-1">✅</span>
                <p className="font-bold text-foreground text-sm">Tasks</p>
              </Link>
              <Link
                href="/shop"
                className="flex flex-col items-center p-3 bg-accent/20 hover:bg-accent/30 rounded-xl transition-colors group"
              >
                <ShoppingBag className="w-6 h-6 mb-1 text-accent-foreground" />
                <p className="font-bold text-foreground text-sm">Shop</p>
              </Link>
            </div>

            {/* Financial Tip */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-5 border border-primary/20">
              <h3 className="font-bold text-foreground flex items-center gap-2 mb-2">Financial Tip of the Day</h3>
              <p className="text-muted-foreground text-sm">
                Try to save at least 20% of what you earn! It helps build good habits and gives you a safety net for
                unexpected expenses like vet visits.
              </p>
            </div>
          </div>

          <div>
            <ActivityLog />
          </div>
        </div>
      </main>

      <AIChatbot />
    </div>
  )
}
