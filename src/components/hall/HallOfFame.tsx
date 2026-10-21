import React, { useState } from 'react';
import { Student } from '../../types';
import { sounds } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { Award, Star, Heart, Sparkles, ShieldCheck, Smile } from 'lucide-react';

interface HallOfFameProps {
  students: Student[];
  currentStudent: Student;
}

export const HallOfFame: React.FC<HallOfFameProps> = ({ students, currentStudent }) => {
  const [selectedBadge, setSelectedBadge] = useState<string>('all');

  const badgesList = [
    { name: 'Ngôi sao chăm chỉ', icon: '⭐', color: 'from-amber-400 to-yellow-500', desc: 'Dành cho bạn luôn hoàn thành bài đúng hạn và kiên trì rèn luyện.' },
    { name: 'Nhà khám phá nhí', icon: '🔍', color: 'from-sky-400 to-blue-500', desc: 'Dành cho bạn luôn tò mò, khám phá hết các ngóc ngách bài học trực quan.' },
    { name: 'Chuyên gia Toán học', icon: '🔢', color: 'from-indigo-400 to-purple-500', desc: 'Dành cho bạn tính nhẩm nhanh, chính xác và yêu thích các con số.' },
    { name: 'Đọc hiểu xuất sắc', icon: '📖', color: 'from-emerald-400 to-teal-500', desc: 'Dành cho bạn đọc diễn cảm, nắm bắt nhanh ý nghĩa bài tập đọc.' },
    { name: 'Nhà sáng tạo', icon: '🎨', color: 'from-pink-400 to-rose-500', desc: 'Dành cho bạn có tranh vẽ, sơ đồ tư duy hoặc câu chuyện độc đáo.' },
    { name: 'Đồng đội tuyệt vời', icon: '🤝', color: 'from-orange-400 to-amber-500', desc: 'Dành cho bạn luôn lắng nghe, đoàn kết và hỗ trợ nhóm trưởng.' },
    { name: 'Người bạn biết chia sẻ', icon: '💖', color: 'from-rose-400 to-red-500', desc: 'Dành cho bạn sẵn sàng chỉ bài, động viên khi bạn bè gặp khó khăn.' },
    { name: 'Chiến binh kiên trì', icon: '🛡️', color: 'from-cyan-400 to-sky-600', desc: 'Dành cho bạn không bỏ cuộc trước bài toán khó, luôn nỗ lực vươn lên.' },
  ];

  const filteredStudents = selectedBadge === 'all'
    ? students
    : students.filter((s) => s.badges.includes(selectedBadge));

  const celebrate = () => {
    sounds.playCorrect();
    sounds.playStar();
    confetti({ particleCount: 70, spread: 60 });
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-pink-400 to-purple-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black">
            <span>✨</span> KHÔNG ÁP LỰC ĐIỂM SỐ – TÔN VINH MỌI NỖ LỰC
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            VƯỜN SAO TRI THỨC LỚP 3D 🌟
          </h2>
          <p className="text-amber-100 text-sm">
            Nơi ghi nhận tinh thần cố gắng, lòng nhân ái, khả năng hợp tác và sự tiến bộ từng ngày của mỗi bạn nhỏ.
          </p>
        </div>
      </div>

      {/* Badges Grid Filter */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
        <h3 className="font-black text-slate-800 text-base flex items-center justify-between">
          <span>8 Huy hiệu Vinh danh Lớp 3D</span>
          <span className="text-xs font-bold text-slate-400">Chọn huy hiệu để xem các bạn đạt được</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badgesList.map((b) => (
            <button
              key={b.name}
              onClick={() => {
                setSelectedBadge(selectedBadge === b.name ? 'all' : b.name);
                sounds.playPop();
              }}
              className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                selectedBadge === b.name
                  ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-300 shadow-sm'
                  : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{b.icon}</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white text-slate-600 shadow-sm">
                  {students.filter((s) => s.badges.includes(b.name)).length} bạn
                </span>
              </div>
              <div>
                <span className="font-black text-slate-800 text-xs block">{b.name}</span>
                <span className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">{b.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Honored Students Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
            <span>🏅</span> {selectedBadge === 'all' ? 'Tất cả các bạn lớp 3D đều tỏa sáng!' : `Các bạn đạt huy hiệu "${selectedBadge}"`}
          </h3>
          <button
            onClick={celebrate}
            className="px-4 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full text-xs font-bold flex items-center gap-1 transition"
          >
            <Sparkles className="w-4 h-4" /> Bắn pháo hoa chúc mừng 🎉
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredStudents.map((s) => {
            const isMe = s.id === currentStudent.id;
            return (
              <div
                key={s.id}
                className={`bg-white rounded-3xl p-5 border shadow-sm transition hover:shadow-md hover:-translate-y-1 relative ${
                  isMe ? 'border-amber-300 ring-4 ring-amber-100 bg-amber-50/20' : 'border-slate-100'
                }`}
              >
                {isMe && (
                  <span className="absolute -top-2.5 right-4 bg-amber-400 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-sm">
                    CHÍNH BẠN!
                  </span>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{s.avatar}</span>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm">{s.name}</h4>
                    <span className="text-[10px] text-slate-500 font-bold">{s.group}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl mb-3 text-xs">
                  <span className="font-bold text-slate-600">Ngôi sao đạt:</span>
                  <span className="font-black text-amber-500 flex items-center gap-1">
                    ⭐ {s.stars} sao
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400">Huy hiệu đã đạt:</span>
                  <div className="flex flex-wrap gap-1">
                    {s.badges.map((b) => (
                      <span key={b} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
