"use client"

import { useGame } from "@/contexts/game-context"
import { cn } from "@/lib/utils"

export function GameClock() {
  const { gameTime, getTimeOfDay, getFormattedDate } = useGame()
  const { hour, minute } = gameTime
  const timeOfDay = getTimeOfDay()
  const formattedDate = getFormattedDate()

  // Digital clock formatting
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  const ampm = hour < 12 ? "AM" : "PM"
  const displayMinute = minute.toString().padStart(2, "0")

  // Analog clock calculations
  const hourAngle = ((hour % 12) + minute / 60) * 30 // 360/12 = 30 degrees per hour
  const minuteAngle = minute * 6 // 360/60 = 6 degrees per minute

  const timeColors = {
    morning: { bg: "from-amber-100 to-yellow-200", text: "text-amber-900", label: "Morning", icon: "sun" },
    afternoon: { bg: "from-sky-100 to-blue-200", text: "text-sky-900", label: "Afternoon", icon: "sun" },
    evening: { bg: "from-orange-200 to-rose-300", text: "text-orange-900", label: "Evening", icon: "sunset" },
    night: { bg: "from-indigo-300 to-slate-400", text: "text-indigo-100", label: "Night", icon: "moon" },
  }

  const current = timeColors[timeOfDay]

  return (
    <div
      className={cn(
        "rounded-2xl p-6 bg-gradient-to-br border border-border/50 shadow-lg",
        current.bg,
      )}
    >
      <div className="flex items-center gap-6">
        {/* Analog Clock */}
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Clock face */}
            <circle cx="50" cy="50" r="48" fill="white" stroke="currentColor" strokeWidth="2" className={current.text} opacity="0.9" />
            <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="0.5" className={current.text} opacity="0.3" />

            {/* Hour markers */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 - 90) * (Math.PI / 180)
              const x1 = 50 + 38 * Math.cos(angle)
              const y1 = 50 + 38 * Math.sin(angle)
              const x2 = 50 + 44 * Math.cos(angle)
              const y2 = 50 + 44 * Math.sin(angle)
              return (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={i % 3 === 0 ? "2.5" : "1"} className={current.text} strokeLinecap="round" />
              )
            })}

            {/* Hour numbers */}
            {[12, 3, 6, 9].map((num) => {
              const angle = ((num * 30 - 90) * Math.PI) / 180
              const x = 50 + 32 * Math.cos(angle)
              const y = 50 + 32 * Math.sin(angle)
              return (
                <text key={num} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="9" fontWeight="bold" className={current.text} fill="currentColor">
                  {num}
                </text>
              )
            })}

            {/* Hour hand */}
            <line
              x1="50" y1="50"
              x2={50 + 22 * Math.cos((hourAngle - 90) * (Math.PI / 180))}
              y2={50 + 22 * Math.sin((hourAngle - 90) * (Math.PI / 180))}
              stroke="currentColor" strokeWidth="3" strokeLinecap="round" className={current.text}
            />

            {/* Minute hand */}
            <line
              x1="50" y1="50"
              x2={50 + 32 * Math.cos((minuteAngle - 90) * (Math.PI / 180))}
              y2={50 + 32 * Math.sin((minuteAngle - 90) * (Math.PI / 180))}
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={current.text}
            />

            {/* Center dot */}
            <circle cx="50" cy="50" r="3" fill="currentColor" className={current.text} />
          </svg>
        </div>

        {/* Digital Clock + Date */}
        <div className="flex-1">
          <div className={cn("font-mono text-4xl font-bold tracking-tight leading-none", current.text)}>
            {displayHour}:{displayMinute}
            <span className="text-lg ml-1 opacity-80">{ampm}</span>
          </div>

          <p className={cn("text-sm font-medium mt-2 opacity-80", current.text)}>
            {formattedDate}
          </p>

          <div className={cn("inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-semibold", 
            timeOfDay === "morning" && "bg-amber-200/60 text-amber-800",
            timeOfDay === "afternoon" && "bg-sky-200/60 text-sky-800",
            timeOfDay === "evening" && "bg-orange-200/60 text-orange-800",
            timeOfDay === "night" && "bg-indigo-200/60 text-indigo-200",
          )}>
            {timeOfDay === "morning" && "Rise and shine!"}
            {timeOfDay === "afternoon" && "Good afternoon!"}
            {timeOfDay === "evening" && "Evening time"}
            {timeOfDay === "night" && "Good night"}
          </div>
        </div>
      </div>
    </div>
  )
}
