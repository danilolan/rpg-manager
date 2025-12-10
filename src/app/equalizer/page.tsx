'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, ExternalLink, Play } from 'lucide-react'

interface YoutubeVideo {
  id: string
  name: string
  category: string
  youtubeLink: string
  createdAt: string
  updatedAt: string
}

export default function EqualizerPage() {
  const [videos, setVideos] = useState<YoutubeVideo[]>([])
  const [form, setForm] = useState({ name: '', category: '', youtubeLink: '' })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [currentVideo, setCurrentVideo] = useState<YoutubeVideo | null>(null)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/youtube')
      if (response.ok) {
        const data = await response.json()
        setVideos(data)
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.name || !form.category || !form.youtubeLink) {
      alert('Preencha todos os campos')
      return
    }

    try {
      if (editingId) {
        await fetch(`/api/youtube/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
      } else {
        await fetch('/api/youtube', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
      }
      
      setForm({ name: '', category: '', youtubeLink: '' })
      setEditingId(null)
      fetchVideos()
    } catch (error) {
      console.error('Error saving video:', error)
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

    try {
      await fetch(`/api/youtube/${id}`, {
        method: 'DELETE',
      })
      fetchVideos()
      if (currentVideo?.id === id) {
        setCurrentVideo(null)
      }
    } catch (error) {
      console.error('Error deleting video:', error)
      alert('Erro ao excluir vídeo')
    }
  }

  const cancelEdit = () => {
    setForm({ name: '', category: '', youtubeLink: '' })
    setEditingId(null)
  }

  const getYoutubeEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url)
      let videoId = ''
      
      if (urlObj.hostname.includes('youtube.com')) {
        videoId = urlObj.searchParams.get('v') || ''
      } else if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1)
      }
      
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null
    } catch {
      return null
    }
  }

  const groupedVideos = videos.reduce((acc, video) => {
    if (!acc[video.category]) {
      acc[video.category] = []
    }
    acc[video.category].push(video)
    return acc
  }, {} as Record<string, YoutubeVideo[]>)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">YouTube Equalizer</h2>
        <p className="text-muted-foreground">
          Gerencie seus vídeos do YouTube organizados por categoria
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Video List */}
        <div className="space-y-4">
          {Object.keys(groupedVideos).length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  Nenhum vídeo cadastrado. Adicione um vídeo usando o formulário abaixo.
                </p>
              </CardContent>
            </Card>
          ) : (
            Object.entries(groupedVideos).map(([category, categoryVideos]) => (
              <Card key={category}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{category}</CardTitle>
                    <Badge variant="secondary">{categoryVideos.length}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categoryVideos.map((video) => (
                        <TableRow key={video.id}>
                          <TableCell className="font-medium">{video.name}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setCurrentVideo(video)}
                                title="Reproduzir"
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => window.open(video.youtubeLink, '_blank')}
                                title="Abrir no YouTube"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(video)}
                                title="Editar"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(video.id)}
                                title="Excluir"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Video Player */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Player</CardTitle>
              <CardDescription>
                {currentVideo ? currentVideo.name : 'Selecione um vídeo para reproduzir'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentVideo ? (
                <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={getYoutubeEmbedUrl(currentVideo.youtubeLink) || ''}
                    title={currentVideo.name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Nenhum vídeo selecionado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add/Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Editar Vídeo' : 'Adicionar Vídeo'}</CardTitle>
          <CardDescription>
            {editingId ? 'Atualize as informações do vídeo' : 'Preencha os dados para adicionar um novo vídeo'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nome do vídeo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Input
                  id="category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Ex: Música, Tutorial"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtubeLink">URL do YouTube *</Label>
                <Input
                  id="youtubeLink"
                  type="url"
                  value={form.youtubeLink}
                  onChange={(e) => setForm({ ...form, youtubeLink: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">
                {editingId ? 'Atualizar' : 'Adicionar'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

