"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, PieChart, TrendingUp, Users } from "lucide-react"
import type { Poll } from "@/types/poll"
import { PollBarChart } from "./poll-bar-chart"
import { PollPieChart } from "./poll-pie-chart"
import { formatDistanceToNow } from "date-fns"

interface PollAnalyticsProps {
  poll: Poll
}

export function PollAnalytics({ poll }: PollAnalyticsProps) {
  const [selectedChart, setSelectedChart] = useState<"bar" | "pie">("bar")

  const getTopOption = () => {
    return poll.options.reduce((prev, current) => (prev.votes > current.votes ? prev : current))
  }

  const getEngagementRate = () => {
    // Simple engagement calculation based on time since creation
    const hoursOld = (Date.now() - poll.createdAt.getTime()) / (1000 * 60 * 60)
    return hoursOld > 0 ? Math.round(poll.totalVotes / hoursOld) : poll.totalVotes
  }

  const topOption = getTopOption()
  const engagementRate = getEngagementRate()

  return (
    <div className="space-y-6">
      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leading Option</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">{topOption.text}</div>
            <p className="text-xs text-muted-foreground">
              {topOption.votes} votes ({poll.totalVotes > 0 ? Math.round((topOption.votes / poll.totalVotes) * 100) : 0}
              %)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{engagementRate}</div>
            <p className="text-xs text-muted-foreground">votes per hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Poll Age</CardTitle>
            <Badge variant={poll.isActive ? "default" : "secondary"} className="text-xs">
              {poll.isActive ? "Active" : "Closed"}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{formatDistanceToNow(poll.createdAt)}</div>
            <p className="text-xs text-muted-foreground">since created</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Visualization */}
      <Tabs value={selectedChart} onValueChange={(value) => setSelectedChart(value as "bar" | "pie")}>
        <div className="flex items-center justify-between">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="bar" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Bar Chart
            </TabsTrigger>
            <TabsTrigger value="pie" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Pie Chart
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="bar" className="mt-4">
          <PollBarChart poll={poll} />
        </TabsContent>

        <TabsContent value="pie" className="mt-4">
          <PollPieChart poll={poll} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
