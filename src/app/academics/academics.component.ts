import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AcademicsService } from '../services/academics.service';
import { Resource, ResourceType } from '../models/resource.model';
import { CreateResourceComponent } from '../components/create-resource/create-resource.component';

@Component({
  selector: 'app-academics',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, CreateResourceComponent],
  templateUrl: './academics.component.html',
  styleUrl: './academics.component.scss'
})
export class AcademicsComponent implements OnInit {
  resources: Resource[] = [];
  filteredResources: Resource[] = [];
  activeResourceType: ResourceType | 'all' = 'all';
  showCreateResource = false;
  isSidebarCollapsed = false;
  userProfilePic: string | null = 'https://ui-avatars.com/api/?name=Demo+User';

  constructor(private academicsService: AcademicsService) {}

  ngOnInit() {
    this.loadResources();
  }

  loadResources() {
    this.academicsService.getResources().subscribe(resources => {
      this.resources = resources;
      this.filterResources(this.activeResourceType);
    });
  }

  filterResources(type: ResourceType | 'all') {
    this.activeResourceType = type;
    if (type === 'all') {
      this.filteredResources = [...this.resources];
    } else {
      this.filteredResources = this.resources.filter(resource => resource.type === type);
    }
  }

  openCreateResourceModal() {
    this.showCreateResource = true;
  }

  closeCreateResourceModal() {
    this.showCreateResource = false;
  }

  handleResourceCreated() {
    this.loadResources();
    this.closeCreateResourceModal();
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}