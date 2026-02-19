import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Fingerprint, Sparkles, BookOpen, Info } from 'lucide-react';

// Siz yuborgan ro'yxatni shu yerga import qiling yoki joylashtiring
import { ZIKRLAR } from '../data/'; 

const CLASSIC_ZIKRS = [
  { name: "Subhanallah", arabic: "سُبْحَانَ اللَّهِ", uz_reading: "Subhanalloh", uz_translation: "Alloh barcha ayb-nuqsonlardan pokdir." },
  { name: "Alhamdulillah", arabic: "الْحَمْدُ لِلَّهِ", uz_reading: "Alhamdulillah", uz_translation: "Allohga hamd bo'lsin." },
  { name: "Allahu Akbar", arabic: "اللَّهُ أَكْبَرُ", uz_reading: "Allohu Akbar", uz_translation: "Alloh buyukdir." }
];

export function Tasbih({ tasbih, setTasbih }) {
  const [tapped, setTapped] = useState(false);
  const [mode, setMode] = useState('classic'); 
  const [zikrIndex, setZikrIndex] = useState(0);
  const [showPurpose, setShowPurpose] = useState(false);
  const [zikrCount, setZikrCount] = useState(0);


  
  const increment = () => {
    const tg = window.Telegram?.WebApp;
    const currentToday = tasbih.today || 0;
  
    if (mode === 'classic' && currentToday >= 99) {
      tg?.HapticFeedback?.notificationOccurred('error');
      return;
    }
  
    const nextToday = currentToday + 1;
    const nextMonthly = (tasbih.monthlyTotal || 0) + 1;
  
    if (mode === 'zikr') {
      const nextZikrCount = zikrCount + 1;
  
      if (nextZikrCount % 11 === 0) {
        tg?.HapticFeedback?.notificationOccurred('medium');
  
        setZikrIndex((prev) =>
          prev + 1 >= ZIKRLAR.length ? prev : prev + 1
        );
  
        setShowPurpose(false);
      } else {
        tg?.HapticFeedback?.impactOccurred('light');
      }
  
      setZikrCount(nextZikrCount);
    } else {
      if (nextToday === 33 || nextToday === 66 || nextToday === 99) {
        tg?.HapticFeedback?.notificationOccurred('success');
      } else {
        tg?.HapticFeedback?.impactOccurred('light');
      }
    }
  
    const newData = {
      ...tasbih,
      today: nextToday,
      monthlyTotal: nextMonthly,
      date: new Date().toDateString()
    };
  
    setTasbih(newData);
    localStorage.setItem('tasbihData', JSON.stringify(newData));
  
    setTapped(true);
    setTimeout(() => setTapped(false), 100);
  };
  
  const handleReset = () => {
    if (window.confirm("Barcha sanoqlarni nollashni xohlaysizmi?")) {
      const resetData = {
        ...tasbih,
        today: 0,
        monthlyTotal: 0
      };
      setTasbih(resetData);
      setZikrIndex(0);
      localStorage.setItem('tasbihData', JSON.stringify(resetData));
      
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('warning');
      }
    }
  };

  const resetAll = () => {
    if (window.confirm("Sanoqni boshidan boshlaysizmi?")) {
      setTasbih({ ...tasbih, today: 0 });
      setZikrIndex(0);
    }
  };

  const currentData = mode === 'classic' 
    ? (tasbih.today < 33 ? CLASSIC_ZIKRS[0] : tasbih.today < 66 ? CLASSIC_ZIKRS[1] : CLASSIC_ZIKRS[2])
    : ZIKRLAR[zikrIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 space-y-4">
      
      <div className="flex bg-white/60 backdrop-blur-xl p-1.5 rounded-[2rem] border border-white shadow-inner w-full max-w-[320px]">
        <button 
          onClick={() => { setMode('classic'); setTasbih({...tasbih, today: 0}); }}
          className={`flex-1 py-3 rounded-[1.6rem] text-[11px] font-black uppercase tracking-wider transition-all ${mode === 'classic' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400'}`}
        >
          Klassik
        </button>
        <button 
          onClick={() => { setMode('zikr'); setTasbih({...tasbih, today: 0}); setZikrIndex(0); }}
          className={`flex-1 py-3 rounded-[1.6rem] text-[11px] font-black uppercase tracking-wider transition-all ${mode === 'zikr' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400'}`}
        >
          Salovatlar
        </button>
      </div>

      <div className="w-full max-w-[400px] bg-white rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] border border-emerald-50/50 p-8 relative overflow-hidden">
        
        <div className="text-center min-h-[160px] flex flex-col justify-center relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentData.arabic + zikrIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="space-y-3"
            >
              <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] opacity-60">
                {mode === 'classic' ? currentData.name : `Salovat ${zikrIndex + 1}`}
              </h3>
              <p className="text-2xl font-arabic text-slate-800 leading-relaxed dir-rtl" style={{ fontFamily: 'Amiri, serif' }}>
                {currentData.arabic}
              </p>
              <div className="space-y-1 px-4">
                <p className="text-xs font-bold text-emerald-900 leading-tight">{currentData.uz_reading}</p>
                <p className="text-[10px] text-slate-400 leading-snug">{currentData.uz_translation}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Maqsadi (Purpose) uchun info tugmasi faqat Salovat rejimida */}
          {mode === 'zikr' && currentData.purpose && (
            <button 
              onClick={() => setShowPurpose(!showPurpose)}
              className="absolute -top-2 -right-2 p-2 text-emerald-300 hover:text-emerald-600 transition-colors"
            >
              <Info size={18} />
            </button>
          )}
        </div>

        {/* Maqsad (Purpose) Popup */}
        <AnimatePresence>
          {showPurpose && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-emerald-50 rounded-2xl mb-4"
            >
              <p className="p-4 text-[10px] text-emerald-800 italic leading-relaxed">
                <Sparkles size={12} className="inline mr-2 mb-1" />
                {currentData.purpose}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Asosiy Sanoq Tugmasi */}
        <button 
          onClick={increment}
          className="w-full flex flex-col items-center justify-center py-4 select-none outline-none group active:opacity-80"
        >
          <div className="relative">
            <motion.div 
              animate={tapped ? { scale: 0.8, y: 10 } : { scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 600, damping: 20 }}
              className={`text-[110px] font-black leading-none tracking-tighter transition-colors ${mode === 'classic' && tasbih.today >= 99 ? 'text-red-500' : 'text-slate-900'}`}
            >
              {tasbih.today || 0}
            </motion.div>
            {mode === 'classic' && (
              <span className="absolute -right-8 bottom-6 text-[10px] font-black text-slate-200">/99</span>
            )}
          </div>
          
          <div className="mt-4 flex items-center gap-3 bg-slate-50 px-8 py-3 rounded-3xl border border-slate-100 transition-all group-active:scale-95">
            <Fingerprint size={18} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Bosish</span>
          </div>
        </button>

        {/* Pastki Stats va Reset */}
        <div className="mt-8 pt-8 border-t border-slate-50 flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block">Oylik jami</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xl font-black text-slate-800">{tasbih.monthlyTotal}</span>
            </div>
          </div>
          
          <button 
            onClick={resetAll} 
            className="w-14 h-14 flex items-center justify-center rounded-[1.5rem] bg-slate-50 text-slate-300 hover:text-red-500 hover:bg-red-50 active:scale-90 transition-all duration-300 shadow-sm"
          >
            <RotateCcw size={22} />
          </button>
        </div>

      </div>

      <div className="flex items-center gap-2 text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">
        <BookOpen size={12} />
        <span>{mode === 'classic' ? "33/66/99 marralar" : "Har 11 bosishda almashadi"}</span>
      </div>
    </div>
  );
}