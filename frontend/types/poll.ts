export interface PollOption {
  id: string
  text: string
  votes: number
}

export interface Poll {
  id: string
  title: string
  description?: string
  totalVotes: number
  createdAt: Date
  userVote: string | null
}

export interface PollDetails extends Poll {
  isActive: boolean
  ttlInMs: number
  options: PollOption[]
}

export interface Vote {
  pollId: string
  optionId: string
  userId: string
  timestamp: Date
}

export interface PollContextType {
  polls: Poll[]
  pollDetails: Map<string, PollDetails>
  stats: { activePolls: number; totalVotes: number } | null
  createPoll: (data: { title: string; description?: string; options: string[]; ttlInMs: number }) => Promise<void>
  vote: (pollId: string, optionId: string) => Promise<void>
  refreshPolls: () => Promise<void>
  getPollDetails: (pollId: string) => Promise<void>
  isLoading: boolean
  error: string | null
}
