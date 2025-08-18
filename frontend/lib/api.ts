import { apiClient } from './axios';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  totalVotes: number;
  userVote: string | null;
}

export interface PollDetails extends Poll {
  isActive: boolean;
  ttlInMs: number;
  options: PollOption[];
}

export interface PollStats {
  activePolls: number;
  totalVotes: number;
}

export interface GetPollsResponse {
  items: Poll[];
  meta: {
    currentPage: number;
    itemCount: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface CreatePollRequest {
  title: string;
  description?: string;
  options: string[];
  ttlInMs: number;
}

export interface VoteEvent {
  type: 'vote';
  pollId: string;
  optionId: string;
  votes: number;
}

export interface PollUpdateEvent {
  type: 'poll_update';
  pollId: string;
  poll: PollDetails;
}

export type PollEvent = VoteEvent | PollUpdateEvent;

class ApiService {
  async getPolls(page: number = 1, isActive: boolean = true): Promise<GetPollsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      isActive: isActive.toString(),
    });
    const response = await apiClient.get<GetPollsResponse>(`/poll?${params}`);
    return response.data;
  }

  async getPollById(pollId: string): Promise<PollDetails> {
    const response = await apiClient.get<PollDetails>(`/poll/${pollId}`);
    return response.data;
  }

  async getPollStats(): Promise<PollStats> {
    const response = await apiClient.get<PollStats>('/poll/stats');
    return response.data;
  }

  async createPoll(data: CreatePollRequest): Promise<string> {
    const response = await apiClient.post<string>('/poll', data);
    return response.data;
  }

  async vote(pollId: string, optionId: string): Promise<void> {
    await apiClient.post<void>(`/poll/${pollId}/vote/${optionId}`);
  }

  createEventSource(endpoint: string): EventSource {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    return new EventSource(`${API_BASE_URL}${endpoint}`, {
      withCredentials: true,
    });
  }
}

export const apiService = new ApiService();
