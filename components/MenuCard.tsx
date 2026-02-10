
import React, { useState } from 'react';
import { MenuItem, Portion, SpiceLevel, DiningOption, Category } from '../types';
import { Plus, Minus, Flame, Clock, Utensils, Ban } from 'lucide-react';

interface MenuCardProps {
  item: MenuItem;
  isActive: boolean;
  onClick: () => void;
  onAddToOrder: (item: MenuItem, portion: Portion, spice: SpiceLevel, dining: DiningOption, quantity: number) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, isActive, onClick, onAddToOrder }) => {
  const [portion, setPortion] = useState<Portion>(Portion.FULL);
  const [spice, setSpice] = useState<SpiceLevel>(SpiceLevel.NORMAL);
  const [dining, setDining] = useState<DiningOption>(DiningOption.OUT);
  const [quantity, setQuantity] = useState<number>(1);

  const getMultiplier = (p: Portion) => {
    switch(p) {
      case Portion.FULL: return 1;
      case Portion.HALF: return 0.6;
      case Portion.QUARTER: return 0.4;
      default: return 1;
    }
  };

  const multiplier = getMultiplier(portion);
  const currentPrice = Math.round(item.price * multiplier);
  
  const currentCalories = {
    fat: Math.round(item.calories.fat * multiplier),
    saturatedFat: Math.round(item.calories.saturatedFat * multiplier),
  };

  // Modern Gradients & Theme Logic
  const getTheme = (cat: Category) => {
    switch (cat) {
      case Category.DRINKS:
        return {
          cardBg: 'bg-gradient-to-b from-[#A5F3FC] to-[#06B6D4]', // Cyan range
          text: 'text-cyan-950',
          accent: 'bg-cyan-950 text-white',
          secondary: 'bg-white/40 text-cyan-950',
          shadow: 'shadow-cyan-500/30'
        };
      case Category.DESSERTS:
        return {
          cardBg: 'bg-gradient-to-b from-[#E8DCCA] to-[#8D6E63]', // Beige to Milk Chocolate
          text: 'text-[#3E2723]',
          accent: 'bg-[#3E2723] text-white',
          secondary: 'bg-white/40 text-[#3E2723]',
          shadow: 'shadow-[#8D6E63]/40'
        };
      default: // MEALS
        return {
          cardBg: 'bg-gradient-to-b from-[#FFEDD5] to-[#EA580C]', // Primary/Burnt Orange
          text: 'text-orange-950',
          accent: 'bg-stone-900 text-white',
          secondary: 'bg-white/40 text-stone-900',
          shadow: 'shadow-orange-600/30'
        };
    }
  };

  const theme = getTheme(item.category);

  return (
    <div
      onClick={!item.available && isActive ? undefined : onClick}
      className={`relative flex-shrink-0 transition-all duration-700 ease-[0.23,1,0.32,1]
        w-[280px] md:w-[320px] select-none
        ${isActive ? 'scale-100 z-20' : 'scale-90 opacity-60 hover:opacity-80 z-10'}
        ${!item.available ? 'cursor-not-allowed grayscale' : 'cursor-pointer'}
        `}
      style={{
        height: '480px', // Taller to accommodate pop-out
        margin: '0 12px',
      }}
    >
      {/* Main Card Background */}
      <div className={`absolute bottom-0 w-full h-[80%] rounded-[2.5rem] shadow-2xl ${theme.shadow} overflow-hidden ${isActive ? theme.cardBg : 'bg-white border border-stone-200'} transition-colors duration-500`}>
          
          {/* Texture Overlays */}
          {isActive ? (
             <>
                {/* Noise Texture for that organic feel */}
                <div 
                    className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none" 
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />
                
                {/* Depth Gradient */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-black mix-blend-overlay"></div>
                
                {/* Category Specific Patterns */}
                {item.category === Category.MEALS && (
                    <div className="absolute inset-0 opacity-[0.15] mix-blend-multiply bg-[radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:20px_20px]"></div>
                )}
                {item.category === Category.DRINKS && (
                    <div className="absolute inset-0 opacity-[0.25]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1h2v2H1V1zm4 4h2v2H5V5zm4 4h2v2H9V9zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2z\' fill=\'%23ffffff\' fill-opacity=\'0.6\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}></div>
                )}
                {item.category === Category.DESSERTS && (
                    <div className="absolute inset-0 opacity-[0.2]" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }}></div>
                )}
             </>
          ) : (
             /* Subtle Paper Texture for inactive cards */
             <div className="absolute inset-0 opacity-[0.5]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'4\' height=\'4\' viewBox=\'0 0 4 4\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h4v4H0V0zm2 2h2v2H2V2z\' fill=\'%23000000\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}></div>
          )}
      </div>

      {/* Floating Image - Pops out of the card */}
      <div className={`absolute left-0 right-0 mx-auto transition-all duration-700 ease-[0.23,1,0.32,1] z-30
         ${isActive ? 'top-6 w-44 h-44 md:w-48 md:h-48 rotate-0 hover:rotate-3' : 'top-24 w-28 h-28 grayscale-[0.5]'}`}
      >
        <div className={`relative w-full h-full rounded-full ${isActive ? 'shadow-[0_15px_30px_rgba(0,0,0,0.2)]' : 'shadow-none'}`}>
           <img 
            src={item.image} 
            alt={item.name} 
            className={`w-full h-full object-cover rounded-full border-4 border-white ${!item.available ? 'opacity-80' : ''}`}
          />
          {!item.available && isActive && (
             <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full backdrop-blur-[2px] animate-in fade-in duration-500">
                <div className="border-4 border-white/80 px-4 py-2 rounded-xl transform -rotate-12 bg-red-600/90 shadow-2xl">
                    <span className="text-white font-black text-xl md:text-2xl tracking-widest uppercase font-serif drop-shadow-md">
                        SOLD OUT
                    </span>
                </div>
             </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className={`absolute bottom-0 w-full h-[80%] flex flex-col px-6 pb-6 text-center transition-all duration-500 z-20
        ${isActive ? 'pt-28' : 'pt-20 justify-center'}`}
      >
        
        {/* Title & Info */}
        <div className="mt-2 relative z-10">
            <h3 className={`font-serif font-bold leading-tight tracking-tight transition-all duration-300 
                ${isActive ? `text-xl md:text-2xl ${theme.text} mb-1 drop-shadow-sm` : 'text-lg text-stone-600 mb-1 line-clamp-2'}`}>
              {item.name}
            </h3>

            {!isActive && (
                 <p className="text-stone-400 font-serif font-bold italic">₹{item.price}</p>
            )}

            {isActive && (
                <>
                    {item.quote && (
                      <p className={`text-[10px] md:text-xs font-serif italic mb-1 opacity-90 ${theme.text}`}>
                        "{item.quote}"
                      </p>
                    )}
                    
                    {/* Description - Ingredients */}
                    <p className={`text-[10px] font-medium opacity-75 mb-3 px-1 line-clamp-2 leading-tight ${theme.text}`}>
                        {item.description}
                    </p>

                    <div className="flex justify-center gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${theme.secondary} shadow-sm backdrop-blur-sm`}>
                            <Clock size={10} /> {item.prepTime} min
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${theme.secondary} shadow-sm backdrop-blur-sm`}>
                            <Utensils size={10} /> {currentCalories.fat}g Fat
                        </span>
                    </div>
                </>
            )}
        </div>

        {/* Active Controls */}
        {isActive && (
            <div className="mt-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
               
               {item.available ? (
                   <>
                       <div className="bg-white/30 backdrop-blur-md rounded-2xl p-1 mb-3 flex items-center justify-between gap-1 shadow-sm border border-white/20">
                           {/* Portion */}
                           <div className="flex bg-white/50 rounded-xl p-0.5 gap-0.5">
                              {Object.values(Portion).map(p => (
                                  <button 
                                    key={p}
                                    onClick={(e) => { e.stopPropagation(); setPortion(p); }}
                                    className={`w-6 h-6 md:w-7 md:h-7 rounded-lg text-[10px] font-black flex items-center justify-center transition-all ${portion === p ? theme.accent : 'text-stone-600 hover:bg-white'}`}
                                  >
                                    {p}
                                  </button>
                              ))}
                           </div>
                           
                           {/* Dining */}
                           <div className="flex bg-white/50 rounded-xl p-0.5 gap-0.5">
                              {Object.values(DiningOption).map(d => (
                                  <button 
                                    key={d}
                                    onClick={(e) => { e.stopPropagation(); setDining(d); }}
                                    className={`px-1.5 md:px-2 h-6 md:h-7 rounded-lg text-[10px] font-bold flex items-center justify-center transition-all ${dining === d ? theme.accent : 'text-stone-600 hover:bg-white'}`}
                                  >
                                    {d}
                                  </button>
                              ))}
                           </div>

                           {/* Spice - Only show for Meals */}
                           {item.category === Category.MEALS && (
                             <button 
                                onClick={(e) => { e.stopPropagation(); setSpice(spice === SpiceLevel.NORMAL ? SpiceLevel.EXTRA : SpiceLevel.NORMAL); }}
                                className={`w-7 h-6 md:w-8 md:h-7 rounded-xl flex items-center justify-center transition-all ${spice === SpiceLevel.EXTRA ? 'bg-red-500 text-white shadow-lg shadow-red-500/40' : 'bg-white/50 text-stone-500'}`}
                             >
                                <Flame size={14} className={spice === SpiceLevel.EXTRA ? 'fill-current' : ''} />
                             </button>
                           )}
                       </div>

                       {/* Add To Cart Row */}
                       <div className="flex gap-2">
                           {/* Qty */}
                           <div className={`flex items-center justify-between px-1 h-10 md:h-12 rounded-xl bg-white text-stone-900 shadow-lg min-w-[80px] md:min-w-[100px]`}>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setQuantity(Math.max(1, quantity - 1)); }}
                                className="w-8 h-full flex items-center justify-center text-stone-400 hover:text-stone-900 transition-colors"
                              >
                                 <Minus size={14} strokeWidth={3} />
                              </button>
                              <span className="font-bold text-base md:text-lg">{quantity}</span>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setQuantity(quantity + 1); }}
                                className="w-8 h-full flex items-center justify-center text-stone-400 hover:text-stone-900 transition-colors"
                              >
                                 <Plus size={14} strokeWidth={3} />
                              </button>
                           </div>

                           {/* Main Button */}
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               onAddToOrder(item, portion, spice, dining, quantity);
                               setQuantity(1);
                             }}
                             className={`flex-1 h-10 md:h-12 ${theme.accent} rounded-xl shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all`}
                           >
                              <span className="text-[10px] md:text-xs font-bold tracking-wider hidden md:inline">ADD</span>
                              <span className="w-1 h-1 bg-white/40 rounded-full hidden md:inline"></span>
                              <span className="font-serif font-bold text-base md:text-lg">₹{currentPrice * quantity}</span>
                           </button>
                       </div>
                   </>
               ) : (
                   <div className="bg-stone-100/80 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-stone-500 border border-white/40 shadow-inner">
                       <Ban size={24} className="text-stone-400" />
                       <span className="text-xs font-bold uppercase tracking-widest">Currently Unavailable</span>
                   </div>
               )}
            </div>
        )}
      </div>
    </div>
  );
};

export default MenuCard;
