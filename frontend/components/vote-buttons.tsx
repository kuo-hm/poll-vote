"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"
import type { Poll } from "@/types/poll"
import { useToast } from "@/hooks/use-toast"

interface VoteButtonsProps {
  poll: Poll
  onVote: (optionId: string) => void
}

export function VoteButtons({ poll, onVote }: VoteButtonsProps) {
  const [votingFor, setVotingFor] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState<string | null>(null)
  const { toast } = useToast()

  const handleVote = async (optionId: string) => {
    if (hasVoted || votingFor) return

    setVotingFor(optionId)

    // Simulate voting delay
    setTimeout(() => {
      onVote(optionId)
      setVotingFor(null)
      setHasVoted(optionId)

      const option = poll.options.find((opt) => opt.id === optionId)
      toast({
        title: "Vote recorded!",
        description: `You voted for "${option?.text}"`,
      })

      // Reset voted state after showing feedback
      setTimeout(() => {
        setHasVoted(null)
      }, 2000)
    }, 800)
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-muted-foreground mb-3">Cast your vote:</h4>
      <div className="grid gap-2">
        {poll.options.map((option) => {
          const isVoting = votingFor === option.id
          const isVoted = hasVoted === option.id
          const isDisabled = votingFor !== null || hasVoted !== null

          return (
            <Button
              key={option.id}
              variant={isVoted ? "default" : "outline"}
              className={`justify-start h-auto p-3 text-left transition-all duration-200 ${
                isVoted ? "bg-primary text-primary-foreground" : ""
              } ${isVoting ? "scale-[0.98]" : "hover:scale-[1.02]"}`}
              onClick={() => handleVote(option.id)}
              disabled={isDisabled}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">{option.text}</span>
                <div className="flex items-center gap-2">
                  {isVoting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isVoted && <Check className="h-4 w-4" />}
                </div>
              </div>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
