import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PollModule } from './modules/poll/poll.module';
import { PrismaService } from './modules/prisma/prisma.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    PollModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
