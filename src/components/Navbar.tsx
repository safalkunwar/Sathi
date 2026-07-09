import React, { useState, useRef, useEffect } from 'react';
import { User, LogIn, UserCircle, Briefcase, Settings, LogOut, Menu, X, Sun, Moon, LayoutDashboard, Search } from 'lucide-react';

interface NavbarProps {
  activeTab: 'explore' | 'bookings' | 'messages' | 'about' | 'admin';
  setActiveTab: (tab: 'explore' | 'bookings' | 'messages' | 'about' | 'admin') => void;
  onOpenAuth: (mode: 'login' | 'signup' | 'guide') => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenAuth, searchQuery, setSearchQuery }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0F1113] border-b border-[#2A2D31] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo / Mobile Menu Toggle */}
          <div 
            className="flex items-center gap-2 md:gap-3 cursor-pointer select-none shrink-0" 
            onClick={() => {
              if (window.innerWidth >= 768) {
                setActiveTab('about');
              }
            }}
          >
             <div className="w-11 h-11 md:w-10 md:h-10 rounded-xl bg-[#C8A25E] flex items-center justify-center font-bold text-[#0F1113] text-xl">
                S
             </div>
             <span className="text-xl md:text-2xl font-semibold tracking-tight text-white hidden sm:block">SATHI<span className="text-[#C8A25E]">.</span></span>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden flex-1 mx-3 relative">
            <Search className="w-4 h-4 text-[#8E9299] absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search people..." 
              className="w-full bg-[#1E2124]/50 backdrop-blur-md border border-[#2A2D31] rounded-[24px] h-11 pl-10 pr-4 text-[15px] text-white placeholder-[#8E9299] focus:outline-none focus:border-[#C8A25E] focus:bg-[#17191C] transition-all shadow-sm"
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery?.(e.target.value)}
            />
          </div>
          
          {/* Desktop Search and Links */}
          <div className="hidden md:flex flex-1 items-center px-8">
            <div className="flex-1 max-w-xl mx-auto relative">
              <Search className="w-4 h-4 text-[#8E9299] absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Find friends, activities, or locations..." 
                className="w-full bg-[#1E2124]/40 backdrop-blur-md border border-[#2A2D31] rounded-full h-11 pl-11 pr-4 text-sm text-white placeholder-[#8E9299] focus:outline-none focus:border-[#C8A25E] focus:bg-[#17191C] transition-all shadow-sm"
                value={searchQuery || ''}
                onChange={(e) => setSearchQuery?.(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-7 text-[15px] font-medium ml-6">
              <button onClick={() => setActiveTab('explore')} className={`transition-colors ${activeTab === 'explore' ? 'text-white' : 'text-[#8E9299] hover:text-[#C8A25E]'}`}>Discover</button>
              <button onClick={() => setActiveTab('about')} className={`transition-colors ${activeTab === 'about' ? 'text-white' : 'text-[#8E9299] hover:text-[#C8A25E]'}`}>Experiences</button>
              <button onClick={() => setActiveTab('bookings')} className={`transition-colors ${activeTab === 'bookings' ? 'text-white' : 'text-[#8E9299] hover:text-[#C8A25E]'}`}>Bookings</button>
              <button onClick={() => setActiveTab('messages')} className={`transition-colors ${activeTab === 'messages' ? 'text-white' : 'text-[#8E9299] hover:text-[#C8A25E]'}`}>Messages</button>
            </div>
          </div>

          <div className="flex items-center space-x-3 md:space-x-4 relative">
            <button className="hidden md:flex w-10 h-10 rounded-full bg-[#1E2124] border border-[#2A2D31] hover:border-[#C8A25E] transition-colors items-center justify-center text-[#8E9299] hover:text-[#C8A25E] relative focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#C8A25E] rounded-full border-2 border-[#1E2124]"></span>
            </button>
            <div className="h-6 w-[1px] bg-[#2A2D31] hidden md:block"></div>
            
            <div ref={dropdownRef} className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-11 h-11 md:w-10 md:h-10 rounded-full bg-[#1E2124] overflow-hidden border border-[#2A2D31] hover:border-[#C8A25E] transition-colors focus:outline-none"
              >
                 <img src="https://ui-avatars.com/api/?name=User&background=random" alt="User profile" className="w-full h-full object-cover" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-12 mt-2 w-56 bg-[#17191C] border border-[#2A2D31] rounded-xl shadow-2xl py-2 z-50 overflow-hidden">
                   <div className="px-4 py-3 border-b border-[#2A2D31]">
                      <p className="text-sm font-semibold text-white">Guest User</p>
                      <p className="text-xs text-[#8E9299] truncate">guest@example.com</p>
                   </div>
                   
                   <div className="py-1 border-b border-[#2A2D31]">
                     <button onClick={() => { onOpenAuth('login'); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-[#8E9299] hover:bg-[#1E2124] hover:text-white flex items-center gap-2">
                        <LogIn className="w-4 h-4" /> Login / Sign Up
                     </button>
                     <button className="w-full text-left px-4 py-2 text-sm text-[#8E9299] hover:bg-[#1E2124] hover:text-white flex items-center gap-2">
                        <UserCircle className="w-4 h-4" /> My Profile
                     </button>
                   </div>

                   <div className="py-1 border-b border-[#2A2D31]">
                     <button onClick={() => { onOpenAuth('guide'); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-[#C8A25E] hover:bg-[#1E2124] flex items-center gap-2 font-medium">
                        <Briefcase className="w-4 h-4" /> Join as Guide
                     </button>
                   </div>

                   <div className="py-1 border-b border-[#2A2D31]">
                     <a href="#admin" onClick={() => setIsDropdownOpen(false)} className="w-full text-left px-4 py-2 text-sm text-[#C8A25E] hover:bg-[#1E2124] flex items-center gap-2 font-medium">
                        <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                     </a>
                   </div>
                   <div className="py-1">
                     <button onClick={toggleTheme} className="w-full text-left px-4 py-2 text-sm text-[#8E9299] hover:bg-[#1E2124] hover:text-white flex items-center gap-2">
                        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                     </button>
                     <button className="w-full text-left px-4 py-2 text-sm text-[#8E9299] hover:bg-[#1E2124] hover:text-white flex items-center gap-2">
                        <Settings className="w-4 h-4" /> Settings
                     </button>
                     <button className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-900/20 flex items-center gap-2">
                        <LogOut className="w-4 h-4" /> Log Out
                     </button>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#2A2D31] space-y-4">
             <button onClick={() => { setActiveTab('explore'); setIsMobileMenuOpen(false); }} className={`block w-full text-left px-4 py-2 text-sm font-medium ${activeTab === 'explore' ? 'text-[#C8A25E] bg-[#1E2124] rounded-lg' : 'text-[#8E9299]'}`}>Discover</button>
             <button onClick={() => { setActiveTab('bookings'); setIsMobileMenuOpen(false); }} className={`block w-full text-left px-4 py-2 text-sm font-medium ${activeTab === 'bookings' ? 'text-[#C8A25E] bg-[#1E2124] rounded-lg' : 'text-[#8E9299]'}`}>Bookings</button>
             <button onClick={() => { setActiveTab('messages'); setIsMobileMenuOpen(false); }} className={`block w-full text-left px-4 py-2 text-sm font-medium ${activeTab === 'messages' ? 'text-[#C8A25E] bg-[#1E2124] rounded-lg' : 'text-[#8E9299]'}`}>Messages</button>
             <button onClick={() => { setActiveTab('about'); setIsMobileMenuOpen(false); }} className={`block w-full text-left px-4 py-2 text-sm font-medium ${activeTab === 'about' ? 'text-[#C8A25E] bg-[#1E2124] rounded-lg' : 'text-[#8E9299]'}`}>About SATHI</button>
             <a href="#admin" onClick={() => setIsMobileMenuOpen(false)} className={`block w-full text-left px-4 py-2 text-sm font-medium ${activeTab === 'admin' ? 'text-[#C8A25E] bg-[#1E2124] rounded-lg' : 'text-[#8E9299]'}`}>Admin Dashboard</a>
          </div>
        )}
      </div>
    </nav>
  );
};
