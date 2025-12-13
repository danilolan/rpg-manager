export function getYoutubeVideoId(url: string): string {
  try {
    const urlObj = new URL(url)
    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v') || ''
    } else if (urlObj.hostname.includes('youtu.be')) {
      return urlObj.pathname.slice(1)
    }
    return ''
  } catch {
    return ''
  }
}

export function getYoutubeEmbedUrl(url: string, autoplay = false): string | null {
  try {
    const videoId = getYoutubeVideoId(url)
    
    if (!videoId) return null
    
    const params = new URLSearchParams({
      enablejsapi: '1',
      origin: typeof window !== 'undefined' ? window.location.origin : '',
    })
    
    if (autoplay) {
      params.append('autoplay', '1')
    }
    
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
  } catch {
    return null
  }
}

export function getYoutubeThumbnailUrl(url: string, quality: 'default' | 'hq' | 'mq' | 'sd' | 'maxres' = 'mq'): string {
  const videoId = getYoutubeVideoId(url)
  if (!videoId) return ''
  
  const qualityMap = {
    default: 'default',
    hq: 'hqdefault',
    mq: 'mqdefault',
    sd: 'sddefault',
    maxres: 'maxresdefault',
  }
  
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`
}






