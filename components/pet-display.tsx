"use client"

import { useGame, type PetType, type PetMood } from "@/contexts/game-context"
import { cn } from "@/lib/utils"

interface PetDisplayProps {
  size?: "sm" | "md" | "lg"
  showStats?: boolean
}

const petEmojis: Record<PetType, Record<PetMood, string>> = {
  dog: {
    happy: "🐕",
    sad: "🐕‍🦺",
    hungry: "🐶",
    tired: "🐕",
    sick: "🐕",
    energetic: "🐕",
    loving: "🐕",
  },
  cat: {
    happy: "🐱",
    sad: "😿",
    hungry: "🐱",
    tired: "😸",
    sick: "🙀",
    energetic: "😺",
    loving: "😻",
  },
  bunny: {
    happy: "🐰",
    sad: "🐇",
    hungry: "🐰",
    tired: "🐇",
    sick: "🐰",
    energetic: "🐇",
    loving: "🐰",
  },
  hamster: {
    happy: "🐹",
    sad: "🐹",
    hungry: "🐹",
    tired: "🐹",
    sick: "🐹",
    energetic: "🐹",
    loving: "🐹",
  },
}

const moodColors: Record<PetMood, string> = {
  happy: "from-green-400 to-emerald-500",
  sad: "from-blue-400 to-indigo-500",
  hungry: "from-orange-400 to-amber-500",
  tired: "from-purple-400 to-violet-500",
  sick: "from-red-400 to-rose-500",
  energetic: "from-yellow-400 to-orange-500",
  loving: "from-pink-400 to-rose-500",
}

const moodMessages: Record<PetMood, string> = {
  happy: "is feeling great! 😊",
  sad: "needs some attention... 😢",
  hungry: "is getting hungry! 🍽️",
  tired: "needs some rest... 😴",
  sick: "is not feeling well! 🏥",
  energetic: "wants to play! ⚡",
  loving: "loves you so much! 💕",
}

export function PetDisplay({ size = "lg", showStats = true }: PetDisplayProps) {
  const { pet } = useGame()

  if (!pet) return null

  const sizeClasses = {
    sm: "text-6xl",
    md: "text-8xl",
    lg: "text-9xl",
  }

  const containerSizes = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-64 h-64",
  }

  const animationClass = {
    happy: "animate-bounce-slow",
    sad: "",
    hungry: "animate-wiggle",
    tired: "",
    sick: "",
    energetic: "animate-bounce-slow",
    loving: "animate-pulse-heart",
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Pet Container with 3D-like appearance */}
      <div
        className={cn(
          "relative rounded-full flex items-center justify-center",
          "bg-gradient-to-br shadow-2xl",
          moodColors[pet.mood],
          containerSizes[size],
        )}
      >
        {/* Inner glow */}
        <div className="absolute inset-2 rounded-full bg-white/30 backdrop-blur-sm" />

        {/* Pet emoji */}
        <span className={cn(sizeClasses[size], animationClass[pet.mood], "relative z-10 drop-shadow-lg select-none")}>
          {petEmojis[pet.type][pet.mood]}
        </span>

        {/* Mood indicators */}
        {pet.mood === "loving" && (
          <>
            <span className="absolute -top-2 -right-2 text-3xl animate-pulse">💕</span>
            <span className="absolute -top-4 left-4 text-2xl animate-pulse delay-100">💖</span>
          </>
        )}
        {pet.mood === "hungry" && <span className="absolute -top-2 right-0 text-2xl animate-bounce">🍖</span>}
        {pet.mood === "sick" && <span className="absolute -top-2 right-0 text-2xl">🤒</span>}
        {pet.mood === "energetic" && (
          <>
            <span className="absolute -top-2 -right-2 text-2xl animate-ping">⚡</span>
            <span className="absolute -top-4 left-2 text-xl animate-ping delay-75">✨</span>
          </>
        )}
      </div>

      {/* Pet Name and Mood */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">{pet.name}</h2>
        <p className="text-muted-foreground">
          {pet.name} {moodMessages[pet.mood]}
        </p>
      </div>

      {/* Stats */}
      {showStats && (
        <div className="w-full max-w-md grid grid-cols-2 gap-3">
          <StatBar label="Hunger" value={pet.hunger} icon="🍖" color="bg-orange-400" />
          <StatBar label="Happiness" value={pet.happiness} icon="😊" color="bg-pink-400" />
          <StatBar label="Energy" value={pet.energy} icon="⚡" color="bg-yellow-400" />
          <StatBar label="Health" value={pet.health} icon="❤️" color="bg-red-400" />
          <StatBar label="Cleanliness" value={pet.cleanliness} icon="✨" color="bg-blue-400" />
        </div>
      )}
    </div>
  )
}

function StatBar({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <div className="bg-card rounded-lg p-3 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          {icon} {label}
        </span>
        <span className="text-sm font-bold">{value}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-500", color)} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
