'use client'

import { useResourcesQualitiesDrawbacks } from '@/hooks/use-resources-qualities-drawbacks'
import { ResourceQualityDrawbackCard } from '@/components/molecules/resource-quality-drawback-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

export function DrawbacksQualitiesList() {
  const { qualities, drawbacks, isLoading } = useResourcesQualitiesDrawbacks()

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Qualities Section */}
      {qualities.length > 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Qualities ({qualities.length})
            </h3>
            <Separator />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {qualities.map((item) => (
              <ResourceQualityDrawbackCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Drawbacks Section */}
      {drawbacks.length > 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Drawbacks ({drawbacks.length})
            </h3>
            <Separator />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {drawbacks.map((item) => (
              <ResourceQualityDrawbackCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {qualities.length === 0 && drawbacks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No qualities or drawbacks found.</p>
        </div>
      )}
    </div>
  )
}

