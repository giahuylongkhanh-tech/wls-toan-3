
import React, { useState, useEffect } from 'react';
import { View, Player, Question } from './types.ts';
import { PlayerLobby } from './components/PlayerLobby.tsx';
import { GameRoom } from './GameRoom.tsx';
import { AdminPanel } from './AdminPanel.tsx';
import { HallOfFame } from './HallOfFame.tsx';
import { Login } from './components/Login.tsx';
import { MathApi } from './api.ts';
import { INITIAL_QUESTIONS } from './constants.ts';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.LOGIN);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [currentRound, setCurrentRound] = useState<number | null>(null);
  const [gameResult, setGameResult] = useState<{ score: number, time: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const syncData = async () => {
      setIsSyncing(true);
      try {
        const res = await MathApi.getInitialData();
        if (res.success) {
          if (res.data.questions?.length > 0) setQuestions(res.data.questions);
          const lb = await MathApi.getLeaderboard();
          if (lb.success) setPlayers(lb.data || []);
        }
      } catch (err) {
        console.error("Background sync failed:", err);
      } finally {
        setIsSyncing(false);
      }
    };
    syncData();
  }, []);

  const handleLoginSuccess = (playerData: Player) => {
    setCurrentPlayer(playerData);
    setView(playerData.isAdmin ? View.ADMIN : View.LOBBY);
  };

  const logout = () => {
    try {
      localStorage.clear();
    } catch (e) {}
    window.location.reload();
  };

  const finishRound = async (score: number, total: number, time: number) => {
    setIsLoading(true);
    if (currentPlayer && !currentPlayer.isAdmin) {
      try {
        const res = await MathApi.saveResult(currentPlayer.id, currentRound!, score, time);
        if (res.success) {
          setCurrentPlayer(res.data);
          const lb = await MathApi.getLeaderboard();
          if (lb.success) setPlayers(lb.data || []);
        }
      } catch (e) {}
    }
    setGameResult({ score, time });
    setIsLoading(false);
    setView(View.RESULT);
  };

  return (
    <div className="min-h-screen bg-[#f0f9ff] font-['Quicksand'] selection:bg-indigo-100 text-slate-900">
      {isSyncing && (
        <div className="fixed bottom-4 right-4 z-50 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-indigo-100 flex items-center gap-2">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Đang tải Cloud...</span>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-indigo-900/10 backdrop-blur-[2px] z-[999] flex items-center justify-center">
          <div className="bg-white p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-indigo-600 text-xs">Đang xử lý...</p>
          </div>
        </div>
      )}

      {view !== View.LOGIN && (
        <header className="bg-white p-4 shadow-sm flex justify-between items-center px-6 sticky top-0 z-40 border-b border-indigo-50">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView(currentPlayer?.isAdmin ? View.ADMIN : View.LOBBY)}>
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm">M</div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">MathMaster</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-bold text-xs text-slate-700">{currentPlayer?.name}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase">{currentPlayer?.isAdmin ? 'Admin' : `Lớp ${currentPlayer?.className}`}</p>
            </div>
            <button onClick={logout} className="px-3 py-1.5 bg-rose-500 text-white rounded-lg text-[10px] font-bold uppercase hover:bg-rose-600 transition">Thoát</button>
          </div>
        </header>
      )}

      <main className="min-h-[90vh] flex flex-col items-center justify-center p-4">
        {view === View.LOGIN && <Login onLoginSuccess={handleLoginSuccess} setIsLoading={setIsLoading} />}
        {view === View.LOBBY && <PlayerLobby player={currentPlayer!} onStartRound={(id) => { setCurrentRound(id); setView(View.GAME); }} onShowHallOfFame={() => setView(View.HALL_OF_FAME)} />}
        {view === View.GAME && <GameRoom round={currentRound!} questions={questions.filter(q => q.round === currentRound)} onFinish={finishRound} />}
        {view === View.ADMIN && <AdminPanel players={players} questions={questions} setPlayers={setPlayers} setQuestions={setQuestions} setIsLoading={setIsLoading} />}
        {view === View.HALL_OF_FAME && <HallOfFame players={players} onBack={() => setView(currentPlayer?.isAdmin ? View.ADMIN : View.LOBBY)} />}
        
        {view === View.RESULT && (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl text-center max-w-sm w-full animate-slide-up border-b-8 border-indigo-600">
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="text-2xl font-black text-slate-800 mb-4 uppercase italic">Kết quả Vòng {currentRound}</h2>
            <div className="bg-indigo-50 p-6 rounded-2xl mb-6">
              <p className="text-5xl font-black text-indigo-600">{gameResult?.score}</p>
              <p className="text-[10px] font-bold text-indigo-300 mt-1 uppercase">Điểm</p>
              <p className="text-[10px] text-slate-400 mt-4 font-bold">Thời gian: {gameResult?.time}s</p>
            </div>
            <button onClick={() => setView(View.LOBBY)} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg transition transform active:scale-95">TIẾP TỤC</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
