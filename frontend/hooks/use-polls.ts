import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, type CreatePollRequest } from '@/lib/api';

export const usePolls = (page: number = 1, isActive: boolean = true) => {
  return useQuery({
    queryKey: ['polls', page, isActive],
    queryFn: () => apiService.getPolls(page, isActive),
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 30, // Refetch every 30 seconds for real-time updates
  });
};

export const usePollById = (pollId: string) => {
  return useQuery({
    queryKey: ['poll', pollId],
    queryFn: () => apiService.getPollById(pollId),
    enabled: !!pollId,
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const usePollStats = () => {
  return useQuery({
    queryKey: ['poll-stats'],
    queryFn: () => apiService.getPollStats(),
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60, // Refetch every minute
  });
};

export const useCreatePoll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePollRequest) => apiService.createPoll(data),
    onSuccess: () => {
      // Invalidate and refetch polls
      queryClient.invalidateQueries({ queryKey: ['polls'] });
      queryClient.invalidateQueries({ queryKey: ['poll-stats'] });
    },
  });
};

export const useVote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pollId, optionId }: { pollId: string; optionId: string }) =>
      apiService.vote(pollId, optionId),
    onSuccess: (_, { pollId }) => {
      // Invalidate specific poll and polls list
      queryClient.invalidateQueries({ queryKey: ['poll', pollId] });
      queryClient.invalidateQueries({ queryKey: ['polls'] });
      queryClient.invalidateQueries({ queryKey: ['poll-stats'] });
    },
  });
};
