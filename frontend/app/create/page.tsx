"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PollTemplates } from "@/components/poll-templates"
import { CreatePollDialog } from "@/components/create-poll-dialog"

export default function CreatePage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Create New Poll</h2>
          <p className="text-muted-foreground">Start a new poll or use one of our templates</p>
        </div>

        <PollTemplates />

        <div className="pt-6 border-t">
          <h3 className="text-lg font-semibold mb-4">Custom Poll</h3>
          <Card>
            <CardHeader>
              <CardTitle>Create from Scratch</CardTitle>
              <CardDescription>Build a completely custom poll with your own questions and options</CardDescription>
            </CardHeader>
            <CardContent>
              <CreatePollDialog />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
