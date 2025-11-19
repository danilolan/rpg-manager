'use client'

import { Button } from '@/components/ui/button'
import { CharacterCard, type Character } from '@/components/organisms/character-card'
import { X } from 'lucide-react'

interface Combatant {
  instanceId: string
  character: Character
}

interface CombatRosterProps {
  combatants: Array<{ instanceId: string; character: Character }>
  onRemove: (instanceId: string) => void
}

export function CombatRoster({ combatants, onRemove }: CombatRosterProps) {
  if (combatants.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-muted/50 p-6">
        <p className="text-muted-foreground text-center py-8">
          No combatants yet. Add characters from the left to build your combat roster.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2">
      {combatants.map((combatant) => (
        <div key={combatant.instanceId} className="relative group">
          <CharacterCard
            character={combatant.character}
            variant="compact"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-50 h-8 w-8 bg-red-900/90 hover:bg-red-800 border border-red-500 opacity-100"
            onClick={(e) => {
              e.stopPropagation()
              onRemove(combatant.instanceId)
            }}
          >
            <X className="h-4 w-4 text-white" />
          </Button>
        </div>
      ))}
    </div>
  )
}

