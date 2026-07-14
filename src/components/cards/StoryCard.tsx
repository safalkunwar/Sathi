import React from 'react';
import { ExperienceStory, Companion } from '../../types';
import { MapPin, ShieldCheck, Heart, MessageSquare, Clock, Play } from 'lucide-react';

interface StoryCardProps {
  story: ExperienceStory;
  companion?: Companion;
  onViewStory: (story: ExperienceStory) => void;
}

const CATEGORY_MAP: Record<string, string> = {
  'Trekking': 'Hiking',
  'Hiking': 'Hiking',
  'Mountains': 'Hiking',
  'Coffee': 'Coffee Buddy',
  'Food': 'Food Tour',
  'Local Food': 'Food Tour',
  'Photography': 'Photography',
  'History': 'Museum',
  'Art': 'Museum',
  'Pottery': 'Museum',
  'Language': 'Language Exchange',
  'Shopping': 'Shopping',
  'Fashion': 'Shopping',
  'Crafts': 'Shopping',
  'Fitness': 'Fitness',
  'Culture': 'Cultural',
  'Local Culture': 'Cultural',
  'Wildlife': 'Wildlife',
  'Music': 'Music',
  'Reading': 'Study',
  'Business': 'Networking',
  'Swimming': 'Outdoors',
  'Outdoors': 'Outdoors',
  'Nature': 'Nature',
};

function getCategory(interests: string[]): string {
  for (const interest of interests) {
    if (CATEGORY_MAP[interest]) return CATEGORY_MAP[interest];
  }
  return 'Community';
}

export const StoryCard = React.memo<StoryCardProps>(({ story, companion, onViewStory }) => {
  const category = companion?.interests?.length ? getCategory(companion.interests) : 'Community';
  const views = (story.likes || 0) * 3 + 42;

  return (
    <div
      className="shrink-0 w-[300px] md:w-[360px] h-[460px] md:h-[520px] snap-center bg-[#17191C] rounded-[24px] overflow-hidden border-2 border-transparent transition-all duration-300 hover:border-[#C8A25E] hover:shadow-2xl hover:shadow-[#C8A25E]/15 group cursor-pointer"
      onClick={() => onViewStory(story)}
    >
      <div className="relative h-[280px] md:h-[320px] overflow-hidden">
        <img
          src={story.imageUrl}
          alt={story.caption}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#17191C] via-[#17191C]/20 to-transparent" />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-[#C8A25E]/90 flex items-center justify-center backdrop-blur-sm">
            <Play className="w-6 h-6 text-[#0F1113] fill-[#0F1113] ml-1" />
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <img
            src={story.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(story.userName)}&background=random`}
            alt={story.userName}
            className="w-11 h-11 rounded-full border-2 border-[#C8A25E] object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-white font-semibold text-sm truncate">{story.companionName}</span>
              {companion?.isVerified && <ShieldCheck className="w-4 h-4 text-[#C8A25E] shrink-0" />}
            </div>
            {companion?.location && (
              <div className="flex items-center gap-1 text-[#8E9299] text-xs mt-0.5">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{companion.location}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="self-start px-3 py-1 rounded-full bg-[#C8A25E]/15 text-[#C8A25E] text-xs font-medium border border-[#C8A25E]/20">
          {category}
        </div>
        
        <p className="text-white text-sm leading-relaxed line-clamp-2 font-light">
          {story.caption}
        </p>
        
        <div className="flex items-center justify-between pt-2 border-t border-[#2A2D31]">
          <div className="flex items-center gap-4 text-xs text-[#8E9299]">
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
              {story.likes || 0}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              {story.comments || 0}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {story.timeAgo}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewStory(story);
            }}
            className="px-4 py-2 bg-[#C8A25E] text-[#0F1113] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#B69150] transition-colors"
          >
            View Story
          </button>
        </div>
      </div>
    </div>
  );
});

StoryCard.displayName = 'StoryCard';
