import { useState, useEffect } from 'react'

export interface ResourceSkill {
  id: string
  name: string
  description: string | null
  type: 'REGULAR' | 'SPECIAL'
  page: number | null
  createdAt: string
  updatedAt: string
}

export function useResourcesSkills() {
  const [skills, setSkills] = useState<ResourceSkill[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchSkills = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/resources/skills')
      if (response.ok) {
        const data = await response.json()
        setSkills(data)
      }
    } catch (error) {
      console.error('Error fetching skills:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSkills()
  }, [])

  const groupedSkills = skills.reduce((acc, skill) => {
    const key = skill.type
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(skill)
    return acc
  }, {} as Record<string, ResourceSkill[]>)

  return {
    skills,
    groupedSkills,
    isLoading,
    refetch: fetchSkills,
  }
}

