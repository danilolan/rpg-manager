'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import { getYoutubeVideoId } from '@/lib/youtube-utils'
import type { EqualizerSlot } from '@/hooks/use-equalizer-slots'

interface EqualizerSlotProps {
  slot: EqualizerSlot
  masterVolume: number
  onRemove: () => void
  onVolumeChange: (volume: number) => void
}

// Declare YouTube IFrame API types
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export function EqualizerSlotComponent({ slot, masterVolume, onRemove, onVolumeChange }: EqualizerSlotProps) {
  const playerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const playerIdRef = useRef(`youtube-player-slot-${slot.id}`)

  // Calculate effective volume (master * slot / 100)
  const effectiveVolume = Math.round((masterVolume * slot.volume) / 100)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    // Initialize player when video is loaded
    const initPlayer = () => {
      if (!slot.video || !window.YT?.Player) return

      // Destroy existing player before creating new one
      if (playerRef.current) {
        try {
          playerRef.current.destroy()
        } catch (e) {
          console.warn('Failed to destroy player:', e)
        }
        playerRef.current = null
      }

      const videoId = getYoutubeVideoId(slot.video.youtubeLink)
      if (!videoId) return

      // Small delay to ensure DOM is ready
      setTimeout(() => {
        try {
          playerRef.current = new window.YT.Player(playerIdRef.current, {
            videoId,
            playerVars: {
              autoplay: 1,
              controls: 1,
              modestbranding: 1,
              rel: 0,
            },
            events: {
              onReady: (event: any) => {
                event.target.setVolume(effectiveVolume)
                // Set to lowest quality for audio-only usage (saves bandwidth)
                event.target.setPlaybackQuality('small')
              },
            },
          })
        } catch (e) {
          console.warn('Failed to create player:', e)
        }
      }, 100)
    }

    // Wait for API to be ready
    if (window.YT?.loaded) {
      initPlayer()
    } else {
      const existingCallback = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        if (existingCallback) existingCallback()
        initPlayer()
      }
    }

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy()
        } catch (e) {
          console.warn('Failed to destroy player on cleanup:', e)
        }
        playerRef.current = null
      }
    }
  }, [slot.video])

  // Update volume when slider or master volume changes
  useEffect(() => {
    if (playerRef.current && playerRef.current.setVolume) {
      playerRef.current.setVolume(effectiveVolume)
    }
  }, [effectiveVolume])

  return (
    <div className="space-y-2">
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
        {slot.video ? (
          <>
            <div
              ref={containerRef}
              id={playerIdRef.current}
              className="w-full h-full"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onClick={onRemove}
            >
              <X className="h-3 w-3" />
            </Button>
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm rounded px-1 py-0.5 z-10">
              <p className="text-xs truncate max-w-[120px]">{slot.video.name}</p>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Plus className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
      </div>
      
      {/* Vertical Volume Slider */}
      <div className="flex flex-col items-center gap-1 h-32">
        <span className="text-xs text-muted-foreground font-medium">
          {slot.volume}% 
          <span className="text-[10px] text-muted-foreground/60"> ({effectiveVolume}%)</span>
        </span>
        <div className="relative flex-1 w-8 flex items-center justify-center">
          <input
            type="range"
            min="0"
            max="100"
            value={slot.volume}
            onChange={(e) => onVolumeChange(parseInt(e.target.value))}
            className="absolute vertical-slider cursor-pointer"
            style={{
              writingMode: 'bt-lr',
              WebkitAppearance: 'slider-vertical',
              width: '8px',
              height: '100%',
              padding: 0,
            }}
          />
          {/* Visual track */}
          <div className="absolute h-full w-2 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute bottom-0 w-full bg-primary transition-all"
              style={{ height: `${slot.volume}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

