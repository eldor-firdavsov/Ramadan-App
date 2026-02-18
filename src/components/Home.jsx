import { useEffect, useState } from 'react';
import { Moon, Sunrise, Sunset, MapPin, BookOpen, Sun } from 'lucide-react';
import { ramadanTimetable } from '../data'; // DEV_MODE importdan olib tashlandi
import { motion, AnimatePresence } from 'framer-motion';

export function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Bugungi ma'lumotlarni real vaqt bo'yicha topish
  const todayData = ramadanTimetable.find(d => 
    d.date.includes(currentTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }))
  );

  if (!todayData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        Bugun uchun ma'lumot topilmadi
      </div>
    );
  }

  const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const [sH, sM] = todayData.fajr.split(':').map(Number);
  const [iH, iM] = todayData.maghrib.split(':').map(Number);
  
  const isFasting = nowMinutes >= (sH * 60 + sM) && nowMinutes < (iH * 60 + iM);

  // Duolar ma'lumoti
  const duaData = isFasting 
    ? {
        title: "Iftorlik duosi",
        arabic: "اَللَّهُمَّ لَكَ صُمْتُ وَ بِكَ آمَنْتُ وَ عَلَيْكَ تَوَكَّلْتُ وَ عَلَى رِزْقِكَ أَفْتَرْتُ، فَغْفِرْلِى مَا قَدَّمْتُ وَ مَا أَخَّرْتُ بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ",
        reading: "Allohumma laka sumtu va bika aamantu va ’alayka tavakkaltu va ’alaa rizqika aftortu, fag‘firlii yaa G‘offaru maa qoddamtu va maa axxortu, birohmatika yaa arhamar-Rohimiyn",
        translation: "Ey Alloh, ushbu Ro‘zamni Sen uchun tutdim va Senga iymon keltirdim va Senga tavakkal qildim va bergan rizqing bilan iftor qildim. Ey mehribonlarning eng mehriboni, mening avvalgi va keyingi gunohlarimni mag‘firat qilgil."
      }
    : {
        title: "Saharlik (Niyat) duosi",
        arabic: "نَوَيْتُ أَنْ أَصُومَ صَوْمَ شَهْرَ رَمَضَانَ مِنَ الْفَجْرِ إِلَى الْمَغْرِبِ، خَالِصًا لِلهِ تَعَالَى أَللهُ أَكْبَرُ",
        reading: "Navaytu an asuuma sovma shahri ramazona minal-fajri ilal-mag‘ribi, xolisan lillahi ta’aalaa. Alloh-u akbar",
        translation: "Ramazon oyining ro‘zasini subhdan to kun botguncha tutmoqni niyat qildim. Xolis Alloh uchun Alloh buyukdir."
      };

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-slate-800 font-sans pb-20">
      <main className="max-w-md mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 px-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <Moon size={18} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight text-slate-900 uppercase">Ramazon 1447</h1>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                <MapPin size={10} /> Urgut, Samarqand
              </div>
            </div>
          </div>
          <div className="text-right">
             <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Bugun</div>
             <div className="text-sm font-black text-slate-900">{currentTime.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long' })}</div>
          </div>
        </div>

        {/* Status Card */}
        <div className={`relative overflow-hidden rounded-[2.5rem] p-8 mb-6 ${isFasting ? 'bg-emerald-600 shadow-emerald-100' : 'bg-slate-900 shadow-slate-200'} text-white shadow-2xl transition-colors duration-500`}>
          <div className="relative z-10 flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70 mb-1">Hozirgi holat</p>
              <h2 className="text-4xl font-black tracking-tight">{isFasting ? "Ro'za" : "Iftor"}</h2>
            </div>
            <div className="text-right">
              <div className="text-2xl font-light opacity-90">{currentTime.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Dua Card */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={isFasting ? 'iftor' : 'sahar'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-[2rem] p-6 mb-6 border border-slate-100 shadow-sm relative group"
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={14} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{duaData.title}</span>
            </div>
            <p className="text-xl font-arabic text-right text-slate-800 leading-loose mb-3" dir="rtl">
              {duaData.arabic}
            </p>
            <p className="text-xs font-bold text-emerald-700 leading-relaxed mb-2">
              {duaData.reading}
            </p>
            <p className="text-[10px] text-slate-400 leading-relaxed italic">
              "{duaData.translation}"
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Times Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-3">
              <Sun size={20} />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bomdod</p>
            <h3 className="text-xl font-black text-slate-900">{todayData.fajr}</h3>
          </div>

          <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <Sunset size={20} />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Iftorlik (Shom)</p>
            <h3 className="text-xl font-black text-slate-900">{todayData.maghrib}</h3>
          </div>
        </div>

        {/* Ramazon Progress */}
        <div className="mt-6 bg-white rounded-3xl p-5 border border-slate-100 flex items-center justify-between shadow-sm">
           <div className="flex gap-4">
              <div className="text-center">
                <div className="text-lg font-black text-slate-900">{todayData.day}</div>
                <div className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Kun</div>
              </div>
              <div className="w-[1px] bg-slate-100 h-8"></div>
              <div className="text-center">
                <div className="text-lg font-black text-slate-900">{30 - todayData.day}</div>
                <div className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Qoldi</div>
              </div>
           </div>
           <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">
             {Math.round((todayData.day / 30) * 100)}% yakunlandi
           </div>
        </div>

      </main>
    </div>
  );
}