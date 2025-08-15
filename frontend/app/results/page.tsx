"use client"

import { PollList } from "@/components/poll-list"

export default function ResultsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Poll Results</h2>
          <p className="text-muted-foreground">View detailed results and vote distributions</p>
        </div>
        <PollList showResults={true} />
      </div>
    </div>
  )
}
