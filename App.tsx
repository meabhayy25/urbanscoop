
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import MenuCarousel from './components/MenuCarousel';
import OrderSidebar from './components/OrderSidebar';
import AIChef from './components/AIChef';
import Promotions from './components/Promotions'; // Import new component
import AdminDashboard from './components/AdminDashboard'; // Import Admin
import { MOCK_MENU_ITEMS } from './constants';
import { Category, MenuItem, CartItem, Portion, SpiceLevel, DiningOption } from './types';
import { CheckCircle } from 'lucide-react';

const App: React.FC = () => {
  // STATE: Menu Items now live in state to allow modification (Sold Out)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MOCK_MENU_ITEMS);

  const [activeCategory, setActiveCategory] = useState<Category>(Category.MEALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  
  // Admin State
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<string>('');

  // Keyboard shortcut for Admin Dashboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl + Shift + A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAdminOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter items based on category or search query
  const filteredItems = menuItems.filter(item => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(query) || 
             item.description.toLowerCase().includes(query);
    }
    return item.category === activeCategory;
  });

  // Set default active item when category or search changes
  useEffect(() => {
    if (filteredItems.length > 0) {
      const isActiveItemVisible = filteredItems.some(item => item.id === activeItemId);
      if (!isActiveItemVisible) {
        const defaultActive = filteredItems[1] || filteredItems[0];
        setActiveItemId(defaultActive.id);
      }
    } else {
      setActiveItemId(null);
    }
  }, [activeCategory, searchQuery, filteredItems.length]);

  const handleAddToOrder = (item: MenuItem, portion: Portion, spice: SpiceLevel, dining: DiningOption, quantity: number) => {
    let priceMultiplier = 1;
    switch(portion) {
      case Portion.FULL: priceMultiplier = 1; break;
      case Portion.HALF: priceMultiplier = 0.6; break;
      case Portion.QUARTER: priceMultiplier = 0.4; break;
    }
    const adjustedPrice = Math.round(item.price * priceMultiplier);

    const newItem: CartItem = {
      ...item,
      cartId: Date.now().toString(),
      price: adjustedPrice,
      selectedPortion: portion,
      selectedSpice: spice,
      selectedDining: dining,
      quantity: quantity,
    };
    setCartItems(prev => [...prev, newItem]);
    
    setLastAddedItem(`${quantity}x ${item.name}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleRemoveItem = (cartId: string) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  const handleClearCart = () => {
    setCartItems([]);
    setIsSidebarOpen(false);
  };

  // Admin Action
  const toggleItemAvailability = (id: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-stone-50 font-sans text-stone-800 relative selection:bg-primary-200">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 text-[15vw] md:text-[20vw] font-black font-serif text-stone-200/60 pointer-events-none select-none -z-20 leading-none tracking-tighter opacity-40 mix-blend-multiply">
        URBAN
      </div>
      
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-orange-200/30 rounded-full blur-[100px] -z-30 pointer-events-none mix-blend-multiply"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-yellow-100/40 rounded-full blur-[100px] -z-30 pointer-events-none mix-blend-multiply"
      />
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed top-4 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:top-auto md:bottom-10 z-[9999] flex items-center gap-4 bg-stone-900/95 text-white px-5 py-3 md:px-6 md:py-3 rounded-2xl md:rounded-full shadow-2xl border border-white/10 backdrop-blur-xl"
          >
            <div className="bg-green-500/20 p-1.5 rounded-full flex-shrink-0">
              <CheckCircle size={18} className="text-green-400" strokeWidth={3} />
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-0.5">Added to Cart</p>
               <p className="text-sm font-semibold truncate text-white">{lastAddedItem}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <Header 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
        cartCount={cartItems.length}
        toggleSidebar={() => setIsSidebarOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col pt-0 md:pt-10">
        
        {/* Hero Section Grid */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-0 md:mb-8">
            
            {/* Left Side: Brand Statement (Hidden on Mobile) */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="hidden md:flex flex-col items-start space-y-4"
            >
                <div className="flex items-center space-x-3 text-primary-600 font-bold tracking-widest text-[10px] uppercase">
                    <span className="w-8 h-[2px] bg-primary-600"></span>
                    <span>Experience Taste</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-serif text-stone-900 leading-tight">
                    Where Flavor <br/> Meets <span className="text-primary-600 italic">Passion</span>
                </h2>
                <p className="text-sm text-stone-500 max-w-[240px] leading-relaxed font-light">
                    Crafted with fresh ingredients and a touch of culinary magic. Taste the difference today.
                </p>
            </motion.div>

            {/* Center: Hero Heading & Offer Section */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-center flex flex-col items-center justify-center col-span-1"
            >
                <p className="text-stone-400 uppercase tracking-[0.3em] text-[10px] md:text-xs mb-1 md:mb-2 font-medium mt-4 md:mt-0">
                    Daily Specials
                </p>
                
                {/* Modern Promotions Component */}
                <Promotions />

                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="hidden md:inline-flex group relative items-center justify-center px-8 py-3 bg-white border border-stone-200 shadow-sm rounded-full overflow-hidden hover:shadow-xl hover:shadow-primary-100/30 hover:border-primary-100 transition-all duration-300 mt-4"
                >
                    <div className="absolute inset-0 w-0 bg-gradient-to-r from-primary-50 to-white transition-all duration-500 ease-out group-hover:w-full"></div>
                    <span className="relative flex items-center space-x-2 text-xs font-bold text-stone-600 group-hover:text-primary-600 tracking-wide">
                        <span>VIEW CART</span>
                        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                </button>
            </motion.div>

            {/* Right Side: Accolade */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="hidden md:flex flex-col items-end text-right"
            >
                 <div className="flex items-center space-x-1 justify-end mb-2">
                     {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-500 text-sm drop-shadow-sm">★</span>)}
                 </div>
                 <h1 className="text-2xl lg:text-3xl font-serif text-stone-900 leading-tight mb-2">
                   Where <span className="text-primary-600 font-bold">Spices</span><br/>Tell Stories
                 </h1>
                 <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/50 shadow-sm">
                     Awarded 2024
                 </p>
            </motion.div>
        </div>

        {/* Carousel Container */}
        <div className="flex-1 relative w-full h-auto min-h-[500px] md:min-h-[500px] mt-0 pb-20 md:pb-0">
           {/* Search Results Feedback */}
           {searchQuery && (
              <div className="text-center mb-4 animate-fade-in">
                <span className="bg-stone-200/60 backdrop-blur text-stone-600 px-4 py-1.5 rounded-full text-xs font-semibold">
                  Showing results for "{searchQuery}"
                </span>
              </div>
           )}
           
          {filteredItems.length > 0 ? (
            <MenuCarousel 
              items={filteredItems} 
              activeId={activeItemId}
              setActiveId={setActiveItemId}
              onAddToOrder={handleAddToOrder}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-stone-400">
               <div className="text-4xl mb-2">😕</div>
               <p>No items found matching your search.</p>
               <button 
                 onClick={() => setSearchQuery('')}
                 className="mt-4 text-primary-600 font-bold text-sm hover:underline"
               >
                 Clear Search
               </button>
            </div>
          )}
        </div>
      </main>

      {/* Sidebar & AI */}
      <OrderSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
      
      {/* 
        INVISIBLE ADMIN TRIGGER 
        - Press Ctrl + Shift + A (Desktop)
        - Triple click bottom left corner (Mobile)
      */}
      <div 
        className="fixed bottom-0 left-0 w-20 h-20 z-50 cursor-default"
        onClick={(e) => {
            if (e.detail === 3) setIsAdminOpen(true);
        }}
      />

      <AIChef menuItems={menuItems} />

      {/* Admin Modal */}
      <AdminDashboard 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        menuItems={menuItems}
        onToggleAvailability={toggleItemAvailability}
      />

    </div>
  );
};

export default App;
