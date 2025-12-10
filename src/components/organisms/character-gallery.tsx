'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Trash2 } from 'lucide-react'
import { CharacterCard, type Character } from '@/components/organisms/character-card'

interface CharacterGalleryProps {
  refreshTrigger?: number
}

export function CharacterGallery({ refreshTrigger }: CharacterGalleryProps) {
  const [characters, setCharacters] = useState<Character[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [characterToDelete, setCharacterToDelete] = useState<Character | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

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

  const handleDeleteClick = (character: Character) => {
    setCharacterToDelete(character)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!characterToDelete) return

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/characters/${characterToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete character')
      }

      // Remove from local state and refresh
      setCharacters(characters.filter((c) => c.id !== characterToDelete.id))
      setDeleteDialogOpen(false)
      setCharacterToDelete(null)
    } catch (err) {
      console.error('Error deleting character:', err)
      setError('Failed to delete character')
    } finally {
      setIsDeleting(false)
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            variant="compact"
            headerAction={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteClick(character)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            }
          />
        ))}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Character</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{characterToDelete?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setCharacterToDelete(null)
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

