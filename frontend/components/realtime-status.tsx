"use client";

import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";
import { useSSE } from "@/hooks/use-sse";

export function RealtimeStatus() {
  const { isConnected, error } = useSSE("/poll/stream");

  if (error) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <WifiOff className="h-3 w-3" />
        Disconnected
      </Badge>
    );
  }

  return (
    <Badge
      variant={isConnected ? "default" : "secondary"}
      className="flex items-center gap-1"
    >
      <Wifi className={`h-3 w-3 ${isConnected ? "animate-pulse" : ""}`} />
      {isConnected ? "Real-time" : "Connecting..."}
    </Badge>
  );
}
