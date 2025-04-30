import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PollingService, Poll, PollOption } from '../services/polling.service';
import { CreatePollComponent } from '../components/create-poll/create-poll.component';


@Component({
  selector: 'app-polling',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule, CreatePollComponent],
  templateUrl: './polling.component.html',
  styleUrl: './polling.component.scss'
})
export class PollingComponent implements OnInit {
  polls: Poll[] = [];
  showCreatePoll = false;
  newPoll = {
    question: '',
    options: ['', '']
  };
  userProfilePic: string | null = null;
  userName: string | null = null;

  constructor(private pollingService: PollingService) {
    this.userName = 'Demo User';
    this.userProfilePic = 'https://ui-avatars.com/api/?name=Demo+User';
  }

  ngOnInit() {
    this.loadPolls();
  }

  private loadPolls() {
    this.pollingService.getPolls().subscribe(polls => {
      this.polls = polls;
    });
  }

  toggleCreatePoll() {
    this.showCreatePoll = !this.showCreatePoll;
    if (this.showCreatePoll) {
      this.newPoll = {
        question: '',
        options: ['', '']
      };
    }
  }

  onPollCreated() {
    // Poll has been created via the create-poll component
    // No need to do anything as the polling service will update the polls list
  }

  addOption() {
    if (this.newPoll.options.length < 10) {
      this.newPoll.options.push('');
    }
  }

  removeOption(index: number) {
    if (this.newPoll.options.length > 2) {
      this.newPoll.options.splice(index, 1);
    }
  }

  createPoll() {
    if (this.newPoll.question.trim() === '') {
      alert('Please enter a question');
      return;
    }

    const validOptions = this.newPoll.options.filter(option => option.trim() !== '');
    if (validOptions.length < 2) {
      alert('Please enter at least two options');
      return;
    }

    const newPollData = {
      question: this.newPoll.question,
      options: validOptions.map((text, index) => ({
        id: (index + 1).toString(),
        text,
        votes: 0
      })),
      createdBy: this.userName || 'Anonymous',
      createdByPic: this.userProfilePic || undefined
    };

    this.pollingService.createPoll(newPollData);
    this.toggleCreatePoll();
  }

  vote(pollId: string, optionId: string) {
    this.pollingService.vote(pollId, optionId);
  }

  calculatePercentage(votes: number, totalVotes: number): number {
    return this.pollingService.calculatePercentage(votes, totalVotes);
  }
}