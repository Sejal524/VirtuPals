"use client"

import type React from "react"

import { useState } from "react"
import { useGame } from "@/contexts/game-context"
import { cn } from "@/lib/utils"
import { UtensilsCrossed, Gamepad2, Moon, Sparkles, Stethoscope } from "lucide-react"

interface ActionItem {
  id: string
  label: string
  icon: React.ReactNode
  emoji: string
  cost: number
  action: (cost: number) => boolean | void
  description: string
  color: string
}

export function CareActions() {
  const { feedPet, playWithPet, restPet, cleanPet, visitVet, wallet, pet } = useGame()
  const [feedback, setFeedback] = useState<string | null>(null)

  const actions: ActionItem[] = [
    {
      id: "feed",
      label: "Feed",
      icon: <UtensilsCrossed className="w-5 h-5" />,
      emoji: "🍖",
      cost: 5,
      action: feedPet,
      description: "Give your pet a delicious meal",
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      id: "play",
      label: "Play",
      icon: <Gamepad2 className="w-5 h-5" />,
      emoji: "🎾",
      cost: 3,
      action: playWithPet,
      description: "Have fun and bond with your pet",
      color: "bg-pink-500 hover:bg-pink-600",
    },
    {
      id: "rest",
      label: "Rest",
      icon: <Moon className="w-5 h-5" />,
      emoji: "😴",
      cost: 0,
      action: () => {
        restPet()
        return true
      },
      description: "Let your pet take a nap",
      color: "bg-indigo-500 hover:bg-indigo-600",
    },
    {
      id: "clean",
      label: "Clean",
      icon: <Sparkles className="w-5 h-5" />,
      emoji: "🛁",
      cost: 4,
      action: cleanPet,
      description: "Give your pet a nice bath",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      id: "vet",
      label: "Vet Visit",
      icon: <Stethoscope className="w-5 h-5" />,
      emoji: "🏥",
      cost: 15,
      action: visitVet,
      description: "Get a health checkup",
      color: "bg-red-500 hover:bg-red-600",
    },
  ]

  const handleAction = (action: ActionItem) => {
    if (action.cost > wallet) {
      setFeedback(`Not enough money! You need $${action.cost.toFixed(2)} 😢`)
      setTimeout(() => setFeedback(null), 3000)
      return
    }

    const result = action.action(action.cost)
    if (result || action.cost === 0) {
      setFeedback(`${pet?.name} loved that! ${action.emoji}`)
      setTimeout(() => setFeedback(null), 3000)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground flex items-center gap-2">🎮 Pet Care Actions</h3>

      {feedback && (
        <div className="bg-primary/10 text-primary rounded-lg p-3 text-center font-medium animate-in fade-in slide-in-from-top duration-300">
          {feedback}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleAction(action)}
            disabled={action.cost > wallet}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-xl text-white transition-all",
              "hover:scale-105 hover:shadow-lg active:scale-95",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
              action.color,
            )}
          >
            <span className="text-3xl">{action.emoji}</span>
            <span className="font-bold">{action.label}</span>
            {action.cost > 0 ? (
              <span className="text-sm opacity-90">${action.cost.toFixed(2)}</span>
            ) : (
              <span className="text-sm opacity-90">Free!</span>
            )}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground text-center">
        💡 Each action costs money (except rest). Earn more by completing tasks!
      </p>
    </div>
  )
}
