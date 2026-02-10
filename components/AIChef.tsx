
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage, MenuItem } from '../types';
import { getChefRecommendation } from '../services/geminiService';

interface AIChefProps {
  menuItems: MenuItem[];
}

const AIChef: React.FC<AIChefProps> = ({ menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'model', text: 'Hello! I am the Urban Spoon Chef AI. Ask me anything about our menu!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const responseText = await getChefRecommendation(userMsg.text, menuItems);

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsTyping(false);
  };

  return (
    <>
      <div className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[60] ${isOpen ? 'hidden' : 'flex'}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-primary-600 text-white p-3 md:p-4 rounded-full shadow-lg hover:bg-primary-700 transition-all hover:scale-110 active:scale-95"
        >
          <MessageCircle size={24} className="md:w-7 md:h-7" />
          <span className="absolute top-0 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
          </span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Backdrop */}
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 0.5 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-black z-[60] md:hidden"
               onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[70] w-[calc(100vw-32px)] md:w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col h-[500px] max-h-[80vh] md:max-h-[600px]"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 flex items-center justify-between text-white shadow-md z-10">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                    <ChefHat size={20} />
                  </div>
                  <div>
                     <h3 className="font-bold text-sm">Chef AI Assistant</h3>
                     <p className="text-[10px] text-primary-100 opacity-80">Powered by Gemini</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {messages.map((msg) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 md:p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-primary-600 text-white rounded-tr-none'
                          : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex space-x-1.5 items-center">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s'}}></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s'}}></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 bg-white border-t border-gray-100 flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about our food..."
                  className="flex-1 bg-gray-100 rounded-full px-4 md:px-5 py-2.5 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:bg-white transition-all"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="bg-primary-600 text-white p-2.5 rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  <Send size={16} md:size={18} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChef;
