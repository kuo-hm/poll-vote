"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  apiService,
  type Poll,
  type PollDetails,
  type CreatePollRequest,
} from "@/lib/api";
import { useSSE } from "@/hooks/use-sse";

interface PollContextType {
  polls: Poll[];
  pollDetails: Map<string, PollDetails>;
  stats: { activePolls: number; totalVotes: number } | null;
  isLoading: boolean;
  error: string | null;
  createPoll: (data: CreatePollRequest) => Promise<void>;
  vote: (pollId: string, optionId: string) => Promise<void>;
  refreshPolls: () => Promise<void>;
  getPollDetails: (pollId: string) => Promise<void>;
}

const PollContext = createContext<PollContextType | undefined>(undefined);

export function PollProvider({ children }: { children: ReactNode }) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [pollDetails, setPollDetails] = useState<Map<string, PollDetails>>(
    new Map()
  );
  const [stats, setStats] = useState<{
    activePolls: number;
    totalVotes: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // SSE connection for real-time updates
  const { events, isConnected } = useSSE("/poll/stream");

  // Handle real-time events
  useEffect(() => {
    events.forEach((event) => {
      if (event.type === "poll_update") {
        // Update poll details
        setPollDetails((prev) => new Map(prev).set(event.pollId, event.poll));

        // Update polls list if the poll exists there
        setPolls((prev) =>
          prev.map((poll) =>
            poll.id === event.pollId
              ? {
                  ...poll,
                  totalVotes: event.poll.totalVotes,
                }
              : poll
          )
        );
      }
    });
  }, [events]);

  const refreshPolls = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getPolls(1, true);
      setPolls(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch polls");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPollStats = useCallback(async () => {
    try {
      const statsData = await apiService.getPollStats();
      setStats(statsData);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, []);

  const getPollDetails = useCallback(async (pollId: string) => {
    try {
      const details = await apiService.getPollById(pollId);
      setPollDetails((prev) => new Map(prev).set(pollId, details));
    } catch (err) {
      console.error("Failed to fetch poll details:", err);
    }
  }, []);

  const createPoll = useCallback(
    async (data: CreatePollRequest) => {
      try {
        setIsLoading(true);
        setError(null);
        await apiService.createPoll(data);
        await refreshPolls();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create poll");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshPolls]
  );

  const vote = useCallback(async (pollId: string, optionId: string) => {
    try {
      setError(null);
      await apiService.vote(pollId, optionId);

      // Optimistically update the poll
      setPolls((prev) =>
        prev.map((poll) =>
          poll.id === pollId ? { ...poll, userVote: optionId } : poll
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to vote");
      throw err;
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    refreshPolls();
    getPollStats();
  }, [refreshPolls, getPollStats]);

  return (
    <PollContext.Provider
      value={{
        polls,
        pollDetails,
        stats,
        isLoading,
        error,
        createPoll,
        vote,
        refreshPolls,
        getPollDetails,
      }}
    >
      {children}
    </PollContext.Provider>
  );
}

export function usePoll() {
  const context = useContext(PollContext);
  if (context === undefined) {
    throw new Error("usePoll must be used within a PollProvider");
  }
  return context;
}
