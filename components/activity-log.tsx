"use client"

import { useGame } from "@/contexts/game-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, Heart, DollarSign, Sparkles, ShoppingBag, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const typeIcons = {
  care: Heart,
  task: CheckCircle,
  financial: DollarSign,
  event: Sparkles,
  shop: ShoppingBag,
}

const typeColors = {
  care: "text-pink-500 bg-pink-50",
  task: "text-green-500 bg-green-50",
  financial: "text-blue-500 bg-blue-50",
  event: "text-amber-500 bg-amber-50",
  shop: "text-purple-500 bg-purple-50",
}

export function ActivityLog() {
  const { activityLog, pet } = useGame()

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="w-5 h-5 text-primary" />
          Activity Log
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px] px-4 pb-4">
          {activityLog.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <Sparkles className="w-10 h-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No activity yet!</p>
              <p className="text-xs text-muted-foreground mt-1">
                Start caring for {pet?.name || "your pet"} to see updates here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activityLog.map((activity) => {
                const Icon = typeIcons[activity.type]
                const colorClass = typeColors[activity.type]

                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300"
                  >
                    <div className={cn("p-2 rounded-full flex-shrink-0", colorClass)}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-tight">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatTime(activity.timestamp)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
