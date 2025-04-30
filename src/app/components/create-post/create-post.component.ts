import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post } from '../../home/home.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="handleCloseModal()">
      <div class="bg-[#1E293B] rounded-lg w-full max-w-lg mx-4" (click)="$event.stopPropagation()">
        <div class="p-4 border-b border-gray-700">
          <h2 class="text-xl font-semibold">Create Post</h2>
        </div>
        <div class="p-4">
          <textarea
            [(ngModel)]="postContent"
            placeholder="What's on your mind?"
            class="w-full bg-[#0B1120] text-white rounded-lg p-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          
          <div *ngIf="selectedImage" class="mt-4 relative">
            <img [src]="imagePreview" alt="Selected image" class="max-h-64 rounded-lg mx-auto" />
            <button
              (click)="removeImage()"
              class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="mt-4 flex items-center justify-between">
            <label class="cursor-pointer text-blue-500 hover:text-blue-400">
              <i class="fas fa-image mr-2"></i>
              Add Image
              <input
                type="file"
                class="hidden"
                accept="image/*"
                (change)="onImageSelected($event)"
              />
            </label>
            <div class="space-x-3">
              <button
                (click)="handleCloseModal()"
                class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                (click)="createPost()"
                [disabled]="!postContent.trim() && !selectedImage"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CreatePostComponent {
  postContent = '';
  selectedImage: File | null = null;
  imagePreview: string | undefined;

  @Output() closeModal = new EventEmitter<void>();
  @Output() postCreated = new EventEmitter<Omit<Post, 'id'>>();

  constructor(private router: Router) {}

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedImage = null;
    this.imagePreview = undefined;
  }

  createPost() {
    if (!this.postContent.trim() && !this.selectedImage) return;

    const newPost: Omit<Post, 'id'> = {
      content: this.postContent,
      image: this.imagePreview,
      timestamp: new Date(),
      authorName: 'Demo User',
      authorPic: 'https://ui-avatars.com/api/?name=Demo+User',
      likes: 0,
      comments: [],
      authorId: 'demo-user'
    };

    this.postCreated.emit(newPost);
    this.handleCloseModal();
  }

  handleCloseModal() {
    this.closeModal.emit();
    // Remove unnecessary navigation that may be causing issues
  }
}