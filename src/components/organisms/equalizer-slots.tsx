import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Volume2 } from 'lucide-react'
import { EqualizerSlotComponent } from '@/components/molecules/equalizer-slot'
import type { EqualizerSlot } from '@/hooks/use-equalizer-slots'

interface EqualizerSlotsProps {
  slots: EqualizerSlot[]
  masterVolume: number
  onRemoveVideo: (slotId: number) => void
  onVolumeChange: (slotId: number, volume: number) => void
  onMasterVolumeChange: (volume: number) => void
}

export function EqualizerSlots({ 
  slots, 
  masterVolume, 
  onRemoveVideo, 
  onVolumeChange,
  onMasterVolumeChange 
}: EqualizerSlotsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Equalizer</CardTitle>
            <CardDescription>
              Clique nos vídeos da galeria abaixo para adicionar aos slots
            </CardDescription>
          </div>
          <div className="flex items-center gap-3 min-w-[200px]">
            <Volume2 className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Master Volume</span>
                <Badge variant="secondary">{masterVolume}%</Badge>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={masterVolume}
                onChange={(e) => onMasterVolumeChange(parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                style={{
                  background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${masterVolume}%, hsl(var(--muted)) ${masterVolume}%, hsl(var(--muted)) 100%)`,
                }}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {slots.map((slot) => (
            <EqualizerSlotComponent
              key={slot.id}
              slot={slot}
              masterVolume={masterVolume}
              onRemove={() => onRemoveVideo(slot.id)}
              onVolumeChange={(volume) => onVolumeChange(slot.id, volume)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

