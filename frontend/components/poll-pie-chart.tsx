"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { Poll } from "@/types/poll"

interface PollPieChartProps {
  poll: Poll
  className?: string
}

const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export function PollPieChart({ poll, className }: PollPieChartProps) {
  const chartData = poll.options
    .filter((option) => option.votes > 0) // Only show options with votes
    .map((option, index) => ({
      name: option.text,
      votes: option.votes,
      percentage: poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0,
      fill: chartColors[index % chartColors.length],
    }))

  const chartConfig = {
    votes: {
      label: "Votes",
    },
  }

  if (poll.totalVotes === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Vote Distribution</CardTitle>
          <p className="text-sm text-muted-foreground">No votes yet</p>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <p>Cast the first vote to see the distribution!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Vote Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">Total votes: {poll.totalVotes}</p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={2}
                dataKey="votes"
                animationBegin={0}
                animationDuration={800}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      <div key={name} className="flex items-center gap-2">
                        <span>{value} votes</span>
                        <span className="text-muted-foreground">
                          ({chartData.find((d) => d.votes === value)?.percentage}%)
                        </span>
                      </div>,
                      name,
                    ]}
                  />
                }
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry) => (
                  <span className="text-sm">
                    {value} ({entry.payload?.percentage}%)
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
