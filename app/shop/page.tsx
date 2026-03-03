"use client"

import { useState, useEffect } from "react"
import { useGame } from "@/contexts/game-context"
import { Navbar } from "@/components/navbar"
import { AIChatbot } from "@/components/ai-chatbot"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingBag, Award, Check, Lock, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ShopPage() {
  const { hasCompletedSetup, wallet, shopItems, purchaseItem, badges } = useGame()
  const [feedback, setFeedback] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!hasCompletedSetup) {
      router.push("/")
    }
  }, [hasCompletedSetup, router])

  if (!hasCompletedSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const handlePurchase = (itemId: string) => {
    const item = shopItems.find((i) => i.id === itemId)
    if (!item) return

    if (item.owned) {
      setFeedback("You already own this item!")
      setTimeout(() => setFeedback(null), 2000)
      return
    }

    if (wallet < item.price) {
      setFeedback("Not enough money! Complete more tasks to earn.")
      setTimeout(() => setFeedback(null), 2000)
      return
    }

    const success = purchaseItem(itemId)
    if (success) {
      setFeedback(`Purchased ${item.name}! Your pet will love it!`)
      setTimeout(() => setFeedback(null), 3000)
    }
  }

  const earnedBadges = badges.filter((b) => b.earned)
  const lockedBadges = badges.filter((b) => !b.earned)

  const categories = [
    { id: "upgrade", label: "Upgrades", icon: "⚡" },
    { id: "accessory", label: "Accessories", icon: "🎀" },
    { id: "food", label: "Food", icon: "🍖" },
    { id: "toy", label: "Toys", icon: "🎾" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Shop & Rewards</h1>
          <p className="text-muted-foreground">Purchase upgrades and view your earned badges!</p>
        </div>

        {feedback && (
          <div className="mb-6 bg-primary/10 text-primary rounded-lg p-4 text-center font-medium animate-in fade-in slide-in-from-top duration-300">
            {feedback}
          </div>
        )}

        <Tabs defaultValue="shop" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="shop" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Shop
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Badges ({earnedBadges.length}/{badges.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shop" className="space-y-6">
            {/* Wallet Display */}
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Your Balance</p>
                  <p className="text-3xl font-bold text-foreground">${wallet.toFixed(2)}</p>
                </div>
                <div className="text-5xl">💰</div>
              </CardContent>
            </Card>

            {/* Shop Categories */}
            {categories.map((category) => {
              const categoryItems = shopItems.filter((i) => i.category === category.id)
              if (categoryItems.length === 0) return null

              return (
                <div key={category.id}>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span>{category.icon}</span>
                    {category.label}
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {categoryItems.map((item) => (
                      <Card
                        key={item.id}
                        className={cn("transition-all hover:shadow-lg", item.owned && "bg-green-50 border-green-200")}
                      >
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <span className="text-4xl">{item.icon}</span>
                            {item.owned && (
                              <Badge className="bg-green-500 text-white">
                                <Check className="w-3 h-3 mr-1" />
                                Owned
                              </Badge>
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground">{item.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <span className="font-bold text-lg text-primary">${item.price}</span>
                            <Button
                              size="sm"
                              onClick={() => handlePurchase(item.id)}
                              disabled={item.owned || wallet < item.price}
                              variant={item.owned ? "outline" : "default"}
                            >
                              {item.owned ? "Owned" : wallet < item.price ? "Can't Afford" : "Buy"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            {/* Earned Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  Earned Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                {earnedBadges.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No badges earned yet. Keep playing to unlock achievements!
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {earnedBadges.map((badge) => (
                      <div
                        key={badge.id}
                        className="text-center p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-200"
                      >
                        <span className="text-4xl block mb-2">{badge.icon}</span>
                        <h4 className="font-bold text-foreground text-sm">{badge.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                        {badge.earnedAt && (
                          <p className="text-xs text-yellow-600 mt-2">
                            {new Date(badge.earnedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Locked Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  Locked Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {lockedBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="text-center p-4 bg-muted/30 rounded-xl border border-border opacity-60"
                    >
                      <span className="text-4xl block mb-2 grayscale">{badge.icon}</span>
                      <h4 className="font-bold text-foreground text-sm">{badge.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                      <div className="flex items-center justify-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Lock className="w-3 h-3" />
                        Locked
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <AIChatbot />
    </div>
  )
}
