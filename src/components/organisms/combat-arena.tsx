'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { CharacterCard } from '@/components/organisms/character-card'
import type { Combatant } from '@/app/combat/page'
import { NumberInput } from '@/components/atoms/number-input'
import { cn } from '@/lib/utils'

interface CombatArenaProps {
  combatants: Combatant[]
  onResetCombat: () => void
}

export function CombatArena({ combatants, onResetCombat }: CombatArenaProps) {
  const [hpMap, setHpMap] = useState<Record<string, number>>({})
  const [damageMap, setDamageMap] = useState<Record<string, number>>({})
  const [healMap, setHealMap] = useState<Record<string, number>>({})

  // Split combatants into allies and enemies based on category
  const allies = combatants.filter((c) => 
    c.character.category === 'PLAYER' || c.character.category === 'ALLY'
  )
  const enemies = combatants.filter((c) => 
    c.character.category === 'MONSTER' || 
    c.character.category === 'ZOMBIE' || 
    c.character.category === 'NPC'
  )

  // Initialize / sync HP map when combatants change
  useEffect(() => {
    setHpMap((prev) => {
      const next: Record<string, number> = { ...prev }

      // Add or keep current entries
      for (const c of combatants) {
        if (next[c.instanceId] == null) {
          const baseHp = c.character.status?.life ?? 0
          next[c.instanceId] = baseHp
        }
      }

      // Remove entries for combatants that no longer exist
      Object.keys(next).forEach((id) => {
        if (!combatants.some((c) => c.instanceId === id)) {
          delete next[id]
        }
      })

      return next
    })
  }, [combatants])

  const getCurrentHp = (c: Combatant): number => {
    const base = c.character.status?.life ?? 0
    const stored = hpMap[c.instanceId]
    return stored !== undefined ? stored : base
  }

  const getMaxHp = (c: Combatant): number => {
    return c.character.status?.life ?? 0
  }

  const isDead = (c: Combatant): boolean => {
    return getCurrentHp(c) <= 0
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

  const applyDamageTo = (c: Combatant) => {
    const id = c.instanceId
    const amount = getDamageAmount(id)
    if (amount <= 0) return

    setHpMap((prev) => {
      const current = prev[id] ?? (c.character.status?.life ?? 0)
      const next = Math.max(0, current - amount)
      return { ...prev, [id]: next }
    })
  }

  const applyHealTo = (c: Combatant) => {
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

  const renderCombatantCard = (combatant: Combatant, index: number) => {
    const currentHp = getCurrentHp(combatant)
    const maxHp = getMaxHp(combatant)
    const dead = isDead(combatant)

    return (
      <div
        key={combatant.instanceId}
        className={cn(
          'relative rounded-lg border p-4 transition shadow-sm',
          dead
            ? 'border-gray-800 bg-gray-900/80 opacity-60'
            : 'border-border bg-background/60'
        )}
      >
        {/* Number badge */}
        <div className="absolute -left-3 top-3 z-20 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow">
          {index + 1}
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
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Combat Arena</h2>
          <p className="text-muted-foreground">
            {combatants.length} combatant{combatants.length !== 1 ? 's' : ''} in
            battle
          </p>
        </div>
        <Button variant="outline" onClick={onResetCombat}>
          Reset Combat
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Allies Column */}
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-lg font-semibold mb-4 text-green-600">
            Allies ({allies.length})
          </h3>
          <div className="space-y-4">
            {allies.map((combatant, index) => renderCombatantCard(combatant, index))}
            {allies.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No allies in this battle.
              </p>
            )}
          </div>
        </div>

        {/* Enemies Column */}
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-lg font-semibold mb-4 text-red-600">
            Enemies ({enemies.length})
          </h3>
          <div className="space-y-4">
            {enemies.map((combatant, index) => renderCombatantCard(combatant, index))}
            {enemies.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No enemies in this battle.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
