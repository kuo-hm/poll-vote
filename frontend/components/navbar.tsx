"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Vote, Plus, BarChart3, TrendingUp, HomeIcon } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { CreatePollDialog } from "@/components/create-poll-dialog";
import { usePoll } from "@/contexts/poll-context";

export function Navbar() {
  const { polls } = usePoll();

  return (
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Vote className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">PollVote</h1>
                <p className="text-xs text-muted-foreground">
                  Real-time polling
                </p>
              </div>
            </Link>
            <Badge variant="secondary" className="text-xs">
              {polls.length} polls
            </Badge>
          </div>

          <nav className="hidden md:flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <HomeIcon className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/results">
              <Button variant="ghost" size="sm" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Results
              </Button>
            </Link>
            <Link href="/analytics">
              <Button variant="ghost" size="sm" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Analytics
              </Button>
            </Link>
            <Link href="/create">
              <Button variant="ghost" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Create
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <CreatePollDialog />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
