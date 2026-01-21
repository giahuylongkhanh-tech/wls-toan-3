
import React, { useState, useEffect, useRef } from 'react';
import { Question } from './types.ts';

interface GameRoomProps {
  round: number;
  questions: Question[];
  onFinish: (score: number, total: number, timeUsed: number) => void;
}

export const GameRoom: React.FC<GameRoomProps> = ({ round, questions, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [shortAnswer, setShortAnswer] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  
  const roundStartTimeRef = useRef<number>(Date.now());
  const currentQuestion = questions[currentIndex];
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit);
      setSelectedOption(null);
      setShortAnswer('');
      setIsAnswering(false);
      setFeedback(null);
    }
  }, [currentIndex, currentQuestion]);

  useEffect(() => {
    if (timeLeft <= 0 && !isAnswering) {
      handleCheckAnswer(null);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft, isAnswering]);

  const handleCheckAnswer = (answer: string | number | null) => {
    if (isAnswering) return;
    setIsAnswering(true);
    if (timerRef.current) clearInterval(timerRef.current);

    let isCorrect = false;
    if (currentQuestion.type === 'short') {
      isCorrect = String(answer).trim().toLowerCase() === String(currentQuestion.correctAnswer).toLowerCase();
    } else {
      isCorrect = answer === currentQuestion.correctAnswer;
    }

    if (isCorrect) {
      setScore(prev => prev + currentQuestion.points);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(prev => prev + 1);
      } else {
        const totalDuration = Math.round((Date.now() - roundStartTimeRef.current) / 1000);
        onFinish(
          score + (isCorrect ? currentQuestion.points : 0), 
          questions.reduce((acc, q) => acc + q.points, 0),
          totalDuration
        );
      }
    }, 1500);
  };

  const renderQuestionBody = () => {
    switch (currentQuestion.type) {
      case 'short':
        return (
          <div className="flex flex-col items-center gap-6 mt-4">
            <input 
              type="text" 
              value={shortAnswer}
              onChange={(e) => setShortAnswer(e.target.value)}
              disabled={isAnswering}
              placeholder="Nhập câu trả lời..."
              className="w-full max-w-md p-5 bg-slate-50 border-4 border-indigo-100 rounded-3xl outline-none text-center text-2xl font-black text-indigo-900 shadow-inner focus:border-indigo-500 transition-all"
              onKeyDown={(e) => e.key === 'Enter' && handleCheckAnswer(shortAnswer)}
            />
            <button onClick={() => handleCheckAnswer(shortAnswer)} disabled={isAnswering || !shortAnswer.trim()} className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition disabled:opacity-50">Xác Nhận</button>
          </div>
        );
      case 'truefalse':
        return (
          <div className="grid grid-cols-2 gap-6 mt-4">
            {['ĐÚNG', 'SAI'].map((label, idx) => (
              <button key={idx} disabled={isAnswering} onClick={() => { setSelectedOption(idx); handleCheckAnswer(idx); }} className={`p-10 rounded-[2.5rem] text-3xl font-black transition-all border-b-[10px] transform active:scale-95 ${isAnswering && idx === currentQuestion.correctAnswer ? 'bg-emerald-500 border-emerald-700 text-white' : isAnswering && idx === selectedOption ? 'bg-rose-500 border-rose-700 text-white' : 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100'}`}>{label}</button>
            ))}
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
            {currentQuestion.options.map((opt, idx) => (
              <button key={idx} disabled={isAnswering} onClick={() => { setSelectedOption(idx); handleCheckAnswer(idx); }} className={`p-6 rounded-2xl text-left border-4 text-xl font-bold flex items-center gap-4 transition-all transform active:scale-95 ${!isAnswering ? 'bg-white border-slate-100 hover:border-indigo-300' : idx === currentQuestion.correctAnswer ? 'bg-emerald-500 border-emerald-600 text-white shadow-xl' : idx === selectedOption ? 'bg-rose-500 border-rose-600 text-white shadow-xl' : 'bg-slate-50 border-transparent opacity-40'}`}>
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${isAnswering && idx === currentQuestion.correctAnswer ? 'bg-white text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>{String.fromCharCode(65 + idx)}</span>
                {opt}
              </button>
            ))}
          </div>
        );
    }
  };

  const timerPercentage = (timeLeft / currentQuestion.timeLimit) * 100;

  return (
    <div className="w-full max-w-4xl animate-slide-up px-4">
      {feedback && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none">
          <div className={`px-12 py-8 rounded-[3rem] shadow-2xl animate-bounce font-black text-4xl text-white ${feedback === 'correct' ? 'bg-emerald-500' : 'bg-rose-500'}`}>{feedback === 'correct' ? 'CHÍNH XÁC! 🌟' : 'TIẾC QUÁ! 😢'}</div>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-10 gap-6">
        <div className="flex-1">
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden border-2 border-white shadow-inner">
            <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-black uppercase tracking-widest">Tiến độ: {currentIndex + 1} / {questions.length}</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-3xl shadow-lg border-b-4 border-indigo-100 min-w-[100px] text-center">
            <p className="text-[9px] text-slate-400 font-black mb-1">CÂU HỎI</p>
            <p className={`text-3xl font-black ${timeLeft < 5 ? 'text-rose-500 animate-pulse' : 'text-indigo-600'}`}>{timeLeft}s</p>
          </div>
          <div className="bg-emerald-500 p-4 rounded-3xl shadow-xl border-b-4 border-emerald-700 min-w-[100px] text-center text-white">
            <p className="text-[9px] opacity-70 font-black mb-1">ĐIỂM SỐ</p>
            <p className="text-3xl font-black">{score}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-10 md:p-16 rounded-[4rem] shadow-2xl relative overflow-hidden border-b-[15px] border-slate-100">
        <div className={`absolute top-0 left-0 h-2 bg-yellow-400 transition-all duration-1000`} style={{ width: `${timerPercentage}%` }}></div>
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
             <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Câu {currentIndex + 1}</span>
             <span className="bg-slate-50 text-slate-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{currentQuestion.level}</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-slate-800 leading-[1.3]">{currentQuestion.text}</h3>
        </div>
        {renderQuestionBody()}
      </div>
    </div>
  );
};
