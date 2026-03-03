"use client"

import { useGame } from "@/contexts/game-context"
import { PetSelector } from "@/components/pet-selector"
import { Navbar } from "@/components/navbar"
import { PetDisplay } from "@/components/pet-display"
import { CareActions } from "@/components/care-actions"
import { AIChatbot } from "@/components/ai-chatbot"
import { ActivityLog } from "@/components/activity-log"
import { GameClock } from "@/components/game-clock"
import Link from "next/link"
import { Wallet, TrendingUp, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"

export default function HomePage() {
  const { pet, hasCompletedSetup, wallet, savings, totalEarned, totalSpent, getTimeOfDay } = useGame()

  if (!hasCompletedSetup || !pet) {
    return <PetSelector />
  }

  const timeOfDay = getTimeOfDay()

  const bgClasses = {
    morning: "bg-gradient-to-b from-amber-50 via-yellow-50/50 to-background",
    afternoon: "bg-gradient-to-b from-sky-50 via-blue-50/30 to-background",
    evening: "bg-gradient-to-b from-orange-100/60 via-rose-50/30 to-background",
    night: "bg-gradient-to-b from-slate-800 via-indigo-900/30 to-slate-900",
  }

  const isNight = timeOfDay === "night"

  return (
    <div className={cn("min-h-screen transition-colors duration-[3000ms]", bgClasses[timeOfDay])}>
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Clock + Welcome */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="flex flex-col justify-center">
            <h1 className={cn("text-4xl font-bold mb-2 text-balance", isNight ? "text-white" : "text-foreground")}>
              Welcome back!
            </h1>
            <p className={cn(isNight ? "text-slate-300" : "text-muted-foreground")}>
              {pet.name} is waiting for you. How will you care for them today?
            </p>
          </div>
          <GameClock />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className={cn("rounded-xl p-4 border shadow-sm", isNight ? "bg-slate-800/80 border-slate-700" : "bg-card border-border")}>
            <div className="flex items-center gap-2 mb-1">
              <Wallet className={cn("w-4 h-4", isNight ? "text-slate-400" : "text-muted-foreground")} />
              <span className={cn("text-sm", isNight ? "text-slate-400" : "text-muted-foreground")}>Wallet</span>
            </div>
            <p className={cn("text-2xl font-bold", isNight ? "text-white" : "text-foreground")}>${wallet.toFixed(2)}</p>
          </div>
          <div className={cn("rounded-xl p-4 border shadow-sm", isNight ? "bg-slate-800/80 border-slate-700" : "bg-card border-border")}>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className={cn("w-4 h-4", isNight ? "text-slate-400" : "text-muted-foreground")} />
              <span className={cn("text-sm", isNight ? "text-slate-400" : "text-muted-foreground")}>Savings</span>
            </div>
            <p className={cn("text-2xl font-bold", isNight ? "text-sky-300" : "text-primary")}>${savings.toFixed(2)}</p>
          </div>
          <div className={cn("rounded-xl p-4 border shadow-sm", isNight ? "bg-slate-800/80 border-slate-700" : "bg-card border-border")}>
            <div className="flex items-center gap-2 mb-1">
              <span className={cn("text-sm", isNight ? "text-slate-400" : "text-muted-foreground")}>Total Earned</span>
            </div>
            <p className={cn("text-2xl font-bold", isNight ? "text-emerald-400" : "text-green-600")}>${totalEarned.toFixed(2)}</p>
          </div>
          <div className={cn("rounded-xl p-4 border shadow-sm", isNight ? "bg-slate-800/80 border-slate-700" : "bg-card border-border")}>
            <div className="flex items-center gap-2 mb-1">
              <span className={cn("text-sm", isNight ? "text-slate-400" : "text-muted-foreground")}>Total Spent</span>
            </div>
            <p className={cn("text-2xl font-bold", isNight ? "text-orange-400" : "text-orange-600")}>${totalSpent.toFixed(2)}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pet Display */}
          <div className={cn("rounded-2xl p-8 border shadow-lg", isNight ? "bg-slate-800/80 border-slate-700" : "bg-card border-border")}>
            <PetDisplay size="lg" showStats={true} />
          </div>

          {/* Actions & Quick Links */}
          <div className="space-y-6">
            <div className={cn("rounded-2xl p-6 border shadow-lg", isNight ? "bg-slate-800/80 border-slate-700" : "bg-card border-border")}>
              <CareActions />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Link href="/wallet" className={cn("flex flex-col items-center p-3 rounded-xl transition-colors group", isNight ? "bg-slate-700/60 hover:bg-slate-700" : "bg-secondary/50 hover:bg-secondary")}>
                <span className="text-2xl mb-1">💰</span>
                <p className={cn("font-bold text-sm", isNight ? "text-slate-200" : "text-secondary-foreground")}>Wallet</p>
              </Link>
              <Link href="/tasks" className={cn("flex flex-col items-center p-3 rounded-xl transition-colors group", isNight ? "bg-slate-700/60 hover:bg-slate-700" : "bg-primary/10 hover:bg-primary/20")}>
                <span className="text-2xl mb-1">✅</span>
                <p className={cn("font-bold text-sm", isNight ? "text-slate-200" : "text-foreground")}>Tasks</p>
              </Link>
              <Link href="/shop" className={cn("flex flex-col items-center p-3 rounded-xl transition-colors group", isNight ? "bg-slate-700/60 hover:bg-slate-700" : "bg-accent/20 hover:bg-accent/30")}>
                <ShoppingBag className={cn("w-6 h-6 mb-1", isNight ? "text-slate-300" : "text-accent-foreground")} />
                <p className={cn("font-bold text-sm", isNight ? "text-slate-200" : "text-foreground")}>Shop</p>
              </Link>
            </div>

            <div className={cn("rounded-xl p-5 border", isNight ? "bg-slate-800/60 border-slate-700" : "bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20")}>
              <h3 className={cn("font-bold flex items-center gap-2 mb-2", isNight ? "text-white" : "text-foreground")}>Financial Tip of the Day</h3>
              <p className={cn("text-sm", isNight ? "text-slate-300" : "text-muted-foreground")}>
                Try to save at least 20% of what you earn! It helps build good habits and gives you a safety net for
                unexpected expenses like vet visits.
              </p>
            </div>
          </div>

          <div>
            <ActivityLog />
          </div>
        </div>

        {/* Night sky stars decoration */}
        {isNight && (
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${(i * 37 + 13) % 100}%`,
                  top: `${(i * 23 + 7) % 60}%`,
                  animationDelay: `${i * 200}ms`,
                  opacity: 0.3 + (i % 4) * 0.2,
                }}
              />
            ))}
          </div>
        )}
      </main>

      <AIChatbot />
    </div>
  )
}
