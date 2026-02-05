import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

const initialRoutine = [
  { id: 'fajr', label: 'Fajr Namoz', completed: false },
  { id: 'dhuhr', label: 'Dhuhr Namoz', completed: false },
  { id: 'asr', label: 'Asr Namoz', completed: false },
  { id: 'maghrib', label: 'Maghrib Namoz', completed: false },
  { id: 'isha', label: 'Isha Namoz', completed: false },
  { id: 'fasting', label: 'Ro‘za', completed: false },
  { id: 'tarawih', label: 'Taroveh', completed: false },
  { id: 'quran', label: 'Qur’on o‘qish', completed: false },
  { id: 'zikr', label: 'Zikr', completed: false },
];

export function DailyRoutine({ routine, setRoutine }) {
  const toggleItem = (id) => {
    const updated = routine.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setRoutine(updated);
    localStorage.setItem('dailyRoutine', JSON.stringify(updated));
  };

  useEffect(() => {
    const saved = localStorage.getItem('dailyRoutine');
    if (saved) setRoutine(JSON.parse(saved));
    else setRoutine(initialRoutine);
  }, [setRoutine]);

  const completedCount = routine.filter((item) => item.completed).length;
  const totalCount = routine.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <div className="px-4 py-6 max-w-md mx-auto bg-[#FFFFFF] min-h-screen space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm font-medium">
          <span>Bugungi progress</span>
          <span>{completedCount}/{totalCount}</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-600 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        {routine.map((item) => (
          <button key={item.id} onClick={() => toggleItem(item.id)} className="w-full flex items-center gap-4 py-4 px-5 active:bg-gray-50">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border-2 ${item.completed ? 'bg-emerald-600 border-emerald-600' : 'border-gray-200 bg-white'}`}>
              {item.completed && <Check className="w-5 h-5 text-white" strokeWidth={3} />}
            </div>
            <span className={`text-base font-medium ${item.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}