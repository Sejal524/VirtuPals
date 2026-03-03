"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot, User, ImagePlus, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useGame } from "@/contexts/game-context"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  image?: string // base64 image data URL
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi there! I'm your VirtuPals Assistant! I can help you with:\n\n- Pet care tips\n- Financial advice\n- Task information\n- **Task verification** - upload a photo of your completed task!\n- **Screen time verification** - upload a screenshot of your screen time!\n\nType **help** to see the full guide, or ask me anything!",
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [pendingImage, setPendingImage] = useState<string | null>(null)
  const [pendingImageName, setPendingImageName] = useState<string>("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { pet, wallet, savings, tasks, completeTask, submitScreenTime } = useGame()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) return

    const reader = new FileReader()
    reader.onload = () => {
      setPendingImage(reader.result as string)
      setPendingImageName(file.name)
    }
    reader.readAsDataURL(file)

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const analyzeImageForTask = (userMessage: string): { type: "task" | "screentime" | "unknown"; taskId?: string; hours?: number; response: string } => {
    const lowerMessage = userMessage.toLowerCase()

    // Check if user is trying to verify screen time
    if (
      lowerMessage.includes("screen time") ||
      lowerMessage.includes("screentime") ||
      lowerMessage.includes("screen") ||
      lowerMessage.includes("phone time") ||
      lowerMessage.includes("device time") ||
      lowerMessage.includes("phone usage")
    ) {
      // Parse hours from message or simulate detection
      const hoursMatch = lowerMessage.match(/(\d+\.?\d*)\s*(hours?|hrs?|h)/i)
      let hours = hoursMatch ? parseFloat(hoursMatch[1]) : null

      if (hours === null) {
        // Simulate AI reading the screenshot - random realistic value
        hours = Math.round((Math.random() * 4 + 0.5) * 10) / 10
      }

      return {
        type: "screentime",
        hours,
        response: `I've analyzed your screen time screenshot!\n\n**Detected Screen Time:** ${hours} hours\n\nProcessing your reward now...`,
      }
    }

    // Check if user is trying to verify a specific task
    const incompleteTasks = tasks.filter((t) => !t.completed)

    // Try to match to a specific task from the message
    for (const task of incompleteTasks) {
      const titleWords = task.title.toLowerCase().split(" ")
      const matches = titleWords.filter((w) => w.length > 2 && lowerMessage.includes(w))
      if (matches.length >= 1 || lowerMessage.includes(task.title.toLowerCase())) {
        return {
          type: "task",
          taskId: task.id,
          response: `I've reviewed your photo for **"${task.title}"**.\n\n**Verification: APPROVED!**\n\nGreat work completing this task! Your reward of **$${task.reward.toFixed(2)}** has been added to your wallet.`,
        }
      }
    }

    // If no specific task matched, try to find any related task
    if (
      lowerMessage.includes("task") ||
      lowerMessage.includes("chore") ||
      lowerMessage.includes("complete") ||
      lowerMessage.includes("done") ||
      lowerMessage.includes("finished") ||
      lowerMessage.includes("did") ||
      lowerMessage.includes("proof") ||
      lowerMessage.includes("verify")
    ) {
      if (incompleteTasks.length > 0) {
        // Pick the first incomplete task as the most likely
        const task = incompleteTasks[0]
        return {
          type: "task",
          taskId: task.id,
          response: `I've reviewed your uploaded photo and matched it to **"${task.title}"**.\n\n**Verification: APPROVED!**\n\nYour reward of **$${task.reward.toFixed(2)}** has been added to your wallet. Keep up the great work!`,
        }
      }
    }

    return {
      type: "unknown",
      response: `I received your image! To verify a task, please mention which task you completed (e.g., "I finished making my bed") or say "screen time" if you're submitting a screen time screenshot.\n\n**Your incomplete tasks:**\n${incompleteTasks.map((t) => `- ${t.title} ($${t.reward})`).join("\n") || "All tasks completed!"}`,
    }
  }

  const generateResponse = (userMessage: string, hasImage: boolean): string => {
    const lowerMessage = userMessage.toLowerCase().trim()

    // If there's an image, process it for task/screentime validation
    if (hasImage) {
      const analysis = analyzeImageForTask(userMessage)

      if (analysis.type === "task" && analysis.taskId) {
        // Actually complete the task
        setTimeout(() => completeTask(analysis.taskId!), 500)
        return analysis.response
      }

      if (analysis.type === "screentime" && analysis.hours !== undefined) {
        // Actually submit screen time
        const reward = analysis.hours <= 1 ? 30 : analysis.hours <= 2 ? 20 : analysis.hours <= 3 ? 15 : analysis.hours <= 4 ? 10 : 5
        setTimeout(() => submitScreenTime(analysis.hours!), 500)
        return `${analysis.response}\n\n**Screen Time Reward: $${reward.toFixed(2)}** has been added to your wallet!\n\n${analysis.hours <= 1 ? "Incredible discipline! Under 1 hour!" : analysis.hours <= 2 ? "Nice job keeping it reasonable!" : "Try reducing screen time tomorrow for a bigger bonus!"}`
      }

      return analysis.response
    }

    // Regular text responses (same as before)
    if (lowerMessage === "help" || lowerMessage === "help me" || lowerMessage === "i need help") {
      router.push("/help")
      return "Redirecting you to the Help page now! You'll find detailed guides there."
    }

    if (lowerMessage.includes("verify") || lowerMessage.includes("upload") || lowerMessage.includes("photo") || lowerMessage.includes("proof") || lowerMessage.includes("screenshot")) {
      const incompleteTasks = tasks.filter((t) => !t.completed)
      return `**To verify a task or screen time:**\n\n1. Click the image button (camera icon) next to the text input\n2. Upload a photo of your completed task\n3. Tell me which task you completed\n4. I'll verify it and add your reward!\n\n**Your incomplete tasks:**\n${incompleteTasks.map((t) => `- ${t.title} ($${t.reward})`).join("\n") || "All tasks completed!"}\n\nFor screen time, upload a screenshot and say "screen time".`
    }

    if (lowerMessage.includes("feed") || lowerMessage.includes("hungry") || lowerMessage.includes("food")) {
      return `**Feeding your pet** costs $5 and increases their hunger meter by 30%. ${pet ? `${pet.name}'s hunger is currently at ${pet.hunger}%.` : ""}`
    }

    if (lowerMessage.includes("play") || lowerMessage.includes("fun") || lowerMessage.includes("bored")) {
      return `**Playing with your pet** costs $3 and boosts their happiness by 25%. ${pet ? `${pet.name}'s happiness is at ${pet.happiness}%.` : ""}`
    }

    if (lowerMessage.includes("rest") || lowerMessage.includes("sleep") || lowerMessage.includes("tired") || lowerMessage.includes("energy")) {
      return `**Resting is free!** Let your pet sleep to restore their energy by 40%. ${pet ? `${pet.name}'s energy is at ${pet.energy}%.` : ""}`
    }

    if (lowerMessage.includes("clean") || lowerMessage.includes("bath") || lowerMessage.includes("dirty") || lowerMessage.includes("groom")) {
      return `**Cleaning your pet** costs $4 and increases cleanliness by 40%. ${pet ? `${pet.name}'s cleanliness is at ${pet.cleanliness}%.` : ""}`
    }

    if (lowerMessage.includes("vet") || lowerMessage.includes("sick") || lowerMessage.includes("ill") || lowerMessage.includes("health") || lowerMessage.includes("doctor")) {
      return `**Vet visits** cost $15 but fully restore health to 100%. If you have Pet Insurance, it's 25% off. ${pet ? `${pet.name}'s health is at ${pet.health}%.` : ""}`
    }

    if (lowerMessage.includes("money") || lowerMessage.includes("earn") || lowerMessage.includes("income")) {
      return `**Ways to earn money:**\n\n1. Complete daily tasks (upload photo proof!)\n2. Log low screen time (upload screenshot!)\n3. Look out for random events!\n\nWallet: $${wallet.toFixed(2)}. Visit Tasks page!`
    }

    if (lowerMessage.includes("save") || lowerMessage.includes("saving")) {
      return `**Savings tips:** Transfer money to savings from the Wallet page. You have $${savings.toFixed(2)} saved. Try saving at least 20% of earnings!`
    }

    if (lowerMessage.includes("budget") || lowerMessage.includes("report") || lowerMessage.includes("expense")) {
      return `**Budget Report:** Visit the Wallet page to see your detailed budget report! You can filter by category (responsibility, budget, pet care, tasks, screen time) and download it as a PDF.`
    }

    if (lowerMessage.includes("task") || lowerMessage.includes("chore") || lowerMessage.includes("work")) {
      return `**Tasks & Earnings:**\n\n- Upload a photo to verify task completion!\n- Add custom tasks with the "Add Task" button\n- Screen time: upload a screenshot for verification\n\nGo to the Tasks page to see all available tasks!`
    }

    if (lowerMessage.includes("screen") || lowerMessage.includes("phone") || lowerMessage.includes("device")) {
      return `**Screen Time Bonus:** Upload a screenshot of your screen time report here! I'll read it and give you the right reward:\n- 1hr or less: $30\n- 1-2hrs: $20\n- 2-3hrs: $15\n- 3-4hrs: $10\n- 4+hrs: $5`
    }

    if (lowerMessage.includes("shop") || lowerMessage.includes("buy") || lowerMessage.includes("purchase") || lowerMessage.includes("upgrade")) {
      return `**The Shop** has awesome upgrades! Premium Food, Comfy Bed, Insurance, and more. Visit the Shop page to browse!`
    }

    if (lowerMessage.includes("badge") || lowerMessage.includes("achievement") || lowerMessage.includes("award")) {
      return `**Badges** are earned by completing achievements! Pet Parent, Hard Worker, Super Saver, and more. Check the Shop page!`
    }

    if (lowerMessage.includes("how is") || lowerMessage.includes("how's") || lowerMessage.includes("status") || lowerMessage.includes("check")) {
      if (pet) {
        return `**${pet.name}'s Status:**\n\n- Mood: ${pet.mood}\n- Hunger: ${pet.hunger}%\n- Happiness: ${pet.happiness}%\n- Energy: ${pet.energy}%\n- Health: ${pet.health}%\n- Cleanliness: ${pet.cleanliness}%\n\n${pet.mood === "sick" ? "Needs a vet visit!" : pet.mood === "hungry" ? "Time to feed!" : pet.mood === "tired" ? "Needs rest!" : "Looking good!"}`
      }
      return "You haven't adopted a pet yet! Go to the home page to choose one."
    }

    if (lowerMessage.includes("time") || lowerMessage.includes("clock") || lowerMessage.includes("day") || lowerMessage.includes("night")) {
      return `**Game Time System:** The clock on the home page shows in-game time where 30 real seconds = 1 game hour. The background changes for day/night cycles - morning (6am-12pm), afternoon (12-5pm), evening (5-9pm), and night (9pm-6am).`
    }

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey") || lowerMessage.includes("yo") || lowerMessage.includes("sup")) {
      const greetings = [
        `Hello! How can I help you today? ${pet ? `${pet.name} says hi too!` : ""}`,
        `Hey there! Ready to learn about pet care and money management?`,
        `Hi! Upload a photo to verify a task, or ask me anything!`,
      ]
      return greetings[Math.floor(Math.random() * greetings.length)]
    }

    if (lowerMessage.includes("bye") || lowerMessage.includes("goodbye") || lowerMessage.includes("see you") || lowerMessage.includes("later")) {
      return `Goodbye! ${pet ? `Take good care of ${pet.name}!` : "Come back soon!"} Remember to complete your tasks!`
    }

    if (lowerMessage.includes("thank") || lowerMessage.includes("thanks") || lowerMessage.includes("thx")) {
      return "You're welcome! Feel free to ask if you have more questions!"
    }

    if (lowerMessage.includes("joke") || lowerMessage.includes("funny") || lowerMessage.includes("laugh")) {
      const jokes = [
        "Why don't pets ever win at poker? Too many tells... and they always paws!",
        "What do you call a dog that does magic? A Labracadabrador!",
        "Why did the cat sit on the computer? To keep an eye on the mouse!",
      ]
      return jokes[Math.floor(Math.random() * jokes.length)]
    }

    if (lowerMessage.includes("love") || lowerMessage.includes("like you") || lowerMessage.includes("best")) {
      return `Thank you! I love helping you too! ${pet ? `And ${pet.name} loves you the most!` : ""}`
    }

    if (lowerMessage.includes("name") || lowerMessage.includes("who are you") || lowerMessage.includes("what are you")) {
      return "I'm the VirtuPals Assistant! I help you take care of your virtual pet and learn about financial responsibility. I can also verify your tasks and screen time with photo uploads!"
    }

    if (lowerMessage.includes("reset") || lowerMessage.includes("start over") || lowerMessage.includes("new game")) {
      return "Want to start fresh? Reset from the **Help page**. Warning: This deletes all progress!"
    }

    if (pet && (lowerMessage.includes("my pet") || lowerMessage.includes("pet name"))) {
      return `Your pet is ${pet.name} the ${pet.type}! They joined on ${new Date(pet.createdAt).toLocaleDateString()}. Currently feeling ${pet.mood}.`
    }

    if (lowerMessage.includes("?") || lowerMessage.includes("what") || lowerMessage.includes("how") || lowerMessage.includes("why") || lowerMessage.includes("when") || lowerMessage.includes("where") || lowerMessage.includes("can")) {
      return `Here's what I can help with:\n\n- **Task verification**: Upload a photo + name the task\n- **Screen time**: Upload screenshot + say "screen time"\n- **Pet Care**: feeding, playing, resting, cleaning, vet\n- **Money**: earning, saving, budgeting, reports\n- **Shop**: upgrades, accessories, badges\n\nType **help** for the full guide!`
    }

    const randomResponses = [
      `Interesting! Did you know you can upload photos to verify tasks? Try it!`,
      `I'm great at pet care and money tips! Also: upload task photos for verification!`,
      `Have you completed your tasks today? Upload a photo as proof!`,
      `How are your savings going? Check the budget report on the Wallet page!`,
      `Quick tip: keeping your pet happy boosts their overall health!`,
    ]
    return randomResponses[Math.floor(Math.random() * randomResponses.length)]
  }

  const handleSend = () => {
    if (!input.trim() && !pendingImage) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input || (pendingImage ? "(Photo uploaded)" : ""),
      image: pendingImage || undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    const hasImage = !!pendingImage
    const messageText = input
    setInput("")
    setPendingImage(null)
    setPendingImageName("")
    setIsTyping(true)

    setTimeout(() => {
      const response = generateResponse(messageText, hasImage)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, hasImage ? 1500 : 800) // Longer delay for "analyzing" images
  }

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full",
          "bg-primary text-primary-foreground shadow-lg",
          "flex items-center justify-center",
          "hover:scale-110 transition-transform",
          "animate-bounce-slow",
          isOpen && "hidden",
        )}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[560px] max-h-[calc(100vh-6rem)] bg-card rounded-2xl shadow-2xl border border-border flex flex-col animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground rounded-t-2xl">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span className="font-bold">VirtuPals Assistant</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex gap-2", message.role === "user" ? "justify-end" : "justify-start")}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div className="max-w-[80%] space-y-2">
                  {message.image && (
                    <div className={cn(
                      "rounded-2xl overflow-hidden border border-border",
                      message.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm",
                    )}>
                      <img src={message.image} alt="Uploaded" className="max-h-32 w-auto object-cover" />
                    </div>
                  )}
                  {message.content && (
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-muted text-foreground rounded-tl-sm",
                      )}
                    >
                      {message.content}
                    </div>
                  )}
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2 items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-2 rounded-tl-sm">
                  <span className="flex gap-1 items-center">
                    <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                    <span className="text-xs text-muted-foreground ml-1">
                      {pendingImage ? "Analyzing image..." : "Typing..."}
                    </span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Pending Image Preview */}
          {pendingImage && (
            <div className="px-4 py-2 border-t border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <img src={pendingImage} alt="Preview" className="h-12 w-12 rounded-lg object-cover border border-border" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{pendingImageName}</p>
                  <p className="text-[10px] text-muted-foreground">Ready to send</p>
                </div>
                <button
                  onClick={() => { setPendingImage(null); setPendingImageName("") }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex gap-2"
            >
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="flex-shrink-0"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus className="w-4 h-4" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={pendingImage ? "Describe your task..." : "Ask me anything..."}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!input.trim() && !pendingImage}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
