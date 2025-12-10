'use client'

import { useState } from 'react'
import { useYoutubeVideos, type YoutubeVideo } from '@/hooks/use-youtube-videos'
import { useEqualizerSlots } from '@/hooks/use-equalizer-slots'
import { EqualizerSlots } from '@/components/organisms/equalizer-slots'
import { VideoGallery } from '@/components/organisms/video-gallery'
import { VideoForm } from '@/components/molecules/video-form'

export default function EqualizerPage() {
  const {
    groupedVideos,
    createVideo,
    updateVideo,
    deleteVideo,
  } = useYoutubeVideos()

  const {
    slots,
    addVideoToSlot,
    removeVideoFromSlot,
    updateSlotVolume,
    removeVideoById,
    isVideoInSlot,
    getEmptySlot,
  } = useEqualizerSlots(8)

  const [form, setForm] = useState({ name: '', category: '', youtubeLink: '' })
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleFormChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.name || !form.category || !form.youtubeLink) {
      alert('Preencha todos os campos')
      return
    }

    const success = editingId
      ? await updateVideo(editingId, form)
      : await createVideo(form)

    if (success) {
      setForm({ name: '', category: '', youtubeLink: '' })
      setEditingId(null)
    } else {
      alert('Erro ao salvar vídeo')
    }
  }

  const handleEdit = (video: YoutubeVideo) => {
    setForm({
      name: video.name,
      category: video.category,
      youtubeLink: video.youtubeLink,
    })
    setEditingId(video.id)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este vídeo?')) return

    const success = await deleteVideo(id)
    if (success) {
      removeVideoById(id)
    } else {
      alert('Erro ao excluir vídeo')
    }
  }

  const handleCancel = () => {
    setForm({ name: '', category: '', youtubeLink: '' })
    setEditingId(null)
  }

  const handleAddToSlot = (video: YoutubeVideo) => {
    if (isVideoInSlot(video.id)) {
      alert('Este vídeo já está em um slot')
      return
    }

    const emptySlot = getEmptySlot()
    if (!emptySlot) {
      alert('Todos os slots estão ocupados')
      return
    }

    addVideoToSlot(emptySlot.id, video)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">YouTube Equalizer</h2>
        <p className="text-muted-foreground">
          Reproduza até 8 vídeos simultaneamente com controle de volume individual
        </p>
      </div>

      <EqualizerSlots
        slots={slots}
        onRemoveVideo={removeVideoFromSlot}
        onVolumeChange={updateSlotVolume}
      />

      <VideoGallery
        groupedVideos={groupedVideos}
        isVideoInSlot={isVideoInSlot}
        onAddToSlot={handleAddToSlot}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <VideoForm
        form={form}
        isEditing={!!editingId}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}
