'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Swords } from 'lucide-react'
import { CharacterCard, type Character } from '@/components/organisms/character-card'
import { CombatCharacterSelection } from '@/components/organisms/combat-character-selection'
import { CombatRoster } from '@/components/organisms/combat-roster'
import { CombatInitiative, type CombatantWithInitiative } from '@/components/organisms/combat-initiative'

type CombatStep = 'setup' | 'initiative' | 'combat'

export default function CombatPage() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [combatants, setCombatants] = useState<CombatantWithInitiative[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState<CombatStep>('setup')

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
    const newCombatant: CombatantWithInitiative = {
      instanceId: `${character.id}-${Date.now()}-${Math.random()}`,
      character,
      initiative: null,
    }
    setCombatants([...combatants, newCombatant])
  }

  const removeFromCombat = (instanceId: string) => {
    setCombatants(combatants.filter((c) => c.instanceId !== instanceId))
  }

  const updateInitiative = (instanceId: string, initiative: number) => {
    setCombatants(
      combatants.map((c) =>
        c.instanceId === instanceId ? { ...c, initiative } : c
      )
    )
  }

  const proceedToInitiative = () => {
    if (combatants.length < 2) {
      alert('Add at least 2 combatants to continue')
      return
    }
    setCurrentStep('initiative')
  }

  const startCombat = () => {
    // Sort by initiative (highest first)
    const sorted = [...combatants].sort((a, b) => (b.initiative || 0) - (a.initiative || 0))
    setCombatants(sorted)
    setCurrentStep('combat')
  }

  const resetCombat = () => {
    setCurrentStep('setup')
    setCombatants([])
  }

  // Initiative Step
  if (currentStep === 'initiative') {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Initiative Phase</h2>
          <p className="text-muted-foreground">
            Roll for initiative and enter the values for each combatant
          </p>
        </div>

        <CombatInitiative
          combatants={combatants}
          onUpdateInitiative={updateInitiative}
          onContinue={startCombat}
          onBack={() => setCurrentStep('setup')}
        />
      </div>
    )
  }

  // Combat Step
  if (currentStep === 'combat') {
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
          <h3 className="text-lg font-semibold mb-4">Turn Order (Initiative)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {combatants.map((combatant, index) => (
              <div key={combatant.instanceId} className="relative">
                <div className="absolute -top-2 -left-2 z-10 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="absolute -top-2 -right-2 z-10 bg-blue-600 text-white rounded-full px-2 py-1 text-xs font-bold">
                  Init: {combatant.initiative}
                </div>
                <CharacterCard
                  character={combatant.character}
                  variant="compact"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <p className="text-muted-foreground text-center py-8">
            Turn-based combat system coming soon...
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
          <CombatCharacterSelection
            characters={characters}
            isLoading={isLoading}
            onAddCharacter={addToCombat}
          />
        </div>

        {/* Combat Roster */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Combat Roster ({combatants.length})
          </h3>
          <CombatRoster
            combatants={combatants}
            onRemove={removeFromCombat}
          />
          {combatants.length > 0 && (
            <div className="sticky bottom-0 pt-4">
              <Button
                onClick={proceedToInitiative}
                disabled={combatants.length < 2}
                size="lg"
                className="w-full"
              >
                <Swords />
                Set Initiative ({combatants.length} combatants)
              </Button>
              {combatants.length < 2 && (
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Add at least 2 combatants to continue
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

