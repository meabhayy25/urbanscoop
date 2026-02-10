import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Sparkles, Copy, ArrowRight, Percent, Zap, Check, Gift } from 'lucide-react';

export const PROMOS = [
  {
    id: 1,
    type: 'LIMITED TIME',
    title: 'COMBO BLAST',
    text: 'Chicken Biryani + Coke @ ₹299',
    code: 'BLAST299',
    color: 'orange'
  },
  {
    id: 2,
    type: 'FLAT DEAL',
    title: 'FAMILY FEAST',
    text: 'Flat 20% OFF above ₹1500',
    code: 'FAM20',
    color: 'rose'
  },
  {
    id: 3,
    type: 'FREEBIE',
    title: 'SWEET TREAT',
    text: 'Free Dessert on orders > ₹800',
    code: 'SUGARHIGH',
    color: 'purple'
  }
];

const Promotions: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PROMOS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const currentPromo = PROMOS[currentIndex];

  const getColorClasses = (color: string) => {
    switch(color) {
        case 'orange': return {
            bg: 'bg-gradient-to-br from-orange-400 to-red-600',
            shadow: 'shadow-orange-500/40',
            accent: 'bg-orange-500',
            text: 'text-orange-100'
        };
        case 'rose': return {
            bg: 'bg-gradient-to-br from-rose-400 to-pink-600',
            shadow: 'shadow-rose-500/40',
            accent: 'bg-rose-500',
            text: 'text-rose-100'
        };
        case 'purple': return {
            bg: 'bg-gradient-to-br from-violet-400 to-purple-600',
            shadow: 'shadow-purple-500/40',
            accent: 'bg-purple-500',
            text: 'text-purple-100'
        };
        default: return {
            bg: 'bg-stone-800',
            shadow: 'shadow-stone-500/40',
            accent: 'bg-stone-700',
            text: 'text-stone-100'
        };
    }
  }

  const theme = getColorClasses(currentPromo.color);

  return (
    <div 
        className="w-full max-w-sm mx-auto h-48 md:h-52 relative perspective-1000 my-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
        <AnimatePresence mode="wait">
            <motion.div
                key={currentIndex}
                initial={{ rotateX: -90, opacity: 0, y: 20 }}
                animate={{ rotateX: 0, opacity: 1, y: 0 }}
                exit={{ rotateX: 90, opacity: 0, y: -20 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
                className={`w-full h-full rounded-3xl ${theme.bg} ${theme.shadow} shadow-2xl relative overflow-hidden flex flex-col justify-between p-6 text-white transform-style-3d group cursor-default`}
            >
                {/* Abstract Background Shapes */}
                <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[-20%] left-[-20%] w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
                <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] z-0"></div>

                {/* Header */}
                <div className="flex justify-between items-start relative z-10">
                    <div className="flex items-center gap-2">
                         <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold tracking-widest uppercase border border-white/10 shadow-sm">
                            <Zap size={10} className="fill-current" />
                            {currentPromo.type}
                        </span>
                    </div>
                    {/* Animated Icon */}
                     <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md shadow-inner border border-white/10">
                        {currentPromo.color === 'orange' && <Sparkles size={18} className="text-yellow-200" />}
                        {currentPromo.color === 'rose' && <Percent size={18} className="text-pink-200" />}
                        {currentPromo.color === 'purple' && <Gift size={18} className="text-purple-200" />}
                    </div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 mt-2">
                    <h3 className="font-serif text-3xl font-bold mb-1.5 leading-none tracking-tight drop-shadow-sm">
                        {currentPromo.title}
                    </h3>
                    <p className={`text-sm font-medium opacity-90 ${theme.text} leading-tight`}>
                        {currentPromo.text}
                    </p>
                </div>

                {/* Footer / Actions */}
                <div className="relative z-10 flex justify-between items-center mt-auto pt-3">
                    
                    {/* Code Copy Button */}
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(currentPromo.code || '', currentIndex);
                        }}
                        className="flex items-center gap-2 bg-black/20 hover:bg-black/30 rounded-xl px-3 py-2 border border-white/10 transition-all active:scale-95 group/btn"
                    >
                        <Tag size={14} className="text-white/70 group-hover/btn:text-white transition-colors" />
                        <span className="text-xs font-mono font-bold tracking-widest uppercase text-white/90">
                            {copiedIndex === currentIndex ? 'COPIED!' : currentPromo.code}
                        </span>
                        {copiedIndex === currentIndex ? (
                             <Check size={12} className="text-green-300" />
                        ) : (
                             <Copy size={12} className="text-white/50 group-hover/btn:text-white transition-colors" />
                        )}
                    </button>
                    
                    {/* Claim Button */}
                    <button className="flex items-center gap-1.5 text-[10px] font-bold bg-white text-stone-900 px-4 py-2 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-white/20">
                        CLAIM <ArrowRight size={12} strokeWidth={3} />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
        
        {/* Modern Pagination Indicators */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {PROMOS.map((_, idx) => (
                <button 
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-500 ease-out 
                        ${idx === currentIndex ? 'w-8 bg-stone-800' : 'w-1.5 bg-stone-300 hover:bg-stone-400'}`}
                />
            ))}
        </div>
    </div>
  );
}

export default Promotions;