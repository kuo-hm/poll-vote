"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Users } from "lucide-react"
import type { Poll } from "@/types/poll"
import { usePoll } from "@/contexts/poll-context"

export function QuickVote() {
  const { polls, vote } = usePoll()
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null)

  // Get the most recent active poll for quick voting
  const latestPoll = polls.find((poll) => poll.isActive) || null

  if (!latestPoll) {
    return null
  }

  const currentPoll = selectedPoll || latestPoll

  const handleQuickVote = (optionId: string) => {
    vote(currentPoll.id, optionId)
    // Auto-close after voting
    setTimeout(() => {
      setSelectedPoll(null)
    }, 1500)
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Quick Vote</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            <Users className="h-3 w-3 mr-1" />
            {currentPoll.totalVotes}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-sm mb-1">{currentPoll.title}</h3>
            {currentPoll.description && <p className="text-xs text-muted-foreground">{currentPoll.description}</p>}
          </div>

          <div className="grid gap-2">
            {currentPoll.options.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                size="sm"
                className="justify-start h-8 text-xs hover:bg-primary/10 hover:border-primary/30 bg-transparent"
                onClick={() => handleQuickVote(option.id)}
              >
                {option.text}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
