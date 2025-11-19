'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus } from 'lucide-react'
import { CharacterCard, type Character } from '@/components/organisms/character-card'

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
      {characters.map((character) => (
        <div 
          key={character.id} 
          className="cursor-pointer"
          onClick={() => onAddCharacter(character)}
        >
          <CharacterCard
            character={character}
            variant="mini"
            expandOnHover
            headerAction={
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  onAddCharacter(character)
                }}
                size="sm"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            }
          />
        </div>
      ))}
    </div>
  )
}

