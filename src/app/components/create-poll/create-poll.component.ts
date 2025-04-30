import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PollingService } from '../../services/polling.service';

@Component({
  selector: 'app-create-poll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-poll.component.html',
  styleUrl: './create-poll.component.scss'
})
export class CreatePollComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() pollCreated = new EventEmitter<void>();

  newPoll = {
    question: '',
    options: ['', '']
  };

  userProfilePic: string | null = 'https://ui-avatars.com/api/?name=Demo+User';
  userName: string | null = 'Demo User';

  constructor(private pollingService: PollingService) {}

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
    this.pollCreated.emit();
    this.closeModal.emit();
  }

  cancel() {
    this.closeModal.emit();
  }
}