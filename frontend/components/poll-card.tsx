"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Check } from "lucide-react";
import type { Poll, PollDetails } from "@/types/poll";
import { formatDistanceToNow } from "date-fns";
import { usePollById, useVote } from "@/hooks/use-polls";

interface PollCardProps {
  poll: Poll;
  showResults?: boolean;
  children?: React.ReactNode;
}

export function PollCard({
  poll,
  showResults = false,
  children,
}: PollCardProps) {
  const { data: details, isLoading: isLoadingDetails } = usePollById(poll.id);
  const voteMutation = useVote();

  const handleVote = async (optionId: string) => {
    if (voteMutation.isPending || poll.userVote) return;

    try {
      await voteMutation.mutateAsync({ pollId: poll.id, optionId });
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  };

  const getPercentage = (votes: number) => {
    if (!details || details.totalVotes === 0) return 0;
    return Math.round((votes / details.totalVotes) * 100);
  };

  const getMaxVotes = () => {
    if (!details) return 0;
    return Math.max(...details.options.map((option) => option.votes));
  };

  if (isLoadingDetails || !details) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold leading-tight mb-2">
              {poll.title}
            </CardTitle>
            {poll.description && (
              <CardDescription className="text-sm text-muted-foreground">
                {poll.description}
              </CardDescription>
            )}
          </div>
          <Badge
            variant={details.isActive ? "default" : "secondary"}
            className="shrink-0"
          >
            {details.isActive ? "Active" : "Closed"}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{poll.totalVotes} votes</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>
              {formatDistanceToNow(poll.createdAt, { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {details.options.map((option) => {
            const percentage = getPercentage(option.votes);
            const isHighest =
              option.votes === getMaxVotes() && details.totalVotes > 0;
            const isVoted = poll.userVote === option.id;

            return (
              <div key={option.id} className="space-y-2 ">
                <div className="flex items-center justify-between text-sm ">
                  <span
                    className={`font-medium text-foreground flex items-center gap-2  w-full ${
                      !poll.userVote && "hover:bg-gray-500 rounded-full"
                    }`}
                  >
                    {!poll.userVote && details.isActive ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start "
                        onClick={() => handleVote(option.id)}
                        disabled={voteMutation.isPending}
                      >
                        Vote for {option.text}
                      </Button>
                    ) : (
                      option.text
                    )}
                    {isVoted && <Check className="h-4 w-4 text-green-500" />}
                  </span>
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
            );
          })}
        </div>

        {children && <div className="mt-6 pt-4 border-t">{children}</div>}
      </CardContent>
    </Card>
  );
}
