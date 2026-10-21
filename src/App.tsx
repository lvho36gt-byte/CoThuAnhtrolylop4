import React, { useState, useEffect } from 'react';
import { Role, Student } from './types';
import { INITIAL_STUDENTS, TEACHER_INFO } from './data/mockData';
import { Navbar } from './components/common/Navbar';
import { HeroBanner } from './components/home/HeroBanner';
import { AdventureMap } from './components/adventure/AdventureMap';
import { StudentActivities } from './components/activities/StudentActivities';
import { AIChatbot } from './components/chatbot/AIChatbot';
import { LibraryView } from './components/library/LibraryView';
import { InteractiveGames } from './components/games/InteractiveGames';
import { ClassManagement } from './components/classroom/ClassManagement';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { HallOfFame } from './components/hall/HallOfFame';
import { EvidenceSection } from './components/evidence/EvidenceSection';
import { PresentationMode } from './components/presentation/PresentationMode';
import { SettingsModal } from './components/common/SettingsModal';
import { sounds } from './utils/sound';
import { 
  Bot, Sparkles, MessageCircle, Heart, Star, Compass, 
  HelpCircle, ShieldCheck, ArrowUp 
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [currentRole, setCurrentRole] = useState<Role>('student');
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('lop3d_students');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    return INITIAL_STUDENTS;
  });

  const [currentStudentId, setCurrentStudentId] = useState<string>(INITIAL_STUDENTS[0].id);
  const [presentationOpen, setPresentationOpen] = useState(false);
  const [floatingChatOpen, setFloatingChatOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Save student updates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lop3d_students', JSON.stringify(students));
    } catch (e) {
      console.warn('Storage write error:', e);
    }
  }, [students]);

  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0];

  const handleUpdateCurrentStudent = (updated: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === currentStudent.id ? { ...s, ...updated } : s))
    );
  };

  const handleResetData = () => {
    setStudents(INITIAL_STUDENTS);
    setCurrentStudentId(INITIAL_STUDENTS[0].id);
    localStorage.removeItem('lop3d_students');
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] text-slate-800 flex flex-col selection:bg-emerald-200">
      {/* 1. Header Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => { setCurrentTab(tab); handleScrollTop(); }}
        currentRole={currentRole}
        onChangeRole={setCurrentRole}
        currentStudent={currentStudent}
        students={students}
        onSelectStudent={(s) => setCurrentStudentId(s.id)}
        onStartPresentation={() => setPresentationOpen(true)}
        onOpenChatbot={() => setFloatingChatOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* 2. Main Content Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* TAB 1: TRANG CHỦ */}
        {currentTab === 'home' && (
          <div className="space-y-8 animate-fadeIn">
            <HeroBanner
              onStartAdventure={() => { setCurrentTab('adventure'); handleScrollTop(); }}
              onGoToTeacherMode={() => { setCurrentRole('teacher'); setCurrentTab('classroom'); handleScrollTop(); }}
              onOpenStation={(stId) => { setCurrentTab('adventure'); handleScrollTop(); }}
              onOpenChatbot={() => setFloatingChatOpen(true)}
            />
          </div>
        )}

        {/* TAB 2: TRẠM PHIÊU LƯU AI */}
        {currentTab === 'adventure' && (
          <div className="space-y-6 animate-fadeIn">
            <AdventureMap
              currentStudent={currentStudent}
              onUpdateStudent={handleUpdateCurrentStudent}
              isTeacherView={currentRole === 'teacher'}
            />
          </div>
        )}

        {/* TAB 3: HOẠT ĐỘNG CỦA EM (6 BƯỚC) */}
        {currentTab === 'activities' && (
          <div className="space-y-6 animate-fadeIn">
            <StudentActivities
              currentStudent={currentStudent}
              onUpdateScore={(pts, stars) => {
                handleUpdateCurrentStudent({
                  score: Math.min(100, currentStudent.score + pts),
                  stars: currentStudent.stars + stars,
                  completedTasks: Math.min(currentStudent.totalTasks, currentStudent.completedTasks + 1),
                });
              }}
            />
          </div>
        )}

        {/* TAB 4: CHATBOT AI – ROBOT TRI THỨC 3D */}
        {currentTab === 'chatbot' && (
          <div className="max-w-3xl mx-auto space-y-4 animate-fadeIn">
            <div className="text-center space-y-1 mb-2">
              <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full font-black text-xs">
                Trợ lý thông minh đồng hành
              </span>
              <h2 className="text-2xl font-black text-slate-800">
                GIAO LƯU CÙNG ROBOT TRI THỨC 3D 🤖
              </h2>
              <p className="text-xs text-slate-500">
                Hỏi bài Toán, Tiếng Việt, câu đố vui và nhận gợi mở từng bước
              </p>
            </div>
            <AIChatbot studentName={currentStudent.name} />
          </div>
        )}

        {/* TAB 5: THƯ VIỆN HỌC LIỆU – KHO BÁU TRI THỨC */}
        {currentTab === 'library' && (
          <div className="space-y-6 animate-fadeIn">
            <LibraryView />
          </div>
        )}

        {/* TAB 6: 10 TRÒ CHƠI TƯƠNG TÁC */}
        {currentTab === 'games' && (
          <div className="space-y-6 animate-fadeIn">
            <InteractiveGames
              onGameComplete={(title, score) => {
                handleUpdateCurrentStudent({
                  stars: currentStudent.stars + 5,
                  score: Math.min(100, currentStudent.score + 2),
                });
              }}
            />
          </div>
        )}

        {/* TAB 7: QUẢN LÝ LỚP HỌC 3D */}
        {currentTab === 'classroom' && (
          <div className="space-y-6 animate-fadeIn">
            <ClassManagement
              students={students}
              onUpdateStudents={setStudents}
            />
          </div>
        )}

        {/* TAB 8: ĐÁNH GIÁ – THỐNG KÊ (HÀNH TRÌNH TIẾN BỘ LỚP 3D) */}
        {currentTab === 'analytics' && (
          <div className="space-y-6 animate-fadeIn">
            <AnalyticsDashboard />
          </div>
        )}

        {/* TAB 9: GÓC VINH DANH – VƯỜN SAO TRI THỨC */}
        {currentTab === 'hall' && (
          <div className="space-y-6 animate-fadeIn">
            <HallOfFame
              students={students}
              currentStudent={currentStudent}
            />
          </div>
        )}

        {/* TAB 10: MINH CHỨNG DỰ THI 2026 */}
        {currentTab === 'evidence' && (
          <div className="space-y-6 animate-fadeIn">
            <EvidenceSection />
          </div>
        )}
      </main>

      {/* 3. Floating Quick Chatbot Button (always accessible on bottom-right) */}
      {!floatingChatOpen && (
        <button
          onClick={() => { setFloatingChatOpen(true); sounds.playStar(); }}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-sky-400 via-indigo-500 to-pink-500 text-white p-3.5 rounded-full shadow-2xl hover:scale-110 transition flex items-center gap-2 border-2 border-white glow-effect group"
          title="Mở Robot Tri Thức 3D"
        >
          <span className="text-2xl group-hover:rotate-12 transition">🤖</span>
          <span className="hidden sm:inline font-black text-xs pr-1">Hỏi Robot 3D</span>
        </button>
      )}

      {/* Floating Chatbot Overlay */}
      {floatingChatOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-full sm:w-[420px] max-w-[calc(100vw-2rem)] shadow-2xl animate-scaleUp">
          <AIChatbot
            studentName={currentStudent.name}
            isOpenFloating={true}
            onCloseFloating={() => setFloatingChatOpen(false)}
          />
        </div>
      )}

      {/* 4. Classroom Presentation Mode Overlay */}
      {presentationOpen && (
        <PresentationMode onExit={() => setPresentationOpen(false)} />
      )}

      {/* 5. Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onResetData={handleResetData}
      />

      {/* 6. Footer */}
      <footer className="bg-white border-t border-emerald-100 py-8 px-4 text-center text-xs text-slate-500 mt-12 space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-3 font-bold text-slate-700">
          <span>AI CÙNG EM – PHIÊU LƯU TRI THỨC LỚP 3</span>
          <span>•</span>
          <span>Cô giáo: {TEACHER_INFO.name}</span>
          <span>•</span>
          <span>{TEACHER_INFO.school}</span>
          <span>•</span>
          <span>{TEACHER_INFO.classRoom} ({TEACHER_INFO.academicYear})</span>
        </div>
        <p className="max-w-2xl mx-auto text-slate-400 text-[11px]">
          "{TEACHER_INFO.slogan}" – Hệ thống học tập số cá nhân hóa, bám sát Chương trình Giáo dục Phổ thông 2018 và tâm lý lứa tuổi học sinh tiểu học (8-9 tuổi).
        </p>
        <div className="text-[10px] text-emerald-600 font-bold pt-1">
          Dữ liệu demo minh họa phục vụ trình diễn trước Hội đồng Ban giám khảo cuộc thi năm 2026.
        </div>
      </footer>
    </div>
  );
}
