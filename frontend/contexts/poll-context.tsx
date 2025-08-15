"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Poll, PollContextType } from "@/types/poll";

const PollContext = createContext<PollContextType | undefined>(undefined);

// Mock data for demonstration
const initialPolls: Poll[] = [
  {
    id: "1",
    title: "What's your favorite programming language?",
    description: "Help us understand the community preferences",
    options: [
      { id: "1a", text: "JavaScript", votes: 45 },
      { id: "1b", text: "Python", votes: 38 },
      { id: "1c", text: "TypeScript", votes: 52 },
      { id: "1d", text: "Go", votes: 23 },
    ],
    totalVotes: 158,
    createdAt: new Date("2024-01-15"),
    isActive: true,
  },
  {
    id: "2",
    title: "Best time for team meetings?",
    description: "Let's find a time that works for everyone",
    options: [
      { id: "2a", text: "9:00 AM", votes: 12 },
      { id: "2b", text: "2:00 PM", votes: 28 },
      { id: "2c", text: "4:00 PM", votes: 15 },
    ],
    totalVotes: 55,
    createdAt: new Date("2024-01-16"),
    isActive: true,
  },
];

export function PollProvider({ children }: { children: ReactNode }) {
  const [polls, setPolls] = useState<Poll[]>(initialPolls);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPolls((currentPolls) =>
        currentPolls
          .map((poll) => ({
            ...poll,
            options: poll.options.map((option) => ({
              ...option,
              // Randomly add votes to simulate real-time activity
              votes: Math.random() > 0.95 ? option.votes + 1 : option.votes,
            })),
          }))
          .map((poll) => ({
            ...poll,
            totalVotes: poll.options.reduce(
              (sum, option) => sum + option.votes,
              0
            ),
          }))
      );
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const createPoll = (
    title: string,
    description: string,
    optionTexts: string[]
  ) => {
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const newPoll: Poll = {
        id: Date.now().toString(),
        title,
        description,
        options: optionTexts.map((text, index) => ({
          id: `${Date.now()}-${index}`,
          text,
          votes: 0,
        })),
        totalVotes: 0,
        createdAt: new Date(),
        isActive: true,
      };

      setPolls((prev) => [newPoll, ...prev]);
      setIsLoading(false);
    }, 1000);
  };

  const vote = (pollId: string, optionId: string) => {
    setPolls((currentPolls) =>
      currentPolls.map((poll) => {
        if (poll.id === pollId) {
          const updatedOptions = poll.options.map((option) =>
            option.id === optionId
              ? { ...option, votes: option.votes + 1 }
              : option
          );
          return {
            ...poll,
            options: updatedOptions,
            totalVotes: updatedOptions.reduce(
              (sum, option) => sum + option.votes,
              0
            ),
          };
        }
        return poll;
      })
    );
  };

  return (
    <PollContext.Provider value={{ polls, createPoll, vote, isLoading }}>
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
