export interface Review {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  date: string;
}

export interface ExperienceStory {
  id: string;
  companionName: string;
  userName: string;
  userAvatar: string;
  imageUrl: string;
  timeAgo: string;
  caption: string;
}

export interface Companion {
  id: string;
  name: string;
  age: number;
  gender: string;
  bio: string;
  hourlyRate: number;
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  location: string;
  languages: string[];
  interests: string[];
  imageUrl: string;
  images?: string[];
  reviews?: Review[];
}

export interface Booking {
  id: string;
  companionId: string;
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed';
  totalPrice: number;
  meetingPoint: string;
  paymentMethod?: 'esewa' | 'khalti';
}
