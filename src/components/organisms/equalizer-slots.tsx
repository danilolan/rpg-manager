import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EqualizerSlotComponent } from '@/components/molecules/equalizer-slot'
import type { EqualizerSlot } from '@/hooks/use-equalizer-slots'

interface EqualizerSlotsProps {
  slots: EqualizerSlot[]
  onRemoveVideo: (slotId: number) => void
  onVolumeChange: (slotId: number, volume: number) => void
}

export function EqualizerSlots({ slots, onRemoveVideo, onVolumeChange }: EqualizerSlotsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Equalizer</CardTitle>
        <CardDescription>
          Clique nos vídeos da galeria abaixo para adicionar aos slots
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {slots.map((slot) => (
            <EqualizerSlotComponent
              key={slot.id}
              slot={slot}
              onRemove={() => onRemoveVideo(slot.id)}
              onVolumeChange={(volume) => onVolumeChange(slot.id, volume)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

