'use client'

import { Button } from '@/components/ui/button'
import { CharacterCard } from '@/components/organisms/character-card'
import type { CombatantWithInitiative } from '@/components/organisms/combat-initiative'

interface CombatArenaProps {
  combatants: CombatantWithInitiative[]
  onResetCombat: () => void
}

export function CombatArena({ combatants, onResetCombat }: CombatArenaProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Combat Arena</h2>
          <p className="text-muted-foreground">
            {combatants.length} combatant{combatants.length !== 1 ? 's' : ''} in battle
          </p>
        </div>
        <Button variant="outline" onClick={onResetCombat}>
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

