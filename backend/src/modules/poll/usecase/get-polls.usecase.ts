import { Injectable } from '@nestjs/common';
import { PollRepository } from '../repository/poll.repository';

export interface GetPollsRequest {
  page?: number;
  voterIp?: string;
  isActive?: boolean;
}

 interface PollOption {
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

@Injectable()
export class GetPollsUseCase {
  constructor(private readonly pollRepository: PollRepository) {}

  async execute(request: GetPollsRequest): Promise<GetPollsResponse> {
    const { page = 1, voterIp, isActive = true } = request;
    
    return this.pollRepository.getPolls(page, voterIp, isActive);
  }
}
