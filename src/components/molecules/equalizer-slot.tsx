import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import { getYoutubeEmbedUrl } from '@/lib/youtube-utils'
import type { EqualizerSlot } from '@/hooks/use-equalizer-slots'

interface EqualizerSlotProps {
  slot: EqualizerSlot
  onRemove: () => void
  onVolumeChange: (volume: number) => void
}

export function EqualizerSlotComponent({ slot, onRemove, onVolumeChange }: EqualizerSlotProps) {
  return (
    <div className="space-y-2">
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
        {slot.video ? (
          <>
            <iframe
              width="100%"
              height="100%"
              src={getYoutubeEmbedUrl(slot.video.youtubeLink, true) || ''}
              title={slot.video.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onRemove}
            >
              <X className="h-3 w-3" />
            </Button>
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm rounded px-1 py-0.5">
              <p className="text-xs truncate max-w-[120px]">{slot.video.name}</p>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Plus className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
      </div>
      
      {/* Volume Slider */}
      <div className="flex flex-col items-center gap-1 px-2">
        <input
          type="range"
          min="0"
          max="100"
          value={slot.volume}
          onChange={(e) => onVolumeChange(parseInt(e.target.value))}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          style={{
            background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${slot.volume}%, hsl(var(--muted)) ${slot.volume}%, hsl(var(--muted)) 100%)`,
          }}
        />
        <span className="text-xs text-muted-foreground">{slot.volume}%</span>
      </div>
    </div>
  )
}

