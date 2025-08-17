import { Injectable, NotFoundException } from '@nestjs/common';
import { PollRepository } from '../repository/poll.repository';

export interface GetPollByIdRequest {
  pollId: string;
  voterIp?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PollDetails {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  isActive: boolean;
  ttlInMs: number;
  totalVotes: number;
  options: PollOption[];
  userVote: string | null;
}

@Injectable()
export class GetPollByIdUseCase {
  constructor(private readonly pollRepository: PollRepository) {}

  async execute(request: GetPollByIdRequest): Promise<PollDetails> {
    const { pollId, voterIp } = request;
    
    const poll = await this.pollRepository.getPollByIdWithDetails(pollId, voterIp);
    
    if (!poll) {
      throw new NotFoundException('Poll not found');
    }
    
    return poll;
  }
}
