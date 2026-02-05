import { useEffect, useState } from 'react';
import { Moon, Sunrise, Sunset, MapPin } from 'lucide-react';
import { ramadanTimetable, DEV_MODE } from '../data';

export function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayData = DEV_MODE ? ramadanTimetable[0] : 
    ramadanTimetable.find(d => d.date.includes(currentTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })));

  if (!todayData) return null;

  const isFasting = (() => {
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    const [sH, sM] = todayData.fajr.split(':').map(Number);
    const [iH, iM] = todayData.maghrib.split(':').map(Number);
    return now >= (sH * 60 + sM) && now < (iH * 60 + iM);
  })();

  return (
    <div className="bg-[#FFFFFF] min-h-screen text-slate-800 font-sans">
      <main className="max-w-md mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-10 px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white">
              <Moon size={16} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-900">Ramazon 1447</h1>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                <MapPin size={10} /> Samarqand, Urgut
              </div>
            </div>
          </div>
          <div className="text-right text-sm font-bold text-slate-900">
            {currentTime.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long' })}
          </div>
        </div>

        <div className={`relative overflow-hidden rounded-[2rem] p-8 mb-8 ${isFasting ? 'bg-emerald-600' : 'bg-slate-900'} text-white shadow-xl`}>
          <div className="relative z-10 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-2">Hozirgi holat</p>
            <h2 className="text-4xl font-bold tracking-tight mb-1">{isFasting ? "Ro'za" : "Iftor"}</h2>
            <div className="text-sm font-medium opacity-80">{currentTime.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 mb-8 border border-slate-100 shadow-sm flex justify-around items-center">
          <div className="text-center">
            <div className="text-2xl font-black text-slate-900">{todayData.day}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kuni</div>
          </div>
          <div className="h-8 w-[1px] bg-slate-100"></div>
          <div className="text-center">
            <div className="text-2xl font-black text-slate-900">{30 - todayData.day}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kun qoldi</div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Sunrise size={24} /></div>
              <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Saharlik</p><h3 className="text-lg font-bold">Bomdod</h3></div>
            </div>
            <div className="text-2xl font-black text-slate-900">{todayData.fajr}</div>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center"><Sunset size={24} /></div>
              <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Iftorlik</p><h3 className="text-lg font-bold">Shom</h3></div>
            </div>
            <div className="text-2xl font-black text-slate-900">{todayData.maghrib}</div>
          </div>
        </div>
      </main>
    </div>
  );
}