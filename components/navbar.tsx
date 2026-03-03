"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useGame } from "@/contexts/game-context"
import { Home, Heart, Wallet, ListTodo, HelpCircle, ShoppingBag } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const { wallet, pet } = useGame()

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/pet", label: "My Pet", icon: Heart },
    { href: "/wallet", label: "Wallet", icon: Wallet },
    { href: "/tasks", label: "Tasks", icon: ListTodo },
    { href: "/shop", label: "Shop", icon: ShoppingBag },
    { href: "/help", label: "Help", icon: HelpCircle },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <span className="font-bold text-xl text-primary">VirtuPals</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* Wallet Display */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
              <span className="text-lg">💰</span>
              <span className="font-bold text-secondary-foreground">${wallet.toFixed(2)}</span>
            </div>
            {pet && (
              <div className="hidden sm:flex items-center gap-2 bg-accent/20 px-3 py-2 rounded-full">
                <span className="text-lg">
                  {pet.type === "dog" ? "🐕" : pet.type === "cat" ? "🐱" : pet.type === "bunny" ? "🐰" : "🐹"}
                </span>
                <span className="font-medium text-sm">{pet.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-around py-2 border-t border-border overflow-x-auto">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors flex-shrink-0",
                pathname === href ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
