import './App.css'
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Home } from './components/Home';
import { DailyRoutine } from './components/DailyRoutine';
import { Countdown } from './components/Countdown';
import { Tasbih } from './components/Tasbih';
import { Home as HomeIcon, CheckSquare, Clock, Circle } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef(null);

  const [tasbih, setTasbih] = useState(() => {
    // localStorage'dan ma'lumotni yuklash
    const saved = localStorage.getItem('tasbihData');
    return saved ? JSON.parse(saved) : { today: 0, monthlyTotal: 0, date: new Date().toDateString() };
  });

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      // Hujjatdagi kabi iOS 26 uslubida header rangini sozlash
      tg.setHeaderColor('#059669'); 
    }
  }, []);

  // Minimize on scroll mantiqi (Hujjatdagi tabBarMinimizeBehavior: 'onScrollDown' kabi)
  const handleScroll = (e) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (scrollTop > 50) {
      setIsScrolling(true);
    } else {
      setIsScrolling(false);
    }
  };

  const [routine, setRoutine] = useState([
    { id: 'fajr', label: 'Bomdod Namozi', completed: false },
    { id: 'dhuhr', label: 'Peshin Namozi', completed: false },
    { id: 'asr', label: 'Asr Namozi', completed: false },
    { id: 'maghrib', label: 'Shom Namozi', completed: false },
    { id: 'isha', label: 'Xufton Namozi', completed: false },
    { id: 'fasting', label: 'Ro‘za (Og‘iz yopish)', completed: false },
    { id: 'tarawih', label: 'Taroveh', completed: false },
    { id: 'quran', label: 'Qur’on mutolaasi', completed: false },
    { id: 'zikr', label: 'Kundalik zikrlar', completed: false },
  ]);


  const navItems = [
    { id: 'home', label: 'Asosiy', icon: HomeIcon },
    { id: 'countdown', label: 'Vaqtlar', icon: Clock },
    { id: 'routine', label: 'Vazifalar', icon: CheckSquare },
    { id: 'tasbih', label: 'Tasbeh', icon: Circle },
  ];

  const handleTabChange = (id) => {
    if (currentPage !== id) {
      setCurrentPage(id);
      // Telegram Native Haptic Feedback (Hujjatga mos ravishda)
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-slate-900 font-sans overflow-hidden relative">
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[60%] h-[40%] bg-emerald-100/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[5%] right-[-5%] w-[50%] h-[40%] bg-orange-50/30 rounded-full blur-[100px]" />
      </div>

      <main 
        onScroll={handleScroll}
        className="relative h-screen w-full z-10 overflow-y-auto overflow-x-hidden scroll-smooth"
      >
        <LayoutGroup>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="min-h-full w-full px-4 pb-44 pt-8"
            >
              <div className="max-w-md mx-auto">
                {currentPage === 'home' && <Home />}
                {currentPage === 'countdown' && <Countdown />}
                {currentPage === 'routine' && <DailyRoutine routine={routine} setRoutine={setRoutine} />}
                {currentPage === 'tasbih' && <Tasbih tasbih={tasbih} setTasbih={setTasbih} />}
              </div>
            </motion.div>
          </AnimatePresence>
        </LayoutGroup>
      </main>

      {/* Native Style Bottom Tabs 
          `isScrolling` bo'lganda menyu kichrayadi (Minimize behavior)
      */}
      <nav className={`fixed bottom-0 left-0 right-0 z-[100] px-6 pb-10 pt-4 transition-all duration-500 ease-out ${isScrolling ? 'translate-y-4 scale-95 opacity-80' : 'translate-y-0 scale-100 opacity-100'}`}>
        <div className="max-w-[420px] mx-auto relative group">
          
          {/* Liquid Glass Layer */}
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[30px] rounded-[2.5rem] border border-white/80 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] ring-1 ring-black/[0.02]" />
          
          <div className="relative flex justify-around items-center h-[76px] px-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className="relative flex-1 flex flex-col items-center justify-center h-full touch-none outline-none"
                >
                  <div className="relative py-2 px-4 flex flex-col items-center">
                    {/* Active Glow Indicator */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div 
                          layoutId="activeTabGlow"
                          className="absolute inset-0 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-900/20"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                        />
                      )}
                    </AnimatePresence>
                    
                    <div className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400'}`}>
                      <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                    </div>

                    {!isScrolling && isActive && (
                      <motion.span 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -bottom-4 text-[9px] font-black uppercase tracking-widest text-emerald-900 whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}