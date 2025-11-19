'use client'

import { Button } from '@/components/ui/button'
import { Swords } from 'lucide-react'
import { CombatCharacterSelection } from '@/components/organisms/combat-character-selection'
import { CombatRoster } from '@/components/organisms/combat-roster'
import type { Character } from '@/components/organisms/character-card'
import type { CombatantWithInitiative } from '@/components/organisms/combat-initiative'

interface CombatSetupProps {
  characters: Character[]
  combatants: CombatantWithInitiative[]
  isLoading: boolean
  onAddCharacter: (character: Character) => void
  onRemoveCharacter: (instanceId: string) => void
  onProceedToInitiative: () => void
}

export function CombatSetup({
  characters,
  combatants,
  isLoading,
  onAddCharacter,
  onRemoveCharacter,
  onProceedToInitiative,
}: CombatSetupProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Combat Setup</h2>
        <p className="text-muted-foreground">
          Add characters to combat (you can add the same character multiple times)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Characters */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available Characters</h3>
          <CombatCharacterSelection
            characters={characters}
            isLoading={isLoading}
            onAddCharacter={onAddCharacter}
          />
        </div>

        {/* Combat Roster */}
        <div className="space-y-4 lg:col-span-2">
          <h3 className="text-lg font-semibold">
            Combat Roster ({combatants.length})
          </h3>
          <CombatRoster
            combatants={combatants}
            onRemove={onRemoveCharacter}
          />
          {combatants.length > 0 && (
            <div className="sticky bottom-0 pt-4">
              <Button
                onClick={onProceedToInitiative}
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

