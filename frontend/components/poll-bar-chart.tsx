"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { Poll } from "@/types/poll"

interface PollBarChartProps {
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

export function PollBarChart({ poll, className }: PollBarChartProps) {
  const chartData = poll.options.map((option, index) => ({
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

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Results Overview</CardTitle>
        <p className="text-sm text-muted-foreground">Total votes: {poll.totalVotes}</p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
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
                      "Votes",
                    ]}
                  />
                }
              />
              <Bar dataKey="votes" radius={[4, 4, 0, 0]} className="transition-all duration-300">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
