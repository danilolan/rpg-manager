'use client'

import { useResourcesSkills } from '@/hooks/use-resources-skills'
import { ResourceSkillCard } from '@/components/molecules/resource-skill-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

export function SkillsList() {
  const { skills, groupedSkills, isLoading } = useResourcesSkills()

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    )
  }

  if (skills.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No skills found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedSkills).map(([type, typeSkills]) => (
        <div key={type} className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold capitalize mb-2">
              {type} Skills ({typeSkills.length})
            </h3>
            <Separator />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {typeSkills.map((skill) => (
              <ResourceSkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

