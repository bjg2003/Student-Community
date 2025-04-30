import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Resource, ResourceType, ResourceContribution } from '../models/resource.model';

@Injectable({
  providedIn: 'root'
})
export class AcademicsService {
  private resourcesSubject = new BehaviorSubject<Resource[]>([]);
  private resources: Resource[] = [];

  constructor() {
    this.initializeResources();
  }

  private initializeResources() {
    const mockResources: Resource[] = [
      {
        id: '1',
        title: 'Introduction to Angular',
        description: 'A comprehensive guide to Angular framework',
        type: 'book',
        url: 'https://example.com/angular-guide.pdf',
        uploadedBy: 'Demo User',
        uploadedById: 'demo-user',
        uploadedByPic: 'https://ui-avatars.com/api/?name=Demo+User',
        uploadedAt: new Date(),
        tags: ['angular', 'programming', 'web development']
      },
      {
        id: '2',
        title: 'Web Development Tutorial',
        description: 'Video tutorial series on modern web development',
        type: 'video',
        url: 'https://example.com/web-dev-tutorial',
        uploadedBy: 'John Doe',
        uploadedById: 'john-doe',
        uploadedByPic: 'https://ui-avatars.com/api/?name=John+Doe',
        uploadedAt: new Date(new Date().setDate(new Date().getDate() - 2)),
        tags: ['web development', 'tutorial']
      }
    ];
    
    this.resources = mockResources;
    this.resourcesSubject.next(mockResources);
  }

  private determineResourceType(fileName: string): ResourceType {
    const ext = fileName.toLowerCase().split('.').pop();
    if (['pdf', 'doc', 'docx', 'txt'].includes(ext || '')) return 'book';
    if (['mp4', 'avi', 'mov', 'webm'].includes(ext || '')) return 'video';
    if (['exe', 'dmg', 'zip', 'rar'].includes(ext || '')) return 'software';
    return 'link';
  }

  getResources(): Observable<Resource[]> {
    return this.resourcesSubject.asObservable();
  }

  getResourcesByType(type: ResourceType): Observable<Resource[]> {
    return this.resourcesSubject.pipe(
      map(resources => resources.filter(resource => resource.type === type))
    );
  }

  createResource(resourceData: ResourceContribution, userId: string = 'demo-user', userName: string = 'Demo User'): Observable<Resource> {
    const newResource: Resource = {
      id: (this.resources.length + 1).toString(),
      title: resourceData.title,
      description: resourceData.description,
      type: this.determineResourceType(resourceData.title),
      url: resourceData.file ? URL.createObjectURL(resourceData.file) : '#',
      uploadedBy: userName,
      uploadedById: userId,
      uploadedByPic: `https://ui-avatars.com/api/?name=${userName.replace(' ', '+')}`,
      uploadedAt: new Date(),
      tags: []
    };

    return of(newResource).pipe(
      delay(500),
      map(resource => {
        this.resources.unshift(resource);
        this.resourcesSubject.next([...this.resources]);
        return resource;
      })
    );
  }

  searchResources(query: string): Observable<Resource[]> {
    const searchResults = this.resources.filter(resource => 
      resource.title.toLowerCase().includes(query.toLowerCase()) ||
      resource.description.toLowerCase().includes(query.toLowerCase()) ||
      (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
    );
    return of(searchResults);
  }
}