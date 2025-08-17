import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PollRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPoll(payload: CreatePoll): Promise<string> {
    const poll = await this.prisma.poll.create({
      data: {
        title: payload.title,
        description: payload.title,
        options: {
          createMany: {
            data: payload.options.map((option) => ({
              text: option,
            })),
          },
        },
        ttlInMs: payload.ttlInMs,
      },
    });

    return poll.id;
  }

  async expirePoll(pollId: string) {
    return this.prisma.poll.update({
      where: { id: pollId },
      data: { isActive: false },
    });
  }

  async getPollById(pollId: string) {
    return this.prisma.poll.findUnique({
      where: { id: pollId },
      include: { options: true },
    });
  }

  async alreadyVoted(pollId: string, voterIp: string): Promise<boolean> {
    const voted = await this.prisma.vote.count({
      where: {
        ip: voterIp,
        pollId: pollId,
      },
    });
    return voted > 0;
  }

  async optionExists(pollId: string, optionId: string): Promise<boolean> {
    const option = await this.prisma.option.count({
      where: {
        id: optionId,
        pollId: pollId,
      },
    });
    return option > 0;
  }

  async vote(payload: VoteForPoll) {
    await this.prisma.poll.update({
      where: {
        id: payload.pollId,
      },
      data: {
        votes: {
          create: {
            ip: payload.voterIp,
            optionId: payload.optionId,
          },
        },
        options: {
          update: {
            where: {
              id: payload.optionId,
            },
            data: {
              votes: {
                increment: 1,
              },
            },
          },
        },
      },
    });
  }

  async getPolls(page: number = 1, voterIp?: string, isActive: boolean = true) {
    const limit = 2;
    const skip = (page - 1) * limit;

    const [polls, totalCount] = await Promise.all([
      this.prisma.poll.findMany({
        where: {
          isActive,
        },
        include: {
          votes: {
            where: {
              ip: voterIp,
            },
            select: {
              optionId: true,
            },
          },
          _count: {
            select: {
              votes: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.poll.count({
        where: {
          isActive,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      items: polls.map(poll => ({
        id: poll.id,
        title: poll.title,
        description: poll.description,
        createdAt: poll.createdAt,
        totalVotes: poll._count.votes,
        userVote: poll.votes.length > 0 ? poll.votes[0].optionId : null,
      })),
      meta: {
        currentPage: page,
        itemCount: polls.length,
        itemsPerPage: limit,
        totalItems: totalCount,
        totalPages,
      },
    };
  }

  async getPollByIdWithDetails(pollId: string, voterIp?: string) {
    const poll = await this.prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: {
          select: {
            id: true,
            text: true,
            votes: true,
          },
        },
        votes: {
          where: {
            ip: voterIp,
          },
          select: {
            optionId: true,
          },
        },
        _count: {
          select: {
            votes: true,
          },
        },
      },
    });

    if (!poll) {
      return null;
    }

    return {
      id: poll.id,
      title: poll.title,
      description: poll.description,
      createdAt: poll.createdAt,
      isActive: poll.isActive,
      ttlInMs: poll.ttlInMs,
      totalVotes: poll._count.votes,
      options: poll.options.map(option => ({
        id: option.id,
        text: option.text,
        votes: option.votes,
      })),
      userVote: poll.votes.length > 0 ? poll.votes[0].optionId : null,
    };
  }

  async getPollStats() {
    const [activePollsCount, totalVotes] = await Promise.all([
      this.prisma.poll.count({
        where: {
          isActive: true,
        },
      }),
      this.prisma.vote.count({
        where: {
          poll: {
            isActive: true,
          },
        },
      }),
    ]);

    return {
      activePolls: activePollsCount,
      totalVotes,
    };
  }
}

interface CreatePoll {
  title: string;
  description?: string;
  options: string[];
  ttlInMs: number;
}

interface VoteForPoll {
  pollId: string;
  optionId: string;
  voterIp: string;
}
