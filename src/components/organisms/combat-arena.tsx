'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { CharacterCard } from '@/components/organisms/character-card'
import type { CombatantWithInitiative } from '@/components/organisms/combat-initiative'
import { NumberInput } from '@/components/atoms/number-input'
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
  const [hpMap, setHpMap] = useState<Record<string, number>>({})
  const [damageMap, setDamageMap] = useState<Record<string, number>>({})
  const [healMap, setHealMap] = useState<Record<string, number>>({})

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

  // Initialize / sync HP map when combatants change
  useEffect(() => {
    setHpMap((prev) => {
      const next: Record<string, number> = { ...prev }

      // Add or keep current entries
      for (const c of turnOrder) {
        if (next[c.instanceId] == null) {
          const baseHp = c.character.status?.life ?? 0
          next[c.instanceId] = baseHp
        }
      }

      // Remove entries for combatants that no longer exist
      Object.keys(next).forEach((id) => {
        if (!turnOrder.some((c) => c.instanceId === id)) {
          delete next[id]
        }
      })

      return next
    })
  }, [turnOrder])

  const getCurrentHp = (c: CombatantWithInitiative): number => {
    const base = c.character.status?.life ?? 0
    const stored = hpMap[c.instanceId]
    return stored !== undefined ? stored : base
  }

  const getMaxHp = (c: CombatantWithInitiative): number => {
    return c.character.status?.life ?? 0
  }

  const getDamageAmount = (id: string): number => {
    return damageMap[id] ?? 1
  }

  const getHealAmount = (id: string): number => {
    return healMap[id] ?? 1
  }

  const setDamageFor = (id: string, value: number) => {
    setDamageMap((prev) => ({ ...prev, [id]: value }))
  }

  const setHealFor = (id: string, value: number) => {
    setHealMap((prev) => ({ ...prev, [id]: value }))
  }

  const applyDamageTo = (c: CombatantWithInitiative) => {
    const id = c.instanceId
    const amount = getDamageAmount(id)
    if (amount <= 0) return

    setHpMap((prev) => {
      const current = prev[id] ?? (c.character.status?.life ?? 0)
      const next = Math.max(0, current - amount)
      return { ...prev, [id]: next }
    })
  }

  const applyHealTo = (c: CombatantWithInitiative) => {
    const id = c.instanceId
    const amount = getHealAmount(id)
    if (amount <= 0) return

    const maxHp = getMaxHp(c)

    setHpMap((prev) => {
      const current = prev[id] ?? (c.character.status?.life ?? 0)
      const unclamped = current + amount
      const next = maxHp ? Math.min(maxHp, unclamped) : unclamped
      return { ...prev, [id]: next }
    })
  }

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
          <div className="mt-2 px-2 py-4">
            <div className="flex flex-col gap-8">
              {turnOrder.map((combatant, index) => {
                const isCurrent = index === currentIndex
                const currentHp = getCurrentHp(combatant)
                const maxHp = getMaxHp(combatant)
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
                    <div className="absolute -left-3 top-0 -translate-y-1/2 z-20 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow">
                      {index + 1}
                    </div>

                    {/* Initiative pill */}
                    <div className="absolute top-2 right-2 z-10 bg-blue-600 text-white rounded-full px-2 py-1 text-xs font-bold shadow">
                      Init: {combatant.initiative}
                    </div>

                    <div>
                      <div className="grid grid-cols-[max-content_1fr] gap-4 items-start">
                        <div className="min-w-0">
                          <CharacterCard
                            character={combatant.character}
                            variant="full"
                          />
                        </div>

                        {/* Per-character HP and controls */}
                        <div className="w-full h-full rounded-md border bg-background/60 p-4">
                          <div className="grid grid-cols-2 gap-4">
                            {/* Left: HP Values */}
                            <div className="flex flex-col gap-8">
                              <p className="text-xs font-semibold text-muted-foreground uppercase">
                                Current HP
                              </p>
                              <div className="text-3xl font-bold">
                                {currentHp}
                                {maxHp && (
                                  <span className="text-xl text-muted-foreground">
                                    {' '}
                                    / {maxHp}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Right: Manipulation buttons */}
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <p className="text-xs font-semibold text-muted-foreground">
                                  Inflict damage
                                </p>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => applyDamageTo(combatant)}
                                    className="w-20"
                                  >
                                    Damage
                                  </Button>
                                  <NumberInput
                                    value={getDamageAmount(combatant.instanceId)}
                                    onChange={(val) =>
                                      setDamageFor(combatant.instanceId, val)
                                    }
                                    min={0}
                                    max={999}
                                    step={1}
                                    placeholder="0"
                                    className="w-auto"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <p className="text-xs font-semibold text-muted-foreground">
                                  Heal
                                </p>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => applyHealTo(combatant)}
                                    className="w-20 bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    Heal
                                  </Button>
                                  <NumberInput
                                    value={getHealAmount(combatant.instanceId)}
                                    onChange={(val) =>
                                      setHealFor(combatant.instanceId, val)
                                    }
                                    min={0}
                                    max={999}
                                    step={1}
                                    placeholder="0"
                                    className="w-auto"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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
        <div className="rounded-lg border bg-card p-4 flex flex-col gap-6">
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

