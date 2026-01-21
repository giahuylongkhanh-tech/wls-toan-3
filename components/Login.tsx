
import React, { useState } from 'react';
import { Player } from '../types.ts';
import { MathApi } from '../api.ts';

interface LoginProps {
  onLoginSuccess: (player: Player) => void;
  setIsLoading: (val: boolean) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, setIsLoading }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || (!isAdminMode && !className.trim()) || !password.trim()) {
      setError('Vui lòng điền đủ 3 thông tin!');
      return;
    }

    setIsLoading(true);
    try {
      if (isAdminMode) {
        if (name.toLowerCase() === 'admin' && password === '123456') {
          onLoginSuccess({
            id: 'admin-001',
            name: 'Quản trị viên',
            className: 'Hệ thống',
            totalScore: 0,
            totalTimeSpent: 0,
            completedRounds: [],
            isAdmin: true,
            status: 'active',
            createdAt: new Date().toISOString()
          });
        } else {
          setError('Tên admin hoặc mật khẩu không đúng!');
        }
      } else {
        const response = await MathApi.login(name.trim(), className.trim(), password.trim());
        if (response.success) {
          onLoginSuccess(response.data);
        } else {
          setError(response.error || 'Lỗi không xác định khi kết nối Cloud');
        }
      }
    } catch (err) {
      setError('Lỗi kết nối nghiêm trọng. Kiểm tra internet hoặc API URL!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md border-b-[12px] border-indigo-600">
      <div className="text-center mb-8">
        <div className={`inline-block p-5 rounded-3xl mb-4 shadow-inner ${isAdminMode ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-slate-800 uppercase italic">
          {isAdminMode ? 'Admin Đăng Nhập' : 'Vào Học Toán'}
        </h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 text-rose-600 text-xs font-black rounded-xl border-2 border-rose-100 animate-shake">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl font-bold"
          placeholder="Tên của bạn (VD: An)"
          required
        />
        
        {!isAdminMode && (
          <input 
            type="text" 
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl font-bold"
            placeholder="Lớp (VD: 3A)"
            required
          />
        )}

        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl font-bold"
          placeholder="Mật khẩu"
          required
        />

        <button 
          type="submit"
          className={`w-full py-5 text-white rounded-2xl font-black text-xl shadow-lg transition active:scale-95 ${
            isAdminMode ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          XÁC NHẬN ĐĂNG NHẬP
        </button>
      </form>
      
      <button 
        type="button"
        onClick={() => setIsAdminMode(!isAdminMode)}
        className="mt-6 w-full text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600"
      >
        {isAdminMode ? "Quay lại Học sinh" : "Dành cho Giáo viên"}
      </button>
    </div>
  );
};
