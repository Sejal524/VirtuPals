"use client"

import { useGame } from "@/contexts/game-context"
import { Navbar } from "@/components/navbar"
import { AIChatbot } from "@/components/ai-chatbot"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Heart, Wallet, ListTodo, MessageCircle, RefreshCw, AlertTriangle, ShoppingBag } from "lucide-react"

export default function HelpPage() {
  const { resetGame, hasCompletedSetup } = useGame()

  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset? This will delete all progress including your pet, wallet, badges, and purchases!",
      )
    ) {
      resetGame()
      window.location.href = "/"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {hasCompletedSetup && <Navbar />}

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Help Center</h1>
          <p className="text-muted-foreground">Learn how to use VirtuPals and master financial responsibility!</p>
        </div>

        {/* Quick Start Guide */}
        <Card className="mb-8 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Quick Start Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-card rounded-lg">
                <span className="text-3xl block mb-2">1</span>
                <h4 className="font-medium">Choose Pet</h4>
                <p className="text-sm text-muted-foreground">Select and name your virtual companion</p>
              </div>
              <div className="text-center p-4 bg-card rounded-lg">
                <span className="text-3xl block mb-2">2</span>
                <h4 className="font-medium">Complete Tasks</h4>
                <p className="text-sm text-muted-foreground">Earn money by doing chores</p>
              </div>
              <div className="text-center p-4 bg-card rounded-lg">
                <span className="text-3xl block mb-2">3</span>
                <h4 className="font-medium">Care for Pet</h4>
                <p className="text-sm text-muted-foreground">Feed, play, and keep them healthy</p>
              </div>
              <div className="text-center p-4 bg-card rounded-lg">
                <span className="text-3xl block mb-2">4</span>
                <h4 className="font-medium">Save Money</h4>
                <p className="text-sm text-muted-foreground">Learn to budget and save!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Help Sections */}
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="pet-care" className="bg-card rounded-lg border">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-accent" />
                <span className="font-bold">Pet Care</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4 text-muted-foreground">
                <p>Your virtual pet needs regular care to stay happy and healthy. Here&apos;s what you need to know:</p>

                <div className="grid gap-3">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-1">Feeding ($5)</h4>
                    <p className="text-sm">
                      Increases hunger by 30% and happiness by 5%. Feed your pet when the hunger bar drops below 50%.
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-1">Playing ($3)</h4>
                    <p className="text-sm">Increases happiness by 25% but uses 15% energy. Great for bonding!</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-1">Resting (Free!)</h4>
                    <p className="text-sm">Restores 40% energy. Let your pet rest when they&apos;re tired.</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-1">Cleaning ($4)</h4>
                    <p className="text-sm">
                      Increases cleanliness by 40% and happiness by 10%. Keeps your pet healthy!
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-1">Vet Visit ($15)</h4>
                    <p className="text-sm">Fully restores health to 100%. Use when your pet is sick!</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-1">Pet Moods & Random Events</h4>
                  <p className="text-sm text-yellow-700">
                    Your pet&apos;s mood changes based on their stats. Random events can also occur - your pet might
                    find money, get sick unexpectedly, or have other surprises! Check the Activity Log on the home
                    screen to see what&apos;s happening.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ... existing accordion items ... */}

          <AccordionItem value="shop" className="bg-card rounded-lg border">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-purple-600" />
                <span className="font-bold">Shop & Badges</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4 text-muted-foreground">
                <p>Visit the shop to purchase upgrades and track your achievements!</p>

                <div className="grid gap-3">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-1">Upgrades</h4>
                    <p className="text-sm">
                      Buy items like Premium Food, Comfy Bed, and Pet Insurance to boost your pet care abilities!
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-1">Accessories</h4>
                    <p className="text-sm">Get fun accessories like Bow Ties and Sunglasses to style your pet!</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-1">Badges</h4>
                    <p className="text-sm">
                      Earn badges by completing achievements like saving $50, completing tasks, and more!
                    </p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="wallet" className="bg-card rounded-lg border">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-green-600" />
                <span className="font-bold">Wallet & Savings</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4 text-muted-foreground">
                <p>Managing your money is key to being a responsible pet owner!</p>

                <div className="grid gap-3">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-1">Wallet Balance</h4>
                    <p className="text-sm">This is your spending money. Use it for pet care and daily expenses.</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-1">Savings Account</h4>
                    <p className="text-sm">
                      Transfer money here to save for bigger goals. You can deposit and withdraw anytime.
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-1">Savings Goals</h4>
                    <p className="text-sm">
                      Set a goal amount to stay motivated. The progress bar shows how close you are!
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-1">Expense Tracking</h4>
                    <p className="text-sm">
                      All your spending is categorized (food, health, toys, supplies) so you can see where your money
                      goes.
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-1">Financial Tip</h4>
                  <p className="text-sm text-green-700">
                    Try saving at least 20% of everything you earn. This builds good habits and gives you a safety net
                    for emergencies like unexpected vet visits!
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tasks" className="bg-card rounded-lg border">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center gap-3">
                <ListTodo className="w-5 h-5 text-blue-600" />
                <span className="font-bold">Tasks & Earning</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4 text-muted-foreground">
                <p>Earn money by completing tasks - just like real life!</p>

                <div className="grid gap-3">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-1">Chores</h4>
                    <p className="text-sm">
                      Household tasks like making your bed, doing dishes, cleaning, laundry, and more. Rewards range
                      from $5-$15.
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-1">Learning</h4>
                    <p className="text-sm">
                      Educational activities like reading and homework. Rewards are higher ($10-$20) because learning is
                      valuable!
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-1">Screen Time Bonus</h4>
                    <p className="text-sm">
                      Enter your daily screen time to earn bonuses. Less screen time = more money!
                    </p>
                    <ul className="mt-2 space-y-1 text-xs">
                      <li>1 hour or less: $30</li>
                      <li>1-2 hours: $20</li>
                      <li>2-3 hours: $15</li>
                      <li>3-4 hours: $10</li>
                      <li>More than 4 hours: $5</li>
                    </ul>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="chatbot" className="bg-card rounded-lg border">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-primary" />
                <span className="font-bold">AI Assistant</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4 text-muted-foreground">
                <p>The VirtuPals AI Assistant is here to help you 24/7!</p>

                <div className="grid gap-3">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-1">How to Access</h4>
                    <p className="text-sm">Click the chat bubble in the bottom right corner of any page.</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-1">What to Ask</h4>
                    <p className="text-sm">
                      Ask about anything! Pet care, earning money, saving tips, jokes, or just chat!
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-1">Quick Help</h4>
                    <p className="text-sm">
                      Type <strong>&quot;help&quot;</strong> to be automatically redirected to this help page!
                    </p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Financial Lessons */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Financial Lessons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-2">Budgeting Basics</h4>
                <p className="text-sm text-blue-700">
                  A budget helps you plan how to spend and save your money. Track what comes in (earnings) and what goes
                  out (expenses). The goal is to spend less than you earn!
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-bold text-green-800 mb-2">Importance of Saving</h4>
                <p className="text-sm text-green-700">
                  Saving money helps you prepare for emergencies and reach bigger goals. Start small - even saving a
                  little bit regularly adds up over time!
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-bold text-purple-800 mb-2">Setting Goals</h4>
                <p className="text-sm text-purple-700">
                  Having a specific savings goal makes it easier to stay motivated. Want something special? Figure out
                  how much it costs and save towards it!
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-bold text-orange-800 mb-2">Needs vs Wants</h4>
                <p className="text-sm text-orange-700">
                  Needs are things you must have (like food for your pet). Wants are nice to have but not essential
                  (like extra toys). Always cover needs first!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {hasCompletedSetup && (
          <Card className="mt-8 border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                Reset Game
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Want to start completely fresh with a new pet? This will delete ALL your progress including your pet,
                wallet, savings, badges, shop purchases, and task history. This action cannot be undone.
              </p>
              <Button variant="destructive" onClick={handleReset}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Everything & Start Fresh
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      <AIChatbot />
    </div>
  )
}
