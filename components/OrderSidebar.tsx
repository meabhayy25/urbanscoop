
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Smartphone, User, ArrowRight, Tag, Percent, Check, Utensils, ShoppingBag } from 'lucide-react';
import { CartItem, DiningOption } from '../types';
import { PROMOS } from './Promotions';

const OWNER_PHONE_NUMBER = '917055531270'; 

interface OrderSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (cartId: string) => void;
  onClearCart: () => void;
}

const OrderSidebar: React.FC<OrderSidebarProps> = ({ isOpen, onClose, cartItems, onRemoveItem, onClearCart }) => {
  const [customerName, setCustomerName] = useState('');
  
  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Service Charge Calculation (10% for Dine-In items)
  const serviceCharge = cartItems.reduce((sum, item) => {
    if (item.selectedDining === DiningOption.IN) {
        return sum + (item.price * item.quantity * 0.10);
    }
    return sum;
  }, 0);

  // Reset coupon if cart becomes empty or subtotal changes drastically
  useEffect(() => {
    if (cartItems.length === 0) {
        setDiscount(0);
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponSuccess('');
        setCouponError('');
    } else if (appliedCoupon) {
        handleApplyCoupon(appliedCoupon, true);
    }
  }, [cartItems, subtotal]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApplyCoupon = (codeToApply?: string, silent: boolean = false) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    if (!code) return;

    const promo = PROMOS.find(p => p.code === code);
    
    if (!silent) {
        setCouponError('');
        setCouponSuccess('');
    }

    if (!promo) {
        if (!silent) setCouponError('Invalid coupon code');
        setDiscount(0);
        setAppliedCoupon(null);
        return;
    }

    let calculatedDiscount = 0;
    let isValid = true;
    let errorMsg = '';

    switch (code) {
        case 'FAM20':
            if (subtotal >= 1500) {
                calculatedDiscount = subtotal * 0.20;
            } else {
                isValid = false;
                errorMsg = `Add items worth ₹${(1500 - subtotal).toFixed(0)} more`;
            }
            break;
        case 'SUGARHIGH':
            if (subtotal > 800) {
                calculatedDiscount = 150; 
            } else {
                isValid = false;
                errorMsg = `Min order ₹800 for this offer`;
            }
            break;
        case 'BLAST299':
            calculatedDiscount = 50;
            break;
        default:
            calculatedDiscount = 50; 
            break;
    }

    if (isValid) {
        setDiscount(calculatedDiscount);
        setAppliedCoupon(code);
        if (!silent) {
            setCouponSuccess(`'${code}' applied! Saved ₹${calculatedDiscount.toFixed(0)}`);
            setCouponCode(code);
        }
    } else {
        setDiscount(0);
        setAppliedCoupon(null);
        if (!silent) setCouponError(errorMsg);
    }
  };

  const removeCoupon = () => {
      setDiscount(0);
      setAppliedCoupon(null);
      setCouponCode('');
      setCouponSuccess('');
      setCouponError('');
  };

  const amountAfterDiscount = Math.max(0, subtotal - discount);
  const taxableAmount = amountAfterDiscount + serviceCharge;
  const tax = taxableAmount * 0.05; 
  const total = taxableAmount + tax;

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;

    let message = `*New Order @ Urban Spoon* \n`;
    message += `Customer: ${customerName || 'Guest'}\n\n`;
    message += `*Items:*\n`;

    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (x${item.quantity})\n`;
      message += `   ${item.selectedPortion} | ${item.selectedSpice} | ${item.selectedDining}\n`;
      message += `   Price: ₹${item.price * item.quantity}\n`;
    });

    message += `\nSubtotal: ₹${subtotal.toFixed(2)}`;
    
    if (discount > 0) {
        message += `\nDiscount (${appliedCoupon}): -₹${discount.toFixed(2)}`;
    }

    if (serviceCharge > 0) {
        message += `\nService Charge (10% on Dine-In): ₹${serviceCharge.toFixed(2)}`;
    }

    message += `\nTax (5%): ₹${tax.toFixed(2)}`;
    message += `\n*TOTAL: ₹${total.toFixed(2)}*`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${OWNER_PHONE_NUMBER}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    onClearCart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-40 touch-none"
          />
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-[#FAFAF9] z-50 shadow-2xl flex flex-col border-l border-white/50"
          >
            {/* Header */}
            <div className="px-6 py-5 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-stone-200 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                 <div className="bg-primary-100 p-2 rounded-xl">
                    <ShoppingBag size={20} className="text-primary-600" />
                 </div>
                 <div>
                    <h2 className="text-xl font-bold text-stone-900 font-serif leading-none">My Bag</h2>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">{cartItems.length} items selected</p>
                 </div>
              </div>
              <button 
                onClick={onClose} 
                className="group p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-900 transition-colors"
              >
                <X size={22} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Scrollable Items Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth pb-40">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-stone-400 space-y-4">
                  <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mb-2">
                    <ShoppingBag size={40} className="text-stone-300" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-600">Your cart is empty</h3>
                  <p className="text-sm text-stone-400 max-w-[200px] text-center">Looks like you haven't added any delicious items yet.</p>
                  <button onClick={onClose} className="mt-4 px-6 py-2 bg-stone-900 text-white rounded-full text-sm font-bold hover:scale-105 transition-transform">
                    Browse Menu
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence initial={false}>
                    {cartItems.map((item) => (
                      <motion.li 
                        layout
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        key={item.cartId} 
                        className="group relative bg-white p-3 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow"
                      >
                         <div className="flex gap-4">
                            {/* Image */}
                            <div className="relative w-20 h-20 flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full rounded-xl object-cover" />
                                <div className="absolute inset-0 rounded-xl shadow-inner border border-black/5 pointer-events-none"></div>
                            </div>
                            
                            {/* Details */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-stone-800 text-sm line-clamp-1 pr-6">{item.name}</h4>
                                        <button 
                                            onClick={() => onRemoveItem(item.cartId)} 
                                            className="absolute top-3 right-3 p-1.5 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                        >
                                           <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-stone-100 text-stone-600 rounded-md border border-stone-200">
                                            {item.selectedPortion}
                                        </span>
                                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-stone-100 text-stone-600 rounded-md border border-stone-200">
                                            {item.selectedSpice}
                                        </span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                            item.selectedDining === DiningOption.IN 
                                            ? 'bg-orange-50 text-orange-600 border-orange-100' 
                                            : 'bg-blue-50 text-blue-600 border-blue-100'
                                        }`}>
                                            {item.selectedDining}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-end justify-between mt-2">
                                    <div className="text-sm font-bold text-stone-900">₹{item.price * item.quantity}</div>
                                    <div className="text-xs text-stone-400 font-medium bg-stone-50 px-2 py-1 rounded-lg">
                                        Qty: {item.quantity}
                                    </div>
                                </div>
                            </div>
                         </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Sticky Footer Area */}
            {cartItems.length > 0 && (
              <div className="bg-white/80 backdrop-blur-xl border-t border-stone-200 p-6 pt-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
                
                {/* Coupon Input */}
                <div className="mb-4">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Tag size={16} className="text-stone-400 group-focus-within:text-stone-800 transition-colors" />
                        </div>
                        <input 
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Promo Code"
                            disabled={!!appliedCoupon}
                            className={`block w-full pl-10 pr-20 py-3 bg-stone-50 border border-stone-200 rounded-xl text-base md:text-sm placeholder-stone-400 focus:outline-none focus:ring-2 transition-all uppercase font-medium ${
                                appliedCoupon ? 'border-green-200 bg-green-50 text-green-700' : 'focus:ring-primary-500 focus:border-transparent focus:bg-white'
                            }`}
                        />
                        <div className="absolute right-1.5 top-1.5 bottom-1.5">
                             {appliedCoupon ? (
                                <button onClick={removeCoupon} className="h-full px-3 text-xs font-bold text-red-500 bg-white hover:bg-red-50 rounded-lg border border-red-100 transition-colors">
                                    Remove
                                </button>
                             ) : (
                                <button 
                                    onClick={() => handleApplyCoupon()}
                                    className="h-full px-4 text-xs font-bold text-stone-700 bg-white hover:bg-stone-200 rounded-lg shadow-sm border border-stone-200 transition-all active:scale-95"
                                >
                                    Apply
                                </button>
                             )}
                        </div>
                    </div>
                    {/* Feedback */}
                    <AnimatePresence>
                        {couponError && (
                            <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="text-red-500 text-[10px] font-bold mt-1.5 ml-1 flex items-center gap-1">
                               <X size={10} strokeWidth={3} /> {couponError}
                            </motion.div>
                        )}
                        {couponSuccess && (
                            <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="text-green-600 text-[10px] font-bold mt-1.5 ml-1 flex items-center gap-1">
                               <Check size={10} strokeWidth={3} /> {couponSuccess}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Receipt Details */}
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs text-stone-500">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    
                    {discount > 0 && (
                        <div className="flex justify-between text-xs font-bold text-green-600">
                            <span className="flex items-center gap-1"><Percent size={10} /> Discount</span>
                            <span>-₹{discount.toFixed(2)}</span>
                        </div>
                    )}
                    
                    {serviceCharge > 0 && (
                        <div className="flex justify-between text-xs font-medium text-orange-600">
                            <span className="flex items-center gap-1"><Utensils size={10} /> Service Charge (10%)</span>
                            <span>₹{serviceCharge.toFixed(2)}</span>
                        </div>
                    )}

                    <div className="flex justify-between text-xs text-stone-500">
                        <span>Tax (5%)</span>
                        <span>₹{tax.toFixed(2)}</span>
                    </div>

                    <div className="my-2 border-t border-dashed border-stone-300"></div>

                    <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-stone-800">Total Amount</span>
                        <span className="text-xl font-serif font-black text-stone-900">₹{total.toFixed(2)}</span>
                    </div>
                </div>

                {/* User Details & Action */}
                <div className="space-y-3">
                    <div className="relative group">
                        <User size={16} className="absolute left-3.5 top-3.5 text-stone-400 group-focus-within:text-stone-800 transition-colors" />
                        <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Your Name / Table No."
                            className="w-full bg-stone-50 border border-stone-200 text-stone-800 text-base md:text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                        />
                    </div>

                    <button 
                        onClick={handleWhatsAppCheckout}
                        disabled={!customerName.trim()}
                        className="group w-full bg-stone-900 text-white font-bold py-4 rounded-xl hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/20 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                        <Smartphone size={18} className="text-green-400" />
                        <span className="tracking-wide">Confirm Order</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OrderSidebar;
