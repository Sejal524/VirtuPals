"use client"

import { useGame } from "@/contexts/game-context"
import { Navbar } from "@/components/navbar"
import { PetDisplay } from "@/components/pet-display"
import { CareActions } from "@/components/care-actions"
import { AIChatbot } from "@/components/ai-chatbot"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Heart, Clock } from "lucide-react"

export default function PetPage() {
  const { pet, hasCompletedSetup } = useGame()

  if (!hasCompletedSetup || !pet) {
    redirect("/")
  }

  const daysSinceCreation = Math.floor(
    (new Date().getTime() - new Date(pet.createdAt).getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">🐾 {pet.name}&apos;s Profile</h1>
          <p className="text-muted-foreground">Everything about your beloved {pet.type}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Pet Display */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <PetDisplay size="lg" showStats={true} />
              </CardContent>
            </Card>
          </div>

          {/* Pet Info Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="w-5 h-5 text-accent" />
                  Pet Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-bold text-foreground">{pet.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-bold text-foreground capitalize">{pet.type}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Mood</span>
                  <span className="font-bold text-foreground capitalize">{pet.mood}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-info" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Age</span>
                  <span className="font-bold text-foreground">
                    {daysSinceCreation} day{daysSinceCreation !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Adopted</span>
                  <span className="font-bold text-foreground">{new Date(pet.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Care Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>🍖 Feed regularly to keep hunger above 50%</li>
                  <li>🎾 Play daily to maintain happiness</li>
                  <li>🛁 Clean often to prevent illness</li>
                  <li>😴 Let them rest when energy is low</li>
                  <li>🏥 Visit vet if health drops below 50%</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Care Actions */}
        <div className="mt-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <CareActions />
            </CardContent>
          </Card>
        </div>
      </main>

      <AIChatbot />
    </div>
  )
}
