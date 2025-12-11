'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { SkillsList } from '@/components/organisms/skills-list'
import { DrawbacksQualitiesList } from '@/components/organisms/drawbacks-qualities-list'

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Resources</h2>
        <p className="text-muted-foreground">
          Manage skills, qualities, and drawbacks
        </p>
      </div>

      <Tabs defaultValue="skills" className="w-full">
        <TabsList>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="drawbacks-qualities">Drawbacks and Qualities</TabsTrigger>
        </TabsList>
        <TabsContent value="skills" className="mt-4">
          <SkillsList />
        </TabsContent>
        <TabsContent value="drawbacks-qualities" className="mt-4">
          <DrawbacksQualitiesList />
        </TabsContent>
      </Tabs>
    </div>
  )
}

