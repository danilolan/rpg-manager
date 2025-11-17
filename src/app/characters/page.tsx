'use client'

import { useState } from 'react'
import { CharacterFormDrawer } from "@/components/organisms/character-form-drawer"
import { CharacterGallery } from "@/components/organisms/character-gallery"

export default function CharactersPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleCharacterCreated = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Characters</h2>
          <p className="text-muted-foreground">
            Manage your RPG characters
          </p>
        </div>
        <CharacterFormDrawer onCharacterCreated={handleCharacterCreated} />
      </div>
      
      <CharacterGallery refreshTrigger={refreshTrigger} />
    </div>
  )
}

