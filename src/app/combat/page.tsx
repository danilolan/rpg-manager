'use client'

import { useState, useEffect } from 'react'
import { CombatSetup } from '@/components/organisms/combat-setup'
import { CombatArena } from '@/components/organisms/combat-arena'
import type { Character } from '@/components/organisms/character-card'

export interface Combatant {
  instanceId: string
  character: Character
}

type CombatStep = 'setup' | 'combat'

export default function CombatPage() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [combatants, setCombatants] = useState<Combatant[]>([])
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
      alert('Add at least 2 combatants to continue')
      return
    }
    setCurrentStep('combat')
  }

  const resetCombat = () => {
    setCurrentStep('setup')
    setCombatants([])
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
      onStartCombat={startCombat}
    />
  )
}

