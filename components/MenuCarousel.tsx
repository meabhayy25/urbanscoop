
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { MenuItem, Portion, SpiceLevel, DiningOption } from '../types';
import MenuCard from './MenuCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MenuCarouselProps {
  items: MenuItem[];
  activeId: string | null;
  setActiveId: (id: string) => void;
  onAddToOrder: (item: MenuItem, portion: Portion, spice: SpiceLevel, dining: DiningOption, quantity: number) => void;
}

const MenuCarousel: React.FC<MenuCarouselProps> = ({ items, activeId, setActiveId, onAddToOrder }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Auto-swipe logic
  useEffect(() => {
    if (!activeId || isDragging || isHovered || items.length === 0) return;

    const interval = setInterval(() => {
      const currentIndex = items.findIndex(i => i.id === activeId);
      const nextIndex = (currentIndex + 1) % items.length;
      isProgrammaticScroll.current = true;
      setActiveId(items[nextIndex].id);
    }, 5000); 

    return () => clearInterval(interval);
  }, [activeId, items, isDragging, isHovered, setActiveId]);

  // Center active item
  useEffect(() => {
    if (isDragging || !containerRef.current || !activeId) return;

    const index = items.findIndex(i => i.id === activeId);
    if (index === -1) return;

    const container = containerRef.current;
    const card = container.children[index] as HTMLElement;
    
    if (card) {
      isProgrammaticScroll.current = true;
      // Calculate scroll position to center the card
      const containerWidth = container.offsetWidth;
      const cardWidth = card.offsetWidth;
      const cardLeft = card.offsetLeft;
      
      const scrollTo = cardLeft - (containerWidth / 2) + (cardWidth / 2);
      
      container.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });

      const timeout = setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [activeId, items, isDragging]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || isProgrammaticScroll.current) return;

    const container = containerRef.current;
    const containerCenter = container.scrollLeft + (container.clientWidth / 2);
    
    let closestItem: MenuItem | null = null;
    let minDistance = Infinity;

    Array.from(container.children).forEach((child, index) => {
       const element = child as HTMLElement;
       const elementCenter = element.offsetLeft + (element.offsetWidth / 2);
       const distance = Math.abs(elementCenter - containerCenter);

       if (distance < minDistance) {
         minDistance = distance;
         closestItem = items[index];
       }
    });

    if (closestItem && (closestItem as MenuItem).id !== activeId) {
      setActiveId((closestItem as MenuItem).id);
    }
  }, [items, activeId, setActiveId]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (items.length === 0) return;
    isProgrammaticScroll.current = true;
    const currentIndex = items.findIndex(i => i.id === activeId);
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    setActiveId(items[prevIndex].id);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (items.length === 0) return;
    isProgrammaticScroll.current = true;
    const currentIndex = items.findIndex(i => i.id === activeId);
    const nextIndex = (currentIndex + 1) % items.length;
    setActiveId(items[nextIndex].id);
  };

  return (
    <div 
      className="w-full h-full flex flex-col justify-center relative group touch-pan-y"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Navigation Buttons - Hidden on touch devices usually, shown on hover/desktop */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-8 z-40 pointer-events-none hidden md:flex">
        <button 
           onClick={handlePrev}
           className="pointer-events-auto w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-stone-100 shadow-lg text-stone-600 hover:text-stone-900 hover:scale-110 active:scale-95 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
           aria-label="Previous Item"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
           onClick={handleNext}
           className="pointer-events-auto w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-stone-100 shadow-lg text-stone-600 hover:text-stone-900 hover:scale-110 active:scale-95 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
           aria-label="Next Item"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div 
        ref={containerRef}
        onScroll={handleScroll}
        onTouchStart={() => {
          isProgrammaticScroll.current = false;
          setIsDragging(true);
        }}
        onTouchEnd={() => setTimeout(() => setIsDragging(false), 500)}
        // Dynamic padding calculation:
        // Mobile card width ~280px -> Half is 140px. Center padding = 50vw - 140px
        // Desktop card width ~320px -> Half is 160px. Center padding = 50% - 160px
        className="flex items-center overflow-x-auto no-scrollbar pt-12 pb-12 px-[calc(50vw-140px)] md:px-[calc(50%-160px)] relative z-10 scroll-smooth" 
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {items.map((item) => (
          <div key={item.id} className="scroll-snap-center flex-shrink-0">
            <MenuCard 
              item={item} 
              isActive={activeId === item.id} 
              onClick={() => {
                 isProgrammaticScroll.current = true;
                 setActiveId(item.id);
              }}
              onAddToOrder={onAddToOrder}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuCarousel;
