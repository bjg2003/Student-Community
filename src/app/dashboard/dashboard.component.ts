import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeAgoPipe } from '../pipes/time-ago.pipe';

interface Post {
  id: string;
  content: string;
  image?: string;
  imageAlt?: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
}

interface Friend {
  id: string;
  name: string;
  department: string;
  profilePic?: string;
}

interface EditForm {
  name: string;
  bio: string;
  department: string;
  batch: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TimeAgoPipe]
})
export class DashboardComponent implements OnInit {
  userProfilePic: string = '';
  userName: string = '';
  userEmail: string = '';
  userDepartment: string = '';
  userBatch: string = '';
  userBio: string = '';
  activeTab: 'posts' | 'about' | 'friends' = 'posts';
  isEditMode: boolean = false;
  userPosts: Post[] = [];
  userFriends: Friend[] = [];

  editForm: EditForm = {
    name: '',
    bio: '',
    department: '',
    batch: ''
  };

  constructor() {}

  ngOnInit(): void {
    // TODO: Fetch user data from service
    this.loadUserData();
    this.loadUserPosts();
    this.loadUserFriends();
  }

  loadUserData(): void {
    // TODO: Implement API call to fetch user data
    this.userName = 'John Doe';
    this.userEmail = 'john.doe@example.com';
    this.userDepartment = 'Computer Science';
    this.userBatch = '2023';
    this.userBio = 'Student at PCE';
  }

  loadUserPosts(): void {
    // TODO: Implement API call to fetch user posts
    this.userPosts = [
      {
        id: '1',
        content: 'Hello everyone!',
        timestamp: new Date(),
        likes: 5,
        isLiked: false,
        comments: []
      }
    ];
  }

  loadUserFriends(): void {
    // TODO: Implement API call to fetch user friends
    this.userFriends = [
      {
        id: '1',
        name: 'Jane Smith',
        department: 'Computer Science',
        profilePic: 'assets/default-avatar.png'
      }
    ];
  }

  onProfilePicChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // TODO: Implement file upload logic
      const reader = new FileReader();
      reader.onload = (e) => {
        this.userProfilePic = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.editForm = {
        name: this.userName,
        bio: this.userBio,
        department: this.userDepartment,
        batch: this.userBatch
      };
    }
  }

  saveProfile(): void {
    // TODO: Implement API call to save profile changes
    this.userName = this.editForm.name;
    this.userBio = this.editForm.bio;
    this.userDepartment = this.editForm.department;
    this.userBatch = this.editForm.batch;
    this.isEditMode = false;
  }

  cancelEdit(): void {
    this.isEditMode = false;
  }

  deletePost(postId: string): void {
    // TODO: Implement API call to delete post
    this.userPosts = this.userPosts.filter(post => post.id !== postId);
  }

  likePost(postId: string): void {
    // TODO: Implement API call to like/unlike post
    const post = this.userPosts.find(p => p.id === postId);
    if (post) {
      post.isLiked = !post.isLiked;
      post.likes += post.isLiked ? 1 : -1;
    }
  }
}