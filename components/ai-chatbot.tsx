"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useGame } from "@/contexts/game-context"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi there! I'm your VirtuPals Assistant! I can help you with:\n\n- Pet care tips\n- Financial advice\n- Task information\n- Or just chat about anything!\n\nType **help** to see the full guide, or ask me anything!",
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { pet, wallet, savings } = useGame()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase().trim()

    // Check for "help" keyword - redirect to help page
    if (lowerMessage === "help" || lowerMessage === "help me" || lowerMessage === "i need help") {
      router.push("/help")
      return "Redirecting you to the Help page now! You'll find detailed guides there."
    }

    // Pet-related responses
    if (lowerMessage.includes("feed") || lowerMessage.includes("hungry") || lowerMessage.includes("food")) {
      return `**Feeding your pet** costs $5 and increases their hunger meter by 30%. A well-fed pet is a happy pet! ${pet ? `${pet.name}'s hunger is currently at ${pet.hunger}%.` : ""}`
    }

    if (lowerMessage.includes("play") || lowerMessage.includes("fun") || lowerMessage.includes("bored")) {
      return `**Playing with your pet** costs $3 and boosts their happiness by 25% while using some energy. It's great for bonding! ${pet ? `${pet.name}'s happiness is at ${pet.happiness}%.` : ""}`
    }

    if (
      lowerMessage.includes("rest") ||
      lowerMessage.includes("sleep") ||
      lowerMessage.includes("tired") ||
      lowerMessage.includes("energy")
    ) {
      return `**Resting is free!** Let your pet sleep to restore their energy by 40%. A tired pet can't play as much. ${pet ? `${pet.name}'s energy is at ${pet.energy}%.` : ""}`
    }

    if (
      lowerMessage.includes("clean") ||
      lowerMessage.includes("bath") ||
      lowerMessage.includes("dirty") ||
      lowerMessage.includes("groom")
    ) {
      return `**Cleaning your pet** costs $4 and increases cleanliness by 40%. Good hygiene prevents illness and makes them happier! ${pet ? `${pet.name}'s cleanliness is at ${pet.cleanliness}%.` : ""}`
    }

    if (
      lowerMessage.includes("vet") ||
      lowerMessage.includes("sick") ||
      lowerMessage.includes("ill") ||
      lowerMessage.includes("health") ||
      lowerMessage.includes("doctor")
    ) {
      return `**Vet visits** cost $15 but fully restore your pet's health to 100%. Visit the vet if your pet gets sick! If you have Pet Insurance from the shop, it's 25% off. ${pet ? `${pet.name}'s health is at ${pet.health}%.` : ""}`
    }

    // Financial responses
    if (lowerMessage.includes("money") || lowerMessage.includes("earn") || lowerMessage.includes("income")) {
      return `**Ways to earn money:**\n\n1. Complete daily tasks (chores & learning)\n2. Log low screen time for bonuses\n3. Look out for random events!\n\nYour current wallet balance is $${wallet.toFixed(2)}. Check the Tasks page for available tasks!`
    }

    if (lowerMessage.includes("save") || lowerMessage.includes("saving")) {
      return `**Savings tips:**\n\nYou can transfer money to your savings account from the Wallet page. Set goals to stay motivated! You currently have $${savings.toFixed(2)} saved. Try to save at least 20% of what you earn!`
    }

    if (lowerMessage.includes("budget") || lowerMessage.includes("spend") || lowerMessage.includes("expense")) {
      return `**Budgeting advice:**\n\nKeep track of your spending on the Wallet page. All expenses are categorized (food, health, toys, supplies). The key is to spend less than you earn and always keep some money for emergencies!`
    }

    if (lowerMessage.includes("task") || lowerMessage.includes("chore") || lowerMessage.includes("work")) {
      return `**Tasks & Earnings:**\n\n- Chores: Make bed ($5), Dishes ($8), Clean room ($15), etc.\n- Learning: Reading ($10), Homework ($20)\n- Screen Time Bonus: 1hr or less = $30!\n\nGo to the Tasks page to start earning!`
    }

    if (lowerMessage.includes("screen") || lowerMessage.includes("phone") || lowerMessage.includes("device")) {
      return `**Screen Time Bonus:**\n\n- 1 hour or less: $30 (Best!)\n- 1-2 hours: $20\n- 2-3 hours: $15\n- 3-4 hours: $10\n- 4+ hours: $5\n\nLess screen time = more money! Log your screen time on the Tasks page.`
    }

    // Shop and badges
    if (
      lowerMessage.includes("shop") ||
      lowerMessage.includes("buy") ||
      lowerMessage.includes("purchase") ||
      lowerMessage.includes("upgrade")
    ) {
      return `**The Shop** has awesome upgrades for your pet care!\n\n- Premium Food: +50% hunger boost\n- Comfy Bed: +20% rest energy\n- Pet Insurance: 25% off vet visits\n- And more accessories!\n\nVisit the Shop page to browse items!`
    }

    if (
      lowerMessage.includes("badge") ||
      lowerMessage.includes("achievement") ||
      lowerMessage.includes("award") ||
      lowerMessage.includes("trophy")
    ) {
      return `**Badges** are earned by completing achievements!\n\n- Pet Parent: Adopt your first pet\n- Hard Worker: Complete your first task\n- Super Saver: Save $50 or more\n- And many more!\n\nCheck the Shop page to see all badges!`
    }

    // Pet status check
    if (
      lowerMessage.includes("how is") ||
      lowerMessage.includes("how's") ||
      lowerMessage.includes("status") ||
      lowerMessage.includes("check")
    ) {
      if (pet) {
        return `**${pet.name}'s Status:**\n\n- Mood: ${pet.mood}\n- Hunger: ${pet.hunger}%\n- Happiness: ${pet.happiness}%\n- Energy: ${pet.energy}%\n- Health: ${pet.health}%\n- Cleanliness: ${pet.cleanliness}%\n\n${pet.mood === "sick" ? "Your pet needs a vet visit!" : pet.mood === "hungry" ? "Time to feed your pet!" : pet.mood === "tired" ? "Let your pet rest!" : "Looking good!"}`
      }
      return "You haven't adopted a pet yet! Go to the home page to choose your companion."
    }

    // Greetings
    if (
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi") ||
      lowerMessage.includes("hey") ||
      lowerMessage.includes("yo") ||
      lowerMessage.includes("sup")
    ) {
      const greetings = [
        `Hello! How can I help you today? ${pet ? `${pet.name} says hi too!` : ""}`,
        `Hey there! Ready to learn about pet care and money management?`,
        `Hi! I'm here to help with anything you need. Just ask!`,
        `Hello friend! What would you like to know about?`,
      ]
      return greetings[Math.floor(Math.random() * greetings.length)]
    }

    // Farewells
    if (
      lowerMessage.includes("bye") ||
      lowerMessage.includes("goodbye") ||
      lowerMessage.includes("see you") ||
      lowerMessage.includes("later")
    ) {
      return `Goodbye! ${pet ? `Take good care of ${pet.name}!` : "Come back soon!"} Remember to complete your tasks and save money!`
    }

    // Thanks
    if (lowerMessage.includes("thank") || lowerMessage.includes("thanks") || lowerMessage.includes("thx")) {
      return "You're welcome! Feel free to ask if you have more questions. Happy pet caring!"
    }

    // Fun responses
    if (lowerMessage.includes("joke") || lowerMessage.includes("funny") || lowerMessage.includes("laugh")) {
      const jokes = [
        "Why don't pets ever win at poker? Too many tells... and they always paws!",
        "What do you call a dog that does magic? A Labracadabrador!",
        "Why did the cat sit on the computer? To keep an eye on the mouse!",
        "What do you call a pile of cats? A meow-ntain!",
        "Why are cats bad storytellers? Because they only have one tale!",
      ]
      return jokes[Math.floor(Math.random() * jokes.length)]
    }

    if (lowerMessage.includes("love") || lowerMessage.includes("like you") || lowerMessage.includes("best")) {
      return `Aww, thank you! I love helping you too! ${pet ? `And ${pet.name} loves you the most!` : ""}`
    }

    if (
      lowerMessage.includes("name") ||
      lowerMessage.includes("who are you") ||
      lowerMessage.includes("what are you")
    ) {
      return "I'm the VirtuPals Assistant! I'm here to help you take care of your virtual pet and learn about financial responsibility. Think of me as your helpful guide!"
    }

    if (lowerMessage.includes("random") || lowerMessage.includes("event") || lowerMessage.includes("surprise")) {
      return "**Random Events** can happen at any time! Your pet might find money, catch a cold, get extra playful, or have other surprises. Keep an eye on the Activity Log on the home page to see what's happening!"
    }

    if (lowerMessage.includes("reset") || lowerMessage.includes("start over") || lowerMessage.includes("new game")) {
      return "Want to start fresh? You can reset your game from the **Help page**. Just scroll down to find the Reset button. Warning: This will delete all your progress!"
    }

    if (lowerMessage.includes("goal") || lowerMessage.includes("target")) {
      return `**Setting savings goals** helps you stay motivated! Go to the Wallet page to set a goal. You currently have $${savings.toFixed(2)} saved. Try saving for something special like a shop upgrade!`
    }

    // Pet name/type questions
    if (
      pet &&
      (lowerMessage.includes("my pet") || lowerMessage.includes("pet name") || lowerMessage.includes("what pet"))
    ) {
      return `Your pet is ${pet.name} the ${pet.type}! They joined your family on ${new Date(pet.createdAt).toLocaleDateString()}. Currently feeling ${pet.mood}.`
    }

    // Catch-all for questions
    if (
      lowerMessage.includes("?") ||
      lowerMessage.includes("what") ||
      lowerMessage.includes("how") ||
      lowerMessage.includes("why") ||
      lowerMessage.includes("when") ||
      lowerMessage.includes("where") ||
      lowerMessage.includes("can")
    ) {
      return `Great question! Here's what I can help with:\n\n- **Pet Care**: feeding, playing, resting, cleaning, vet visits\n- **Money**: earning from tasks, saving, budgeting\n- **Shop**: upgrades, accessories, badges\n- **Tips**: financial lessons, pet mood info\n\nTry asking about any of these topics, or type **help** for the full guide!`
    }

    // Fun random responses for anything else
    const randomResponses = [
      `Interesting! While I think about that, did you know ${pet ? `${pet.name}` : "your future pet"} would love some attention? Check their stats!`,
      `Hmm, I'm not sure about that specific topic, but I'm great at pet care and money tips! What would you like to know?`,
      `That's a fun thought! By the way, have you completed your tasks today? There's money to be earned!`,
      `I hear you! Speaking of which, how are your savings going? Remember: save for a rainy day!`,
      `Noted! Hey, did you check the shop lately? There might be some cool upgrades for ${pet ? pet.name : "your pet"}!`,
      `I appreciate you sharing! Quick tip: keeping your pet happy boosts their overall health. Try playing with them!`,
    ]
    return randomResponses[Math.floor(Math.random() * randomResponses.length)]
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(input)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 800)
  }

  return (
    <>
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
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-card rounded-2xl shadow-2xl border border-border flex flex-col animate-in slide-in-from-bottom-5 duration-300">
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
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted text-foreground rounded-tl-sm",
                  )}
                >
                  {message.content}
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
                  <span className="flex gap-1">
                    <span
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
