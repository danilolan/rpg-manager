'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { CharacterCard, type Character } from '@/components/organisms/character-card'
import { NumberInput } from '@/components/atoms/number-input'
import { ArrowRight, ArrowLeft } from 'lucide-react'

export interface CombatantWithInitiative {
  instanceId: string
  character: Character
  initiative: number | null
}

interface CombatInitiativeProps {
  combatants: CombatantWithInitiative[]
  onUpdateInitiative: (instanceId: string, initiative: number) => void
  onContinue: () => void
  onBack: () => void
}

export function CombatInitiative({
  combatants,
  onUpdateInitiative,
  onContinue,
  onBack,
}: CombatInitiativeProps) {
  const allHaveInitiative = combatants.every((c) => c.initiative !== null && c.initiative >= 0)

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Set Initiative</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Enter the initiative value for each combatant. Higher values go first.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {combatants.map((combatant) => (
            <div key={combatant.instanceId} className="flex items-center gap-4 p-4 rounded-lg border bg-background">
              <div className="flex-1">
                <CharacterCard character={combatant.character} variant="compact" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <Label htmlFor={`initiative-${combatant.instanceId}`} className="text-sm font-semibold">
                  Initiative
                </Label>
                <NumberInput
                  value={combatant.initiative}
                  onChange={(value) => onUpdateInitiative(combatant.instanceId, value)}
                  min={0}
                  max={99}
                  placeholder="0"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Back to Roster
        </Button>
        <Button
          onClick={onContinue}
          disabled={!allHaveInitiative}
          size="lg"
        >
          Continue to Combat
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      {!allHaveInitiative && (
        <p className="text-sm text-muted-foreground text-center">
          Set initiative for all combatants to continue
        </p>
      )}
    </div>
  )
}

