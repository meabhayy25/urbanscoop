
import React, { useState } from 'react';
import { Search, ShoppingBag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category } from '../types';

interface HeaderProps {
  activeCategory: Category;
  setActiveCategory: (category: Category) => void;
  cartCount: number;
  toggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  activeCategory, 
  setActiveCategory, 
  cartCount,
  toggleSidebar,
  searchQuery,
  setSearchQuery
}) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Dynamic Theme Logic for Header Elements
  const getTheme = (cat: Category) => {
    switch (cat) {
      case Category.DRINKS:
        return {
          activeBg: 'bg-cyan-600',
          activeShadow: 'shadow-cyan-500/40',
          textAccent: 'text-cyan-600',
          hoverText: 'hover:text-cyan-600',
          badgeBg: 'bg-cyan-600',
          logoBg: 'bg-cyan-600',
          logoShadow: 'shadow-cyan-500/30',
          focusText: 'group-focus-within:text-cyan-500',
        };
      case Category.DESSERTS:
        return {
          // Chocolate Theme
          activeBg: 'bg-amber-900',
          activeShadow: 'shadow-amber-900/40',
          textAccent: 'text-amber-900',
          hoverText: 'hover:text-amber-900',
          badgeBg: 'bg-amber-900',
          logoBg: 'bg-amber-900',
          logoShadow: 'shadow-amber-900/30',
          focusText: 'group-focus-within:text-amber-800',
        };
      default: // MEALS
        return {
          activeBg: 'bg-primary-600',
          activeShadow: 'shadow-primary-500/40',
          textAccent: 'text-primary-600',
          hoverText: 'hover:text-primary-600',
          badgeBg: 'bg-primary-600',
          logoBg: 'bg-primary-600',
          logoShadow: 'shadow-primary-500/30',
          focusText: 'group-focus-within:text-primary-500',
        };
    }
  };

  const theme = getTheme(activeCategory);

  return (
    <header className="flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-3 md:py-6 sticky top-0 z-40 transition-all duration-300">
      
      {/* Glass Background Layer */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-sm z-[-1]"></div>

      <div className="flex items-center justify-between w-full md:w-auto mb-3 md:mb-0 h-10">
        
        {/* Mobile Search Overlay */}
        {isMobileSearchOpen ? (
          <div className="flex flex-1 items-center space-x-2 animate-in slide-in-from-left duration-200 w-full mr-2">
            <div className="relative flex-1">
              <input 
                 autoFocus
                 type="text" 
                 placeholder="Search menu..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-9 pr-4 py-2 bg-stone-100 rounded-full text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 text-stone-800"
              />
              <Search className="absolute left-3 top-2.5 text-stone-400 w-4 h-4" />
            </div>
            <button 
              onClick={() => { setIsMobileSearchOpen(false); setSearchQuery(''); }} 
              className="p-2 text-stone-500 hover:text-stone-800 bg-stone-100 rounded-full"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <>
            {/* Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => { setSearchQuery(''); setActiveCategory(Category.MEALS); }}
            >
              <div className="relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                 <div className={`absolute inset-0 ${theme.logoBg} rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300 shadow-lg ${theme.logoShadow}`}></div>
                 <div className="absolute inset-0 bg-stone-900 rounded-xl -rotate-3 group-hover:-rotate-6 transition-transform duration-300 opacity-20"></div>
                 <span className="relative z-10 text-white font-bold text-lg md:text-xl font-serif">U</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-bold tracking-tight leading-none text-stone-900">URBAN</span>
                <span className={`text-[10px] md:text-xs tracking-[0.3em] font-medium transition-colors duration-300 ${theme.textAccent}`}>SPOON</span>
              </div>
            </div>

            {/* Mobile Cart Icon & Actions */}
            <div className="flex items-center space-x-3 md:hidden">
               {/* Mobile Search Toggle */}
               <button 
                 onClick={() => setIsMobileSearchOpen(true)}
                 className="p-2 text-stone-600 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors"
               >
                 <Search size={18} />
               </button>

               <button 
                onClick={toggleSidebar}
                className="relative p-2 bg-stone-900 text-white rounded-full shadow-md active:scale-95 transition-transform"
              >
                  {cartCount > 0 && (
                    <span className={`absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full ${theme.badgeBg} text-[9px] font-bold text-white ring-2 ring-white animate-bounce transition-colors duration-300`}>
                      {cartCount}
                    </span>
                  )}
                  <ShoppingBag size={18} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modern Pill Navigation - Scrollable */}
      <nav className={`relative w-full md:w-auto p-1 bg-stone-100/80 rounded-full flex items-center space-x-1 overflow-x-auto no-scrollbar border border-stone-200/50 shadow-inner transition-opacity duration-300 ${isMobileSearchOpen ? 'opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto' : 'opacity-100'}`}>
        {Object.values(Category).map((cat) => {
          const isActive = activeCategory === cat && !searchQuery;
          return (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setSearchQuery(''); }}
              className={`relative flex-1 md:flex-none px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 z-10 whitespace-nowrap snap-center
                ${isActive ? 'text-white' : 'text-stone-500 hover:text-stone-900'}`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute inset-0 ${theme.activeBg} rounded-full shadow-lg ${theme.activeShadow} z-[-1]`}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {cat}
            </button>
          );
        })}
      </nav>

      {/* Desktop Search & Cart */}
      <div className="hidden md:flex items-center space-x-5">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-stone-100/50 border border-transparent focus:bg-white text-sm focus:outline-none focus:border-stone-300 focus:shadow-sm w-32 focus:w-48 transition-all placeholder-stone-400 text-stone-700 rounded-full"
          />
          <Search className={`absolute left-3 top-2.5 text-stone-400 w-4 h-4 ${theme.focusText} transition-colors duration-300`} />
          {searchQuery && (
             <button 
               onClick={() => setSearchQuery('')}
               className="absolute right-2 top-2 text-stone-400 hover:text-stone-600"
             >
               <X size={14} />
             </button>
          )}
        </div>
        
        <button 
          onClick={toggleSidebar}
          className={`relative p-3 bg-white rounded-full shadow-sm hover:shadow-lg transition-all text-stone-700 ${theme.hoverText} border border-stone-100 hover:scale-105 active:scale-95`}
        >
             {cartCount > 0 && (
               <span className={`absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full ${theme.badgeBg} text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-bounce transition-colors duration-300`}>
                 {cartCount}
               </span>
             )}
             <ShoppingBag size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;
