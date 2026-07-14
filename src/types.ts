export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'guest' | 'customer' | 'companion' | 'admin';
  favorites: string[]; // Companion IDs
  claims?: Record<string, unknown>;
}

export interface Review {
  id: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  text: string;
  date: string;
}

export interface ExperienceStory {
  id: string;
  companionId?: string;
  companionName: string;
  userName: string;
  userAvatar?: string;
  imageUrl: string;
  timeAgo: string;
  caption: string;
  userId?: string;
  likes?: number;
  comments?: number;
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
  coordinates?: { latitude: number; longitude: number };
  languages: string[];
  interests: string[];
  imageUrl: string;
  images?: string[];
  reviews?: Review[];
  availableDays?: string[]; // e.g. ['Monday', 'Tuesday']
  responseRate?: number;
  responseTime?: string;
  completedBookings?: number;
  trustScore?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  id: string;
  companionId: string;
  userId: string;
  date: string;
  time: string;
  duration: number; // hours
  participants: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  totalPrice: number;
  meetingPoint: string;
  specialRequests?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[]; // [userId, companionId]
  lastMessage?: Message;
  unreadCount: number;
}

export interface Activity {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  image?: string;
  duration: string;
  avgPrice: number;
  companionCount: number;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Event {
  id: string;
  date: string;
  time: string;
  title: string;
  description?: string;
  location: string;
  spots: number;
  participants?: number | { length: number };
  coordinates?: { latitude: number; longitude: number };
  imageUrl?: string;
  createdBy?: string;
  createdAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'message' | 'system';
  isRead: boolean;
  timestamp: string;
  link?: string;
}
