import React from 'react';
import { ExperienceStory } from '../../types';
import { Play } from 'lucide-react';

interface StoryCardProps {
  story: ExperienceStory;
  onViewStory: (story: ExperienceStory) => void;
}

export const StoryCard = React.memo<StoryCardProps>(({ story, onViewStory }) => {
  return (
    <div
      className="shrink-0 w-[300px] md:w-[360px] h-[460px] md:h-[520px] snap-center bg-[#17191C] rounded-[24px] overflow-hidden border-2 border-transparent transition-all duration-300 hover:border-[#C8A25E] hover:shadow-2xl hover:shadow-[#C8A25E]/15 group cursor-pointer"
      onClick={() => onViewStory(story)}
    >
      <div className="relative h-full overflow-hidden">
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
    </div>
  );
});

StoryCard.displayName = 'StoryCard';
