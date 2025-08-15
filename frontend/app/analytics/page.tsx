"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import { PollStats } from "@/components/poll-stats"
import { PollAnalytics } from "@/components/poll-analytics"
import { CreatePollDialog } from "@/components/create-poll-dialog"
import { usePoll } from "@/contexts/poll-context"

export default function AnalyticsPage() {
  const { polls } = usePoll()
  const activePoll = polls.find((poll) => poll.isActive)

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Detailed insights and statistics for your polls</p>
        </div>

        <PollStats />

        {activePoll && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Featured Poll Analysis</h3>
            <PollAnalytics poll={activePoll} />
          </div>
        )}

        {!activePoll && (
          <Card>
            <CardContent className="py-12 text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Active Polls</h3>
              <p className="text-muted-foreground mb-4">Create a poll to see detailed analytics</p>
              <CreatePollDialog />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
