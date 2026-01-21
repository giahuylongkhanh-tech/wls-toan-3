
import React from 'react';
import { Player } from './types.ts';

interface HallOfFameProps {
  players: Player[];
  onBack: () => void;
}

export const HallOfFame: React.FC<HallOfFameProps> = ({ players, onBack }) => {
  const sortedPlayers = [...players].sort((a, b) => b.totalScore - a.totalScore);
  const topThree = sortedPlayers.slice(0, 3);
  const others = sortedPlayers.slice(3, 10);

  return (
    <div className="w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-fade-in border-b-8 border-yellow-500">
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-900 to-black p-12 text-center text-white relative overflow-hidden">
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 p-2 bg-white bg-opacity-10 rounded-full hover:bg-opacity-20 transition z-20"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>

        <h2 className="text-5xl font-black mb-2 tracking-tighter italic">BẢNG VINH DANH</h2>
        <p className="text-yellow-400 text-xl font-bold uppercase tracking-widest mb-12">Những huyền thoại toán học</p>

        <div className="flex justify-center items-end gap-2 sm:gap-6 mt-8 relative z-10">
          {topThree[1] && (
            <div className="flex flex-col items-center group">
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full bg-gray-300 border-4 border-white overflow-hidden shadow-lg group-hover:scale-110 transition">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-gray-400 to-gray-200 text-white font-bold text-2xl">
                    {topThree[1].name[0]}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-gray-700 font-bold shadow">2</div>
              </div>
              <div className="bg-gray-400 bg-opacity-20 backdrop-blur-md px-4 py-3 rounded-t-2xl w-28 sm:w-36 h-24 flex flex-col justify-center border-t-2 border-gray-300">
                <p className="font-bold truncate text-sm">{topThree[1].name}</p>
                <p className="text-yellow-400 font-black text-xl">{topThree[1].totalScore}</p>
              </div>
            </div>
          )}

          {topThree[0] && (
            <div className="flex flex-col items-center group -translate-y-4">
              <div className="relative mb-6">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-5xl animate-bounce">👑</div>
                <div className="w-28 h-28 rounded-full bg-yellow-400 border-4 border-white overflow-hidden shadow-[0_0_30px_rgba(250,204,21,0.5)] group-hover:scale-110 transition">
                   <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-yellow-600 to-yellow-300 text-white font-bold text-4xl italic">
                    {topThree[0].name[0]}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center text-yellow-900 font-black shadow-lg">1</div>
              </div>
              <div className="bg-yellow-400 bg-opacity-20 backdrop-blur-md px-4 py-3 rounded-t-2xl w-32 sm:w-44 h-32 flex flex-col justify-center border-t-4 border-yellow-400 shadow-[0_-10px_20px_rgba(250,204,21,0.1)]">
                <p className="font-black truncate text-lg">{topThree[0].name}</p>
                <p className="text-yellow-400 font-black text-3xl">{topThree[0].totalScore}</p>
              </div>
            </div>
          )}

          {topThree[2] && (
            <div className="flex flex-col items-center group">
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full bg-amber-700 border-4 border-white overflow-hidden shadow-lg group-hover:scale-110 transition">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-amber-800 to-amber-600 text-white font-bold text-2xl">
                    {topThree[2].name[0]}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-700 rounded-full border-2 border-white flex items-center justify-center text-white font-bold shadow">3</div>
              </div>
              <div className="bg-amber-700 bg-opacity-20 backdrop-blur-md px-4 py-3 rounded-t-2xl w-28 sm:w-36 h-20 flex flex-col justify-center border-t-2 border-amber-600">
                <p className="font-bold truncate text-sm">{topThree[2].name}</p>
                <p className="text-yellow-400 font-black text-xl">{topThree[2].totalScore}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-10 bg-gray-50 text-center">
        <button 
          onClick={onBack}
          className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition transform hover:-translate-y-1 shadow-xl active:scale-95"
        >
          TIẾP TỤC CHINH PHỤC
        </button>
      </div>
    </div>
  );
};
