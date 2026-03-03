"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

export type PetType = "dog" | "cat" | "bunny" | "hamster"
export type PetMood = "happy" | "sad" | "hungry" | "tired" | "sick" | "energetic" | "loving"

export interface Pet {
  name: string
  type: PetType
  mood: PetMood
  hunger: number
  happiness: number
  energy: number
  health: number
  cleanliness: number
  age: number
  createdAt: Date
}

export interface Expense {
  id: string
  category: "food" | "health" | "toys" | "supplies"
  description: string
  amount: number
  date: Date
}

export interface Task {
  id: string
  title: string
  description: string
  reward: number
  completed: boolean
  type: "chore" | "learning" | "screentime" | "custom"
  isCustom?: boolean
  requiresPhoto?: boolean
}

export interface ActivityLog {
  id: string
  message: string
  type: "care" | "task" | "financial" | "event" | "shop"
  timestamp: Date
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earned: boolean
  earnedAt?: Date
}

export interface ShopItem {
  id: string
  name: string
  description: string
  price: number
  category: "upgrade" | "accessory" | "food" | "toy"
  icon: string
  owned: boolean
}

export interface GameTime {
  hour: number
  minute: number
  day: number
  month: number
  year: number
}

export interface GameState {
  pet: Pet | null
  wallet: number
  savings: number
  savingsGoal: number
  expenses: Expense[]
  tasks: Task[]
  totalEarned: number
  totalSpent: number
  hasCompletedSetup: boolean
  activityLog: ActivityLog[]
  badges: Badge[]
  shopItems: ShopItem[]
  gameTime: GameTime
}

interface GameContextType extends GameState {
  createPet: (name: string, type: PetType) => void
  feedPet: (cost: number) => boolean
  playWithPet: (cost: number) => boolean
  restPet: () => void
  cleanPet: (cost: number) => boolean
  visitVet: (cost: number) => boolean
  completeTask: (taskId: string) => void
  addToSavings: (amount: number) => boolean
  withdrawFromSavings: (amount: number) => boolean
  setSavingsGoal: (amount: number) => void
  submitScreenTime: (hours: number) => number
  resetGame: () => void
  addActivity: (message: string, type: ActivityLog["type"]) => void
  purchaseItem: (itemId: string) => boolean
  triggerRandomEvent: () => void
  addCustomTask: (title: string, description: string, reward: number) => void
  getTimeOfDay: () => "morning" | "afternoon" | "evening" | "night"
  getFormattedDate: () => string
}

const defaultTasks: Task[] = [
  { id: "1", title: "Make Your Bed", description: "Start your day organized!", reward: 5, completed: false, type: "chore", requiresPhoto: true },
  { id: "2", title: "Do the Dishes", description: "Help keep the kitchen clean", reward: 8, completed: false, type: "chore", requiresPhoto: true },
  { id: "3", title: "Clean Your Room", description: "A tidy space, a tidy mind", reward: 15, completed: false, type: "chore", requiresPhoto: true },
  { id: "4", title: "Read for 30 Minutes", description: "Expand your knowledge", reward: 10, completed: false, type: "learning", requiresPhoto: true },
  { id: "5", title: "Complete Homework", description: "Stay on top of your studies", reward: 20, completed: false, type: "learning", requiresPhoto: true },
  { id: "6", title: "Help with Laundry", description: "Learn a life skill", reward: 12, completed: false, type: "chore", requiresPhoto: true },
  { id: "7", title: "Take Out Trash", description: "Keep your home clean", reward: 5, completed: false, type: "chore", requiresPhoto: true },
  { id: "8", title: "Water Plants", description: "Care for nature", reward: 5, completed: false, type: "chore", requiresPhoto: true },
]

const defaultBadges: Badge[] = [
  { id: "first-pet", name: "Pet Parent", description: "Adopted your first pet!", icon: "🐾", earned: false },
  { id: "first-task", name: "Hard Worker", description: "Completed your first task", icon: "⭐", earned: false },
  { id: "saver", name: "Super Saver", description: "Saved $50 or more", icon: "🐖", earned: false },
  { id: "caretaker", name: "Loving Caretaker", description: "Fed your pet 10 times", icon: "❤️", earned: false },
  { id: "rich", name: "Money Master", description: "Earned $200 total", icon: "💵", earned: false },
  { id: "healthy", name: "Health Hero", description: "Visited the vet 3 times", icon: "🏥", earned: false },
  { id: "shopper", name: "Smart Shopper", description: "Made your first purchase", icon: "🛒", earned: false },
  { id: "screentime", name: "Screen Smart", description: "Earned max screen time bonus", icon: "📱", earned: false },
]

const defaultShopItems: ShopItem[] = [
  { id: "premium-food", name: "Premium Pet Food", description: "Increases hunger boost by 50%", price: 25, category: "upgrade", icon: "🥩", owned: false },
  { id: "comfy-bed", name: "Comfy Bed", description: "Rest restores 20% more energy", price: 40, category: "upgrade", icon: "🛏️", owned: false },
  { id: "fun-ball", name: "Super Fun Ball", description: "Playing gives 10% more happiness", price: 30, category: "toy", icon: "🎾", owned: false },
  { id: "grooming-kit", name: "Deluxe Grooming Kit", description: "Cleaning gives 20% more cleanliness", price: 35, category: "upgrade", icon: "✨", owned: false },
  { id: "health-insurance", name: "Pet Insurance", description: "Vet visits cost 25% less", price: 100, category: "upgrade", icon: "🩺", owned: false },
  { id: "treat-jar", name: "Treat Jar", description: "Bonus happiness when feeding", price: 20, category: "food", icon: "🍪", owned: false },
  { id: "bow-tie", name: "Fancy Bow Tie", description: "Your pet looks extra stylish!", price: 15, category: "accessory", icon: "🎀", owned: false },
  { id: "sunglasses", name: "Cool Sunglasses", description: "Your pet is too cool!", price: 18, category: "accessory", icon: "😎", owned: false },
]

const randomEvents = [
  { message: "{name} found a shiny coin on the ground! +$2", effect: "bonus", amount: 2 },
  { message: "{name} caught a cold and is feeling sick!", effect: "sick", amount: 0 },
  { message: "{name} is feeling extra playful today!", effect: "happy", amount: 15 },
  { message: "{name} got into the mud! Cleanliness decreased.", effect: "dirty", amount: -20 },
  { message: "{name} took an unexpected nap! Energy restored.", effect: "energy", amount: 30 },
  { message: "{name} is extra hungry after running around!", effect: "hungry", amount: -25 },
  { message: "A kind stranger gave {name} a treat! +$5", effect: "bonus", amount: 5 },
  { message: "{name} had a bad dream and woke up sad.", effect: "sad", amount: -15 },
]

const GameContext = createContext<GameContextType | undefined>(undefined)

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>({
    pet: null,
    wallet: 50,
    savings: 0,
    savingsGoal: 100,
    expenses: [],
    tasks: defaultTasks,
    totalEarned: 50,
    totalSpent: 0,
    hasCompletedSetup: false,
    activityLog: [],
    badges: defaultBadges,
    shopItems: defaultShopItems,
    gameTime: { hour: 8, minute: 0, day: 1, month: 1, year: 2025 },
  })

  const [feedCount, setFeedCount] = useState(0)
  const [vetCount, setVetCount] = useState(0)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("virtupals-game")
    if (saved) {
      const parsed = JSON.parse(saved)
      setState({
        ...parsed,
        pet: parsed.pet ? { ...parsed.pet, createdAt: new Date(parsed.pet.createdAt) } : null,
        expenses: parsed.expenses?.map((e: Expense) => ({ ...e, date: new Date(e.date) })) || [],
        activityLog: parsed.activityLog?.map((a: ActivityLog) => ({ ...a, timestamp: new Date(a.timestamp) })) || [],
        badges: parsed.badges
          ? parsed.badges.map((b: Badge) => {
              const def = defaultBadges.find((d) => d.id === b.id)
              return def ? { ...b, icon: def.icon } : b
            })
          : defaultBadges,
        shopItems: parsed.shopItems
          ? parsed.shopItems.map((s: ShopItem) => {
              const def = defaultShopItems.find((d) => d.id === s.id)
              return def ? { ...s, icon: def.icon } : s
            })
          : defaultShopItems,
        gameTime: parsed.gameTime || { hour: 8, minute: 0, day: 1, month: 1, year: 2025 },
      })
      setFeedCount(parsed.feedCount || 0)
      setVetCount(parsed.vetCount || 0)
    }
  }, [])

  // Save to localStorage on state change
  useEffect(() => {
    if (state.hasCompletedSetup) {
      localStorage.setItem("virtupals-game", JSON.stringify({ ...state, feedCount, vetCount }))
    }
  }, [state, feedCount, vetCount])

  // GAME TIME: 30 real seconds = 1 game hour. We tick every 1.25 seconds to advance 2.5 minutes.
  useEffect(() => {
    if (!state.hasCompletedSetup) return
    const interval = setInterval(() => {
      setState((prev) => {
        let { hour, minute, day, month, year } = prev.gameTime
        minute += 2 // advance ~2 minutes each tick (1.25s * 30 ticks = 37.5s ~ 30s per hour)
        if (minute >= 60) {
          minute = 0
          hour++
        }
        if (hour >= 24) {
          hour = 0
          day++
        }
        if (day > 30) {
          day = 1
          month++
        }
        if (month > 12) {
          month = 1
          year++
        }
        return { ...prev, gameTime: { hour, minute, day, month, year } }
      })
    }, 1000) // tick every second, advancing 2 min = 30 ticks per hour = 30 seconds real time
    return () => clearInterval(interval)
  }, [state.hasCompletedSetup])

  // Pet stat decay over time
  useEffect(() => {
    if (!state.pet) return
    const interval = setInterval(() => {
      setState((prev) => {
        if (!prev.pet) return prev
        const newPet = {
          ...prev.pet,
          hunger: Math.max(0, prev.pet.hunger - 2),
          happiness: Math.max(0, prev.pet.happiness - 1),
          energy: Math.min(100, prev.pet.energy + 1),
          cleanliness: Math.max(0, prev.pet.cleanliness - 1),
        }
        newPet.mood = calculateMood(newPet)
        return { ...prev, pet: newPet }
      })
    }, 10000)
    return () => clearInterval(interval)
  }, [state.pet])

  useEffect(() => {
    if (!state.pet || !state.hasCompletedSetup) return
    const triggerEvent = () => {
      const randomDelay = Math.random() * 45000 + 45000
      setTimeout(() => {
        if (Math.random() < 0.3) {
          triggerRandomEvent()
        }
        triggerEvent()
      }, randomDelay)
    }
    triggerEvent()
  }, [state.hasCompletedSetup])

  const getTimeOfDay = useCallback((): "morning" | "afternoon" | "evening" | "night" => {
    const h = state.gameTime.hour
    if (h >= 6 && h < 12) return "morning"
    if (h >= 12 && h < 17) return "afternoon"
    if (h >= 17 && h < 21) return "evening"
    return "night"
  }, [state.gameTime.hour])

  const getFormattedDate = useCallback((): string => {
    const { day, month, year } = state.gameTime
    return `${MONTH_NAMES[month - 1]} ${day}, ${year}`
  }, [state.gameTime])

  const calculateMood = (pet: Pet): PetMood => {
    if (pet.health < 30) return "sick"
    if (pet.hunger < 30) return "hungry"
    if (pet.energy < 30) return "tired"
    if (pet.happiness < 30) return "sad"
    if (pet.happiness > 80 && pet.hunger > 60) return "loving"
    if (pet.energy > 70 && pet.happiness > 60) return "energetic"
    return "happy"
  }

  const addActivity = (message: string, type: ActivityLog["type"]) => {
    const activity: ActivityLog = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
    }
    setState((prev) => ({
      ...prev,
      activityLog: [activity, ...prev.activityLog].slice(0, 50),
    }))
  }

  const triggerRandomEvent = () => {
    if (!state.pet) return
    const event = randomEvents[Math.floor(Math.random() * randomEvents.length)]
    const message = event.message.replace("{name}", state.pet.name)

    setState((prev) => {
      if (!prev.pet) return prev
      const newPet = { ...prev.pet }
      let newWallet = prev.wallet

      switch (event.effect) {
        case "bonus":
          newWallet += event.amount
          break
        case "sick":
          newPet.health = Math.max(0, newPet.health - 30)
          newPet.mood = "sick"
          break
        case "happy":
          newPet.happiness = Math.min(100, newPet.happiness + event.amount)
          break
        case "dirty":
          newPet.cleanliness = Math.max(0, newPet.cleanliness + event.amount)
          break
        case "energy":
          newPet.energy = Math.min(100, newPet.energy + event.amount)
          break
        case "hungry":
          newPet.hunger = Math.max(0, newPet.hunger + event.amount)
          break
        case "sad":
          newPet.happiness = Math.max(0, newPet.happiness + event.amount)
          break
      }
      newPet.mood = calculateMood(newPet)

      return {
        ...prev,
        pet: newPet,
        wallet: newWallet,
        totalEarned: event.effect === "bonus" ? prev.totalEarned + event.amount : prev.totalEarned,
        activityLog: [
          { id: Date.now().toString(), message, type: "event", timestamp: new Date() },
          ...prev.activityLog,
        ].slice(0, 50),
      }
    })
  }

  const earnBadge = (badgeId: string) => {
    setState((prev) => ({
      ...prev,
      badges: prev.badges.map((b) =>
        b.id === badgeId && !b.earned ? { ...b, earned: true, earnedAt: new Date() } : b,
      ),
    }))
  }

  const purchaseItem = (itemId: string): boolean => {
    const item = state.shopItems.find((i) => i.id === itemId)
    if (!item || item.owned || state.wallet < item.price) return false
    setState((prev) => ({
      ...prev,
      wallet: prev.wallet - item.price,
      totalSpent: prev.totalSpent + item.price,
      shopItems: prev.shopItems.map((i) => (i.id === itemId ? { ...i, owned: true } : i)),
    }))
    addActivity(`Purchased ${item.name} for $${item.price}`, "shop")
    if (!state.badges.find((b) => b.id === "shopper")?.earned) {
      earnBadge("shopper")
    }
    return true
  }

  const createPet = (name: string, type: PetType) => {
    const newPet: Pet = {
      name, type, mood: "happy", hunger: 70, happiness: 80, energy: 80, health: 100, cleanliness: 90, age: 0, createdAt: new Date(),
    }
    setState((prev) => ({
      ...prev,
      pet: newPet,
      hasCompletedSetup: true,
      activityLog: [
        { id: Date.now().toString(), message: `Welcome ${name} to the family!`, type: "event", timestamp: new Date() },
      ],
    }))
    earnBadge("first-pet")
  }

  const addExpense = (category: Expense["category"], description: string, amount: number) => {
    const expense: Expense = { id: Date.now().toString(), category, description, amount, date: new Date() }
    setState((prev) => ({
      ...prev,
      expenses: [...prev.expenses, expense],
      totalSpent: prev.totalSpent + amount,
    }))
  }

  const feedPet = (cost: number): boolean => {
    if (state.wallet < cost || !state.pet) return false
    const hasPremiumFood = state.shopItems.find((i) => i.id === "premium-food")?.owned
    const hasTreatJar = state.shopItems.find((i) => i.id === "treat-jar")?.owned
    const hungerBoost = hasPremiumFood ? 45 : 30
    const happinessBoost = hasTreatJar ? 15 : 5
    setState((prev) => ({
      ...prev,
      wallet: prev.wallet - cost,
      pet: prev.pet
        ? { ...prev.pet, hunger: Math.min(100, prev.pet.hunger + hungerBoost), happiness: Math.min(100, prev.pet.happiness + happinessBoost), mood: calculateMood({ ...prev.pet, hunger: Math.min(100, prev.pet.hunger + hungerBoost) }) }
        : null,
    }))
    addExpense("food", "Pet food", cost)
    addActivity(`Fed ${state.pet.name} for $${cost}`, "care")
    setFeedCount((prev) => {
      const newCount = prev + 1
      if (newCount >= 10) earnBadge("caretaker")
      return newCount
    })
    return true
  }

  const playWithPet = (cost: number): boolean => {
    if (state.wallet < cost || !state.pet) return false
    const hasFunBall = state.shopItems.find((i) => i.id === "fun-ball")?.owned
    const happinessBoost = hasFunBall ? 35 : 25
    setState((prev) => ({
      ...prev,
      wallet: prev.wallet - cost,
      pet: prev.pet
        ? { ...prev.pet, happiness: Math.min(100, prev.pet.happiness + happinessBoost), energy: Math.max(0, prev.pet.energy - 15), mood: calculateMood({ ...prev.pet, happiness: Math.min(100, prev.pet.happiness + happinessBoost) }) }
        : null,
    }))
    addExpense("toys", "Play time & toys", cost)
    addActivity(`Played with ${state.pet.name} for $${cost}`, "care")
    return true
  }

  const restPet = () => {
    if (!state.pet) return
    const hasComfyBed = state.shopItems.find((i) => i.id === "comfy-bed")?.owned
    const energyBoost = hasComfyBed ? 60 : 40
    setState((prev) => ({
      ...prev,
      pet: prev.pet
        ? { ...prev.pet, energy: Math.min(100, prev.pet.energy + energyBoost), mood: calculateMood({ ...prev.pet, energy: Math.min(100, prev.pet.energy + energyBoost) }) }
        : null,
    }))
    addActivity(`${state.pet.name} took a nice rest`, "care")
  }

  const cleanPet = (cost: number): boolean => {
    if (state.wallet < cost || !state.pet) return false
    const hasGroomingKit = state.shopItems.find((i) => i.id === "grooming-kit")?.owned
    const cleanlinessBoost = hasGroomingKit ? 60 : 40
    setState((prev) => ({
      ...prev,
      wallet: prev.wallet - cost,
      pet: prev.pet
        ? { ...prev.pet, cleanliness: Math.min(100, prev.pet.cleanliness + cleanlinessBoost), happiness: Math.min(100, prev.pet.happiness + 10), mood: calculateMood({ ...prev.pet, cleanliness: Math.min(100, prev.pet.cleanliness + cleanlinessBoost) }) }
        : null,
    }))
    addExpense("supplies", "Grooming supplies", cost)
    addActivity(`Gave ${state.pet.name} a bath for $${cost}`, "care")
    return true
  }

  const visitVet = (cost: number): boolean => {
    const hasInsurance = state.shopItems.find((i) => i.id === "health-insurance")?.owned
    const actualCost = hasInsurance ? Math.round(cost * 0.75) : cost
    if (state.wallet < actualCost || !state.pet) return false
    setState((prev) => ({
      ...prev,
      wallet: prev.wallet - actualCost,
      pet: prev.pet ? { ...prev.pet, health: 100, mood: "happy" } : null,
    }))
    addExpense("health", "Vet visit", actualCost)
    addActivity(`Took ${state.pet.name} to the vet for $${actualCost}${hasInsurance ? " (insurance applied)" : ""}`, "care")
    setVetCount((prev) => {
      const newCount = prev + 1
      if (newCount >= 3) earnBadge("healthy")
      return newCount
    })
    return true
  }

  const completeTask = (taskId: string) => {
    const task = state.tasks.find((t) => t.id === taskId)
    if (!task || task.completed) return
    setState((prev) => ({
      ...prev,
      wallet: prev.wallet + task.reward,
      totalEarned: prev.totalEarned + task.reward,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, completed: true } : t)),
    }))
    addActivity(`Completed "${task.title}" and earned $${task.reward}`, "task")
    if (!state.badges.find((b) => b.id === "first-task")?.earned) {
      earnBadge("first-task")
    }
    if (state.totalEarned + task.reward >= 200) {
      earnBadge("rich")
    }
  }

  const addCustomTask = (title: string, description: string, reward: number) => {
    const newTask: Task = {
      id: `custom-${Date.now()}`,
      title,
      description,
      reward,
      completed: false,
      type: "custom",
      isCustom: true,
      requiresPhoto: true,
    }
    setState((prev) => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }))
    addActivity(`Added new custom task: "${title}"`, "task")
  }

  const addToSavings = (amount: number): boolean => {
    if (state.wallet < amount) return false
    setState((prev) => ({ ...prev, wallet: prev.wallet - amount, savings: prev.savings + amount }))
    addActivity(`Deposited $${amount} to savings`, "financial")
    if (state.savings + amount >= 50) earnBadge("saver")
    return true
  }

  const withdrawFromSavings = (amount: number): boolean => {
    if (state.savings < amount) return false
    setState((prev) => ({ ...prev, wallet: prev.wallet + amount, savings: prev.savings - amount }))
    addActivity(`Withdrew $${amount} from savings`, "financial")
    return true
  }

  const setSavingsGoalFn = (amount: number) => {
    setState((prev) => ({ ...prev, savingsGoal: amount }))
  }

  const submitScreenTime = (hours: number): number => {
    let reward = 0
    if (hours <= 1) reward = 30
    else if (hours <= 2) reward = 20
    else if (hours <= 3) reward = 15
    else if (hours <= 4) reward = 10
    else reward = 5
    setState((prev) => ({ ...prev, wallet: prev.wallet + reward, totalEarned: prev.totalEarned + reward }))
    addActivity(`Logged ${hours} hours screen time and earned $${reward}`, "task")
    if (hours <= 1 && !state.badges.find((b) => b.id === "screentime")?.earned) {
      earnBadge("screentime")
    }
    return reward
  }

  const resetGame = () => {
    localStorage.removeItem("virtupals-game")
    setFeedCount(0)
    setVetCount(0)
    setState({
      pet: null, wallet: 50, savings: 0, savingsGoal: 100, expenses: [],
      tasks: defaultTasks.map((t) => ({ ...t, completed: false })),
      totalEarned: 50, totalSpent: 0, hasCompletedSetup: false, activityLog: [],
      badges: defaultBadges, shopItems: defaultShopItems,
      gameTime: { hour: 8, minute: 0, day: 1, month: 1, year: 2025 },
    })
  }

  return (
    <GameContext.Provider
      value={{
        ...state,
        createPet, feedPet, playWithPet, restPet, cleanPet, visitVet,
        completeTask, addToSavings, withdrawFromSavings, setSavingsGoal: setSavingsGoalFn,
        submitScreenTime, resetGame, addActivity, purchaseItem, triggerRandomEvent,
        addCustomTask, getTimeOfDay, getFormattedDate,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
