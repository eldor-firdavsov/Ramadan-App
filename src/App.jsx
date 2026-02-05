import './App.css'
import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Home } from './components/Home';
import { DailyRoutine } from './components/DailyRoutine';
import { Countdown } from './components/Countdown';
import { Tasbih } from './components/Tasbih';
import { Home as HomeIcon, CheckSquare, Clock, Circle } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
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
  const [tasbih, setTasbih] = useState({ today: 0, monthlyTotal: 0, date: new Date().toDateString() });

  const navItems = [
    { id: 'home', label: 'Asosiy', icon: HomeIcon },
    { id: 'countdown', label: 'Vaqtlar', icon: Clock },
    { id: 'routine', label: 'Vazifalar', icon: CheckSquare },
    { id: 'tasbih', label: 'Tasbeh', icon: Circle },
  ];

  const handleTabChange = (id) => {
    if (currentPage !== id) {
      setCurrentPage(id);
      if (typeof window !== 'undefined' && window.navigator.vibrate) {
        window.navigator.vibrate(10); // Haptic feedback
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-slate-900 font-sans selection:bg-emerald-100 overflow-hidden relative">
      
      {/* iOS Style Background Blur Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-100/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-orange-100/20 rounded-full blur-[100px]" />
      </div>

      {/* Modern Status Notch */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-slate-200/50 rounded-b-2xl z-[100] backdrop-blur-md" />

      <main className="relative h-screen w-full z-10 overflow-hidden">
        <LayoutGroup>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 12, scale: 0.98, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, scale: 0.98, filter: "blur(10px)" }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                mass: 0.8
              }}
              className="h-full w-full overflow-y-auto px-4 pb-36 pt-6 scroll-smooth"
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

      {/* Perfect Liquid Glass Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-[100] px-6 pb-8 pt-4 pointer-events-none">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-[400px] mx-auto pointer-events-auto"
        >
          <div className="relative group shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
            {/* The Ultimate Glass Layer */}
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[32px] rounded-[2.5rem] border border-white/60 ring-1 ring-black/[0.03]" />
            
            <div className="relative flex justify-around items-center h-[80px] px-3">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className="relative flex-1 flex flex-col items-center justify-center h-full z-10 transition-all active:scale-90 touch-none outline-none"
                  >
                    <div className="relative py-2 px-4 rounded-2xl flex flex-col items-center gap-1.5">
                      {/* Animated Glow Backlight */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div 
                            layoutId="navGlow"
                            className="absolute inset-0 bg-emerald-600 rounded-[1.5rem] shadow-[0_10px_20px_rgba(5,150,105,0.25)]"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </AnimatePresence>
                      
                      <div className={`relative z-20 transition-all duration-500 ${isActive ? 'text-white scale-110' : 'text-slate-400'}`}>
                        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                      </div>

                      <AnimatePresence>
                        {isActive && (
                          <motion.span 
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute -bottom-3.5 text-[10px] font-black uppercase tracking-[0.15em] text-emerald-800 whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </nav>
    </div>
  );
}