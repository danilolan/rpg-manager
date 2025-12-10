import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Edit, Trash2 } from 'lucide-react'
import { getYoutubeThumbnailUrl } from '@/lib/youtube-utils'
import type { YoutubeVideo } from '@/hooks/use-youtube-videos'

interface VideoCardProps {
  video: YoutubeVideo
  isInSlot: boolean
  onAddToSlot: () => void
  onEdit: () => void
  onDelete: () => void
}

export function VideoCard({ video, isInSlot, onAddToSlot, onEdit, onDelete }: VideoCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isInSlot ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={onAddToSlot}
    >
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="aspect-video bg-muted rounded overflow-hidden">
            <img
              src={getYoutubeThumbnailUrl(video.youtubeLink)}
              alt={video.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-sm truncate">{video.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(video.youtubeLink, '_blank')
                }}
                title="Abrir no YouTube"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
                title="Editar"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
                title="Excluir"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

