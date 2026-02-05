import { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

export function Tasbih({ tasbih, setTasbih }) {
  const [tapped, setTapped] = useState(false);

  const increment = () => {
    setTapped(true);
    setTimeout(() => setTapped(false), 140);
    const today = tasbih.today + 1;
    const monthly = tasbih.monthlyTotal + 1;
    const data = { today, monthlyTotal: monthly, date: new Date().toDateString() };
    setTasbih(data);
    localStorage.setItem('tasbihData', JSON.stringify(data));
  };

  const resetToday = () => {
    if (!window.confirm('Reset?')) return;
    const data = { ...tasbih, today: 0 };
    setTasbih(data);
    localStorage.setItem('tasbihData', JSON.stringify(data));
  };

  return (
    <div className="bg-[#FFFFFF] min-h-screen pt-8 px-5 max-w-md mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="pt-8 text-center font-medium text-gray-800 text-xl">Tasbih</div>
        <button onClick={increment} className="w-full py-28 flex flex-col items-center justify-center focus:outline-none">
          <div className={`text-9xl font-semibold text-gray-900 tracking-tighter transition-all ${tapped ? 'scale-110' : 'scale-100'}`}>
            {tasbih.today}
          </div>
          <div className="mt-3 text-gray-500">bugun</div>
        </button>
        <div className="px-8 pb-8 flex items-center justify-between text-sm">
          <div className="text-gray-600">Oylik: <span className="font-medium text-emerald-700">{tasbih.monthlyTotal}</span></div>
          <button onClick={resetToday} className="flex items-center gap-1 text-gray-500 hover:text-red-500"><RotateCcw size={17} /> Tozalash</button>
        </div>
      </div>
    </div>
  );
}