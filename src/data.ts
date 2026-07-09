import { Companion, ExperienceStory } from './types';

export const STORIES: ExperienceStory[] = [
  {
    id: "s1",
    companionName: "Aarav Thapa",
    userName: "Emma",
    userAvatar: "https://ui-avatars.com/api/?name=Emma&background=random",
    imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop",
    timeAgo: "2h ago",
    caption: "Amazing momo tasting tour!"
  },
  {
    id: "s2",
    companionName: "Priya Gurung",
    userName: "Raj",
    userAvatar: "https://ui-avatars.com/api/?name=Raj&background=random",
    imageUrl: "https://images.unsplash.com/photo-1510425463958-dcced28da480?q=80&w=800&auto=format&fit=crop",
    timeAgo: "4h ago",
    caption: "Swayambhunath was breathtaking at sunset."
  },
  {
    id: "s3",
    companionName: "Sita Maharjan",
    userName: "Chloe",
    userAvatar: "https://ui-avatars.com/api/?name=Chloe&background=random",
    imageUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=800&auto=format&fit=crop",
    timeAgo: "6h ago",
    caption: "Patan Durbar Square is so rich in history."
  },
  {
    id: "s4",
    companionName: "Tenzing Sherpa",
    userName: "Liam",
    userAvatar: "https://ui-avatars.com/api/?name=Liam&background=random",
    imageUrl: "https://images.unsplash.com/photo-1511216113906-8f56bb20925c?q=80&w=800&auto=format&fit=crop",
    timeAgo: "1d ago",
    caption: "A great boat ride on Phewa lake."
  },
  {
    id: "s5",
    companionName: "David Kim",
    userName: "Sophia",
    userAvatar: "https://ui-avatars.com/api/?name=Sophia&background=random",
    imageUrl: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=800&auto=format&fit=crop",
    timeAgo: "2d ago",
    caption: "Coffee tasting and great conversations."
  }
];

export const COMPANIONS: Companion[] = [
  {
    id: 'c1',
    name: 'Aarav Thapa',
    age: 26,
    gender: 'Male',
    bio: 'Born and raised in Kathmandu. I love showcasing the hidden courtyards, local cafes, and the rich history of Durbar Square. Perfect for those who want an authentic, non-touristy experience.',
    hourlyRate: 15,
    rating: 4.9,
    reviewsCount: 124,
    isVerified: true,
    location: 'Kathmandu',
    languages: ['English', 'Nepali', 'Hindi'],
    interests: ['History', 'Photography', 'Local Food'],
    imageUrl: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?q=80&w=800&auto=format&fit=crop'
    ],
    reviews: []
  },
  {
    id: 'c2',
    name: 'Emma Chen',
    age: 24,
    gender: 'Female',
    bio: "Software engineer by day, foodie by night! Let's explore the city's best cafes, share coding stories, or just enjoy a good cup of matcha. Great for digital nomads seeking local connections.",
    hourlyRate: 18,
    rating: 4.8,
    reviewsCount: 89,
    isVerified: true,
    location: 'San Francisco',
    languages: ['English', 'Mandarin'],
    interests: ['Coffee', 'Tech', 'Food'],
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop'
    ],
  },
  {
    id: 'c3',
    name: 'Marcus Johnson',
    age: 28,
    gender: 'Male',
    bio: 'Fitness enthusiast and language learner. Need a workout buddy, someone to practice Spanish with, or just want to explore the local parks? Im your guy! Fun, energetic, and always positive.',
    hourlyRate: 20,
    rating: 5.0,
    reviewsCount: 204,
    isVerified: true,
    location: 'Austin, TX',
    languages: ['English', 'Spanish'],
    interests: ['Fitness', 'Language', 'Outdoors'],
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop'
    ],
  },
  {
    id: 'c4',
    name: 'Sita Maharjan',
    age: 25,
    gender: 'Female',
    bio: "Art student with a deep love for architecture and pottery. Join me for a guided walking tour through ancient alleys, artisan workshops, and art galleries. Perfect for creative minds.",
    hourlyRate: 14,
    rating: 4.7,
    reviewsCount: 56,
    isVerified: true,
    location: 'Bhaktapur',
    languages: ['English', 'Nepali', 'Newari'],
    interests: ['Art', 'History', 'Pottery'],
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop'
    ],
  },
  {
    id: 'c5',
    name: 'Julian Silva',
    age: 27,
    gender: 'Male',
    bio: "Musician and avid gamer. Whether you need a plus-one to a concert, a co-op gaming partner, or someone to chat about music production over drinks, I'm down!",
    hourlyRate: 16,
    rating: 4.9,
    reviewsCount: 112,
    isVerified: true,
    location: 'Berlin',
    languages: ['English', 'German', 'Portuguese'],
    interests: ['Music', 'Gaming', 'Nightlife'],
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop'
    ]
  },
  {
    id: 'c6',
    name: 'Nina Rossi',
    age: 23,
    gender: 'Female',
    bio: "I love animals and fashion! Need a shopping companion who gives honest advice, or someone to join you and your dog at the park? Let's spend a lovely afternoon together.",
    hourlyRate: 15,
    rating: 4.9,
    reviewsCount: 78,
    isVerified: true,
    location: 'Milan',
    languages: ['Italian', 'English'],
    interests: ['Shopping', 'Pets', 'Fashion'],
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop'
    ]
  },
  {
    id: 'c7',
    name: 'Yuki Tanaka',
    age: 29,
    gender: 'Female',
    bio: "Professional photographer who knows all the best photo spots in the city. I can be your local guide and take amazing photos of you for your social media or memories.",
    hourlyRate: 25,
    rating: 5.0,
    reviewsCount: 340,
    isVerified: true,
    location: 'Tokyo',
    languages: ['Japanese', 'English'],
    interests: ['Photography', 'City Walks', 'Culture'],
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop'
    ]
  },
  {
    id: 'c8',
    name: 'Alex Mercer',
    age: 31,
    gender: 'Male',
    bio: "Entrepreneur and avid reader. I enjoy deep conversations about business, philosophy, and books. Let's grab coffee and chat, or hit up a local networking event together.",
    hourlyRate: 30,
    rating: 4.8,
    reviewsCount: 45,
    isVerified: true,
    location: 'London',
    languages: ['English'],
    interests: ['Business', 'Reading', 'Coffee'],
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop'
    ]
  }
];
