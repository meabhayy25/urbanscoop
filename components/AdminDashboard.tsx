
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Unlock, CheckCircle, Ban, Search } from 'lucide-react';
import { MenuItem, Category } from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  onToggleAvailability: (id: string) => void;
}

const ADMIN_PIN = '2525'; // Simple mock PIN

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose, menuItems, onToggleAvailability }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<Category | 'ALL'>('ALL');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid PIN');
      setPin('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPin('');
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeTab === 'ALL' || item.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/80 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-[10%] md:left-[15%] md:right-[15%] md:bottom-[10%] bg-stone-50 rounded-3xl shadow-2xl z-[70] overflow-hidden flex flex-col border border-stone-200"
          >
            {/* Header */}
            <div className="bg-stone-900 text-white p-6 flex justify-between items-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-stone-800 to-stone-900 z-0"></div>
               <div className="relative z-10 flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-xl">
                    {isAuthenticated ? <Unlock size={20} className="text-green-400" /> : <Lock size={20} className="text-red-400" />}
                  </div>
                  <div>
                      <h2 className="text-xl font-serif font-bold tracking-wide">Admin Dashboard</h2>
                      <p className="text-stone-400 text-xs uppercase tracking-widest font-medium">Inventory Management</p>
                  </div>
               </div>
               <button onClick={onClose} className="relative z-10 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                  <X size={20} />
               </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col bg-[#F5F5F4]">
              {!isAuthenticated ? (
                // Login Screen
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                  <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm text-center border border-stone-100">
                    <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock size={32} className="text-stone-400" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-800 mb-2">Restricted Access</h3>
                    <p className="text-sm text-stone-500 mb-6">Please enter your PIN to manage inventory.</p>
                    
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input 
                            type="password" 
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            placeholder="Enter PIN"
                            className="w-full text-center text-2xl tracking-[0.5em] font-bold p-4 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-800 focus:bg-white transition-all placeholder:text-stone-300 placeholder:text-sm placeholder:tracking-normal"
                            autoFocus
                        />
                        {error && <p className="text-red-500 text-xs font-bold animate-pulse">{error}</p>}
                        <button type="submit" className="w-full bg-stone-900 text-white font-bold py-3 rounded-xl hover:bg-stone-800 transition-colors shadow-lg shadow-stone-900/20">
                            Access Dashboard
                        </button>
                    </form>
                  </div>
                </div>
              ) : (
                // Dashboard Content
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Controls */}
                    <div className="p-4 md:p-6 bg-white border-b border-stone-200 shadow-sm z-10 flex flex-col md:flex-row gap-4 justify-between">
                         {/* Search */}
                         <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-3 text-stone-400" size={16} />
                            <input 
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search menu items..."
                                className="w-full pl-10 pr-4 py-2.5 bg-stone-100 rounded-xl text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 focus:bg-white transition-all"
                            />
                         </div>

                         {/* Filter Tabs */}
                         <div className="flex bg-stone-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
                            {(['ALL', ...Object.values(Category)] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                        activeTab === tab 
                                        ? 'bg-white text-stone-900 shadow-sm' 
                                        : 'text-stone-500 hover:text-stone-700'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                         </div>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
                        {filteredItems.map(item => (
                            <div key={item.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${item.available ? 'bg-white border-stone-100 shadow-sm' : 'bg-stone-100 border-stone-200 opacity-75'}`}>
                                <div className="w-16 h-16 rounded-xl overflow-hidden relative flex-shrink-0">
                                    <img src={item.image} alt={item.name} className={`w-full h-full object-cover ${!item.available && 'grayscale'}`} />
                                    {!item.available && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <Ban size={20} className="text-white" />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-stone-800 truncate">{item.name}</h4>
                                    <p className="text-xs text-stone-500 font-medium">₹{item.price} • {item.category}</p>
                                </div>

                                {/* Toggle Switch */}
                                <button 
                                    onClick={() => onToggleAvailability(item.id)}
                                    className={`relative w-14 h-8 rounded-full transition-colors duration-300 flex items-center px-1 ${
                                        item.available ? 'bg-green-500' : 'bg-stone-300'
                                    }`}
                                >
                                    <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                                        item.available ? 'translate-x-6' : 'translate-x-0'
                                    }`}>
                                        {item.available ? <CheckCircle size={14} className="text-green-500" /> : <Ban size={14} className="text-stone-400" />}
                                    </div>
                                </button>
                            </div>
                        ))}
                        {filteredItems.length === 0 && (
                            <div className="text-center py-12 text-stone-400">
                                <p>No items found.</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-between items-center text-xs text-stone-400">
                        <span>Authenticated as Admin</span>
                        <button onClick={handleLogout} className="text-stone-600 font-bold hover:underline">Log Out</button>
                    </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AdminDashboard;
