
import React from 'react';
import { Player } from '../types';

interface RankingTableProps {
  players: Player[];
  onBack: () => void;
}

export const RankingTable: React.FC<RankingTableProps> = ({ players, onBack }) => {
  // Sắp xếp: Điểm cao nhất trước, nếu bằng điểm thì ai dùng ít thời gian hơn đứng trước
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    return a.totalTimeSpent - b.totalTimeSpent;
  });

  return (
    <div className="w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-fade-in border-b-8 border-indigo-600">
      <div className="bg-indigo-600 p-10 text-center text-white relative">
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 p-2 bg-indigo-500 rounded-full hover:bg-indigo-400 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>
        <div className="mb-4 inline-block p-4 bg-white bg-opacity-10 rounded-full">
           <svg className="w-12 h-12 text-yellow-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tight">Bảng Vàng Thành Tích</h2>
        <p className="text-indigo-200 mt-2 font-bold uppercase text-[10px] tracking-[0.3em]">Hệ thống xếp hạng MathMaster</p>
      </div>

      <div className="p-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-2">Hạng</th>
                <th className="px-6 py-2">Học sinh</th>
                <th className="px-6 py-2 text-center">Lớp</th>
                <th className="px-6 py-2 text-right">Điểm số</th>
                <th className="px-6 py-2 text-right">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-slate-300 italic font-bold">Chưa có dữ liệu thi đấu</td>
                </tr>
              ) : (
                sortedPlayers.map((player, index) => (
                  <tr 
                    key={player.id} 
                    className={`group transition-all ${
                      index === 0 ? 'bg-yellow-50/50' : 
                      index === 1 ? 'bg-slate-50/50' : 
                      index === 2 ? 'bg-orange-50/30' : 'hover:bg-indigo-50/30'
                    }`}
                  >
                    <td className="px-6 py-4 rounded-l-2xl">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                        index === 0 ? 'bg-yellow-400 text-white shadow-lg shadow-yellow-200' : 
                        index === 1 ? 'bg-slate-400 text-white shadow-lg shadow-slate-200' : 
                        index === 2 ? 'bg-orange-400 text-white shadow-lg shadow-orange-200' : 'bg-indigo-100 text-indigo-600'
                      }`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-black text-slate-700">{player.name}</div>
                      <div className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">{player.completedRounds.length} vòng đã xong</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-white px-3 py-1 rounded-lg border border-slate-100 font-bold text-slate-500 text-xs">
                        {player.className}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xl font-black text-indigo-600">{player.totalScore}</span>
                      <span className="text-[9px] text-indigo-300 font-black ml-1 uppercase">đ</span>
                    </td>
                    <td className="px-6 py-4 text-right rounded-r-2xl">
                      <div className="flex items-center justify-end gap-1 text-slate-400 font-bold">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="text-sm">{player.totalTimeSpent}s</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <button 
          onClick={onBack}
          className="mt-10 w-full py-5 bg-indigo-50 text-indigo-600 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-indigo-100 transition shadow-inner shadow-indigo-100"
        >
          Quay lại màn hình chính
        </button>
      </div>
    </div>
  );
};
