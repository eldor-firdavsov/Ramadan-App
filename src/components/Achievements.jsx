// // src/components/Achievements.jsx
// export function Achievements({ routine, tasbih }) {
//     const badges = [];
  
//     // 5 vaqt namoz
//     if (routine.filter(r=>['fajr','dhuhr','asr','maghrib','isha'].includes(r.id) && r.completed).length===5)
//       badges.push({ name:'Namoz ketma-ketligi', level:'Bronze' });
  
//     if (routine.find(r=>r.id==='tarawih' && r.completed))
//       badges.push({ name:'Taroveh', level:'Bronze' });
  
//     if (routine.find(r=>r.id==='fasting' && r.completed))
//       badges.push({ name:'Ro‘za', level:'Gold' });
  
//     if (routine.find(r=>r.id==='quran' && r.completed))
//       badges.push({ name:'Qur’on o‘qish', level:'Silver' });
  
//     if (routine.find(r=>r.id==='zikr' && r.completed))
//       badges.push({ name:'Zikr', level:'Silver' });
  
//     if (tasbih.today>=99)
//       badges.push({ name:'Tasbih 99+', level:'Gold' });
  
//     if (badges.length===0) return <div className="text-gray-500 text-sm">Hech qanday badge yo‘q</div>;
  
//     return (
//       <div className="mt-6">
//         <h2 className="text-xl text-[#255F38] mb-3">Achievements</h2>
//         <div className="space-y-3">
//           {badges.map((b,i)=>(
//             <div key={i} className="bg-yellow-100 rounded-xl p-4 flex justify-between items-center">
//               <span>{b.name}</span>
//               <span className="text-sm font-semibold">{b.level}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }
  