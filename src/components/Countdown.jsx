import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sunrise, Sunset, Calendar as CalendarIcon, Timer, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { ramadanTimetable, RAMADAN_CALENDAR, DEV_MODE } from '../data';

export function Countdown() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [nextEvent, setNextEvent] = useState('iftar');
  const [activeTab, setActiveTab] = useState('countdown');

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const todayData = DEV_MODE
    ? ramadanTimetable[0]
    : (() => {
        const todayStr = currentTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        return ramadanTimetable.find(d => d.date.includes(todayStr));
      })();

  useEffect(() => {
    if (!todayData) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const [fajrH, fajrM] = todayData.fajr.split(':').map(Number);
      const [iftarH, iftarM] = todayData.maghrib.split(':').map(Number);
      
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      const fajrMinutes = fajrH * 60 + fajrM;
      const iftarMinutes = iftarH * 60 + iftarM;

      let targetDate = new Date();
      let targetH, targetM;

      if (nowMinutes < fajrMinutes) {
        targetH = fajrH; targetM = fajrM; setNextEvent('sahur');
      } else if (nowMinutes < iftarMinutes) {
        targetH = iftarH; targetM = iftarM; setNextEvent('iftor');
      } else {
        targetH = fajrH; targetM = fajrM;
        targetDate.setDate(targetDate.getDate() + 1);
        setNextEvent('sahur');
      }

      targetDate.setHours(targetH, targetM, 0, 0);
      const diff = targetDate - now;

      setTimeLeft({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [todayData]);

  const getPrayerStatus = (timeStr) => {
    if (!timeStr) return { isPast: true, remaining: null };
    const [h, m] = timeStr.split(':').map(Number);
    const pDate = new Date();
    pDate.setHours(h, m, 0, 0);
    const diff = pDate - currentTime;
    return { isPast: diff <= 0 };
  };

  const prayers = [
    { id: 'fajr', label: 'Bomdod (Saharlik)', time: todayData?.fajr },
    { id: 'shuruk', label: 'Quyosh', time: todayData?.shuruk },
    { id: 'dhuhr', label: 'Peshin', time: todayData?.dhuhr },
    { id: 'asr', label: 'Asr', time: todayData?.asr },
    { id: 'maghrib', label: 'Shom (Iftor)', time: todayData?.maghrib },
    { id: 'isha', label: 'Xufton', time: todayData?.isha },
  ];

  const nextPrayerId = prayers.find(p => !getPrayerStatus(p.time).isPast)?.id;
  const format = (n) => String(n).padStart(2, '0');

  return (
    <div className="min-h-full pb-20">
      <main className="max-w-md mx-auto px-6 py-4">
        
        {/* Top Segmented Control (iOS style) */}
        <div className="flex bg-slate-100/50 p-1 rounded-[1.4rem] mb-8 border border-white shadow-inner">
          {[
            { id: 'countdown', icon: Timer, label: 'Taymer' },
            { id: 'prayer', icon: Clock, label: 'Vaqtlar' },
            { id: 'calendar', icon: CalendarIcon, label: 'Taqvim' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)} 
              className={`relative flex-1 py-2.5 rounded-[1.1rem] flex items-center justify-center gap-2 transition-all duration-500 ${activeTab === tab.id ? 'text-emerald-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {activeTab === tab.id && (
                <motion.div layoutId="activeSubTab" className="absolute inset-0 bg-white shadow-sm rounded-[1.1rem] z-0" />
              )}
              <tab.icon size={16} className="relative z-10" /> 
              <span className="relative z-10 text-[11px] font-bold tracking-tight">{tab.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'countdown' && (
            <motion.div 
              key="timer"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative overflow-hidden bg-gradient-to-br from-white to-emerald-50/30 rounded-[3rem] border border-white p-10 text-center shadow-xl shadow-emerald-900/5"
            >
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 rounded-[2.2rem] bg-emerald-600 flex items-center justify-center text-white shadow-2xl shadow-emerald-600/30 ring-8 ring-emerald-50">
                  {nextEvent === 'sahur' ? <Sunrise size={32} /> : <Sunset size={32} />}
                </div>
              </div>
              
              <h2 className="text-4xl font-black text-slate-800 mb-1 tracking-tight">
                {nextEvent === 'sahur' ? 'Saharlik' : 'Iftorlik'}
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600/60 mb-12">qolgan vaqt</p>

              <div className="flex justify-between items-center max-w-[240px] mx-auto">
                {['hours', 'minutes', 'seconds'].map((unit, i) => (
                  <div key={unit} className="flex flex-col items-center">
                    <span className="text-5xl tabular-nums font-black text-slate-900 tracking-tighter">
                      {format(timeLeft[unit])}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 mt-2">
                      {unit.slice(0, 3)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'prayer' && (
            <motion.div 
              key="prayers"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {prayers.map((prayer) => {
                const { isPast } = getPrayerStatus(prayer.time);
                const isNext = nextPrayerId === prayer.id;
                return (
                  <div 
                    key={prayer.id} 
                    className={`group flex items-center justify-between p-5 rounded-[1.8rem] transition-all duration-300 ${isNext ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 scale-[1.02]' : 'bg-white/60 border border-white hover:bg-white'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${isNext ? 'bg-white/20' : isPast ? 'bg-slate-50' : 'bg-emerald-50'}`}>
                        {isPast ? <CheckCircle2 size={18} className="text-emerald-500/40" /> : <Clock size={18} className={isNext ? 'text-white' : 'text-emerald-600'} />}
                      </div>
                      <span className={`font-bold text-[15px] ${isPast ? 'text-slate-400' : ''}`}>{prayer.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-black tabular-nums ${isPast ? 'text-slate-300' : ''}`}>{prayer.time}</span>
                      <ChevronRight size={14} className={isNext ? 'text-white/50' : 'text-slate-200'} />
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

{activeTab === 'calendar' && (
  <motion.div 
    key="cal"
    initial={{ opacity: 0, scale: 0.95 }} 
    animate={{ opacity: 1, scale: 1 }} 
    exit={{ opacity: 0, scale: 0.95 }}
    className="bg-white/90 backdrop-blur-md rounded-[2.5rem] border border-white p-4 shadow-xl shadow-black/5 overflow-hidden"
  >
    {/* Sarlavha qismi */}
    <div className="grid grid-cols-7 gap-1 pb-3 mb-2 border-b border-slate-100 text-[9px] font-black uppercase tracking-tighter text-slate-400 text-center">
      <div>Sana</div> {/* "Kun" dan "Sana" ga o'zgartirildi */}
      <div>Bomdod</div>
      <div>Quyosh</div>
      <div>Peshin</div>
      <div>Asr</div>
      <div className="text-emerald-600">Shom</div>
      <div>Xufton</div>
    </div>

    <div className="max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
      {ramadanTimetable.map((item, index) => {
        // Bugungi kunni aniqlash
        const isToday = item.date.includes(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }));
        
        // JSONdagi "February 19 Thu" formatidan "19 Fev" qismini ajratib olish
        const dateParts = item.date.split(' ');
        const formattedDate = `${dateParts[1]} ${dateParts[0].substring(0, 3)}`;

        return (
          <div 
            key={index} 
            className={`grid grid-cols-7 gap-1 py-3 border-b border-slate-50 items-center text-center transition-all
              ${isToday ? 'bg-emerald-50 rounded-xl text-emerald-700' : 'text-slate-600'}
              ${index % 2 === 0 ? '' : 'bg-slate-50/30'}
            `}
          >
            {/* Ramazon kuni va Milodiy sana */}
            <div className="flex flex-col items-center justify-center leading-tight">
              <span className="text-[10px] font-black">
                {item.day < 10 ? `0${item.day}` : item.day}
              </span>
              <span className="text-[7px] uppercase font-medium opacity-40">
                {formattedDate}
              </span>
            </div>
            
            {/* Vaqtlar */}
            <div className="text-[11px] font-bold">{item.fajr}</div>
            <div className="text-[11px] font-medium opacity-50">{item.sunrise || item.shuruk}</div>
            <div className="text-[11px] font-medium opacity-50">{item.dhuhr}</div>
            <div className="text-[11px] font-medium opacity-50">{item.asr}</div>
            
            {/* Shom / Iftor */}
            <div className={`text-[12px] font-black ${isToday ? 'text-emerald-700' : 'text-emerald-600'}`}>
              {item.maghrib}
            </div>
            
            <div className="text-[11px] font-medium opacity-50">{item.isha}</div>
          </div>
        );
      })}
    </div>
  </motion.div>
)}
        </AnimatePresence>
      </main>
    </div>
  );
}