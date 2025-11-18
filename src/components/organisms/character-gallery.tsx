'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { CharacterCard, type Character } from '@/components/organisms/character-card'

interface CharacterGalleryProps {
  refreshTrigger?: number
}

export function CharacterGallery({ refreshTrigger }: CharacterGalleryProps) {
  const [characters, setCharacters] = useState<Character[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCharacters = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/characters')
      
      if (!response.ok) {
        throw new Error('Failed to fetch characters')
      }
      
      const data = await response.json()
      setCharacters(data)
    } catch (err) {
      console.error('Error fetching characters:', err)
      setError('Failed to load characters')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCharacters()
  }, [refreshTrigger])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  if (characters.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <p className="text-muted-foreground text-center py-8">
          No characters yet. Create your first character to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {characters.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
          variant="compact"
        />
      ))}
    </div>
  )
}

