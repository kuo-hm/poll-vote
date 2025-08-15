export interface PollOption {
  id: string
  text: string
  votes: number
}

export interface Poll {
  id: string
  title: string
  description?: string
  options: PollOption[]
  totalVotes: number
  createdAt: Date
  isActive: boolean
}

export interface Vote {
  pollId: string
  optionId: string
  userId: string
  timestamp: Date
}

export interface PollContextType {
  polls: Poll[]
  createPoll: (title: string, description: string, options: string[]) => void
  vote: (pollId: string, optionId: string) => void
  isLoading: boolean
}
