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
    id: 'c9',
    name: 'Safal Kunwar',
    age: 24,
    gender: 'Male',
    bio: "Passionate about trekking, mountain biking, and exploring the hidden gems of Pokhara. I can be your ultimate guide to the whatever your destination.",
    hourlyRate: 22,
    rating: 5.0,
    reviewsCount: 156,
    isVerified: true,
    location: 'Pokhara',
    languages: ['English', 'Nepali'],
    interests: ['Trekking', 'Outdoors', 'Coffee'],
    imageUrl: 'https://scontent.fpkr1-1.fna.fbcdn.net/v/t39.30808-6/595309955_1537495447400950_8564751214332148172_n.jpg?stp=cp6_dst-jpg_tt6&cstp=mx2047x2048&ctp=s2047x2048&_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=TCK1vGdFKesQ7kNvwF_Nyib&_nc_oc=AdoaUc0g_ShpzbyRzyNX68Ga807gHs0sd0FKYxg0PmWrR2vr38u-NUhjzIlZz_pplSs&_nc_zt=23&_nc_ht=scontent.fpkr1-1.fna&_nc_gid=lM9nFhFMb_KRw4UV9epiPQ&_nc_ss=7b2a8&oh=00_AQCX1zqDZPuWJqLO5hjsuoseeJXUWpTMAq2M-h62CzO6Rw&oe=6A56363B&auto=format&fit=crop',
    images: [
      'https://scontent.fpkr1-1.fna.fbcdn.net/v/t39.30808-6/595309955_1537495447400950_8564751214332148172_n.jpg?stp=cp6_dst-jpg_tt6&cstp=mx2047x2048&ctp=s2047x2048&_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=TCK1vGdFKesQ7kNvwF_Nyib&_nc_oc=AdoaUc0g_ShpzbyRzyNX68Ga807gHs0sd0FKYxg0PmWrR2vr38u-NUhjzIlZz_pplSs&_nc_zt=23&_nc_ht=scontent.fpkr1-1.fna&_nc_gid=lM9nFhFMb_KRw4UV9epiPQ&_nc_ss=7b2a8&oh=00_AQCX1zqDZPuWJqLO5hjsuoseeJXUWpTMAq2M-h62CzO6Rw&oe=6A56363B&auto=format&fit=crop'
    ]
  },
  {
    id: 'c2',
    name: 'Priya Gurung',
    age: 24,
    gender: 'Female',
    bio: "Tech enthusiast by day, foodie by night! Let's explore Patan's best cafes, share tech stories, or just enjoy a good cup of chiya. Great for digital nomads seeking local connections.",
    hourlyRate: 18,
    rating: 4.8,
    reviewsCount: 89,
    isVerified: true,
    location: 'Patan',
    languages: ['English', 'Nepali', 'Hindi'],
    interests: ['Coffee', 'Tech', 'Food'],
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop'
    ],
  },
  {
    id: 'c3',
    name: 'Rajan Shrestha',
    age: 28,
    gender: 'Male',
    bio: 'Fitness enthusiast and language learner. Need a workout buddy, someone to practice Nepali with, or just want to explore the Shivapuri hills? Im your guy! Fun, energetic, and always positive.',
    hourlyRate: 20,
    rating: 5.0,
    reviewsCount: 204,
    isVerified: true,
    location: 'Kathmandu',
    languages: ['English', 'Nepali', 'Newari'],
    interests: ['Fitness', 'Language', 'Outdoors'],
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop'
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
    name: 'Nima Sherpa',
    age: 27,
    gender: 'Male',
    bio: "Mountaineer and outdoor enthusiast. If you're looking for someone to guide you on short hikes around the Kathmandu valley or just grab a local beer and talk about Everest, I'm your guy!",
    hourlyRate: 16,
    rating: 4.9,
    reviewsCount: 112,
    isVerified: true,
    location: 'Nagarkot',
    languages: ['English', 'Nepali', 'Sherpa'],
    interests: ['Hiking', 'Mountains', 'Local Culture'],
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop'
    ]
  },
  {
    id: 'c6',
    name: 'Anjali Chhetri',
    age: 23,
    gender: 'Female',
    bio: "I love exploring local markets, fashion, and traditional crafts. Need a shopping companion to navigate Thamel or Asan, or someone to find the best pashmina? Let's spend a lovely afternoon together.",
    hourlyRate: 15,
    rating: 4.9,
    reviewsCount: 78,
    isVerified: true,
    location: 'Kathmandu',
    languages: ['Nepali', 'English'],
    interests: ['Shopping', 'Crafts', 'Fashion'],
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
    bio: "An expat photographer who fell in love with Nepal. I know all the best sunrise photo spots in Chitwan. I can be your guide and take amazing photos of your jungle safari.",
    hourlyRate: 25,
    rating: 5.0,
    reviewsCount: 340,
    isVerified: true,
    location: 'Chitwan',
    languages: ['Japanese', 'English', 'Basic Nepali'],
    interests: ['Photography', 'Wildlife', 'Culture'],
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
    bio: "Digital nomad and avid reader living in Pokhara. I enjoy deep conversations about business, philosophy, and books by the lake. Let's grab coffee and chat, or hike to the Peace Pagoda together.",
    hourlyRate: 30,
    rating: 4.8,
    reviewsCount: 45,
    isVerified: true,
    location: 'Pokhara',
    languages: ['English'],
    interests: ['Business', 'Reading', 'Coffee'],
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop'
    ]
  }
];
