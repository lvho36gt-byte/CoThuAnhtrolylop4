import React, { useState } from 'react';
import { Role, Student } from '../../types';
import { sounds } from '../../utils/sound';
import { 
  Home, Compass, BookOpen, Bot, Folder, PlayCircle, Users, 
  BarChart3, Award, FileCheck, Tv, Volume2, VolumeX, UserCheck, 
  Settings, Menu, X, Sparkles, ChevronDown 
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  currentRole: Role;
  onChangeRole: (role: Role) => void;
  currentStudent: Student;
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onStartPresentation: () => void;
  onOpenChatbot: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  currentRole,
  onChangeRole,
  currentStudent,
  students,
  onSelectStudent,
  onStartPresentation,
  onOpenChatbot,
  onOpenSettings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showStudentPicker, setShowStudentPicker] = useState(false);

  const toggleSound = () => {
    sounds.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'adventure', label: '5 Trạm AI', icon: Compass },
    { id: 'activities', label: 'Hoạt động của em', icon: BookOpen },
    { id: 'chatbot', label: 'Robot AI 3D', icon: Bot },
    { id: 'library', label: 'Kho báu tri thức', icon: Folder },
    { id: 'games', label: '10 Trò chơi', icon: PlayCircle },
    { id: 'classroom', label: 'Quản lý lớp 3D', icon: Users },
    { id: 'analytics', label: 'Đánh giá - Thống kê', icon: BarChart3 },
    { id: 'hall', label: 'Vườn sao vinh danh', icon: Award },
    { id: 'evidence', label: 'Minh chứng dự thi', icon: FileCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 gap-2">
          {/* Brand Logo */}
          <div
            onClick={() => { onSelectTab('home'); sounds.playPop(); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 via-emerald-400 to-amber-400 p-0.5 shadow-md group-hover:scale-105 transition">
              <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center text-2xl">
                🤖
              </div>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block">
                Tiểu học Khoái Châu 1 – Lớp 3D
              </span>
              <h1 className="font-black text-slate-800 text-sm sm:text-base leading-none">
                AI CÙNG EM – PHIÊU LƯU TRI THỨC LỚP 3
              </h1>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Presentation Mode Button */}
            <button
              onClick={() => { onStartPresentation(); sounds.playStar(); }}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-black text-xs shadow-sm hover:scale-102 transition"
            >
              <Tv className="w-4 h-4" /> TRÌNH CHIẾU
            </button>

            {/* Role Switcher */}
            <div className="bg-slate-100 p-1 rounded-2xl flex items-center text-xs font-bold">
              <button
                onClick={() => { onChangeRole('student'); sounds.playPop(); }}
                className={`px-3 py-1.5 rounded-xl transition ${
                  currentRole === 'student' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'
                }`}
              >
                Học sinh
              </button>
              <button
                onClick={() => { onChangeRole('teacher'); sounds.playPop(); }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl transition ${
                  currentRole === 'teacher' ? 'bg-white text-blue-700 shadow-xs font-black' : 'text-slate-500'
                }`}
              >
                <img
                  src="/assets/aistudio/image_8f93a0fd.png"
                  alt="Cô giáo Thu Anh"
                  className="w-5 h-5 rounded-full object-cover object-top border border-emerald-400"
                />
                Cô giáo Thu Anh
              </button>
            </div>

            {/* Active Student Selector Dropdown (when in student role) */}
            {currentRole === 'student' && (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setShowStudentPicker(!showStudentPicker)}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-1.5 transition"
                >
                  <span>{currentStudent.avatar}</span>
                  <span className="max-w-[100px] truncate">{currentStudent.name}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {showStudentPicker && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 max-h-60 overflow-y-auto">
                    <span className="text-[10px] font-bold text-slate-400 px-2 py-1 block">
                      Chọn bạn học sinh để trải nghiệm:
                    </span>
                    {students.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          onSelectStudent(s);
                          setShowStudentPicker(false);
                          sounds.playPop();
                        }}
                        className={`w-full text-left p-2 rounded-xl text-xs flex items-center gap-2 transition ${
                          s.id === currentStudent.id ? 'bg-emerald-50 text-emerald-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span>{s.avatar}</span>
                        <div className="flex-1 truncate">
                          <span className="font-bold block">{s.name}</span>
                          <span className="text-[10px] text-slate-400">{s.group}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-2xl border transition ${
                soundEnabled ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-slate-100 border-slate-200 text-slate-400'
              }`}
              title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Settings button */}
            <button
              onClick={() => { onOpenSettings(); sounds.playPop(); }}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition"
              title="Cài đặt hệ thống & Giáo viên"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 bg-slate-100 rounded-2xl text-slate-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Secondary Navigation Bar */}
        <nav className="hidden md:flex items-center gap-1 py-2 overflow-x-auto no-scrollbar border-t border-slate-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onSelectTab(item.id); sounds.playPop(); }}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-2 shadow-xl animate-fadeIn">
          <button
            onClick={() => { onStartPresentation(); setMobileMenuOpen(false); }}
            className="w-full py-2.5 bg-amber-500 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 mb-3"
          >
            <Tv className="w-4 h-4" /> CHẾ ĐỘ TRÌNH CHIẾU MÀN HÌNH
          </button>
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                    sounds.playPop();
                  }}
                  className={`p-2.5 rounded-xl text-left font-bold text-xs flex items-center gap-2 ${
                    isActive ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
