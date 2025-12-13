import { useState, useEffect } from 'react'

export interface YoutubeVideo {
  id: string
  name: string
  category: string
  youtubeLink: string
  createdAt: string
  updatedAt: string
}

export function useYoutubeVideos() {
  const [videos, setVideos] = useState<YoutubeVideo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchVideos = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/youtube')
      if (response.ok) {
        const data = await response.json()
        setVideos(data)
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  const createVideo = async (video: Omit<YoutubeVideo, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(video),
      })
      if (response.ok) {
        await fetchVideos()
        return true
      }
      return false
    } catch (error) {
      console.error('Error creating video:', error)
      return false
    }
  }

  const updateVideo = async (id: string, video: Partial<Omit<YoutubeVideo, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const response = await fetch(`/api/youtube/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(video),
      })
      if (response.ok) {
        await fetchVideos()
        return true
      }
      return false
    } catch (error) {
      console.error('Error updating video:', error)
      return false
    }
  }

  const deleteVideo = async (id: string) => {
    try {
      const response = await fetch(`/api/youtube/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        await fetchVideos()
        return true
      }
      return false
    } catch (error) {
      console.error('Error deleting video:', error)
      return false
    }
  }

  const groupedVideos = videos.reduce((acc, video) => {
    if (!acc[video.category]) {
      acc[video.category] = []
    }
    acc[video.category].push(video)
    return acc
  }, {} as Record<string, YoutubeVideo[]>)

  return {
    videos,
    groupedVideos,
    isLoading,
    createVideo,
    updateVideo,
    deleteVideo,
    refetch: fetchVideos,
  }
}






