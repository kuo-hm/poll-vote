"use client";

import { PollCard } from "./poll-card";
import { Skeleton } from "@/components/ui/skeleton";
import { RealtimeStatus } from "./realtime-status";
import { usePolls } from "@/hooks/use-polls";
import { Pagination } from "./ui/pagination";
import { PollPagination } from "./poll-pagination";
import { useState } from "react";

interface PollListProps {
  showResults?: boolean;
}

export function PollList({ showResults = false }: PollListProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = usePolls(page, !showResults);

  const polls = data?.items || [];
  const meta = data?.meta;

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
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          <p className="text-lg font-medium mb-2">Error loading polls</p>
          <p className="text-sm">{JSON.stringify(error)}</p>
        </div>
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          <p className="text-lg font-medium mb-2">No polls yet</p>
          <p className="text-sm">Create your first poll to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Active Polls</h3>
        <div className="flex items-center gap-2">
          <RealtimeStatus />
        </div>
      </div>

      {polls.map((poll) => (
        <PollCard key={poll.id} poll={poll} showResults={showResults} />
      ))}

      {meta && (
        <div className="pt-4">
          <PollPagination meta={meta} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
