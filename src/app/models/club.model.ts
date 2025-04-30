export interface Club {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage?: string;
  president: string;
  presidentId: string;
  presidentPic: string;
  members: number;
  tags: string[];
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
  upcomingEvents?: ClubEvent[];
}

export interface ClubEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  venue: string;
  registrationLink?: string;
}

export interface ClubContribution {
  name: string;
  description: string;
  logo?: File;
  coverImage?: File;
  tags: string[];
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
}