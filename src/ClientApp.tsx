/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StrictMode, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import React from 'react';
import { Navbar } from './components/Navbar';
import { CompanionProfileModal } from './components/modals/CompanionProfileModal';
import { StoryCard } from './components/cards/StoryCard';
import { StoryModal } from './components/modals/StoryModal';
import { AuthModal } from './components/AuthModal';
import { MessagesTab } from './components/messages/MessagesTab';
import { DashboardTab } from './components/dashboard/DashboardTab';
import { PartnerDashboard } from './components/dashboard/PartnerDashboard';
import { SafetyWidget } from './components/SafetyWidget';
import { Companion, ExperienceStory } from './types';
import { MapPin, Star, ShieldCheck, Languages, Search, Play, Clock } from 'lucide-react';
import * as motion from 'motion/react-client';
import { useAppContext } from './context/AppContext';
import { useToast } from './components/ui/Toast';
import { useCompanions, useStories, useActivities, useEvents } from './hooks/useFirestoreData';
import { AnimatePresence } from 'motion/react';

interface ClientAppProps {
  initialTab?: 'explore' | 'bookings' | 'messages' | 'about' | 'admin' | 'dashboard' | 'partner';
}

export const ClientApp = React.memo(({ initialTab }: ClientAppProps = {}) => {
  const { bookings, currentUser, updateBookingStatus } = useAppContext();
  const { showToast } = useToast();
  const { companions: fetchedCompanions, loading: companionsLoading } = useCompanions();
  const { stories: fetchedStories, loading: storiesLoading } = useStories();
  const { activities, loading: activitiesLoading } = useActivities();
  const { events, loading: eventsLoading } = useEvents();
  const [activeTab, setActiveTab] = useState<'explore' | 'bookings' | 'messages' | 'about' | 'admin' | 'dashboard' | 'partner'>(initialTab || 'explore');
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingStory, setViewingStory] = useState<ExperienceStory | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'guide' | null>(null);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [isGuide, setIsGuide] = useState(false);
  const [showGuideSetup, setShowGuideSetup] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStoryCategory, setSelectedStoryCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'recommended' | 'priceAsc' | 'priceDesc' | 'rating'>('recommended');
  const [showSOS, setShowSOS] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<Companion[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSOS) {
      timer = setTimeout(() => {
        setShowSOS(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [showSOS]);
  
  const companions = fetchedCompanions;
  const stories = fetchedStories;

  const handleViewCompanion = (companion: Companion) => {
    setSelectedCompanion(companion);
    setRecentlyViewed(prev => {
      const filtered = prev.filter(c => c.id !== companion.id);
      return [companion, ...filtered].slice(0, 6);
    });
  };

  const filteredCompanions = companions.filter(c => 
    (c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.interests.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))) &&
    (selectedCategory === 'All' || c.interests.includes(selectedCategory) || c.bio.includes(selectedCategory))
  ).sort((a, b) => {
    if (sortBy === 'priceAsc') return a.hourlyRate - b.hourlyRate;
    if (sortBy === 'priceDesc') return b.hourlyRate - a.hourlyRate;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // recommended
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollWidth > target.clientWidth && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      target.scrollLeft += e.deltaY;
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.currentTarget.scrollBy({ left: -380, behavior: 'smooth' });
    } else if (e.key === 'ArrowRight') {
      e.currentTarget.scrollBy({ left: 380, behavior: 'smooth' });
    }
  }, []);

  const storyCategories = useMemo(() => {
    const set = new Set<string>();
    stories.forEach(s => {
      const companion = companions.find(c => c.id === s.companionId);
      const interests = companion?.interests || [];
      const map: Record<string, string> = {
        'Trekking': 'Hiking', 'Hiking': 'Hiking', 'Mountains': 'Hiking',
        'Coffee': 'Coffee Buddy', 'Food': 'Food Tour', 'Local Food': 'Food Tour',
        'Photography': 'Photography', 'History': 'Museum', 'Art': 'Museum', 'Pottery': 'Museum',
        'Language': 'Language Exchange', 'Shopping': 'Shopping', 'Fashion': 'Shopping', 'Crafts': 'Shopping',
        'Fitness': 'Fitness', 'Culture': 'Cultural', 'Local Culture': 'Cultural',
        'Wildlife': 'Wildlife', 'Music': 'Music', 'Reading': 'Study', 'Business': 'Networking',
        'Swimming': 'Outdoors', 'Outdoors': 'Outdoors', 'Nature': 'Nature',
      };
      for (const interest of interests) {
        if (map[interest]) { set.add(map[interest]); break; }
      }
    });
    return ['All', ...Array.from(set)];
  }, [stories, companions]);

  const filteredStories = useMemo(() => {
    if (selectedStoryCategory === 'All') return stories;
    const map: Record<string, string> = {
      'Trekking': 'Hiking', 'Hiking': 'Hiking', 'Mountains': 'Hiking',
      'Coffee': 'Coffee Buddy', 'Food': 'Food Tour', 'Local Food': 'Food Tour',
      'Photography': 'Photography', 'History': 'Museum', 'Art': 'Museum', 'Pottery': 'Museum',
      'Language': 'Language Exchange', 'Shopping': 'Shopping', 'Fashion': 'Shopping', 'Crafts': 'Shopping',
      'Fitness': 'Fitness', 'Culture': 'Cultural', 'Local Culture': 'Cultural',
      'Wildlife': 'Wildlife', 'Music': 'Music', 'Reading': 'Study', 'Business': 'Networking',
      'Swimming': 'Outdoors', 'Outdoors': 'Outdoors', 'Nature': 'Nature',
    };
    return stories.filter(s => {
      const companion = companions.find(c => c.id === s.companionId);
      const interests = companion?.interests || [];
      for (const interest of interests) {
        if (map[interest] === selectedStoryCategory) return true;
      }
      return false;
    });
  }, [stories, companions, selectedStoryCategory]);

  return (
    <div className="min-h-screen bg-[#0F1113] font-sans text-[#E0E0E0] pb-20">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenAuth={setAuthMode} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        onLogoClick={() => setShowSOS((s) => !s)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 md:mt-8">
        
        {isGuide && showGuideSetup && (
           <div className="mb-8 p-6 bg-[#1A1814] border border-[#C8A25E]/30 rounded-3xl relative overflow-hidden">
              <button onClick={() => setShowGuideSetup(false)} className="absolute top-4 right-4 text-[#8E9299] hover:text-white">✕</button>
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Star className="w-5 h-5 text-[#C8A25E]" /> Complete Your Guide Profile</h2>
              <p className="text-sm text-[#8E9299] mb-6">You've been authorized as a guide! Let's set up the information that travelers will see when they browse SATHI.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="col-span-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#2A2D31] rounded-2xl bg-[#1E2124] hover:border-[#C8A25E] cursor-pointer text-[#8E9299] hover:text-[#C8A25E] transition-colors">
                    <div className="w-20 h-20 bg-[#17191C] rounded-full mb-3 flex items-center justify-center">
                       <span className="text-2xl font-light">+</span>
                    </div>
                    <span className="text-sm font-medium">Upload Profile Picture</span>
                 </div>
                 
                 <div className="col-span-1 md:col-span-2 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="text-[10px] uppercase tracking-[0.2em] text-[#8E9299] font-bold block mb-2">Display Name</label>
                         <input type="text" className="w-full px-4 py-2 bg-[#1E2124] border border-[#2A2D31] rounded-xl text-white outline-none focus:border-[#C8A25E] text-sm" placeholder="e.g. Pasang" />
                       </div>
                       <div>
                         <label className="text-[10px] uppercase tracking-[0.2em] text-[#8E9299] font-bold block mb-2">Age</label>
                         <input type="number" className="w-full px-4 py-2 bg-[#1E2124] border border-[#2A2D31] rounded-xl text-white outline-none focus:border-[#C8A25E] text-sm" placeholder="25" />
                       </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-[#8E9299] font-bold block mb-2">Short Bio</label>
                      <textarea rows={3} className="w-full px-4 py-2 bg-[#1E2124] border border-[#2A2D31] rounded-xl text-white outline-none focus:border-[#C8A25E] text-sm resize-none" placeholder="Tell travelers about yourself and what you love about your city..."></textarea>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-[#8E9299] font-bold block mb-2">Languages Spoken</label>
                      <input type="text" className="w-full px-4 py-2 bg-[#1E2124] border border-[#2A2D31] rounded-xl text-white outline-none focus:border-[#C8A25E] text-sm" placeholder="English, Nepali, Newari..." />
                    </div>
                    <button onClick={() => { showToast('Profile saved successfully!', 'success'); setShowGuideSetup(false); }} className="px-6 py-2.5 bg-[#C8A25E] text-[#0F1113] font-bold uppercase tracking-wide text-xs rounded-xl hover:bg-[#B69150] transition-colors mt-2">Save Profile Data</button>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'explore' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* Stories Section - Recent Adventures */}
            <div className="mb-5 md:mb-8 pt-2 md:pt-0">
              <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-[#8E9299] mb-4 hidden md:block">Recent Adventures</h2>
              <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 snap-x snap-mandatory">
                  {/* Current user add story mockup */}
                  <div onClick={() => { if (currentUser) setShowStoryModal(true); else setAuthMode('login'); }} className="shrink-0 w-[72px] flex flex-col items-center gap-1.5 cursor-pointer group snap-start">
                     <div className="w-14 h-14 md:w-16 md:h-16 rounded-full p-[2px] bg-[#2A2D31] relative">
                        <img src={currentUser?.avatar || "https://ui-avatars.com/api/?name=User&background=random"} alt="Your Story" className="w-full h-full rounded-full border-2 border-[#1E2124] object-cover" />
                        <div className="absolute bottom-0 right-0 bg-[#C8A25E] text-[#0F1113] w-5 h-5 rounded-full flex items-center justify-center font-bold text-lg leading-none border-2 border-[#1E2124]">+</div>
                     </div>
                     <span className="text-[11px] md:text-xs text-[#8E9299] truncate w-full text-center">Share Moment</span>
                  </div>
                 
                 {stories.map((story) => (
                    <motion.div 
                      key={story.id} 
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setViewingStory(story)}
                      className="shrink-0 w-[72px] flex flex-col items-center gap-1.5 cursor-pointer group snap-start"
                    >
                       <div className="w-14 h-14 md:w-16 md:h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#C8A25E] via-yellow-500 to-[#B69150]">
                          <img src={story.userAvatar} alt={story.userName} className="w-full h-full rounded-full border-2 border-[#17191C] object-cover group-hover:scale-95 transition-transform" />
                       </div>
                       <span className="text-[11px] md:text-xs text-white truncate w-full text-center">{story.userName}</span>
                    </motion.div>
                 ))}
              </div>
             </div>

             {recentlyViewed.length > 0 && (
               <div className="mb-8">
                 <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-[#8E9299] mb-4">Recently Viewed</h2>
                 <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 snap-x snap-mandatory">
                   {recentlyViewed.map(companion => (
                     <motion.div
                       key={companion.id}
                       whileHover={{ scale: 1.05 }}
                       onClick={() => handleViewCompanion(companion)}
                       className="shrink-0 w-[72px] flex flex-col items-center gap-1.5 cursor-pointer group snap-start"
                     >
                       <div className="w-14 h-14 md:w-16 md:h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#C8A25E] via-yellow-500 to-[#B69150]">
                         <img src={companion.imageUrl} alt={companion.name} className="w-full h-full rounded-full border-2 border-[#17191C] object-cover group-hover:scale-95 transition-transform" />
                       </div>
                       <span className="text-[11px] md:text-xs text-white truncate w-full text-center">{companion.name}</span>
                     </motion.div>
                   ))}
                 </div>
               </div>
             )}

             {/* Visual Hero / Search block */}
            <div className="relative rounded-3xl overflow-hidden h-[240px] md:h-[400px] mb-6 md:mb-12 border border-[#2A2D31] group">
               <img src="https://images.unsplash.com/photo-1511216335778-7cb8f49fa7a3?q=80&w=1200&auto=format&fit=crop" alt="Hero" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0F1113] via-[#0F1113]/40 to-transparent flex flex-col justify-end p-6 md:p-10">
                  <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[40px] md:text-5xl lg:text-6xl font-light text-white mb-2 md:mb-4 leading-tight drop-shadow-lg">Find a Local Friend <br className="hidden md:block" /><span className="italic font-serif text-[#C8A25E]">For Any Adventure</span></motion.h2>
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-white/80 text-sm md:text-lg max-w-xl drop-shadow-md hidden md:block">
                    Meet amazing people, share experiences, and build genuine connections in a safe, welcoming community.
                  </motion.p>
               </div>
            </div>

            {/* Filters/Categories */}
            <div className="mb-5 md:mb-10 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-2 -mx-4 px-4 md:mx-0 md:px-0">
              <div className="flex gap-3 w-max">
                {['All', 'Coffee Buddy', 'Travel Companion', 'Language Exchange', 'Food Explorer', 'Museum Guide', 'Hiking Partner', 'Shopping Buddy', 'Study Partner', 'Nightlife', 'Photography Walk'].map((cat, i) => (
                   <motion.span 
                     whileTap={{ scale: 0.95 }} 
                     key={cat} 
                     onClick={() => setSelectedCategory(cat)}
                     className={`snap-start shrink-0 px-5 py-2.5 rounded-full text-[14px] font-medium tracking-wide cursor-pointer transition-colors border shadow-sm ${selectedCategory === cat ? 'bg-[#C8A25E] text-[#0F1113] border-[#C8A25E]' : 'bg-[#1E2124]/80 backdrop-blur-md text-[#8E9299] border-[#2A2D31] hover:border-[#C8A25E] hover:text-white'}`}
                   >
                     {cat}
                   </motion.span>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
              <h2 className="text-xl md:text-2xl font-bold text-white">Featured Companions</h2>
              
              <div className="flex items-center gap-4">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#1E2124] border border-[#2A2D31] text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#C8A25E]"
                >
                  <option value="recommended">Recommended</option>
                  <option value="rating">Highest Rated</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                </select>
                <button onClick={() => setSelectedCategory('All')} className="text-sm font-medium text-[#C8A25E] hover:text-[#B69150]">View All</button>
              </div>
            </div>
            
            {/* Companions Grid */}
            {companionsLoading ? (
              <div className="text-center py-20 text-[#8E9299]">
                Loading companions...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
                {filteredCompanions.map((companion, idx) => (
                <motion.div 
                  key={companion.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  className="group bg-[#17191C] rounded-[20px] overflow-hidden shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-[#C8A25E]/5 transition-all flex flex-col border border-[#2A2D31]/50 relative"
                >
                  <div className="relative aspect-[4/4.5] md:aspect-[4/5] overflow-hidden cursor-pointer" onClick={() => setSelectedCompanion(companion)}>
                    <img 
                      src={companion.imageUrl} 
                      alt={companion.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#17191C] via-[#17191C]/20 to-transparent opacity-80" />
                    <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-white/10">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-semibold text-white">{companion.rating}</span>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-2 flex-1 flex flex-col relative z-10 -mt-10 pointer-events-none">
                    <div className="flex justify-between items-end mb-2">
                      <div className="pointer-events-auto cursor-pointer" onClick={() => setSelectedCompanion(companion)}>
                        <h3 className="font-bold text-[16px] md:text-lg text-white flex items-center gap-1.5 drop-shadow-md">
                          {companion.name}, {companion.age}
                          {companion.isVerified && (
                            <ShieldCheck className="w-4 h-4 text-[#C8A25E]" title="KYC Verified" />
                          )}
                        </h3>
                        <p className="text-[#8E9299] text-[13px] md:text-sm flex items-center gap-1 mt-0.5 drop-shadow-md">
                          <MapPin className="w-3.5 h-3.5" />
                          {companion.location}
                        </p>
                      </div>
                    </div>

                    <p className="text-[13px] md:text-sm text-[#8E9299] line-clamp-2 mt-2 mb-3 flex-1 font-light leading-relaxed pointer-events-auto">
                      {companion.bio}
                    </p>

                    <div className="flex flex-col gap-2 mb-4 pointer-events-auto">
                      <div className="flex items-center gap-1.5 text-[12px] text-[#8E9299]">
                        <Languages className="w-3.5 h-3.5" />
                        <span className="truncate">{companion.languages.join(' • ')}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {companion.interests.slice(0, 3).map(interest => (
                          <span key={interest} className="text-[11px] md:text-xs px-2.5 py-1 bg-[#1E2124]/80 backdrop-blur-sm border border-[#2A2D31] text-[#8E9299] rounded-lg">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#2A2D31]/50 pointer-events-auto">
                      <div>
                        <span className="font-semibold text-white text-[15px]">
                          NPR {companion.hourlyRate} <span className="text-[12px] md:text-sm font-normal text-[#5A5E66]">/hr</span>
                        </span>
                        <div className="text-[12px] text-[#8E9299] mt-0.5 font-medium flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {companion.rating} <span className="opacity-70">({companion.reviewsCount})</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedCompanion(companion)}
                        className="px-5 py-2.5 bg-[#C8A25E] text-[#0F1113] font-semibold text-sm rounded-[14px] hover:bg-[#B69150] transition-transform hover:scale-105 active:scale-95 shadow-sm"
                      >
                        Profile
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            )}

            {filteredCompanions.length === 0 && (
              <div className="text-center py-20 bg-[#17191C] border border-[#2A2D31] rounded-3xl">
                <Search className="w-12 h-12 text-[#8E9299] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No companions found</h3>
                <p className="text-[#8E9299]">Try adjusting your search or filters.</p>
                <button onClick={() => {setSearchQuery(''); setSelectedCategory('All');}} className="mt-4 text-[#C8A25E] font-medium hover:underline">Clear all filters</button>
              </div>
            )}

             {/* Community Moments Feed */}
             <div className="mt-16 md:mt-24">
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl md:text-3xl font-bold text-white">Community Moments</h2>
                 <button onClick={() => showToast('Full community feed coming soon', 'info')} className="text-sm font-medium text-[#C8A25E] hover:text-[#B69150]">View Feed</button>
               </div>
               
               {/* Category Filters */}
               <div className="flex gap-3 mb-6 overflow-x-auto hide-scrollbar pb-2" role="tablist" aria-label="Story categories">
                 {storyCategories.map((cat) => (
                   <button
                     key={cat}
                     role="tab"
                     aria-selected={selectedStoryCategory === cat}
                     onClick={() => setSelectedStoryCategory(cat)}
                     className={`snap-start shrink-0 px-5 py-2.5 rounded-full text-[14px] font-medium tracking-wide cursor-pointer transition-all border shadow-sm ${
                       selectedStoryCategory === cat
                         ? 'bg-[#C8A25E] text-[#0F1113] border-[#C8A25E]'
                         : 'bg-[#1E2124]/80 backdrop-blur-md text-[#8E9299] border-[#2A2D31] hover:border-[#C8A25E] hover:text-white'
                     }`}
                   >
                     {cat}
                   </button>
                 ))}
               </div>
               
               {/* Stories Scroll Container */}
               <div
                 ref={scrollContainerRef}
                 onWheel={handleWheel}
                 onKeyDown={handleKeyDown}
                 tabIndex={0}
                 className="flex overflow-x-auto gap-6 hide-scrollbar snap-x snap-mandatory pb-4 scroll-smooth focus:outline-none focus:ring-2 focus:ring-[#C8A25E]/50 rounded-2xl"
                 aria-label="Community stories"
               >
                 {storiesLoading ? (
                   <div className="text-center py-12 text-[#8E9299]">Loading moments...</div>
                 ) : filteredStories.length === 0 ? (
                   <div className="text-center py-12 text-[#8E9299]">No moments yet. Be the first to share!</div>
                 ) : (
                   filteredStories.map((story) => {
                     const companion = companions.find(c => c.id === story.companionId);
                     return (
                       <StoryCard
                         key={story.id}
                         story={story}
                         companion={companion}
                         onViewStory={setViewingStory}
                       />
                     );
                   })
                 )}
               </div>
             </div>

             {/* Popular Activities */}
             <div className="mt-16 md:mt-24">
               <div className="flex items-center justify-between mb-8">
                 <h2 className="text-xl md:text-3xl font-bold text-white">Popular Activities</h2>
                 <button onClick={() => showToast('Activities directory coming soon', 'info')} className="text-sm font-medium text-[#C8A25E] hover:text-[#B69150]">Explore All</button>
               </div>
               
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {(activities.length > 0 ? activities : []).map((activity) => (
                     <div key={activity.id} onClick={() => { setSelectedCategory(activity.title); showToast(`Filtering by ${activity.title}`, 'success'); }} className="group cursor-pointer rounded-[20px] overflow-hidden border border-[#2A2D31] bg-[#17191C] relative hover:border-[#C8A25E]/50 transition-colors">
                        <div className="h-48 relative overflow-hidden">
                            <img src={activity.imageUrl || activity.image} alt={activity.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                           <div className="absolute inset-0 bg-gradient-to-t from-[#17191C] to-transparent"></div>
                        </div>
                        <div className="p-6 relative z-10 -mt-12">
                           <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">{activity.title}</h3>
                           <div className="flex flex-wrap items-center gap-4 text-sm text-[#8E9299]">
                              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {activity.duration}</span>
                              <span className="flex items-center gap-1.5"><span className="text-[#C8A25E]">Avg.</span> NPR {activity.avgPrice}/hr</span>
                           </div>
                           <div className="mt-4 pt-4 border-t border-[#2A2D31] flex items-center justify-between text-sm">
                              <span className="text-[#8E9299]">{activity.companionCount} companions</span>
                              <span className="text-[#C8A25E] font-medium group-hover:translate-x-1 transition-transform inline-block">Explore →</span>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
                {activities.length === 0 && (
                  <div className="text-center py-12 bg-[#17191C] border border-[#2A2D31] rounded-3xl">
                    <p className="text-[#8E9299]">No activities available yet. Seed Firestore to see activities.</p>
                  </div>
                )}
             </div>

            {/* Trust & Safety */}
            <div className="mt-16 md:mt-24 mb-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white">Trust & Safety First</h2>
                <p className="text-[#8E9299] mt-2">Your safety and comfort are our top priorities.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#17191C] border border-[#2A2D31] p-6 rounded-[20px] flex flex-col items-center text-center">
                   <div className="w-12 h-12 bg-[#C8A25E]/10 text-[#C8A25E] rounded-full flex items-center justify-center mb-4">
                     <ShieldCheck className="w-6 h-6" />
                   </div>
                   <h3 className="text-lg font-bold text-white mb-2">Identity Verified</h3>
                   <p className="text-sm text-[#8E9299]">Every companion goes through a strict identity and background check process.</p>
                </div>
                <div className="bg-[#17191C] border border-[#2A2D31] p-6 rounded-[20px] flex flex-col items-center text-center">
                   <div className="w-12 h-12 bg-[#C8A25E]/10 text-[#C8A25E] rounded-full flex items-center justify-center mb-4">
                     <Star className="w-6 h-6" />
                   </div>
                   <h3 className="text-lg font-bold text-white mb-2">Transparent Reviews</h3>
                   <p className="text-sm text-[#8E9299]">Read genuine experiences from real users before booking your companion.</p>
                </div>
                <div className="bg-[#17191C] border border-[#2A2D31] p-6 rounded-[20px] flex flex-col items-center text-center">
                   <div className="w-12 h-12 bg-[#C8A25E]/10 text-[#C8A25E] rounded-full flex items-center justify-center mb-4">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                   </div>
                   <h3 className="text-lg font-bold text-white mb-2">Secure Payments</h3>
                   <p className="text-sm text-[#8E9299]">Payments are held securely and only released after the experience.</p>
                </div>
              </div>
            </div>

            {/* Customer Testimonials */}
            <div className="mt-16 md:mt-24 mb-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white">Community Love</h2>
                <p className="text-[#8E9299] mt-2">See what our community is saying about their experiences.</p>
              </div>
              <div className="flex overflow-x-auto gap-6 hide-scrollbar snap-x snap-mandatory pb-4">
                 {[
                   { name: 'Michael Chen', city: 'London', review: 'Safal was an amazing guide! He showed me around all the best local coffee spots that I would have never found on my own. Highly recommended!', activity: 'Local Coffee Chat', avatar: 'https://ui-avatars.com/api/?name=Michael+C&background=random' },
                   { name: 'Sarah Jenkins', city: 'New York', review: 'Safal you are the best,I had the best time exploring the street food scene. Very knowledgeable and friendly companion.', activity: 'Street Food Tour', avatar: 'https://ui-avatars.com/api/?name=Sarah+J&background=random' },
                   { name: 'David Lee', city: 'Toronto', review: 'Great experience! We spent hours discussing photography and captured amazing shots of the city skyline.', activity: 'City Photography', avatar: 'https://ui-avatars.com/api/?name=David+L&background=random' }
                 ].map((testimonial, idx) => (
                   <div key={idx} className="shrink-0 w-80 md:w-[400px] snap-center bg-[#1E2124] border border-[#2A2D31] p-6 rounded-[20px] flex flex-col">
                      <div className="flex items-center gap-1 mb-4 text-[#C8A25E]">
                        <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                      </div>
                      <p className="text-white text-sm md:text-base leading-relaxed mb-6 flex-1">"{testimonial.review}"</p>
                      <div className="flex items-center gap-4 mt-auto">
                          <img src={testimonial.avatar} alt={testimonial.name} loading="lazy" className="w-12 h-12 rounded-full border-2 border-[#2A2D31]" />
                         <div>
                            <h4 className="font-bold text-white text-sm">{testimonial.name}</h4>
                            <p className="text-xs text-[#8E9299]">{testimonial.city} • {testimonial.activity}</p>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
            </div>

             {/* Upcoming Local Events */}
             <div className="mt-16 md:mt-24 mb-12">
               <div className="flex items-center justify-between mb-8">
                 <h2 className="text-xl md:text-3xl font-bold text-white">Upcoming Local Events</h2>
                 <button onClick={() => showToast('Event calendar coming soon', 'info')} className="text-sm font-medium text-[#C8A25E] hover:text-[#B69150]">View Calendar</button>
               </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {(events.length > 0 ? events : []).map((event) => {
                     const dateObj = new Date(event.date);
                     const month = dateObj.toLocaleString('en-US', { month: 'short' });
                     const day = dateObj.getDate();
                     return (
                     <div key={event.id} className="bg-[#17191C] border border-[#2A2D31] p-5 md:p-6 rounded-[20px] flex gap-4 hover:border-[#C8A25E]/50 transition-colors">
                        <div className="shrink-0 w-16 h-16 rounded-2xl bg-[#1E2124] border border-[#2A2D31] flex flex-col items-center justify-center">
                           <span className="text-[#C8A25E] text-xs font-bold uppercase">{month}</span>
                           <span className="text-white font-bold text-lg leading-none">{day}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                           <h3 className="font-bold text-white text-lg truncate">{event.title}</h3>
                           <p className="text-sm text-[#8E9299] flex items-center gap-1.5 mt-1 truncate">
                             <MapPin className="w-3.5 h-3.5" /> {event.location}
                           </p>
                           <p className="text-xs text-[#8E9299] flex items-center gap-1.5 mt-1 truncate">
                             <Clock className="w-3.5 h-3.5" /> {event.time}
                           </p>
                           <div className="flex items-center justify-between mt-4">
                              <span className="text-xs text-[#8E9299]">
                                <span className="text-white font-medium">{typeof event.participants === 'number' ? event.participants : (event.participants as any)?.length || 0}</span> going • <span className="text-[#C8A25E]">{event.spots} spots left</span>
                              </span>
                              <button onClick={() => {
                                if (!currentUser) setAuthMode('login');
                                else showToast(`Successfully joined ${event.title}!`, 'success');
                              }} className="px-4 py-1.5 bg-[#1E2124] text-white border border-[#2A2D31] text-xs font-medium rounded-lg hover:bg-[#C8A25E] hover:text-[#0F1113] hover:border-[#C8A25E] transition-colors">
                                 Join
                              </button>
                           </div>
                        </div>
                     </div>
                     );
                   })}
                </div>
                {events.length === 0 && (
                  <div className="text-center py-12 bg-[#17191C] border border-[#2A2D31] rounded-3xl">
                    <p className="text-[#8E9299]">No upcoming events. Seed Firestore to see events.</p>
                  </div>
                )}
             </div>

          </motion.div>
        )}

        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
             <DashboardTab />
          </motion.div>
        )}

        {activeTab === 'partner' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
             <PartnerDashboard />
          </motion.div>
        )}

        {activeTab === 'bookings' && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#2A2D31] pb-4">My Bookings</h2>
              {bookings.filter(b => b.userId === currentUser?.id).length > 0 ? (
                <div className="grid gap-4">
                  {bookings.filter(b => b.userId === currentUser?.id).map(booking => {
                    const companion = companions.find(c => c.id === booking.companionId);
                    const isCancellable = booking.status === 'pending' || booking.status === 'confirmed';
                    return (
                      <div key={booking.id} className="bg-[#17191C] border border-[#2A2D31] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                         <div>
                            <h3 className="font-bold text-white mb-1">Booking with {companion?.name || 'Companion'}</h3>
                            <p className="text-sm text-[#8E9299]">Date: {booking.date} at {booking.time}</p>
                            <p className="text-sm text-[#8E9299]">Duration: {booking.duration} hours {booking.participants > 1 ? `x ${booking.participants} people` : ''}</p>
                            {booking.meetingPoint && <p className="text-sm text-[#8E9299]">Meeting: {booking.meetingPoint}</p>}
                         </div>
                         <div className="text-right flex flex-col items-end gap-2">
                             <span className="block font-bold text-[#C8A25E]">NPR {booking.totalPrice.toFixed(2)}</span>
                            <span className={`text-xs px-2 py-1 rounded-full border ${booking.status === 'confirmed' ? 'bg-green-500/10 border-green-500/50 text-green-500' : booking.status === 'cancelled' ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500'}`}>
                              {booking.status}
                            </span>
                             {isCancellable && (
                               <button onClick={() => { updateBookingStatus(booking.id, 'cancelled'); showToast('Booking cancelled', 'info'); }} className="text-xs text-red-400 hover:text-red-300 transition-colors">Cancel Booking</button>
                             )}
                             {booking.status === 'confirmed' && (
                               <button onClick={() => { updateBookingStatus(booking.id, 'completed'); showToast('Booking marked as completed', 'success'); }} className="text-xs text-green-400 hover:text-green-300 transition-colors">Mark Complete</button>
                             )}
                         </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-[#17191C] border border-[#2A2D31] p-8 rounded-2xl flex flex-col items-center text-center space-y-4">
                   <div className="w-16 h-16 rounded-full bg-[#1E2124] border border-[#2A2D31] flex items-center justify-center">
                      <Star className="w-8 h-8 text-[#8E9299]" />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold text-white">No active bookings</h3>
                     <p className="text-[#8E9299] mt-2">You don't have any upcoming experiences scheduled.</p>
                   </div>
                   <button onClick={() => setActiveTab('explore')} className="mt-4 px-6 py-2 bg-[#C8A25E] text-[#0F1113] rounded-lg font-medium hover:bg-[#B69150] transition-colors">
                     Explore Companions
                   </button>
                </div>
              )}
           </motion.div>
        )}

         {activeTab === 'messages' && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <MessagesTab onOpenAuth={setAuthMode} />
           </motion.div>
         )}

        {activeTab === 'about' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl mx-auto">
             <h2 className="text-3xl font-light text-white mb-6 border-b border-[#2A2D31] pb-4">About <span className="font-bold">SATHI<span className="text-[#C8A25E]">.</span></span></h2>
             
             <div className="bg-[#17191C] border border-[#2A2D31] p-8 rounded-3xl space-y-6 text-[#8E9299] leading-relaxed">
                <p className="text-lg text-white">
                   SATHI is your authentic companion platform in Nepal. We believe the best way to experience the Himalayas, heritage sites, and local culture is through the eyes of a local friend.
                </p>
                <p>
                   Our platform connects travelers with KYC-verified, trusted, and knowledgeable locals for platonic cultural exchange, city tours, adventure guiding, and pure companionship.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                   <div className="p-5 bg-[#1E2124] border border-[#2A2D31] rounded-2xl">
                      <ShieldCheck className="w-8 h-8 text-[#C8A25E] mb-3" />
                      <h3 className="text-white font-semibold mb-2">Verified Safely</h3>
                      <p className="text-sm">Every companion undergoes strict identity verification and background checks.</p>
                   </div>
                   <div className="p-5 bg-[#1E2124] border border-[#2A2D31] rounded-2xl">
                      <Star className="w-8 h-8 text-[#C8A25E] mb-3" />
                      <h3 className="text-white font-semibold mb-2">Authentic Experiences</h3>
                      <p className="text-sm">From hidden street food to unspoken historical tales, discover the real Nepal.</p>
                   </div>
                </div>
             </div>
          </motion.div>
        )}



      </main>

      {/* Story Modal */}
      {viewingStory && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setViewingStory(null)}>
            <div className="relative w-full max-w-sm aspect-[9/16] bg-[#17191C] rounded-3xl overflow-hidden border border-[#2A2D31]" onClick={e => e.stopPropagation()}>
               <img src={viewingStory.imageUrl} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
               
               <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <img src={viewingStory.userAvatar} className="w-10 h-10 rounded-full border-2 border-[#C8A25E]" />
                     <div>
                        <span className="text-white font-semibold text-sm block">{viewingStory.userName}</span>
                        <span className="text-[#8E9299] text-xs">with {viewingStory.companionName} • {viewingStory.timeAgo}</span>
                     </div>
                  </div>
                  <button onClick={() => setViewingStory(null)} className="text-white bg-black/40 rounded-full p-2 backdrop-blur-sm">✕</button>
               </div>

               {/* Left/Right Click Areas */}
               <div className="absolute inset-y-20 left-0 w-1/3 cursor-pointer" onClick={(e) => { e.stopPropagation(); const idx = stories.findIndex(s => s.id === viewingStory.id); if (idx > 0) setViewingStory(stories[idx - 1]); }}></div>
               <div className="absolute inset-y-20 right-0 w-1/3 cursor-pointer" onClick={(e) => { e.stopPropagation(); const idx = stories.findIndex(s => s.id === viewingStory.id); if (idx < stories.length - 1) setViewingStory(stories[idx + 1]); else setViewingStory(null); }}></div>

               <div className="absolute bottom-10 inset-x-0 p-6 flex justify-between items-end gap-2 pointer-events-none">
                  <p className="text-white text-lg font-medium shadow-sm">{viewingStory.caption}</p>
                  
                  <div className="flex gap-1 mb-1">
                     {stories.map((s) => (
                       <div key={s.id} className={`w-1.5 h-1.5 rounded-full ${s.id === viewingStory.id ? 'bg-white' : 'bg-white/30'}`} />
                     ))}
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* Auth Modal */}
      {authMode && (
        <AuthModal 
          initialMode={authMode} 
          onClose={() => setAuthMode(null)} 
          onSuccess={(mode) => {
             if (mode === 'guide') {
                setIsGuide(true);
                setShowGuideSetup(true);
             }
          }}
        />
      )}

      {/* Story Modal */}
      {showStoryModal && (
        <StoryModal onClose={() => setShowStoryModal(false)} />
      )}

      {/* Safety / Verification Widget Mockup */}
      <AnimatePresence>
        {showSOS && (
          <SafetyWidget isVisible={showSOS} onClose={() => setShowSOS(false)} />
        )}
      </AnimatePresence>
      
      {selectedCompanion && (
        <CompanionProfileModal 
          companion={selectedCompanion} 
          onClose={() => setSelectedCompanion(null)} 
          onOpenAuth={setAuthMode}
          onMessage={() => {
            setSelectedCompanion(null);
            setActiveTab('messages');
          }}
        />
      )}
    </div>
  );
});



