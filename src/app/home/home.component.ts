import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CreatePostComponent } from '../components/create-post/create-post.component';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date): string {
    if (!value) return '';

    const now = new Date();
    const seconds = Math.floor((now.getTime() - value.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  }
}

export interface Post {
  id: string;
  authorName: string;
  authorPic?: string;
  content: string;
  image?: string;
  imageAlt?: string;
  timestamp: Date;
  likes: number;
  isLiked?: boolean;
  comments: Comment[];
  authorId: string;
}

interface Comment {
  id: string;
  authorName: string;
  content: string;
  timestamp: Date;
}

interface Event {
  date: Date;
  title: string;
  time: string;
}

interface Suggestion {
  id: string;
  name: string;
  profilePic?: string;
  department: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TimeAgoPipe, CreatePostComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  userProfilePic: string | null = null;
  userName: string | null = null;
  userEmail: string | null = null;
  showCreatePost = false;
  posts: Post[] = [];
  upcomingEvents: Event[] = [];
  suggestions: Suggestion[] = [];
  isSidebarCollapsed: boolean = false;

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  constructor(private router: Router) {
    this.userName = 'Demo User';
    this.userProfilePic = 'https://ui-avatars.com/api/?name=Demo+User';
  }

  ngOnInit() {
    this.loadPosts();
  }

  private loadPosts() {
    // Initialize with some demo posts
    this.posts = [
      {
        id: '1',
        authorName: 'Demo User',
        authorPic: 'https://ui-avatars.com/api/?name=Demo+User',
        content: 'Welcome to our student community!',
        timestamp: new Date(),
        likes: 5,
        comments: [],
        authorId: 'demo-user'
      }
    ];
  }

  onPostCreated(newPost: Omit<Post, 'id'>) {
    const post: Post = {
      id: (this.posts.length + 1).toString(),
      ...newPost,
      comments: [],
      authorId: 'demo-user'
    };
    this.posts.unshift(post);
  }

  likePost(postId: string): void {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.isLiked = !post.isLiked;
      post.likes += post.isLiked ? 1 : -1;
    }
  }

  toggleComments(postId: string): void {
    // Implement comments toggle logic
  }

  sharePost(postId: string): void {
    // Implement share functionality
  }

  connect(userId: string): void {
    // Implement connection functionality
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}