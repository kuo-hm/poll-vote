import { useEffect, useRef, useState } from "react";
import { PollEvent } from "@/lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function useSSE(endpoint: string) {
  const [events, setEvents] = useState<PollEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const connect = () => {
      try {
        const eventSource = new EventSource(`${API_BASE_URL}${endpoint}`, {
          withCredentials: true,
        });
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          setIsConnected(true);
          setError(null);
        };

        eventSource.onmessage = (event: MessageEvent) => {
          try {
            const data: PollEvent = JSON.parse(event.data);
            setEvents((prev) => [...prev, data]);
          } catch (err) {
            console.error("Failed to parse SSE event:", err);
          }
        };

        eventSource.onerror = (error: Event) => {
          console.error("SSE connection error:", error);
          setError("Connection failed");
          setIsConnected(false);
        };

        return () => {
          eventSource.close();
        };
      } catch (err) {
        console.error("Failed to create EventSource:", err);
        setError("Failed to connect");
        return () => {};
      }
    };

    const cleanup = connect();

    return () => {
      cleanup();
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [endpoint]);

  const clearEvents = () => {
    setEvents([]);
  };

  return {
    events,
    isConnected,
    error,
    clearEvents,
  };
}
