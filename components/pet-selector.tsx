"use client"

import { useState } from "react"
import { useGame, type PetType } from "@/contexts/game-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const petOptions: { type: PetType; emoji: string; name: string; description: string }[] = [
  { type: "dog", emoji: "🐕", name: "Dog", description: "Loyal, playful, and loves exercise!" },
  { type: "cat", emoji: "🐱", name: "Cat", description: "Independent, curious, and cuddly!" },
  { type: "bunny", emoji: "🐰", name: "Bunny", description: "Gentle, fluffy, and adorable!" },
  { type: "hamster", emoji: "🐹", name: "Hamster", description: "Tiny, energetic, and fun!" },
]

export function PetSelector() {
  const { createPet } = useGame()
  const [selectedType, setSelectedType] = useState<PetType | null>(null)
  const [petName, setPetName] = useState("")
  const [step, setStep] = useState<"select" | "name">("select")

  const handleContinue = () => {
    if (selectedType) {
      setStep("name")
    }
  }

  const handleCreate = () => {
    if (selectedType && petName.trim()) {
      createPet(petName.trim(), selectedType)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="w-full max-w-2xl">
        {step === "select" ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-foreground">
                Welcome to <span className="text-primary">VirtuPals</span>!
              </h1>
              <p className="text-lg text-muted-foreground">
                Choose your virtual pet companion and learn about financial responsibility!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {petOptions.map((pet) => (
                <button
                  key={pet.type}
                  onClick={() => setSelectedType(pet.type)}
                  className={cn(
                    "p-6 rounded-2xl border-2 transition-all duration-300 text-left",
                    "hover:scale-105 hover:shadow-lg",
                    selectedType === pet.type
                      ? "border-primary bg-primary/10 shadow-lg"
                      : "border-border bg-card hover:border-primary/50",
                  )}
                >
                  <span className="text-6xl block mb-3">{pet.emoji}</span>
                  <h3 className="text-xl font-bold text-card-foreground">{pet.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{pet.description}</p>
                </button>
              ))}
            </div>

            <div className="flex justify-center">
              <Button size="lg" onClick={handleContinue} disabled={!selectedType} className="px-8 py-6 text-lg">
                Continue
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
            <div className="text-center space-y-4">
              <span className="text-8xl block animate-bounce-slow">
                {petOptions.find((p) => p.type === selectedType)?.emoji}
              </span>
              <h2 className="text-3xl font-bold text-foreground">
                Name your {petOptions.find((p) => p.type === selectedType)?.name}!
              </h2>
              <p className="text-muted-foreground">Give your new friend a special name</p>
            </div>

            <div className="max-w-sm mx-auto space-y-4">
              <Input
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="Enter pet name..."
                className="text-center text-xl py-6"
                maxLength={20}
              />

              <div className="flex gap-3">
                <Button variant="outline" size="lg" onClick={() => setStep("select")} className="flex-1">
                  Back
                </Button>
                <Button size="lg" onClick={handleCreate} disabled={!petName.trim()} className="flex-1">
                  Create Pet!
                </Button>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="font-bold text-lg mb-3 text-card-foreground">Starting Bonus!</h3>
              <p className="text-muted-foreground">
                You&apos;ll start with <span className="font-bold text-primary">$50.00</span> in your wallet. Use it
                wisely to take care of your pet and learn about budgeting!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
