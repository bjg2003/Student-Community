import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClubContribution } from '../../models/club.model';
import { ClubsService } from '../../services/clubs.service';

@Component({
  selector: 'app-create-club',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="handleCloseModal()">
      <div class="bg-[#1E293B] rounded-lg w-full max-w-lg mx-4" (click)="$event.stopPropagation()">
        <div class="p-4 border-b border-gray-700">
          <h2 class="text-xl font-semibold">Create New Club</h2>
        </div>
        <div class="p-4">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium mb-1">Club Name</label>
            <input
              type="text"
              id="name"
              [(ngModel)]="club.name"
              class="w-full bg-[#0B1120] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter club name"
            />
          </div>
          
          <div class="mb-4">
            <label for="description" class="block text-sm font-medium mb-1">Description</label>
            <textarea
              id="description"
              [(ngModel)]="club.description"
              class="w-full bg-[#0B1120] text-white rounded-lg p-3 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your club's purpose and activities"
            ></textarea>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Club Logo</label>
            <div class="flex items-center space-x-4">
              <div *ngIf="logoPreview" class="relative w-16 h-16 rounded-lg overflow-hidden">
                <img [src]="logoPreview" alt="Club logo preview" class="w-full h-full object-cover" />
                <button
                  (click)="removeLogo()"
                  class="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 text-xs"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <label class="cursor-pointer text-blue-500 hover:text-blue-400">
                <i class="fas fa-upload mr-2"></i>
                {{ logoPreview ? 'Change Logo' : 'Upload Logo' }}
                <input
                  type="file"
                  class="hidden"
                  accept="image/*"
                  (change)="onLogoSelected($event)"
                />
              </label>
            </div>
          </div>
          
          <div class="mb-4">
            <label for="tags" class="block text-sm font-medium mb-1">Tags (comma separated)</label>
            <input
              type="text"
              id="tags"
              [(ngModel)]="tagsInput"
              class="w-full bg-[#0B1120] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. music, arts, technology"
            />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Social Links</label>
            <div class="space-y-3">
              <div class="flex items-center">
                <i class="fab fa-instagram text-pink-500 w-8"></i>
                <input
                  type="url"
                  [(ngModel)]="instagramLink"
                  class="flex-1 bg-[#0B1120] text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Instagram URL"
                />
              </div>
              <div class="flex items-center">
                <i class="fab fa-facebook text-blue-500 w-8"></i>
                <input
                  type="url"
                  [(ngModel)]="facebookLink"
                  class="flex-1 bg-[#0B1120] text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Facebook URL"
                />
              </div>
              <div class="flex items-center">
                <i class="fab fa-linkedin text-blue-600 w-8"></i>
                <input
                  type="url"
                  [(ngModel)]="linkedinLink"
                  class="flex-1 bg-[#0B1120] text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="LinkedIn URL"
                />
              </div>
            </div>
          </div>

          <div class="mt-6 flex items-center justify-end space-x-3">
            <button
              (click)="handleCloseModal()"
              class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              (click)="submitClub()"
              [disabled]="!isFormValid()"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Club
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CreateClubComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() clubCreated = new EventEmitter<void>();

  club: ClubContribution = {
    name: '',
    description: '',
    tags: [],
  };

  tagsInput: string = '';
  instagramLink: string = '';
  facebookLink: string = '';
  linkedinLink: string = '';
  logoPreview: string | null = null;

  constructor(private clubsService: ClubsService) {}

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.club.logo = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeLogo(): void {
    this.club.logo = undefined;
    this.logoPreview = null;
  }

  isFormValid(): boolean {
    return !!this.club.name && !!this.club.description;
  }

  submitClub(): void {
    // Process tags
    if (this.tagsInput.trim()) {
      this.club.tags = this.tagsInput
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
    }

    // Process social links
    this.club.socialLinks = {};
    if (this.instagramLink.trim()) {
      this.club.socialLinks.instagram = this.instagramLink.trim();
    }
    if (this.facebookLink.trim()) {
      this.club.socialLinks.facebook = this.facebookLink.trim();
    }
    if (this.linkedinLink.trim()) {
      this.club.socialLinks.linkedin = this.linkedinLink.trim();
    }

    // Submit to service
    this.clubsService.createClub(this.club).subscribe(() => {
      this.clubCreated.emit();
    });
  }

  handleCloseModal(): void {
    this.closeModal.emit();
  }
}