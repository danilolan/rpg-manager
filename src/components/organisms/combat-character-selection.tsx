'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus } from 'lucide-react'
import type { Character } from '@/components/organisms/character-card'

interface CombatCharacterSelectionProps {
  characters: Character[]
  isLoading: boolean
  onAddCharacter: (character: Character) => void
}

export function CombatCharacterSelection({
  characters,
  isLoading,
  onAddCharacter,
}: CombatCharacterSelectionProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    )
  }

  if (characters.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <p className="text-muted-foreground text-center py-4">
          No characters found. Create characters first to start combat.
        </p>
      </div>
    )
  }

  return (
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
                onClick={() => onAddCharacter(character)}
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
  )
}

