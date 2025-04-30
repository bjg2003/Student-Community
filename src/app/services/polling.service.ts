import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  createdBy: string;
  createdByPic?: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PollingService {
  private polls: Poll[] = [];
  private pollsSubject = new BehaviorSubject<Poll[]>([]);

  constructor() {
    this.initializePolls();
  }

  private initializePolls() {
    // Initialize with some demo polls
    this.polls = [
      {
        id: '1',
        question: 'Is this portal any good?',
        options: [
          { id: '1', text: 'No', votes: 1 },
          { id: '2', text: 'Yes', votes: 1 },
          { id: '3', text: 'Maybe', votes: 0 }
        ],
        totalVotes: 2,
        createdBy: 'default18',
        createdByPic: 'https://ui-avatars.com/api/?name=Default+User',
        createdAt: new Date()
      },
      {
        id: '2',
        question: 'How many days of Diwali vacation should be given?',
        options: [
          { id: '1', text: '3 days only', votes: 2 },
          { id: '2', text: '5 days', votes: 10 },
          { id: '3', text: '7 days', votes: 15 },
          { id: '4', text: '10 days', votes: 4 }
        ],
        totalVotes: 31,
        createdBy: 'demo-user',
        createdByPic: 'https://ui-avatars.com/api/?name=Demo+User',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 2))
      }
    ];
    this.pollsSubject.next([...this.polls]);
  }

  getPolls(): Observable<Poll[]> {
    return this.pollsSubject.asObservable();
  }

  createPoll(poll: Omit<Poll, 'id' | 'totalVotes' | 'createdAt'>): void {
    const newPoll: Poll = {
      id: (this.polls.length + 1).toString(),
      ...poll,
      totalVotes: 0,
      createdAt: new Date()
    };

    this.polls.unshift(newPoll);
    this.pollsSubject.next([...this.polls]);
  }

  vote(pollId: string, optionId: string): void {
    const pollIndex = this.polls.findIndex(p => p.id === pollId);
    if (pollIndex !== -1) {
      const poll = this.polls[pollIndex];
      const optionIndex = poll.options.findIndex(o => o.id === optionId);
      
      if (optionIndex !== -1) {
        poll.options[optionIndex].votes++;
        poll.totalVotes++;
        this.polls[pollIndex] = { ...poll };
        this.pollsSubject.next([...this.polls]);
      }
    }
  }

  calculatePercentage(votes: number, totalVotes: number): number {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  }
}