import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen } from 'lucide-react'
import type { ResourceSkill } from '@/hooks/use-resources-skills'

interface ResourceSkillCardProps {
  skill: ResourceSkill
}

export function ResourceSkillCard({ skill }: ResourceSkillCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{skill.name}</CardTitle>
          <div className="flex gap-2">
            <Badge variant={skill.type === 'SPECIAL' ? 'default' : 'secondary'}>
              {skill.type}
            </Badge>
            {skill.page && (
              <Badge variant="outline" className="gap-1">
                <BookOpen className="h-3 w-3" />
                {skill.page}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      {skill.description && (
        <CardContent>
          <CardDescription className="text-sm">{skill.description}</CardDescription>
        </CardContent>
      )}
    </Card>
  )
}

