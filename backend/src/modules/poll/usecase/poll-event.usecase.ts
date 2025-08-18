import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class PollEventsUseCase {
  private voteSubject = new Subject<VoteEvent>();
  private pollUpdateSubject = new Subject<PollUpdateEvent>();

  emitVote(payload: VoteEvent) {
    this.voteSubject.next(payload);
  }

  emitPollUpdate(payload: PollUpdateEvent) {
    this.pollUpdateSubject.next(payload);
  }

  getVoteStream(): Observable<VoteEvent> {
    return this.voteSubject.asObservable();
  }

  getPollUpdateStream(): Observable<PollUpdateEvent> {
    return this.pollUpdateSubject.asObservable();
  }

  getAllEvents(): Observable<VoteEvent | PollUpdateEvent> {
    return new Observable(observer => {
      const voteSubscription = this.voteSubject.subscribe(observer);
      const pollUpdateSubscription = this.pollUpdateSubject.subscribe(observer);
      
      return () => {
        voteSubscription.unsubscribe();
        pollUpdateSubscription.unsubscribe();
      };
    });
  }
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
  poll: {
    id: string;
    title: string;
    description?: string;
    createdAt: Date;
    isActive: boolean;
    ttlInMs: number;
    totalVotes: number;
    options: {
      id: string;
      text: string;
      votes: number;
    }[];
    userVote: string | null;
  };
}
