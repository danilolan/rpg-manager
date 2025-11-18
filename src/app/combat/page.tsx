'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Swords, Plus, X } from 'lucide-react'
import { CharacterCard, type Character } from '@/components/organisms/character-card'

interface Combatant {
  instanceId: string
  character: Character
}

export default function CombatPage() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [combatants, setCombatants] = useState<Combatant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [combatStarted, setCombatStarted] = useState(false)

  useEffect(() => {
    fetchCharacters()
  }, [])

  const fetchCharacters = async () => {
    try {
      const response = await fetch('/api/characters')
      if (!response.ok) throw new Error('Failed to fetch characters')
      const data = await response.json()
      setCharacters(data)
    } catch (error) {
      console.error('Error fetching characters:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addToCombat = (character: Character) => {
    const newCombatant: Combatant = {
      instanceId: `${character.id}-${Date.now()}-${Math.random()}`,
      character,
    }
    setCombatants([...combatants, newCombatant])
  }

  const removeFromCombat = (instanceId: string) => {
    setCombatants(combatants.filter((c) => c.instanceId !== instanceId))
  }

  const startCombat = () => {
    if (combatants.length < 2) {
      alert('Add at least 2 combatants to start combat')
      return
    }
    setCombatStarted(true)
  }

  const resetCombat = () => {
    setCombatStarted(false)
    setCombatants([])
  }

  if (combatStarted) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Combat Arena</h2>
            <p className="text-muted-foreground">
              {combatants.length} combatant{combatants.length !== 1 ? 's' : ''} in battle
            </p>
          </div>
          <Button variant="outline" onClick={resetCombat}>
            Reset Combat
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Combatants</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {combatants.map((combatant) => (
              <CharacterCard
                key={combatant.instanceId}
                character={combatant.character}
                variant="compact"
              />
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <p className="text-muted-foreground text-center py-8">
            Combat system coming soon...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Combat Setup</h2>
        <p className="text-muted-foreground">
          Add characters to combat (you can add the same character multiple times)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Characters */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available Characters</h3>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-lg" />
              ))}
            </div>
          ) : characters.length === 0 ? (
            <div className="rounded-lg border bg-card p-6">
              <p className="text-muted-foreground text-center py-4">
                No characters found. Create characters first to start combat.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {characters.map((character) => {
                const categoryColors: Record<string, { border: string; text: string }> = {
                  PLAYER: { border: 'border-blue-500', text: 'text-blue-400' },
                  NPC: { border: 'border-green-500', text: 'text-green-400' },
                  ALLY: { border: 'border-purple-500', text: 'text-purple-400' },
                  MONSTER: { border: 'border-red-500', text: 'text-red-500' },
                  ZOMBIE: { border: 'border-red-500', text: 'text-red-500' },
                }
                
                const colors = categoryColors[character.category] || categoryColors.PLAYER

                return (
                  <div
                    key={character.id}
                    className={`rounded-lg border-[3px] bg-black p-4 ${colors.border}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <h4 className={`font-semibold ${colors.text}`}>{character.name}</h4>
                        <p className="text-sm text-muted-foreground">{character.category}</p>
                      </div>
                      <Button
                        onClick={() => addToCombat(character)}
                        size="sm"
                      >
                        <Plus className="h-4 w-4" />
                        Add
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Combat Roster */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Combat Roster ({combatants.length})
          </h3>
          {combatants.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-muted/50 p-6">
              <p className="text-muted-foreground text-center py-8">
                No combatants yet. Add characters from the left to build your combat roster.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2">
                {combatants.map((combatant) => (
                  <div key={combatant.instanceId} className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 z-10 h-7 w-7 bg-black/80 hover:bg-red-900"
                      onClick={() => removeFromCombat(combatant.instanceId)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <CharacterCard
                      character={combatant.character}
                      variant="compact"
                    />
                  </div>
                ))}
              </div>
              <div className="sticky bottom-0 pt-4">
                <Button
                  onClick={startCombat}
                  disabled={combatants.length < 2}
                  size="lg"
                  className="w-full"
                >
                  <Swords />
                  Start Combat ({combatants.length} combatants)
                </Button>
                {combatants.length < 2 && (
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    Add at least 2 combatants to start
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

