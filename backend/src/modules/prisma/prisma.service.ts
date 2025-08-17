import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { IPaginatedResponse } from './dto/paginate.dto';

interface PrismaPaginationProps<Where, Args> {
  page?: number;
  limit?: number;
  model: {
    findMany: (
      args: Args & { where?: Where; skip?: number; take?: number },
    ) => Promise<any[]>;
    count: (args: { where?: Where }) => Promise<number>;
  };
  args: Args;
  where?: Where;
}

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly config: ConfigService) {
    const databaseUrl: string | undefined = config.get<string>(
      'DATABASE_URL',
    ) as string;

    super({
      datasources: {
        db: { url: databaseUrl ?? '' },
      },
    });

    if (!databaseUrl) {
      console.warn(
        'Warning: DATABASE_URL is not defined in environment variables.',
      );
    }
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private logError(context: string, error: unknown): void {
    if (error instanceof Error) {
      console.error(`${context}:`, error.message, error.stack);
    } else {
      console.error(`${context}:`, error);
    }
  }

  async paginate<Where, Args>({
    page = 1,
    model,
    args,
    limit = 10,
    where,
  }: PrismaPaginationProps<Where, Args>): Promise<IPaginatedResponse> {
    const skip = (page - 1) * limit;

    try {
      const [items, count] = await Promise.all([
        model.findMany({
          ...args,
          where,
          skip: skip < 0 ? 0 : skip,
          take: limit === 0 ? undefined : limit,
        }),
        model.count({ where }),
      ]);

      return {
        items,
        meta: {
          currentPage: page,
          itemCount: items.length,
          itemsPerPage: limit,
          totalItems: count,
          totalPages: limit > 0 ? Math.ceil(count / limit) : 1,
        },
      };
    } catch (error: unknown) {
      this.logError('PrismaService.paginate error', error);
      throw error instanceof Error
        ? error
        : new Error('Unknown error in PrismaService.paginate');
    }
  }
}
