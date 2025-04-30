import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

interface Event {
  id: string;
  name: string;
  organizer: string;
  startDate: Date;
  endDate?: Date;
  venue: string;
  time: string;
  registrationDeadline: Date;
  attendees: number;
  description?: string;
  image?: string;
}

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  showAddEventForm = false;
  newEvent: Event = {
    id: '',
    name: '',
    organizer: '',
    startDate: new Date(),
    venue: '',
    time: '',
    registrationDeadline: new Date(),
    attendees: 0
  };

  ngOnInit(): void {
    // Mock data - in a real app, this would come from a service
    this.events = [
      {
        id: '1',
        name: 'Raaga',
        organizer: 'Music Club',
        startDate: new Date('2021-10-31'),
        endDate: new Date('2021-11-01'),
        venue: 'Online',
        time: '11 PM',
        registrationDeadline: new Date('2021-10-31T23:17:00'),
        attendees: 8,
        image: 'assets/raaga-event.jpg'
      }
    ];
  }

  toggleAddEventForm(): void {
    this.showAddEventForm = !this.showAddEventForm;
    if (this.showAddEventForm) {
      // Reset form
      this.newEvent = {
        id: '',
        name: '',
        organizer: '',
        startDate: new Date(),
        venue: '',
        time: '',
        registrationDeadline: new Date(),
        attendees: 0
      };
    }
  }

  addEvent(): void {
    if (this.validateEvent()) {
      // Generate a unique ID (in a real app, this would be handled by the backend)
      this.newEvent.id = Date.now().toString();
      this.newEvent.attendees = 0; // Initialize attendees count
      
      // Add the new event to the events array
      this.events.push({...this.newEvent});
      
      // Close the form
      this.toggleAddEventForm();
    }
  }

  validateEvent(): boolean {
    // Basic validation
    return !!this.newEvent.name && 
           !!this.newEvent.organizer && 
           !!this.newEvent.venue && 
           !!this.newEvent.time;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  }

  attendEvent(eventId: string): void {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      event.attendees++;
    }
  }
}
