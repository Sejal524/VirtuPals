"use client"

import { useState, useRef } from "react"
import { useGame } from "@/contexts/game-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileDown, Filter, X, UtensilsCrossed, Stethoscope, Gamepad2, ShoppingBag, CheckCircle, Smartphone, PiggyBank, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

type FilterType = "all" | "responsibility" | "budget" | "pet-care" | "task-completion" | "screen-time"

const filterOptions: { id: FilterType; label: string; icon: typeof Heart; description: string }[] = [
  { id: "all", label: "All Activity", icon: Filter, description: "Show everything" },
  { id: "responsibility", label: "Responsibility", icon: PiggyBank, description: "Savings, deposits, withdrawals" },
  { id: "budget", label: "Budget", icon: ShoppingBag, description: "All spending and earning" },
  { id: "pet-care", label: "Pet Care Actions", icon: Heart, description: "Feeding, playing, cleaning, vet" },
  { id: "task-completion", label: "Task Completion", icon: CheckCircle, description: "Completed tasks and earnings" },
  { id: "screen-time", label: "Screen Time", icon: Smartphone, description: "Screen time logs and bonuses" },
]

const categoryIcons: Record<string, typeof Heart> = {
  food: UtensilsCrossed,
  health: Stethoscope,
  toys: Gamepad2,
  supplies: ShoppingBag,
}

const categoryColors: Record<string, string> = {
  food: "bg-orange-100 text-orange-700",
  health: "bg-red-100 text-red-700",
  toys: "bg-pink-100 text-pink-700",
  supplies: "bg-blue-100 text-blue-700",
}

export function BudgetReport() {
  const { activityLog, expenses, totalEarned, totalSpent, wallet, savings, pet, tasks, getFormattedDate, gameTime } = useGame()
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [showFilters, setShowFilters] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  // Filter activities based on selected filter
  const filteredActivities = activityLog.filter((activity) => {
    switch (activeFilter) {
      case "responsibility":
        return activity.type === "financial"
      case "budget":
        return activity.type === "financial" || activity.type === "shop" || activity.type === "care"
      case "pet-care":
        return activity.type === "care"
      case "task-completion":
        return activity.type === "task" && !activity.message.toLowerCase().includes("screen time")
      case "screen-time":
        return activity.type === "task" && activity.message.toLowerCase().includes("screen time")
      default:
        return true
    }
  })

  // Calculate category stats
  const expensesByCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount
    return acc
  }, {} as Record<string, number>)

  const completedTasks = tasks.filter((t) => t.completed).length
  const totalTasks = tasks.length
  const taskEarnings = tasks.filter((t) => t.completed).reduce((acc, t) => acc + t.reward, 0)

  const handleDownloadPDF = async () => {
    // Build a clean HTML report for PDF
    const reportHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>VirtuPals Budget Report</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1a1a2e; max-width: 800px; margin: 0 auto; }
          h1 { color: #2d6a4f; border-bottom: 3px solid #2d6a4f; padding-bottom: 10px; }
          h2 { color: #1a1a2e; margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 8px; }
          .header { display: flex; justify-content: space-between; align-items: center; }
          .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
          .stat-card { background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 15px; }
          .stat-value { font-size: 24px; font-weight: bold; }
          .stat-label { color: #6c757d; font-size: 14px; }
          .green { color: #2d6a4f; }
          .red { color: #dc3545; }
          .blue { color: #0d6efd; }
          .orange { color: #fd7e14; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #dee2e6; }
          th { background: #f8f9fa; font-weight: 600; }
          .category-badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #ddd; color: #6c757d; font-size: 12px; text-align: center; }
          .filter-note { background: #e8f5e9; padding: 10px 15px; border-radius: 8px; margin: 10px 0; font-size: 13px; }
          .progress-section { margin: 10px 0; }
          .progress-bar { height: 10px; background: #dee2e6; border-radius: 5px; overflow: hidden; }
          .progress-fill { height: 100%; background: #2d6a4f; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>VirtuPals Budget Report</h1>
          <div>
            <p style="margin:0;"><strong>Pet:</strong> ${pet?.name || "N/A"} (${pet?.type || "N/A"})</p>
            <p style="margin:0;"><strong>Game Date:</strong> ${getFormattedDate()}</p>
            <p style="margin:0;"><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </div>

        ${activeFilter !== "all" ? `<div class="filter-note">Filtered by: <strong>${filterOptions.find(f => f.id === activeFilter)?.label}</strong></div>` : ""}

        <h2>Financial Overview</h2>
        <div class="stats-grid">
          <div class="stat-card"><div class="stat-label">Wallet Balance</div><div class="stat-value green">$${wallet.toFixed(2)}</div></div>
          <div class="stat-card"><div class="stat-label">Savings</div><div class="stat-value blue">$${savings.toFixed(2)}</div></div>
          <div class="stat-card"><div class="stat-label">Total Earned</div><div class="stat-value green">$${totalEarned.toFixed(2)}</div></div>
          <div class="stat-card"><div class="stat-label">Total Spent</div><div class="stat-value red">$${totalSpent.toFixed(2)}</div></div>
        </div>

        <h2>Task Progress</h2>
        <p>${completedTasks} of ${totalTasks} tasks completed | Earned from tasks: <strong class="green">$${taskEarnings.toFixed(2)}</strong></p>
        <div class="progress-section">
          <div class="progress-bar"><div class="progress-fill" style="width: ${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%"></div></div>
        </div>

        <h2>Spending by Category</h2>
        <table>
          <thead><tr><th>Category</th><th>Amount</th><th>% of Total</th></tr></thead>
          <tbody>
            ${Object.entries(expensesByCategory).map(([cat, amount]) => `
              <tr>
                <td style="text-transform: capitalize;">${cat}</td>
                <td class="red">$${amount.toFixed(2)}</td>
                <td>${totalSpent > 0 ? ((amount / totalSpent) * 100).toFixed(1) : 0}%</td>
              </tr>
            `).join("") || '<tr><td colspan="3" style="text-align:center;color:#999;">No expenses yet</td></tr>'}
          </tbody>
        </table>

        <h2>Activity Log (${filteredActivities.length} entries)</h2>
        <table>
          <thead><tr><th>Time</th><th>Type</th><th>Activity</th></tr></thead>
          <tbody>
            ${filteredActivities.slice(0, 50).map((a) => `
              <tr>
                <td style="white-space:nowrap;font-size:12px;">${new Date(a.timestamp).toLocaleString()}</td>
                <td><span class="category-badge">${a.type}</span></td>
                <td>${a.message}</td>
              </tr>
            `).join("") || '<tr><td colspan="3" style="text-align:center;color:#999;">No activities</td></tr>'}
          </tbody>
        </table>

        <div class="footer">
          <p>VirtuPals Budget Report - Teaching Financial Responsibility Through Pet Care</p>
        </div>
      </body>
      </html>
    `

    // Open in new window for printing/saving as PDF
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(reportHTML)
      printWindow.document.close()
      // Slight delay then trigger print dialog
      setTimeout(() => {
        printWindow.print()
      }, 500)
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileDown className="w-5 h-5 text-primary" />
            Budget Report
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(showFilters && "bg-primary/10 border-primary")}
            >
              <Filter className="w-4 h-4 mr-1" />
              Filter
              {activeFilter !== "all" && (
                <span className="ml-1 w-2 h-2 bg-primary rounded-full" />
              )}
            </Button>
            <Button size="sm" onClick={handleDownloadPDF} className="gap-1">
              <FileDown className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filter Bar */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg border border-border animate-in fade-in slide-in-from-top-2 duration-200">
            {filterOptions.map((filter) => {
              const Icon = filter.icon
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                    activeFilter === filter.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card text-muted-foreground hover:bg-muted border border-border",
                  )}
                >
                  <Icon className="w-3 h-3" />
                  {filter.label}
                </button>
              )
            })}
            {activeFilter !== "all" && (
              <button
                onClick={() => setActiveFilter("all")}
                className="flex items-center gap-1 px-2 py-1.5 text-xs text-destructive hover:bg-destructive/10 rounded-full"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
            <p className="text-xs text-green-600 font-medium">Net Income</p>
            <p className={cn("text-lg font-bold", totalEarned - totalSpent >= 0 ? "text-green-700" : "text-red-700")}>
              ${(totalEarned - totalSpent).toFixed(2)}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
            <p className="text-xs text-blue-600 font-medium">Tasks Done</p>
            <p className="text-lg font-bold text-blue-700">{completedTasks}/{totalTasks}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-100">
            <p className="text-xs text-purple-600 font-medium">Task Earnings</p>
            <p className="text-lg font-bold text-purple-700">${taskEarnings.toFixed(2)}</p>
          </div>
        </div>

        {/* Spending Breakdown */}
        {Object.entries(expensesByCategory).length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Spending by Category</h4>
            {Object.entries(expensesByCategory).map(([category, amount]) => {
              const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0
              const Icon = categoryIcons[category] || ShoppingBag
              return (
                <div key={category} className="flex items-center gap-3">
                  <div className={cn("p-1.5 rounded-lg", categoryColors[category])}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm capitalize font-medium flex-shrink-0 w-16">{category}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/60 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-foreground w-16 text-right">${amount.toFixed(2)}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* Filtered Activity Stream */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">
            Activity ({filteredActivities.length} entries)
            {activeFilter !== "all" && <span className="text-primary font-normal ml-1">- {filterOptions.find(f => f.id === activeFilter)?.label}</span>}
          </h4>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {filteredActivities.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No activities match this filter.</p>
              ) : (
                filteredActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-2 py-1.5 border-b border-border/50 last:border-0">
                    <span className={cn(
                      "text-[10px] font-medium px-1.5 py-0.5 rounded-full mt-0.5 flex-shrink-0",
                      activity.type === "care" && "bg-pink-100 text-pink-700",
                      activity.type === "task" && "bg-green-100 text-green-700",
                      activity.type === "financial" && "bg-blue-100 text-blue-700",
                      activity.type === "event" && "bg-amber-100 text-amber-700",
                      activity.type === "shop" && "bg-purple-100 text-purple-700",
                    )}>
                      {activity.type}
                    </span>
                    <p className="text-sm text-foreground leading-tight flex-1">{activity.message}</p>
                    <span className="text-[10px] text-muted-foreground flex-shrink-0">
                      {new Date(activity.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}
