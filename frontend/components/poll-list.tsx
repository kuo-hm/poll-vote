"use client"

import { usePoll } from "@/contexts/poll-context"
import { PollCard } from "./poll-card"
import { VoteButtons } from "./vote-buttons"
import { Skeleton } from "@/components/ui/skeleton"

interface PollListProps {
  showResults?: boolean
}

export function PollList({ showResults = false }: PollListProps) {
  const { polls, vote, isLoading } = usePoll()

  if (isLoading && polls.length === 0) {
    return (
      <div className="space-y-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (polls.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          <p className="text-lg font-medium mb-2">No polls yet</p>
          <p className="text-sm">Create your first poll to get started!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {polls.map((poll) => (
        <PollCard key={poll.id} poll={poll} showResults={showResults}>
          {!showResults && poll.isActive && <VoteButtons poll={poll} onVote={(optionId) => vote(poll.id, optionId)} />}
        </PollCard>
      ))}
    </div>
  )
}
