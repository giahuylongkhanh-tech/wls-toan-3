
import React from 'react';
import { Player } from '../types.ts';
import { ROUNDS } from '../constants.ts';

interface PlayerLobbyProps {
  player: Player;
  onStartRound: (roundId: number) => void;
  onShowHallOfFame: () => void;
}

export const PlayerLobby: React.FC<PlayerLobbyProps> = ({ player, onStartRound, onShowHallOfFame }) => {
  return (
    <div className="w-full max-w-5xl animate-fade-in">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="bg-indigo-600 text-white p-6 rounded-3xl flex-1 shadow-xl flex items-center justify-between overflow-hidden relative">
          <div className="relative z-10">
            <p className="text-indigo-100 uppercase tracking-widest text-xs font-bold mb-1">Điểm của bạn</p>
            <h3 className="text-4xl font-black">{player.totalScore}</h3>
          </div>
          <div className="text-indigo-500 absolute -right-4 -bottom-4 opacity-50">
             <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L9 9l-8 3 8 3 3 8 3-8 8-3-8-3-3-8z"/></svg>
          </div>
          <button 
            onClick={onShowHallOfFame}
            className="relative z-20 bg-yellow-400 text-indigo-900 px-4 py-2 rounded-2xl font-bold text-sm hover:bg-yellow-300 transition shadow-lg"
          >
            Bảng Vinh Danh 🏆
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-3xl flex-1 shadow-xl flex items-center justify-between border-2 border-indigo-50">
          <div>
            <p className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-1">Vòng đã xong</p>
            <h3 className="text-4xl font-black text-gray-800">{player.completedRounds.length} <span className="text-xl text-gray-300">/ {ROUNDS.length}</span></h3>
          </div>
          <div className="bg-green-100 text-green-600 p-3 rounded-2xl">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
        Chọn Vòng Chơi
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ROUNDS.map((round) => {
          const isCompleted = player.completedRounds.includes(round.id);
          const isUnlocked = round.id === 1 || player.completedRounds.includes(round.id - 1);

          return (
            <div 
              key={round.id}
              className={`group relative bg-white rounded-3xl p-6 shadow-md transition-all border-2 ${
                !isUnlocked ? 'opacity-60 cursor-not-allowed grayscale' : 'hover:shadow-xl hover:-translate-y-1 cursor-pointer border-transparent hover:border-indigo-200'
              }`}
              onClick={() => isUnlocked && onStartRound(round.id)}
            >
              {isCompleted && (
                <div className="absolute top-4 right-4 bg-green-500 text-white p-1 rounded-full shadow-lg z-10">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                </div>
              )}
              
              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-40 rounded-3xl z-10">
                  <div className="bg-white p-3 rounded-full shadow-lg">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">Cấp độ {round.id}</span>
              </div>
              
              <h4 className="text-xl font-bold text-gray-800 mb-2 leading-tight">{round.name}</h4>
              <p className="text-sm text-gray-500 mb-6">{round.description}</p>
              
              <div className="mt-auto flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">5 câu hỏi</span>
                <span className={`text-sm font-bold ${isUnlocked ? 'text-indigo-600' : 'text-gray-400'}`}>
                  {isUnlocked ? 'Chơi ngay →' : 'Bị khóa'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
