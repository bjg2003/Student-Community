import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
// import { auth } from '../core/firebase.config';
// import { environment } from '../../environments/environment';
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
// import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  studentId: string;
  branch: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  profilePic?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    // Check if window is defined (client-side) before accessing localStorage
    if (typeof window !== 'undefined') {
      // Check if user is already logged in from localStorage
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        this.currentUserSubject.next(userData);
        this.isAuthenticatedSubject.next(true);
      }
    }
  }

  signup(userData: {
    fullName: string;
    email: string;
    password: string;
    studentId: string;
    branch: string;
  }): Observable<User> {
    // Mock signup implementation
    const mockUser: User = {
      id: crypto.randomUUID(),
      fullName: userData.fullName,
      email: userData.email,
      role: 'STUDENT',
      studentId: userData.studentId,
      branch: userData.branch,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    };

    return of(mockUser).pipe(
      delay(1000),
      tap(user => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  login(email: string, password: string): Observable<User> {
    // Check for demo user credentials
    if (email === 'demo@pce.edu' && password === 'password123') {
      const mockUser: User = {
        id: crypto.randomUUID(),
        fullName: 'Demo User',
        email: email,
        role: 'STUDENT',
        studentId: 'ST001',
        branch: 'Computer Science',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        profilePic: 'assets/default-avatar.png'
      };

      return of(mockUser).pipe(
        delay(1000),
        tap(user => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        })
      );
    }

    // Return error for invalid credentials
    return new Observable(subscriber => {
      subscriber.error('Invalid credentials');
    });
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}