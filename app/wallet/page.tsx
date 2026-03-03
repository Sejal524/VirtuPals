"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useGame } from "@/contexts/game-context"
import { Navbar } from "@/components/navbar"
import { AIChatbot } from "@/components/ai-chatbot"
import { BudgetReport } from "@/components/budget-report"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Wallet,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Target,
  UtensilsCrossed,
  Stethoscope,
  Gamepad2,
  ShoppingBag,
} from "lucide-react"
import { cn } from "@/lib/utils"

const categoryIcons: Record<string, React.ReactNode> = {
  food: <UtensilsCrossed className="w-4 h-4" />,
  health: <Stethoscope className="w-4 h-4" />,
  toys: <Gamepad2 className="w-4 h-4" />,
  supplies: <ShoppingBag className="w-4 h-4" />,
}

const categoryColors: Record<string, string> = {
  food: "bg-orange-100 text-orange-700",
  health: "bg-red-100 text-red-700",
  toys: "bg-pink-100 text-pink-700",
  supplies: "bg-blue-100 text-blue-700",
}

export default function WalletPage() {
  const {
    wallet,
    savings,
    savingsGoal,
    expenses,
    totalEarned,
    totalSpent,
    addToSavings,
    withdrawFromSavings,
    setSavingsGoal,
    hasCompletedSetup,
  } = useGame()

  const [savingsAmount, setSavingsAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [goalAmount, setGoalAmount] = useState("")
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

  const handleDeposit = () => {
    const amount = Number.parseFloat(savingsAmount)
    if (isNaN(amount) || amount <= 0) return
    if (addToSavings(amount)) {
      setFeedback(`Deposited $${amount.toFixed(2)} to savings!`)
      setSavingsAmount("")
      setTimeout(() => setFeedback(null), 3000)
    } else {
      setFeedback("Not enough money in wallet!")
      setTimeout(() => setFeedback(null), 3000)
    }
  }

  const handleWithdraw = () => {
    const amount = Number.parseFloat(withdrawAmount)
    if (isNaN(amount) || amount <= 0) return
    if (withdrawFromSavings(amount)) {
      setFeedback(`Withdrew $${amount.toFixed(2)} from savings!`)
      setWithdrawAmount("")
      setTimeout(() => setFeedback(null), 3000)
    } else {
      setFeedback("Not enough money in savings!")
      setTimeout(() => setFeedback(null), 3000)
    }
  }

  const handleSetGoal = () => {
    const amount = Number.parseFloat(goalAmount)
    if (isNaN(amount) || amount <= 0) return
    setSavingsGoal(amount)
    setFeedback(`New savings goal set: $${amount.toFixed(2)}!`)
    setGoalAmount("")
    setTimeout(() => setFeedback(null), 3000)
  }

  const savingsProgress = savingsGoal > 0 ? (savings / savingsGoal) * 100 : 0

  const expensesByCategory = expenses.reduce(
    (acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Wallet</h1>
          <p className="text-muted-foreground">Track your earnings, spending, and savings</p>
        </div>

        {feedback && (
          <div className="mb-6 bg-primary/10 text-primary rounded-lg p-4 text-center font-medium animate-in fade-in slide-in-from-top duration-300">
            {feedback}
          </div>
        )}

        {/* Main Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Wallet className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm text-green-700">Wallet Balance</span>
              </div>
              <p className="text-3xl font-bold text-green-800">${wallet.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <PiggyBank className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm text-blue-700">Savings</span>
              </div>
              <p className="text-3xl font-bold text-blue-800">${savings.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-sm text-emerald-700">Total Earned</span>
              </div>
              <p className="text-3xl font-bold text-emerald-800">${totalEarned.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-sm text-orange-700">Total Spent</span>
              </div>
              <p className="text-3xl font-bold text-orange-800">${totalSpent.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Savings Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-primary" />
                Savings Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    Savings Goal
                  </span>
                  <span className="font-bold">
                    ${savings.toFixed(2)} / ${savingsGoal.toFixed(2)}
                  </span>
                </div>
                <div className="h-4 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                    style={{ width: `${Math.min(savingsProgress, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  {savingsProgress >= 100 ? "Goal reached! Set a new one!" : `${savingsProgress.toFixed(1)}% of your goal`}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                  Deposit to Savings
                </label>
                <div className="flex gap-2">
                  <Input type="number" placeholder="Amount" value={savingsAmount} onChange={(e) => setSavingsAmount(e.target.value)} min="0" step="0.01" />
                  <Button onClick={handleDeposit} className="bg-green-600 hover:bg-green-700 text-white">Deposit</Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <ArrowDownLeft className="w-4 h-4 text-orange-500" />
                  Withdraw from Savings
                </label>
                <div className="flex gap-2">
                  <Input type="number" placeholder="Amount" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} min="0" step="0.01" />
                  <Button onClick={handleWithdraw} variant="outline">Withdraw</Button>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-border">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Set New Goal
                </label>
                <div className="flex gap-2">
                  <Input type="number" placeholder="Goal amount" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} min="0" step="1" />
                  <Button onClick={handleSetGoal} variant="secondary">Set Goal</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">Spending Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {Object.entries(expensesByCategory).length > 0 ? (
                  Object.entries(expensesByCategory).map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", categoryColors[category])}>{categoryIcons[category]}</div>
                        <span className="font-medium capitalize">{category}</span>
                      </div>
                      <span className="font-bold">${amount.toFixed(2)}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No expenses yet!</p>
                    <p className="text-sm">Take care of your pet to see spending here.</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="font-medium mb-3">Recent Transactions</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {expenses.slice(-5).reverse().map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className={cn("p-1 rounded", categoryColors[expense.category])}>
                          {categoryIcons[expense.category]}
                        </span>
                        <span className="text-sm">{expense.description}</span>
                      </div>
                      <span className="text-sm font-medium text-red-600">-${expense.amount.toFixed(2)}</span>
                    </div>
                  ))}
                  {expenses.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No transactions yet</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Report - Full Width */}
        <div className="mt-6">
          <BudgetReport />
        </div>

        {/* Financial Tips */}
        <Card className="mt-6 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">Money Management Tips</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-card p-4 rounded-lg">
                <h4 className="font-medium mt-2">Budget Rule</h4>
                <p className="text-sm text-muted-foreground">Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings!</p>
              </div>
              <div className="bg-card p-4 rounded-lg">
                <h4 className="font-medium mt-2">Set Goals</h4>
                <p className="text-sm text-muted-foreground">Having a savings goal motivates you to save more consistently.</p>
              </div>
              <div className="bg-card p-4 rounded-lg">
                <h4 className="font-medium mt-2">Track Everything</h4>
                <p className="text-sm text-muted-foreground">Knowing where your money goes helps you make better decisions.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <AIChatbot />
    </div>
  )
}
