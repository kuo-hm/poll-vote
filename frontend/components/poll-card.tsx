"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users } from "lucide-react"
import type { Poll } from "@/types/poll"
import { formatDistanceToNow } from "date-fns"

interface PollCardProps {
  poll: Poll
  onVote?: (pollId: string, optionId: string) => void
  showResults?: boolean
  children?: React.ReactNode
}

export function PollCard({ poll, onVote, showResults = false, children }: PollCardProps) {
  const getPercentage = (votes: number) => {
    if (poll.totalVotes === 0) return 0
    return Math.round((votes / poll.totalVotes) * 100)
  }

  const getMaxVotes = () => {
    return Math.max(...poll.options.map((option) => option.votes))
  }

  return (
    <Card className="w-full transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold leading-tight mb-2">{poll.title}</CardTitle>
            {poll.description && (
              <CardDescription className="text-sm text-muted-foreground">{poll.description}</CardDescription>
            )}
          </div>
          <Badge variant={poll.isActive ? "default" : "secondary"} className="shrink-0">
            {poll.isActive ? "Active" : "Closed"}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{poll.totalVotes} votes</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatDistanceToNow(poll.createdAt, { addSuffix: true })}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {poll.options.map((option) => {
            const percentage = getPercentage(option.votes)
            const isHighest = option.votes === getMaxVotes() && poll.totalVotes > 0

            return (
              <div key={option.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{option.text}</span>
                  {showResults && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>{option.votes} votes</span>
                      <span className="font-semibold">{percentage}%</span>
                    </div>
                  )}
                </div>

                {showResults && (
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`absolute left-0 top-0 h-full transition-all duration-500 ease-out rounded-full ${
                        isHighest ? "bg-primary" : "bg-primary/70"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {children && <div className="mt-6 pt-4 border-t">{children}</div>}
      </CardContent>
    </Card>
  )
}
