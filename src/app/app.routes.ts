import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { PollingComponent } from './polling/polling.component';
import { EventsComponent } from './events/events.component';
import { AcademicsComponent } from './academics/academics.component';
import { ClubsComponent } from './clubs/clubs.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'profile', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'polling', component: PollingComponent, canActivate: [authGuard] },
  { path: 'events', component: EventsComponent, canActivate: [authGuard] },
  { path: 'academics', component: AcademicsComponent, canActivate: [authGuard] },
  { path: 'clubs', component: ClubsComponent, canActivate: [authGuard] }
];
