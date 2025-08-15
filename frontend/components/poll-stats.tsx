"use client"

import { usePoll } from "@/contexts/poll-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, Vote } from "lucide-react"

export function PollStats() {
  const { polls } = usePoll()

  const totalPolls = polls.length
  const activePolls = polls.filter((poll) => poll.isActive).length
  const totalVotes = polls.reduce((sum, poll) => sum + poll.totalVotes, 0)

  const stats = [
    {
      title: "Total Polls",
      value: totalPolls,
      icon: BarChart3,
      description: `${activePolls} active`,
    },
    {
      title: "Total Votes",
      value: totalVotes,
      icon: Vote,
      description: "All time",
    },
    {
      title: "Avg Votes/Poll",
      value: totalPolls > 0 ? Math.round(totalVotes / totalPolls) : 0,
      icon: Users,
      description: "Per poll",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
