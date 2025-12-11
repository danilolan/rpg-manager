import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen } from 'lucide-react'
import type { ResourceQualityDrawback } from '@/hooks/use-resources-qualities-drawbacks'

interface ResourceQualityDrawbackCardProps {
  item: ResourceQualityDrawback
}

export function ResourceQualityDrawbackCard({ item }: ResourceQualityDrawbackCardProps) {
  const isQuality = item.cost > 0
  const costDisplay = isQuality ? `+${item.cost}` : `${item.cost}`

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{item.name}</CardTitle>
          <div className="flex gap-2">
            <Badge variant={isQuality ? 'default' : 'destructive'}>
              {isQuality ? 'Quality' : 'Drawback'}
            </Badge>
            <Badge variant="outline">
              Cost: {costDisplay}
            </Badge>
            {item.page && (
              <Badge variant="outline" className="gap-1">
                <BookOpen className="h-3 w-3" />
                {item.page}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      {item.description && (
        <CardContent>
          <CardDescription className="text-sm">{item.description}</CardDescription>
        </CardContent>
      )}
    </Card>
  )
}

