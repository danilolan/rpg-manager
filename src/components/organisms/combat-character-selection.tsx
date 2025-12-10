'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'
import { CharacterCard, type Character, type CharacterCategory } from '@/components/organisms/character-card'
import { cn } from '@/lib/utils'

interface CombatCharacterSelectionProps {
  characters: Character[]
  isLoading: boolean
  onAddCharacter: (character: Character) => void
}

const CATEGORIES: CharacterCategory[] = ['PLAYER', 'ALLY', 'NPC', 'MONSTER', 'ZOMBIE']

export function CombatCharacterSelection({
  characters,
  isLoading,
  onAddCharacter,
}: CombatCharacterSelectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<CharacterCategory | 'ALL'>('ALL')
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    )
  }

  const filteredCharacters = selectedCategory === 'ALL'
    ? characters
    : characters.filter((char) => char.category === selectedCategory)

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
    <div className="space-y-4">
      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={selectedCategory === 'ALL' ? 'default' : 'outline'}
          className={cn(
            'cursor-pointer transition-all',
            selectedCategory === 'ALL' && 'shadow-sm',
            selectedCategory !== 'ALL' && 'opacity-60 hover:opacity-100'
          )}
          onClick={() => setSelectedCategory('ALL')}
        >
          ALL
        </Badge>
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category
          return (
            <Badge
              key={category}
              variant={isSelected ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer transition-all',
                isSelected && 'shadow-sm',
                !isSelected && 'opacity-60 hover:opacity-100'
              )}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          )
        })}
      </div>

      {/* Character List */}
      <div className="space-y-3">
        {filteredCharacters.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No characters match the selected filters.
          </p>
        ) : (
          filteredCharacters.map((character) => (
            <div 
              key={character.id} 
              className="cursor-pointer"
              onClick={() => onAddCharacter(character)}
            >
              <CharacterCard
                character={character}
                variant="mini"
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
          ))
        )}
      </div>
    </div>
  )
}

