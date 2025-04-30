import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ClubsService } from '../services/clubs.service';
import { Club } from '../models/club.model';
import { CreateClubComponent } from '../components/create-club/create-club.component';

@Component({
  selector: 'app-clubs',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, CreateClubComponent],
  templateUrl: './clubs.component.html',
  styleUrls: ['./clubs.component.css']
})
export class ClubsComponent implements OnInit {
  clubs: Club[] = [];
  filteredClubs: Club[] = [];
  activeTag: string = 'all';
  searchQuery: string = '';
  showCreateClub = false;
  userProfilePic: string | null = 'https://ui-avatars.com/api/?name=Demo+User';

  constructor(private clubsService: ClubsService) {}

  ngOnInit(): void {
    this.loadClubs();
  }

  loadClubs(): void {
    this.clubsService.getClubs().subscribe((clubs) => {
      this.clubs = clubs;
      this.filterClubs(this.activeTag);
    });
  }

  filterClubs(tag: string): void {
    this.activeTag = tag;
    const filtered = tag === 'all'
      ? this.clubs
      : this.clubs.filter(club => club.tags?.includes(tag));
    
    // If search is already applied, combine with search
    if (this.searchQuery.trim()) {
      this.filteredClubs = filtered.filter(club =>
        club.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredClubs = [...filtered];
    }
  }

  searchClubs(query: string): void {
    this.searchQuery = query.trim();
    if (!query) {
      this.filterClubs(this.activeTag);
      return;
    }

    // First filter by tag, then apply search query
    const tagFiltered = this.activeTag === 'all' 
      ? this.clubs 
      : this.clubs.filter(club => club.tags?.includes(this.activeTag));
    
    // Apply search filter to the tag-filtered results
    this.filteredClubs = tagFiltered.filter(club =>
      club.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      club.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      (club.tags && club.tags.some(tag => tag.toLowerCase().includes(this.searchQuery.toLowerCase())))
    );
  }

  openCreateClubModal(): void {
    this.showCreateClub = true;
  }

  closeCreateClubModal(): void {
    this.showCreateClub = false;
  }

  handleClubCreated(): void {
    this.loadClubs();
    this.closeCreateClubModal();
  }

  getAllTags(): string[] {
    const tagSet = new Set<string>();
    this.clubs.forEach(club => {
      club.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }

  // For performance in *ngFor
  trackByTag(index: number, tag: string): string {
    return tag;
  }

  trackByClubId(index: number, club: Club): string {
    return club.id ?? club.name; // Prefer unique `id`, fallback to `name`
  }
}
