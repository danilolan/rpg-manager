'use client'

import { CharacterFormDrawer } from "@/components/organisms/character-form-drawer"

export default function CharactersPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Characters</h2>
          <p className="text-muted-foreground">
            Manage your RPG characters
          </p>
        </div>
        <CharacterFormDrawer />
      </div>
      
      <div className="rounded-lg border bg-card p-6">
        <p className="text-muted-foreground text-center py-8">
          No characters yet. Create your first character to get.
        </p>
      </div>
    </div>
  )
}

