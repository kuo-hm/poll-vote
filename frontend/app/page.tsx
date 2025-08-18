"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, BarChart3, TrendingUp } from "lucide-react";
import Link from "next/link";
import { PollList } from "@/components/poll-list";
import { QuickVote } from "@/components/quick-vote";
import { usePollStats } from "@/hooks/use-polls";

export default function HomePage() {
  const { data: stats } = usePollStats();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <QuickVote />

          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold text-sm">Quick Actions</h3>
              <div className="grid gap-2">
                <Link href="/create">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 bg-transparent"
                  >
                    <Plus className="h-4 w-4" />
                    Create Poll
                  </Button>
                </Link>
                <Link href="/results">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 bg-transparent"
                  >
                    <BarChart3 className="h-4 w-4" />
                    View Results
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 bg-transparent"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Analytics
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Quick Stats
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Active Polls
                  </span>
                  <Badge variant="default">{stats?.activePolls || 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Total Votes
                  </span>
                  <span className="font-semibold">
                    {stats?.totalVotes || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Active Polls</h2>
                <p className="text-muted-foreground">
                  Vote on the latest polls and see results update in real-time
                </p>
              </div>
            </div>
            <PollList showResults={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
