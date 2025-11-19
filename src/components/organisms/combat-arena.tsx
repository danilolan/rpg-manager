'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { CharacterCard } from '@/components/organisms/character-card'
import type { CombatantWithInitiative } from '@/components/organisms/combat-initiative'
import { cn } from '@/lib/utils'

// Centralized method to compute turn order
export function getTurnOrder(
  combatants: CombatantWithInitiative[]
): CombatantWithInitiative[] {
  return [...combatants].sort(
    (a, b) => (b.initiative || 0) - (a.initiative || 0)
  )
}

interface CombatArenaProps {
  combatants: CombatantWithInitiative[]
  onResetCombat: () => void
}

export function CombatArena({ combatants, onResetCombat }: CombatArenaProps) {
  const turnOrder = useMemo(() => getTurnOrder(combatants), [combatants])
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  // Ensure current index stays in range when combatants change
  useEffect(() => {
    if (currentIndex >= turnOrder.length) {
      setCurrentIndex(0)
    }
  }, [currentIndex, turnOrder.length])

  // Scroll current combatant into view and center it ("roulette" effect)
  useEffect(() => {
    const el = itemRefs.current[currentIndex]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [currentIndex, turnOrder.length])

  const handleNext = () => {
    if (turnOrder.length === 0) return
    setCurrentIndex((prev) => (prev + 1) % turnOrder.length)
  }

  const currentCombatant = turnOrder[currentIndex]

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Combat Arena</h2>
          <p className="text-muted-foreground">
            {turnOrder.length} combatant{turnOrder.length !== 1 ? 's' : ''} in
            battle
          </p>
        </div>
        <Button variant="outline" onClick={onResetCombat}>
          Reset Combat
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Turn order vertical list */}
        <div className="rounded-lg border bg-card p-4 lg:col-span-2 flex flex-col">
          <div className="mt-2 flex-1 overflow-y-auto px-2 py-4">
            <div className="space-y-4">
              {turnOrder.map((combatant, index) => {
                const isCurrent = index === currentIndex
                return (
                  <div
                    key={combatant.instanceId}
                    ref={(el) => {
                      itemRefs.current[index] = el
                    }}
                    className={cn(
                      'relative rounded-lg border bg-background/60 p-4 transition shadow-sm',
                      isCurrent
                        ? 'border-primary ring-2 ring-primary/60 bg-background'
                        : 'border-border opacity-75'
                    )}
                  >
                    {/* Position badge */}
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow">
                      {index + 1}
                    </div>

                    {/* Initiative pill */}
                    <div className="absolute top-2 right-2 z-10 bg-blue-600 text-white rounded-full px-2 py-1 text-xs font-bold shadow">
                      Init: {combatant.initiative}
                    </div>

                    <div className="pl-6">
                      <CharacterCard
                        character={combatant.character}
                        variant="full"
                      />
                    </div>
                  </div>
                )
              })}
              {turnOrder.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No combatants in this battle.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Workspace / controls */}
        <div className="rounded-lg border bg-card p-4 flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-semibold">Combat Workspace</h3>
            <p className="text-xs text-muted-foreground">
              Use this panel to control the flow of combat.
            </p>
          </div>

          {currentCombatant ? (
            <>
              <div className="text-sm space-y-1">
                <p className="font-semibold">Current combatant</p>
                <p className="text-muted-foreground">
                  <span className="font-medium">
                    #{currentIndex + 1} — {currentCombatant.character.name}
                  </span>{' '}
                  (Init: {currentCombatant.initiative})
                </p>
              </div>

              <Button onClick={handleNext} size="lg" className="w-full mt-auto">
                Pass turn to next combatant
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No active combatant. Add characters and start combat from the
              setup screen.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

