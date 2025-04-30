import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResourceContribution, ResourceType } from '../../models/resource.model';
import { AcademicsService } from '../../services/academics.service';

@Component({
  selector: 'app-create-resource',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="handleCloseModal()">
      <div class="bg-[#1E293B] rounded-lg w-full max-w-lg mx-4" (click)="$event.stopPropagation()">
        <div class="p-4 border-b border-gray-700">
          <h2 class="text-xl font-semibold">Contribute a Resource</h2>
        </div>
        <div class="p-4">
          <div class="mb-4">
            <label for="title" class="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              id="title"
              [(ngModel)]="resource.title"
              class="w-full bg-[#0B1120] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Resource title"
            />
          </div>
          
          <div class="mb-4">
            <label for="description" class="block text-sm font-medium mb-1">Description</label>
            <textarea
              id="description"
              [(ngModel)]="resource.description"
              class="w-full bg-[#0B1120] text-white rounded-lg p-3 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe this resource"
            ></textarea>
          </div>
          
          <div class="mb-4">
            <label for="type" class="block text-sm font-medium mb-1">Resource Type</label>
            <select
              id="type"
              [(ngModel)]="resource.type"
              class="w-full bg-[#0B1120] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="book">Book</option>
              <option value="video">Video</option>
              <option value="link">Useful Link</option>
              <option value="software">Software & License</option>
            </select>
          </div>
          
          <div class="mb-4">
            <label for="url" class="block text-sm font-medium mb-1">Resource URL</label>
            <input
              type="url"
              id="url"
              [(ngModel)]="resource.url"
              class="w-full bg-[#0B1120] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/resource"
            />
          </div>
          
          <div class="mb-4">
            <label for="tags" class="block text-sm font-medium mb-1">Tags (comma separated)</label>
            <input
              type="text"
              id="tags"
              [(ngModel)]="tagsInput"
              class="w-full bg-[#0B1120] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. programming, computer science, algorithms"
            />
          </div>

          <div class="mt-6 flex items-center justify-end space-x-3">
            <button
              (click)="handleCloseModal()"
              class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              (click)="submitResource()"
              [disabled]="!isFormValid()"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Contribute
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CreateResourceComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() resourceCreated = new EventEmitter<void>();

  resource: ResourceContribution = {
    title: '',
    description: '',
    type: 'book' as ResourceType,
    url: '',
    tags: []
  };

  tagsInput = '';

  constructor(private academicsService: AcademicsService) {}

  isFormValid(): boolean {
    const hasValidTitle = this.resource.title.trim() !== '';
    const hasValidDescription = this.resource.description.trim() !== '';
    const hasValidUrl = !this.resource.url || this.resource.url.trim() !== '';
    
    return hasValidTitle && hasValidDescription && hasValidUrl;
  }

  submitResource() {
    if (!this.isFormValid()) return;

    // Process tags
    if (this.tagsInput.trim()) {
      this.resource.tags = this.tagsInput
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
    }

    this.academicsService.createResource(this.resource).subscribe(() => {
      this.resourceCreated.emit();
    });
  }

  handleCloseModal() {
    this.closeModal.emit();
  }
}