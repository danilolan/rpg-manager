import { useState, useEffect } from 'react'

export interface ResourceQualityDrawback {
  id: string
  name: string
  description: string | null
  cost: number
  page: number | null
  createdAt: string
  updatedAt: string
}

export function useResourcesQualitiesDrawbacks() {
  const [items, setItems] = useState<ResourceQualityDrawback[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchItems = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/resources/qualities-drawbacks')
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      console.error('Error fetching qualities/drawbacks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const qualities = items.filter(item => item.cost > 0)
  const drawbacks = items.filter(item => item.cost < 0)

  return {
    items,
    qualities,
    drawbacks,
    isLoading,
    refetch: fetchItems,
  }
}

