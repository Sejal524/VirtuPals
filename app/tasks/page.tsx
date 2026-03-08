"use client"

import { useState, useEffect } from "react"
import { useGame } from "@/contexts/game-context"
import { Navbar } from "@/components/navbar"
import { AIChatbot } from "@/components/ai-chatbot"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Circle, Smartphone, Clock, DollarSign, Plus, Camera, X, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export default function TasksPage() {
  const { tasks, completeTask, submitScreenTime, hasCompletedSetup, addCustomTask } = useGame()
  const [screenTime, setScreenTime] = useState("")
  const [screenTimeReward, setScreenTimeReward] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDesc, setNewTaskDesc] = useState("")
  const [newTaskReward, setNewTaskReward] = useState("")
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

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return
    const reward = Number.parseFloat(newTaskReward) || 5
    addCustomTask(newTaskTitle.trim(), newTaskDesc.trim() || "Custom task", reward)
    setNewTaskTitle("")
    setNewTaskDesc("")
    setNewTaskReward("")
    setShowAddTask(false)
    setFeedback(`Added new task: "${newTaskTitle.trim()}" ($${reward.toFixed(2)})`)
    setTimeout(() => setFeedback(null), 3000)
  }

  const handleScreenTimeSubmit = () => {
    const hours = Number.parseFloat(screenTime)
    if (isNaN(hours) || hours < 0) return

    const reward = submitScreenTime(hours)
    setScreenTimeReward(reward)
    setFeedback(
      `Screen time bonus: $${reward.toFixed(2)}! ${hours <= 1 ? "Amazing!" : hours <= 2 ? "Good job!" : "Keep reducing!"}`,
    )
    setScreenTime("")
    setTimeout(() => {
      setFeedback(null)
      setScreenTimeReward(null)
    }, 5000)
  }

  const completedCount = tasks.filter((t) => t.completed).length
  const totalPotentialEarnings = tasks.reduce((acc, t) => acc + t.reward, 0)
  const earnedFromTasks = tasks.filter((t) => t.completed).reduce((acc, t) => acc + t.reward, 0)

  const choresTasks = tasks.filter((t) => t.type === "chore")
  const learningTasks = tasks.filter((t) => t.type === "learning")
  const customTasks = tasks.filter((t) => t.type === "custom")

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-foreground mb-2">Daily Tasks</h1>
            <p className="text-muted-foreground">Complete tasks to earn money for your pet's care!</p>
          </div>
          <Button onClick={() => setShowAddTask(!showAddTask)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        </div>

        {feedback && (
          <div className="mb-6 bg-primary/10 text-primary rounded-lg p-4 text-center font-medium animate-in fade-in slide-in-from-top duration-300">
            {feedback}
          </div>
        )}

        {/* Photo Validation Notice */}
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Camera className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800 text-sm">Photo Verification Required</h3>
              <p className="text-xs text-amber-700 mt-1">
                To complete a task, upload a photo of your completed work to the VirtuPals AI Assistant (chat bubble in bottom-right). 
                The AI will validate your submission and automatically mark the task as complete with the reward.
                For screen time, upload a screenshot of your screen time report to the AI.
              </p>
            </div>
          </div>
        </div>

        {/* Add Task Form */}
        {showAddTask && (
          <Card className="mb-6 border-primary/30 shadow-lg animate-in fade-in slide-in-from-top-3 duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Add Custom Task</CardTitle>
                <button onClick={() => setShowAddTask(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium">Task Title *</label>
                <Input placeholder="e.g., Walk the dog" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input placeholder="e.g., Walk for at least 15 minutes" value={newTaskDesc} onChange={(e) => setNewTaskDesc(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Reward ($)</label>
                <Input type="number" placeholder="5" value={newTaskReward} onChange={(e) => setNewTaskReward(e.target.value)} min="1" max="50" />
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={handleAddTask} disabled={!newTaskTitle.trim()}>Add Task</Button>
                <Button variant="outline" onClick={() => setShowAddTask(false)}>Cancel</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Custom tasks require photo verification via the AI chatbot.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Progress Overview */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {completedCount}/{tasks.length}
              </div>
              <p className="text-muted-foreground">Tasks Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">${earnedFromTasks.toFixed(2)}</div>
              <p className="text-muted-foreground">Earned from Tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-secondary-foreground mb-2">
                ${totalPotentialEarnings.toFixed(2)}
              </div>
              <p className="text-muted-foreground">Total Possible Earnings</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chores */}
          <Card className="shadow-lg">
            <CardHeader className="bg-orange-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-orange-700">Chores</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {choresTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </CardContent>
          </Card>

          {/* Learning */}
          <Card className="shadow-lg">
            <CardHeader className="bg-blue-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-blue-700">Learning</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {learningTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
              {learningTasks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No learning tasks</p>
              )}
            </CardContent>
          </Card>

          {/* Screen Time Bonus */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Smartphone className="w-5 h-5" />
                Screen Time Bonus
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-700 flex items-start gap-2">
                  <ImageIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  Upload a screenshot of your screen time to the AI chatbot for verification and automatic reward!
                </p>
              </div>

              <p className="text-sm text-muted-foreground">
                Or manually enter your daily screen time below:
              </p>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Hours of Screen Time Today
                </label>
                <div className="flex gap-2">
                  <Input type="number" placeholder="e.g., 2.5" value={screenTime} onChange={(e) => setScreenTime(e.target.value)} min="0" step="0.5" />
                  <Button onClick={handleScreenTimeSubmit} className="bg-purple-600 hover:bg-purple-700 text-white">Submit</Button>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-sm">Reward Scale:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{"<="} 1 hour</span>
                    <span className="font-bold text-green-600">$30.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">1-2 hours</span>
                    <span className="font-bold text-green-500">$20.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">2-3 hours</span>
                    <span className="font-bold text-yellow-600">$15.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">3-4 hours</span>
                    <span className="font-bold text-orange-500">$10.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{">"}4 hours</span>
                    <span className="font-bold text-red-500">$5.00</span>
                  </div>
                </div>
              </div>

              {screenTimeReward !== null && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center animate-in fade-in duration-300">
                  <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="font-bold text-green-700">You earned ${screenTimeReward.toFixed(2)}!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Custom Tasks Section */}
        {customTasks.length > 0 && (
          <Card className="mt-6 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-emerald-700">My Custom Tasks</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid md:grid-cols-2 gap-3">
                {customTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips */}
        <Card className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-3 text-green-800 flex items-center gap-2">Earning Tips</h3>
            <ul className="space-y-2 text-green-700 text-sm">
              <li>-- Upload a photo of your completed task to the AI chatbot for verification</li>
              <li>-- Upload your screen time screenshot for automatic screen time bonus</li>
              <li>-- Add custom tasks with the "Add Task" button for personalized goals</li>
              <li>-- Save some of your earnings for unexpected pet expenses</li>
            </ul>
          </CardContent>
        </Card>
      </main>

      <AIChatbot />
    </div>
  )
}

function TaskItem({
  task,
}: {
  task: { id: string; title: string; description: string; reward: number; completed: boolean; requiresPhoto?: boolean; isCustom?: boolean }
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border transition-all",
        task.completed ? "bg-green-50 border-green-200" : "bg-card border-border hover:border-primary/50",
      )}
    >
      <div className={cn("flex-shrink-0", task.completed ? "text-green-500" : "text-muted-foreground")}>
        {task.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("font-medium", task.completed && "line-through text-muted-foreground")}>{task.title}</p>
        <p className="text-xs text-muted-foreground truncate">{task.description}</p>
        {!task.completed && (
          <p className="text-[10px] text-amber-600 mt-0.5 flex items-center gap-1">
            <Camera className="w-3 h-3" />
            Photo verification required via AI chatbot
          </p>
        )}
      </div>
      <div
        className={cn(
          "text-sm font-bold px-2 py-1 rounded-full flex-shrink-0",
          task.completed ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary",
        )}
      >
        ${task.reward}
      </div>
    </div>
  )
}
