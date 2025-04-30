import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Club, ClubContribution } from '../models/club.model';

@Injectable({
  providedIn: 'root'
})
export class ClubsService {
  private clubsSubject = new BehaviorSubject<Club[]>([]);
  private clubs: Club[] = [];

  constructor() {
    this.initializeClubs();
  }

  private initializeClubs() {
    const mockClubs: Club[] = [
      {
        id: '1',
        name: 'The Music Club',
        description: 'A vibrant community of music enthusiasts who come together to create, perform, and appreciate music in all its forms.',
        logo: 'assets/images/music-club-logo.svg',
        coverImage: 'assets/images/music-club-cover.svg',
        president: 'John Smith',
        presidentId: 'john-smith',
        presidentPic: 'https://ui-avatars.com/api/?name=John+Smith',
        members: 50,
        tags: ['music', 'performance', 'arts'],
        socialLinks: {
          instagram: 'https://instagram.com/daiict_music',
          facebook: 'https://facebook.com/daiict.music'
        },
        upcomingEvents: [
          {
            id: '1',
            title: 'Annual Music Festival',
            description: 'A celebration of music featuring performances from our talented members',
            date: new Date(new Date().setDate(new Date().getDate() + 15)),
            venue: 'College Auditorium',
            registrationLink: 'https://example.com/register'
          }
        ]
      },
      {
        id: '2',
        name: 'Dance Club',
        description: 'Express yourself through dance! Join us to learn various dance forms and participate in exciting performances.',
        logo: 'assets/images/dance-club-logo.svg',
        president: 'Emily Davis',
        presidentId: 'emily-davis',
        presidentPic: 'https://ui-avatars.com/api/?name=Emily+Davis',
        members: 35,
        tags: ['dance', 'performance', 'arts'],
        socialLinks: {
          instagram: 'https://instagram.com/daiict_dance'
        }
      }
    ];
    
    this.clubs = mockClubs;
    this.clubsSubject.next(mockClubs);
  }

  getClubs(): Observable<Club[]> {
    return this.clubsSubject.asObservable();
  }

  getClubById(id: string): Observable<Club | undefined> {
    return this.clubsSubject.pipe(
      map(clubs => clubs.find(club => club.id === id))
    );
  }

  createClub(clubData: ClubContribution, userId: string = 'demo-user', userName: string = 'Demo User'): Observable<Club> {
    const newClub: Club = {
      id: (this.clubs.length + 1).toString(),
      name: clubData.name,
      description: clubData.description,
      logo: clubData.logo ? URL.createObjectURL(clubData.logo) : 'assets/images/default-club-logo.svg',
      coverImage: clubData.coverImage ? URL.createObjectURL(clubData.coverImage) : undefined,
      president: userName,
      presidentId: userId,
      presidentPic: `https://ui-avatars.com/api/?name=${userName.replace(' ', '+')}`,
      members: 1,
      tags: clubData.tags || [],
      socialLinks: clubData.socialLinks
    };

    return of(newClub).pipe(
      delay(500),
      map(club => {
        this.clubs.unshift(club);
        this.clubsSubject.next([...this.clubs]);
        return club;
      })
    );
  }

  searchClubs(query: string): Observable<Club[]> {
    const searchResults = this.clubs.filter(club => 
      club.name.toLowerCase().includes(query.toLowerCase()) ||
      club.description.toLowerCase().includes(query.toLowerCase()) ||
      (club.tags && club.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
    );
    return of(searchResults);
  }
}