import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Fingerprint, Clock, Sparkles } from 'lucide-react';

export function Tasbih({ tasbih, setTasbih }) {
  const [tapped, setTapped] = useState(false);

  // 1. Hisobni oshirish funksiyasi
  const increment = () => {
    const tg = window.Telegram?.WebApp;
    const nextToday = (tasbih.today || 0) + 1;
    const nextMonthly = (tasbih.monthlyTotal || 0) + 1;

    

    // Animatsiya holati
    setTapped(true);
    setTimeout(() => setTapped(false), 100);

    // Ma'lumotni saqlash
    const newData = { 
      ...tasbih, 
      today: nextToday, 
      monthlyTotal: nextMonthly, 
      date: new Date().toDateString() 
    };
    
    setTasbih(newData);
    localStorage.setItem('tasbihData', JSON.stringify(newData));
  };

  // 2. FAQAT kunlikni tozalash funksiyasi (Oylik saqlanib qoladi)
  const resetTodayOnly = () => {
    // 1. Foydalanuvchidan tasdiqlash so'rash
    const isConfirmed = window.confirm("Bugungi sanoqni nolga tushirasizmi? (Oylik jami o'chmaydi)");

    if (isConfirmed) {
      // 2. State-ni "prev" orqali yangilash (Eng xavfsiz usul)
      setTasbih(prev => {
        const updatedData = {
          ...prev,
          today: 0
          // monthlyTotal-ga tegmaymiz, u avtomatik saqlanib qoladi
        };
        
        // 3. LocalStorage-ni ham shu yerning o'zida yangilaymiz
        localStorage.setItem('tasbihData', JSON.stringify(updatedData));
        
        return updatedData;
      });

      // 4. Vibratsiya berish
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-2">
      
      {/* Asosiy Tasbeh Kartasi */}
      <div className="w-full max-w-[360px] bg-white rounded-[3.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-emerald-50/50 p-8 relative overflow-hidden">
        
        {/* Yuqori Panel: Oylik va Reset */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 bg-emerald-50/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-emerald-100/50">
            <Sparkles size={14} className="text-emerald-600" />
            <span className="text-[11px] font-black text-emerald-800 uppercase tracking-tighter">
              Jami: {tasbih.monthlyTotal || 0}
            </span>
          </div>
          
          <button 
            onClick={resetTodayOnly}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-300 hover:text-red-500 active:scale-90 transition-all duration-200"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {/* Bosish Maydoni */}
        <button 
          onClick={increment}
          className="w-full flex flex-col items-center justify-center py-12 touch-none outline-none select-none group"
        >
          <div className="relative">
            {/* Raqam Animatsiyasi */}
            <motion.div 
              animate={tapped ? { scale: 0.85, y: 5 } : { scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className={`text-[130px] font-black leading-none tracking-tighter select-none ${tapped ? 'text-emerald-600' : 'text-slate-800'}`}
            >
              {tasbih.today || 0}
            </motion.div>
          </div>

          <motion.div 
            animate={tapped ? { opacity: 1, y: -5 } : { opacity: 0.5, y: 0 }}
            className="mt-8 flex items-center gap-2 text-slate-400"
          >
            <Fingerprint size={18} className={tapped ? 'text-emerald-500' : ''} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Zikr qilish</span>
          </motion.div>
        </button>

        {/* Dekorativ Chiziqlar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-100 to-transparent opacity-50" />
      </div>

      {/* Pastki Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-10 flex items-center gap-3 text-slate-400 bg-white/40 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/50"
      >
        <Clock size={14} />
        <span className="text-[11px] font-medium tracking-tight">
          Oxirgi faollik: <span className="text-slate-600 font-bold">{tasbih.date || "Hozir"}</span>
        </span>
      </motion.div>

    </div>
  );
}