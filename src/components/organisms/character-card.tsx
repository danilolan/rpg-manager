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
  "p-4 space-y-1 relative overflow-hidden border-b-2",
  {
    variants: {
      category: {
        PLAYER: "bg-blue-900/60 border-blue-500",
        NPC: "bg-green-900/60 border-green-500",
        ALLY: "bg-purple-900/60 border-purple-500",
        MONSTER: "bg-red-900/60 border-red-500",
        ZOMBIE: "bg-red-900/60 border-red-500",
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

function getStatusValueColor(category: CharacterCategory): string {
  const colors = {
    PLAYER: "text-blue-400",
    NPC: "text-green-400",
    ALLY: "text-purple-400",
    MONSTER: "text-red-400",
    ZOMBIE: "text-red-400",
  }
  return colors[category]
}

function getLifeBoxBg(category: CharacterCategory): string {
  const colors = {
    PLAYER: "bg-blue-950/30 border-blue-800",
    NPC: "bg-green-950/30 border-green-800",
    ALLY: "bg-purple-950/30 border-purple-800",
    MONSTER: "bg-red-950/30 border-red-800",
    ZOMBIE: "bg-red-950/30 border-red-800",
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
  variant?: "full" | "compact" | "mini"
  expandOnHover?: boolean
  className?: string
  headerAction?: React.ReactNode
}

export function CharacterCard({
  character,
  variant = "full",
  expandOnHover = false,
  className,
  headerAction,
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

  const isMini = variant === "mini"

  const compactBody = (
    <div className="p-2 space-y-1.5 border-t-2 border-border/50">
      {/* Attributes - 6 columns */}
      <div className="grid grid-cols-6 gap-1">
        <div className="flex flex-col items-center justify-center rounded-lg border bg-secondary/50 border-border p-0.5 min-w-[36px]">
          <span className="text-muted-foreground uppercase tracking-wide font-bold text-[9px]">STR</span>
          <span className={cn("font-bold text-base", getStatusValueColor(category))}>
            {safeAttributes.strength}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border bg-secondary/50 border-border p-0.5 min-w-[36px]">
          <span className="text-muted-foreground uppercase tracking-wide font-bold text-[9px]">INT</span>
          <span className={cn("font-bold text-base", getStatusValueColor(category))}>
            {safeAttributes.intelligence}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border bg-secondary/50 border-border p-0.5 min-w-[36px]">
          <span className="text-muted-foreground uppercase tracking-wide font-bold text-[9px]">DEX</span>
          <span className={cn("font-bold text-base", getStatusValueColor(category))}>
            {safeAttributes.dexterity}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border bg-secondary/50 border-border p-0.5 min-w-[36px]">
          <span className="text-muted-foreground uppercase tracking-wide font-bold text-[9px]">CON</span>
          <span className={cn("font-bold text-base", getStatusValueColor(category))}>
            {safeAttributes.constitution}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border bg-secondary/50 border-border p-0.5 min-w-[36px]">
          <span className="text-muted-foreground uppercase tracking-wide font-bold text-[9px]">DET</span>
          <span className={cn("font-bold text-base", getStatusValueColor(category))}>
            {safeAttributes.willPower}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border bg-secondary/50 border-border p-0.5 min-w-[36px]">
          <span className="text-muted-foreground uppercase tracking-wide font-bold text-[9px]">PER</span>
          <span className={cn("font-bold text-base", getStatusValueColor(category))}>
            {safeAttributes.perception}
          </span>
        </div>
      </div>

      {/* Status - each spans 2 columns (double width) */}
      <div className="grid grid-cols-6 gap-1">
        <div className="col-span-2">
          <div className="flex flex-col items-center justify-center rounded-lg border bg-secondary/50 border-border p-0.5 min-w-[36px]">
            <span className="text-muted-foreground uppercase tracking-wide font-bold text-[9px]">END</span>
            <span className="font-bold text-base text-muted-foreground">
              {safeStatus.endurance}
            </span>
          </div>
        </div>
        <div className="col-span-2">
          <div className="flex flex-col items-center justify-center rounded-lg border bg-secondary/50 border-border p-0.5 min-w-[36px]">
            <span className="text-muted-foreground uppercase tracking-wide font-bold text-[9px]">Load</span>
            <span className="font-bold text-base text-muted-foreground">
              {safeStatus.maxLoad}
            </span>
          </div>
        </div>
        <div className="col-span-2">
          <div className="flex flex-col items-center justify-center rounded-lg border bg-secondary/50 border-border p-0.5 min-w-[36px]">
            <span className="text-muted-foreground uppercase tracking-wide font-bold text-[9px]">Speed</span>
            <span className="font-bold text-base text-muted-foreground">
              {safeStatus.speed}
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div
      className={cn(
        characterCardVariants({ category }),
        isMini && expandOnHover && "group",
        className
      )}
    >
      {/* Header Banner */}
      <div className={cn(headerBannerVariants({ category }))}>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h3 className={cn("text-xl font-bold", getTitleColor(category))}>{name}</h3>
            {subtitle && (
              <p className={cn("text-sm", getSubtitleColor(category))}>{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {headerAction && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                {headerAction}
              </div>
            )}
            {variant === "compact" && (
              <div className="ml-4">
                <div className={cn("flex flex-col items-center justify-center rounded-xl border p-1 min-w-[44px]", getLifeBoxBg(category))}>
                  <span className="text-muted-foreground uppercase tracking-wide font-bold text-[10px]">Life</span>
                  <span className="font-bold text-lg text-white">
                    {safeStatus.life}
                  </span>
                </div>
              </div>
            )}
          </div>
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

      {/* Compact variant: show attributes and status at bottom */}
      {variant === "compact" && compactBody}

      {/* Mini variant: optionally expand to compact on hover */}
      {variant === "mini" && expandOnHover && (
        <div className="max-h-0 overflow-hidden transition-all duration-200 group-hover:max-h-[480px] group-hover:py-2">
          {compactBody}
        </div>
      )}
    </div>
  )
}

