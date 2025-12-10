import { useState } from 'react'
import type { YoutubeVideo } from './use-youtube-videos'

export interface EqualizerSlot {
  id: number
  video: YoutubeVideo | null
  volume: number
}

export function useEqualizerSlots(slotCount = 8) {
  const [slots, setSlots] = useState<EqualizerSlot[]>(
    Array.from({ length: slotCount }, (_, i) => ({
      id: i,
      video: null,
      volume: 100,
    }))
  )

  const addVideoToSlot = (slotId: number, video: YoutubeVideo) => {
    setSlots(prevSlots =>
      prevSlots.map(slot =>
        slot.id === slotId ? { ...slot, video } : slot
      )
    )
  }

  const removeVideoFromSlot = (slotId: number) => {
    setSlots(prevSlots =>
      prevSlots.map(slot =>
        slot.id === slotId ? { ...slot, video: null, volume: 100 } : slot
      )
    )
  }

  const updateSlotVolume = (slotId: number, volume: number) => {
    setSlots(prevSlots =>
      prevSlots.map(slot =>
        slot.id === slotId ? { ...slot, volume } : slot
      )
    )
  }

  const removeVideoById = (videoId: string) => {
    setSlots(prevSlots =>
      prevSlots.map(slot =>
        slot.video?.id === videoId ? { ...slot, video: null, volume: 100 } : slot
      )
    )
  }

  const isVideoInSlot = (videoId: string) => {
    return slots.some(slot => slot.video?.id === videoId)
  }

  const getEmptySlot = () => {
    return slots.find(slot => slot.video === null)
  }

  return {
    slots,
    addVideoToSlot,
    removeVideoFromSlot,
    updateSlotVolume,
    removeVideoById,
    isVideoInSlot,
    getEmptySlot,
  }
}

