'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, X } from 'lucide-react'

interface CharacterFormData {
  name: string
  category: string
  age: string
  weight: string
  height: string
  attributes: {
    strength: string
    intelligence: string
    dexterity: string
    perception: string
    constitution: string
    willPower: string
  }
  status: {
    life: string
    endurance: string
    speed: string
    maxLoad: string
  }
}

const initialFormData: CharacterFormData = {
  name: '',
  category: '',
  age: '',
  weight: '',
  height: '',
  attributes: {
    strength: '0',
    intelligence: '0',
    dexterity: '0',
    perception: '0',
    constitution: '0',
    willPower: '0',
  },
  status: {
    life: '0',
    endurance: '0',
    speed: '0',
    maxLoad: '0',
  },
}

interface CharacterFormDrawerProps {
  onCharacterCreated?: () => void
}

export function CharacterFormDrawer({ onCharacterCreated }: CharacterFormDrawerProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<CharacterFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        age: formData.age ? parseInt(formData.age) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        attributes: {
          create: {
            strength: parseInt(formData.attributes.strength) || 0,
            intelligence: parseInt(formData.attributes.intelligence) || 0,
            dexterity: parseInt(formData.attributes.dexterity) || 0,
            perception: parseInt(formData.attributes.perception) || 0,
            constitution: parseInt(formData.attributes.constitution) || 0,
            willPower: parseInt(formData.attributes.willPower) || 0,
          },
        },
        status: {
          create: {
            life: parseInt(formData.status.life) || 0,
            endurance: parseInt(formData.status.endurance) || 0,
            speed: parseInt(formData.status.speed) || 0,
            maxLoad: parseFloat(formData.status.maxLoad) || 0,
          },
        },
      }

      const response = await fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Failed to create character')

      setFormData(initialFormData)
      setOpen(false)
      onCharacterCreated?.()
    } catch (error) {
      console.error('Error creating character:', error)
      alert('Failed to create character')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>
          <Plus />
          New Character
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle>Create New Character</DrawerTitle>
                <DrawerDescription>
                  Fill in the details to create a new RPG character
                </DrawerDescription>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon">
                  <X />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-4 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Basic Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLAYER">Player</SelectItem>
                    <SelectItem value="ZOMBIE">Zombie</SelectItem>
                    <SelectItem value="NPC">NPC</SelectItem>
                    <SelectItem value="MONSTER">Monster</SelectItem>
                    <SelectItem value="ALLY">Ally</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Attributes */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Attributes</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="strength">Strength</Label>
                  <Input
                    id="strength"
                    type="number"
                    value={formData.attributes.strength}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        attributes: { ...formData.attributes, strength: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="intelligence">Intelligence</Label>
                  <Input
                    id="intelligence"
                    type="number"
                    value={formData.attributes.intelligence}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        attributes: { ...formData.attributes, intelligence: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dexterity">Dexterity</Label>
                  <Input
                    id="dexterity"
                    type="number"
                    value={formData.attributes.dexterity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        attributes: { ...formData.attributes, dexterity: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="perception">Perception</Label>
                  <Input
                    id="perception"
                    type="number"
                    value={formData.attributes.perception}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        attributes: { ...formData.attributes, perception: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="constitution">Constitution</Label>
                  <Input
                    id="constitution"
                    type="number"
                    value={formData.attributes.constitution}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        attributes: { ...formData.attributes, constitution: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="willPower">Will Power</Label>
                  <Input
                    id="willPower"
                    type="number"
                    value={formData.attributes.willPower}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        attributes: { ...formData.attributes, willPower: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Status</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="life">Life</Label>
                  <Input
                    id="life"
                    type="number"
                    value={formData.status.life}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: { ...formData.status, life: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endurance">Endurance</Label>
                  <Input
                    id="endurance"
                    type="number"
                    value={formData.status.endurance}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: { ...formData.status, endurance: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="speed">Speed</Label>
                  <Input
                    id="speed"
                    type="number"
                    value={formData.status.speed}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: { ...formData.status, speed: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoad">Max Load</Label>
                  <Input
                    id="maxLoad"
                    type="number"
                    step="0.1"
                    value={formData.status.maxLoad}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: { ...formData.status, maxLoad: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <DrawerFooter>
            <Button type="submit" disabled={isSubmitting || !formData.name || !formData.category}>
              {isSubmitting ? 'Creating...' : 'Create Character'}
            </Button>
            <DrawerClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}

