import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { VideoCard } from '@/components/molecules/video-card'
import type { YoutubeVideo } from '@/hooks/use-youtube-videos'

interface VideoGalleryProps {
  groupedVideos: Record<string, YoutubeVideo[]>
  isVideoInSlot: (videoId: string) => boolean
  onAddToSlot: (video: YoutubeVideo) => void
  onEdit: (video: YoutubeVideo) => void
  onDelete: (videoId: string) => void
}

export function VideoGallery({
  groupedVideos,
  isVideoInSlot,
  onAddToSlot,
  onEdit,
  onDelete,
}: VideoGalleryProps) {
  const isEmpty = Object.keys(groupedVideos).length === 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Galeria de Vídeos</CardTitle>
        <CardDescription>
          Clique em um vídeo para adicioná-lo a um slot vazio
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum vídeo cadastrado. Adicione um vídeo usando o formulário abaixo.
          </p>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedVideos).map(([category, categoryVideos]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold text-lg">{category}</h3>
                  <Badge variant="secondary">{categoryVideos.length}</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {categoryVideos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      isInSlot={isVideoInSlot(video.id)}
                      onAddToSlot={() => onAddToSlot(video)}
                      onEdit={() => onEdit(video)}
                      onDelete={() => onDelete(video.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

