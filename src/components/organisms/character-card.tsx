import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { StatBox } from "@/components/atoms/stat-box"
import { CollapsibleSection, CollapsibleSectionItem } from "@/components/molecules/collapsible-section"
import { Separator } from "@/components/ui/separator"

const characterCardVariants = cva(
  "rounded-lg border-[3px] bg-black overflow-hidden max-w-xs",
  {
    variants: {
      category: {
        PLAYER: "border-blue-500",
        NPC: "border-green-500",
        ALLY: "border-purple-500",
        MONSTER: "border-red-500",
        ZOMBIE: "border-red-500",
      },
    },
    defaultVariants: {
      category: "PLAYER",
    },
  }
)

const headerBannerVariants = cva(
  "p-4 space-y-1 bg-gradient-to-r relative overflow-hidden border-b-2",
  {
    variants: {
      category: {
        PLAYER: "from-blue-900/40 from-0% to-black/80 to-100% via-blue-900/40 via-80% border-blue-500",
        NPC: "from-green-900/40 from-0% to-black/80 to-100% via-green-900/40 via-80% border-green-500",
        ALLY: "from-purple-900/40 from-0% to-black/80 to-100% via-purple-900/40 via-80% border-purple-500",
        MONSTER: "from-red-900/40 from-0% to-black/80 to-100% via-red-900/40 via-80% border-red-500",
        ZOMBIE: "from-red-900/40 from-0% to-black/80 to-100% via-red-900/40 via-80% border-red-500",
      },
    },
    defaultVariants: {
      category: "PLAYER",
    },
  }
)

function getTitleColor(category: CharacterCategory): string {
  const colors = {
    PLAYER: "text-blue-400",
    NPC: "text-green-400",
    ALLY: "text-purple-400",
    MONSTER: "text-red-500",
    ZOMBIE: "text-red-500",
  }
  return colors[category]
}

function getSubtitleColor(category: CharacterCategory): string {
  const colors = {
    PLAYER: "text-blue-300/90",
    NPC: "text-green-300/90",
    ALLY: "text-purple-300/90",
    MONSTER: "text-red-400/90",
    ZOMBIE: "text-red-400/90",
  }
  return colors[category]
}

export type CharacterCategory = "PLAYER" | "NPC" | "ALLY" | "MONSTER" | "ZOMBIE"

export interface CharacterCardAttributes {
  strength: number
  intelligence: number
  dexterity: number
  constitution: number
  willPower: number
  perception: number
}

export interface CharacterCardStatus {
  life: number
  endurance: number
  maxLoad: number | string
  speed: number
}

export interface Character {
  id: string
  name: string
  category: CharacterCategory
  age?: number | null
  weight?: number | null
  height?: number | null
  level?: number
  race?: string
  class?: string
  attributes: CharacterCardAttributes | null
  status: CharacterCardStatus | null
  skills: Array<CollapsibleSectionItem & { id?: string }>
  qualities: Array<CollapsibleSectionItem & { id?: string }>
  drawbacks: Array<CollapsibleSectionItem & { id?: string }>
  createdAt?: string
  updatedAt?: string
}

export interface CharacterCardProps extends VariantProps<typeof characterCardVariants> {
  character: Character
  variant?: "full" | "compact"
  className?: string
}

export function CharacterCard({
  character,
  variant = "full",
  className,
}: CharacterCardProps) {
  const { name, category, level, race, class: characterClass, age, weight, height, attributes, status, skills, qualities, drawbacks } = character

  const subtitleParts = [
    race,
    characterClass && level ? `${characterClass} Lv ${level}` : characterClass,
    age ? `${age} anos` : null,
    weight ? `${weight}kg` : null,
    height ? `${height}cm` : null,
  ]
  
  const subtitle = subtitleParts
    .filter(Boolean)
    .join(" • ")

  // Default values for attributes and status if they are null
  const safeAttributes = attributes || {
    strength: 0,
    intelligence: 0,
    dexterity: 0,
    perception: 0,
    constitution: 0,
    willPower: 0,
  }

  const safeStatus = status || {
    life: 0,
    endurance: 0,
    speed: 0,
    maxLoad: 0,
  }

  return (
    <div className={cn(
      characterCardVariants({ category }),
      variant === "compact" && "cursor-pointer hover:scale-105 transition-transform",
      className
    )}>
      {/* Header Banner */}
      <div className={cn(headerBannerVariants({ category }))}>
        <div className="relative z-10">
          <h3 className={cn("text-xl font-bold", getTitleColor(category))}>{name}</h3>
          {subtitle && (
            <p className={cn("text-sm", getSubtitleColor(category))}>{subtitle}</p>
          )}
        </div>
      </div>

      {/* Show full content only if variant is "full" */}
      {variant === "full" && (
        <div className="p-4 space-y-4">
          {/* Status */}
          <div className="flex gap-2 flex-wrap justify-between">
            <StatBox label="Life" value={safeStatus.life} size="big" variant="blue" />
            <StatBox label="END" value={safeStatus.endurance} size="big" variant="green" />
            <StatBox label="M. Load" value={safeStatus.maxLoad} size="big" variant="muted" />
            <StatBox label="Speed" value={safeStatus.speed} size="big" variant="yellow" />
          </div>

          <Separator />

          {/* Core Attributes */}
          <div className="flex gap-1.5 flex-wrap justify-between">
            <StatBox label="STR" value={safeAttributes.strength} />
            <StatBox label="INT" value={safeAttributes.intelligence} />
            <StatBox label="DEX" value={safeAttributes.dexterity} />
            <StatBox label="CON" value={safeAttributes.constitution} />
            <StatBox label="DET" value={safeAttributes.willPower} />
            <StatBox label="PER" value={safeAttributes.perception} />
          </div>

          {/* Collapsible Sections */}
          <div className="space-y-2">
            <CollapsibleSection title="Skills" items={skills} />
            <CollapsibleSection title="Qualities" items={qualities} />
            <CollapsibleSection title="Drawbacks" items={drawbacks} />
          </div>
        </div>
      )}
    </div>
  )
}

