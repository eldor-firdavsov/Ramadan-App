import { useState, useEffect } from 'react';
import { Check, Plus, Trash2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_ROUTINE = [
  { id: 'fajr', label: 'Bomdod Namozi', completed: false },
  { id: 'dhuhr', label: 'Peshin Namozi', completed: false },
  { id: 'asr', label: 'Asr Namozi', completed: false },
  { id: 'maghrib', label: 'Shom Namozi', completed: false },
  { id: 'isha', label: 'Xufton Namozi', completed: false },
  { id: 'fasting', label: "Ro'za tutish", completed: false },
  { id: 'tarawih', label: 'Taroveh', completed: false },
  { id: 'quran', label: "Qur'on o'qish", completed: false },
  { id: 'zikr', label: 'Zikr va Salovat', completed: false },
];

export function DailyRoutine({ routine, setRoutine }) {
  const [inputValue, setInputValue] = useState('');

    useEffect(() => {
    const saved = localStorage.getItem('dailyRoutine');
    const lastResetDate = localStorage.getItem('lastResetDate');
    const today = new Date().toDateString(); // Masalan: "Mon Feb 16 2026"

    let initialData = saved ? JSON.parse(saved) : DEFAULT_ROUTINE;

    // Agar saqlangan sana bugungiga teng bo'lmasa - hamma narsani 0 qilamiz
    if (lastResetDate !== today) {
      initialData = initialData.map(item => ({ ...item, completed: false }));
      
      // Yangilangan holatni saqlaymiz
      localStorage.setItem('dailyRoutine', JSON.stringify(initialData));
      localStorage.setItem('lastResetDate', today);
    }

    setRoutine(initialData);
  }, [setRoutine]);

  // Taskni holatini o'zgartirish
  const toggleItem = (id) => {
    const updated = routine.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    saveAndSet(updated);
    
    // Haptic feedback (Telegram uchun)
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
  };

  // Yangi task qo'shish
  const addTask = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const newTask = {
      id: Date.now().toString(),
      label: inputValue,
      completed: false,
      isCustom: true // O'chirish imkoni bo'lishi uchun
    };
    
    saveAndSet([...routine, newTask]);
    setInputValue('');
  };

  // Taskni o'chirish (faqat foydalanuvchi qo'shganlarini)
  const deleteTask = (id) => {
    const updated = routine.filter(item => item.id !== id);
    saveAndSet(updated);
  };

  const saveAndSet = (data) => {
    setRoutine(data);
    localStorage.setItem('dailyRoutine', JSON.stringify(data));
  };

  const completedCount = routine.filter((item) => item.completed).length;
  const totalCount = routine.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isAllDone = totalCount > 0 && completedCount === totalCount;

  return (
    <div className="px-6 py-8 max-w-md mx-auto bg-[#FAFAFA] min-h-screen space-y-6 pb-24">
      
      {/* Progress Section */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Progress</h2>
          <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            {completedCount} / {totalCount}
          </span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-emerald-600 shadow-[0_0_15px_rgba(5,150,105,0.3)]"
          />
        </div>
      </div>

      {/* Congrats Message */}
      <AnimatePresence>
        {isAllDone && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-emerald-600 p-6 rounded-[2rem] text-center text-white shadow-xl shadow-emerald-200"
          >
            <Sparkles className="mx-auto mb-2 opacity-80" size={32} />
            <h3 className="text-2xl font-black mb-1">Mashaalloh!</h3>
            <p className="text-sm opacity-90 font-medium">Bugungi barcha vazifalarni bajardingiz. Alloh qabul qilsin!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add New Task Form */}
      <form onSubmit={addTask} className="flex gap-2">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Yangi vazifa qo'shish..."
          className="flex-1 bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-all shadow-sm"
        />
        <button 
          type="submit"
          className="bg-emerald-600 text-white p-3 rounded-2xl shadow-lg shadow-emerald-200 active:scale-90 transition-all"
        >
          <Plus size={24} />
        </button>
      </form>

      {/* Routine List */}
      <div className="space-y-3">
        {routine.map((item) => (
          <motion.div 
            layout
            key={item.id} 
            className={`group flex items-center justify-between p-2 rounded-[1.5rem] transition-all ${item.completed ? 'bg-slate-50' : 'bg-white shadow-sm border border-slate-100'}`}
          >
            <button 
              onClick={() => toggleItem(item.id)}
              className="flex-1 flex items-center gap-4 py-2 px-3"
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-all ${item.completed ? 'bg-emerald-600 border-emerald-600 scale-90' : 'border-slate-200 bg-white'}`}>
                {item.completed && <Check className="w-5 h-5 text-white" strokeWidth={4} />}
              </div>
              <span className={`text-sm font-bold transition-all ${item.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                {item.label}
              </span>
            </button>
            
            {item.isCustom && (
              <button 
                onClick={() => deleteTask(item.id)}
                className="p-3 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            )}
          </motion.div>
        ))}
      </div>

    </div>
  );
}