'use client'

import { useState, useEffect } from 'react'
import { CombatSetup } from '@/components/organisms/combat-setup'
import { CombatInitiative, type CombatantWithInitiative } from '@/components/organisms/combat-initiative'
import { CombatArena } from '@/components/organisms/combat-arena'
import type { Character } from '@/components/organisms/character-card'

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

  if (currentStep === 'initiative') {
    return (
      <CombatInitiative
        combatants={combatants}
        onUpdateInitiative={updateInitiative}
        onContinue={startCombat}
        onBack={() => setCurrentStep('setup')}
      />
    )
  }

  if (currentStep === 'combat') {
    return (
      <CombatArena
        combatants={combatants}
        onResetCombat={resetCombat}
      />
    )
  }

  return (
    <CombatSetup
      characters={characters}
      combatants={combatants}
      isLoading={isLoading}
      onAddCharacter={addToCombat}
      onRemoveCharacter={removeFromCombat}
      onProceedToInitiative={proceedToInitiative}
    />
  )
}

