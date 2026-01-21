
import React, { useState, useEffect } from 'react';
import { Player, Question, AdminTab, QuestionType } from './types.ts';
import { MathApi } from './api.ts';

interface AdminPanelProps {
  players: Player[];
  questions: Question[];
  setPlayers: (p: Player[]) => void;
  setQuestions: (q: Question[]) => void;
  setIsLoading: (val: boolean) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ players, questions, setPlayers, setQuestions, setIsLoading }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>(AdminTab.PLAYERS);
  const [editingQuestion, setEditingQuestion] = useState<Partial<Question> | null>(null);

  useEffect(() => {
    refreshData();
  }, [activeTab]);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === AdminTab.PLAYERS) {
        const res = await MathApi.getPlayers();
        if (res.success) setPlayers(res.data);
      } else if (activeTab === AdminTab.QUESTIONS) {
        const res = await MathApi.getQuestions();
        if (res.success) setQuestions(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveQuestion = async () => {
    if (!editingQuestion?.text) return alert("Vui lòng nhập nội dung câu hỏi!");
    if (editingQuestion.type === 'multiple' && (!editingQuestion.options || editingQuestion.options.length < 2)) {
      return alert("Câu hỏi trắc nghiệm cần ít nhất 2 phương án!");
    }
    
    setIsLoading(true);
    const qToSave = {
      ...editingQuestion,
      id: editingQuestion.id || "Q-" + Date.now(),
      options: editingQuestion.options || [],
      correctAnswer: editingQuestion.correctAnswer ?? (editingQuestion.type === 'multiple' ? 0 : ''),
      points: Number(editingQuestion.points || 10),
      timeLimit: Number(editingQuestion.timeLimit || 20),
      round: Number(editingQuestion.round || 1),
      level: editingQuestion.level || 'Easy'
    } as Question;

    try {
      const res = await MathApi.upsertQuestion(qToSave);
      if (res.success) {
        setEditingQuestion(null);
        refreshData();
      } else {
        alert("Lỗi lưu câu hỏi: " + (res.error || "Không xác định"));
      }
    } catch (e) {
      alert("Lỗi kết nối khi lưu!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) return;
    setIsLoading(true);
    try {
      const res = await MathApi.deleteQuestion(id);
      if (res.success) refreshData();
      else alert("Lỗi xóa!");
    } catch (e) {
      alert("Lỗi kết nối!");
    } finally {
      setIsLoading(false);
    }
  };

  const updateOption = (idx: number, val: string) => {
    const newOpts = [...(editingQuestion?.options || [])];
    newOpts[idx] = val;
    setEditingQuestion({ ...editingQuestion, options: newOpts });
  };

  return (
    <div className="w-full max-w-7xl bg-white rounded-[3rem] shadow-2xl overflow-hidden min-h-[700px] flex flex-col md:flex-row animate-fade-in border border-slate-100">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-slate-900 text-slate-400 p-8 flex flex-col">
        <div className="mb-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20">M</div>
          <h2 className="text-white font-black tracking-tight">ADMIN PANEL</h2>
        </div>
        <nav className="space-y-2 flex-grow">
          {[
            { id: AdminTab.PLAYERS, label: 'Người chơi', icon: '👥' },
            { id: AdminTab.QUESTIONS, label: 'Ngân hàng câu hỏi', icon: '📝' },
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`w-full text-left px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 bg-slate-50 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{activeTab === AdminTab.PLAYERS ? "Danh Sách Học Sinh" : "Ngân Hàng Câu Hỏi"}</h3>
          {activeTab === AdminTab.QUESTIONS && (
            <button 
              onClick={() => setEditingQuestion({ type: 'multiple', points: 10, timeLimit: 20, round: 1, level: 'Easy', options: ['', '', '', ''] })} 
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition shadow-lg flex items-center gap-2"
            >
              <span className="text-base">➕</span> THÊM CÂU HỎI
            </button>
          )}
        </div>

        {activeTab === AdminTab.PLAYERS && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b">
                <tr>
                  <th className="p-5">Học sinh</th>
                  <th className="p-5">Lớp</th>
                  <th className="p-5">Điểm tổng</th>
                  <th className="p-5">Số vòng</th>
                  <th className="p-5 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {players.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5 font-black text-slate-700">{p.name}</td>
                    <td className="p-5 font-bold text-slate-500">{p.className}</td>
                    <td className="p-5 font-black text-indigo-600">{p.totalScore}</td>
                    <td className="p-5 font-bold text-slate-400">{p.completedRounds?.length || 0} vòng</td>
                    <td className="p-5 text-center">
                       <button onClick={() => MathApi.deletePlayer(p.id).then(refreshData)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition" title="Xóa người chơi">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === AdminTab.QUESTIONS && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
             <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b">
                <tr>
                  <th className="p-5">Nội dung</th>
                  <th className="p-5">Vòng</th>
                  <th className="p-5">Đáp án đúng</th>
                  <th className="p-5 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {questions.map(q => (
                  <tr key={q.id} className="hover:bg-slate-50/50 transition-colors text-sm">
                    <td className="p-5 font-bold text-slate-700 max-w-xs truncate">{q.text}</td>
                    <td className="p-5"><span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg font-black text-[10px]">VÒNG {q.round}</span></td>
                    <td className="p-5 font-mono text-emerald-600 font-bold">
                      {q.type === 'multiple' ? q.options[Number(q.correctAnswer)] : q.correctAnswer}
                    </td>
                    <td className="p-5 text-center flex justify-center gap-2">
                       <button onClick={() => setEditingQuestion(q)} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg" title="Sửa">✏️</button>
                       <button onClick={() => handleDeleteQuestion(q.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg" title="Xóa">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-indigo-50/30">
              <h4 className="text-xl font-black text-indigo-900 uppercase italic">
                {editingQuestion.id ? "Sửa câu hỏi" : "Thêm câu hỏi mới"}
              </h4>
              <button onClick={() => setEditingQuestion(null)} className="text-slate-400 hover:text-rose-500 text-2xl">✕</button>
            </div>
            
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Loại câu hỏi</label>
                  <select 
                    value={editingQuestion.type}
                    onChange={(e) => setEditingQuestion({...editingQuestion, type: e.target.value as QuestionType})}
                    className="w-full p-3 bg-slate-50 rounded-xl border-2 border-transparent focus:border-indigo-500 outline-none font-bold text-sm"
                  >
                    <option value="multiple">Trắc nghiệm (4 lựa chọn)</option>
                    <option value="truefalse">Đúng / Sai</option>
                    <option value="short">Trả lời ngắn (Nhập chữ)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Vòng chơi</label>
                  <select 
                    value={editingQuestion.round}
                    onChange={(e) => setEditingQuestion({...editingQuestion, round: Number(e.target.value)})}
                    className="w-full p-3 bg-slate-50 rounded-xl border-2 border-transparent focus:border-indigo-500 outline-none font-bold text-sm"
                  >
                    {[1,2,3,4].map(r => <option key={r} value={r}>Vòng {r}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Nội dung câu hỏi</label>
                <textarea 
                  value={editingQuestion.text}
                  onChange={(e) => setEditingQuestion({...editingQuestion, text: e.target.value})}
                  className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none font-bold min-h-[100px]"
                  placeholder="Nhập nội dung câu hỏi tại đây..."
                />
              </div>

              {editingQuestion.type === 'multiple' && (
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Các lựa chọn & Đáp án</label>
                  {editingQuestion.options?.map((opt, idx) => (
                    <div key={idx} className="flex gap-3 items-center">
                      <input 
                        type="radio" 
                        name="correct" 
                        checked={Number(editingQuestion.correctAnswer) === idx}
                        onChange={() => setEditingQuestion({...editingQuestion, correctAnswer: idx})}
                        className="w-5 h-5 accent-emerald-500 cursor-pointer"
                      />
                      <input 
                        type="text"
                        value={opt}
                        onChange={(e) => updateOption(idx, e.target.value)}
                        className="flex-1 p-3 bg-slate-50 rounded-xl border-2 border-transparent focus:border-indigo-500 outline-none font-bold text-sm"
                        placeholder={`Lựa chọn ${String.fromCharCode(65+idx)}...`}
                      />
                    </div>
                  ))}
                  <p className="text-[10px] text-emerald-600 font-black italic mt-2">* Tích vào nút tròn để chọn đó là đáp án đúng</p>
                </div>
              )}

              {editingQuestion.type === 'truefalse' && (
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Đáp án đúng</label>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setEditingQuestion({...editingQuestion, correctAnswer: 0})}
                      className={`flex-1 py-3 rounded-xl font-black border-2 transition ${editingQuestion.correctAnswer === 0 ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-slate-50 border-transparent text-slate-400'}`}
                    >ĐÚNG</button>
                    <button 
                      onClick={() => setEditingQuestion({...editingQuestion, correctAnswer: 1})}
                      className={`flex-1 py-3 rounded-xl font-black border-2 transition ${editingQuestion.correctAnswer === 1 ? 'bg-rose-50 border-rose-500 text-rose-600' : 'bg-slate-50 border-transparent text-slate-400'}`}
                    >SAI</button>
                  </div>
                </div>
              )}

              {editingQuestion.type === 'short' && (
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Đáp án chính xác</label>
                  <input 
                    type="text"
                    value={editingQuestion.correctAnswer}
                    onChange={(e) => setEditingQuestion({...editingQuestion, correctAnswer: e.target.value})}
                    className="w-full p-4 bg-slate-50 rounded-xl border-2 border-transparent focus:border-indigo-500 outline-none font-bold"
                    placeholder="Nhập đáp án chính xác (Hệ thống sẽ so khớp không phân biệt hoa thường)"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Số điểm</label>
                  <input type="number" value={editingQuestion.points} onChange={(e) => setEditingQuestion({...editingQuestion, points: Number(e.target.value)})} className="w-full p-3 bg-slate-50 rounded-xl border-2 border-transparent focus:border-indigo-500 outline-none font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Thời gian (giây)</label>
                  <input type="number" value={editingQuestion.timeLimit} onChange={(e) => setEditingQuestion({...editingQuestion, timeLimit: Number(e.target.value)})} className="w-full p-3 bg-slate-50 rounded-xl border-2 border-transparent focus:border-indigo-500 outline-none font-bold" />
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 flex gap-4">
              <button 
                onClick={() => setEditingQuestion(null)}
                className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-500 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-100 transition"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleSaveQuestion}
                className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition transform active:scale-95"
              >
                {editingQuestion.id ? "Cập nhật ngay" : "Lưu câu hỏi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
