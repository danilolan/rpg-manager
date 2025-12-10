'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

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
          <TabsTrigger value="skills">Skills and Qualities</TabsTrigger>
          <TabsTrigger value="drawbacks">Drawbacks</TabsTrigger>
        </TabsList>
        <TabsContent value="skills" className="mt-4">
          <div className="rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Skills and Qualities</h3>
            <p className="text-muted-foreground">
              Content for Skills and Qualities will go here.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="drawbacks" className="mt-4">
          <div className="rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Drawbacks</h3>
            <p className="text-muted-foreground">
              Content for Drawbacks will go here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

