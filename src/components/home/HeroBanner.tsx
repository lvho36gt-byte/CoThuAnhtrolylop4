import React, { useState } from 'react';
import { TEACHER_INFO } from '../../data/mockData';
import { sounds } from '../../utils/sound';
import { 
  Sparkles, Compass, ShieldCheck, Heart, Star, 
  Upload, ArrowRight, Play, BookOpen, Bot, Award, Users 
} from 'lucide-react';

interface HeroBannerProps {
  onStartAdventure: () => void;
  onGoToTeacherMode: () => void;
  onOpenStation: (stationId: number) => void;
  onOpenChatbot: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onStartAdventure,
  onGoToTeacherMode,
  onOpenStation,
  onOpenChatbot,
}) => {
  const [teacherImg, setTeacherImg] = useState(TEACHER_INFO.avatar);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [inputUrl, setInputUrl] = useState('');

  const handleUpdateImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      setTeacherImg(inputUrl.trim());
      setShowUploadModal(false);
      sounds.playCorrect();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTeacherImg(reader.result as string);
        setShowUploadModal(false);
        sounds.playCorrect();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      {/* ================= POSTER HERO BANNER ================= */}
      <div className="relative rounded-[36px] overflow-hidden bg-gradient-to-br from-sky-400 via-blue-400 to-emerald-400 p-6 sm:p-10 shadow-xl border-4 border-white/60">
        {/* Background decorative garden elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-emerald-300/30 rounded-full blur-3xl pointer-events-none" />

        {/* Top school badge & author tag */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm text-xs font-black text-emerald-800">
            <span>🏫</span> {TEACHER_INFO.school} – {TEACHER_INFO.classRoom} ({TEACHER_INFO.academicYear})
          </div>

          <div className="inline-flex items-center gap-1.5 bg-amber-400/90 text-slate-900 px-3 py-1 rounded-full text-xs font-black shadow-sm">
            <span>⭐</span> Sản phẩm dự thi ứng dụng AI trong giáo dục
          </div>
        </div>

        {/* 3-Column Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* LEFT: Teacher Portrait & Info */}
          <div className="lg:col-span-3 flex flex-col items-center text-center bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-3xl shadow-lg border-2 border-white space-y-3 relative group">
            <div className="relative w-full max-w-[200px] aspect-[3/4] rounded-2xl overflow-hidden shadow-md border-4 border-amber-300 ring-2 ring-emerald-300">
              <img
                src={teacherImg}
                alt="Cô giáo Nguyễn Hoàng Thu Anh"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                <span>⭐</span> Việt Nam
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="absolute bottom-2 right-2 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full shadow-lg transition hover:scale-110"
                title="Thay đổi ảnh giáo viên"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block">
                Tác giả – Giáo viên thực hiện
              </span>
              <h3 className="font-black text-slate-800 text-base sm:text-lg leading-snug">
                Cô {TEACHER_INFO.name}
              </h3>
              <p className="text-[11px] text-slate-600 font-bold">
                {TEACHER_INFO.school}
              </p>
              <p className="text-[10px] text-emerald-600 font-black">
                Phụ trách: {TEACHER_INFO.classRoom} ({TEACHER_INFO.academicYear})
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="text-[10px] font-bold text-sky-600 hover:underline flex items-center gap-1 pt-1 border-t border-slate-100 w-full justify-center"
            >
              <Upload className="w-3 h-3" /> Cập nhật / Tải ảnh khác ↺
            </button>
          </div>

          {/* CENTER: Main Title, Robot Mascot & Slogans */}
          <div className="lg:col-span-6 text-center space-y-4">
            <div className="inline-block animate-float">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-sky-200 via-white to-pink-200 p-2 shadow-2xl mx-auto flex items-center justify-center border-4 border-white glow-effect">
                <span className="text-6xl sm:text-7xl">🤖</span>
              </div>
            </div>

            <div>
              <span className="text-xs sm:text-sm font-black text-amber-200 uppercase tracking-widest block drop-shadow">
                Mô hình học tập số thông minh 2026
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-md">
                AI CÙNG EM
              </h1>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-amber-300 drop-shadow">
                PHIÊU LƯU TRI THỨC LỚP 3
              </h2>
            </div>

            <p className="text-sky-50 text-xs sm:text-sm font-bold max-w-lg mx-auto bg-black/10 backdrop-blur-xs px-4 py-2 rounded-2xl">
              "{TEACHER_INFO.slogan}"
            </p>

            <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-[11px] font-semibold text-white">
              🌱 {TEACHER_INFO.eduMessage}
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => { onStartAdventure(); sounds.playCorrect(); }}
                className="px-6 sm:px-8 py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 rounded-full font-black text-sm sm:text-base shadow-xl hover:scale-105 transition flex items-center gap-2"
              >
                <span>🚀</span> BẮT ĐẦU PHIÊU LƯU
              </button>

              <button
                onClick={() => { onGoToTeacherMode(); sounds.playPop(); }}
                className="px-6 py-3.5 bg-white/90 hover:bg-white text-emerald-800 rounded-full font-black text-sm shadow-lg hover:scale-102 transition flex items-center gap-2"
              >
                <span>👩‍🏫</span> DÀNH CHO GIÁO VIÊN
              </button>
            </div>
          </div>

          {/* RIGHT: Happy Primary Students Illustration */}
          <div className="lg:col-span-3 flex flex-col items-center text-center bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-md border-2 border-white space-y-3">
            <div className="flex items-center justify-center gap-2 text-5xl">
              <span className="animate-bounce">👧</span>
              <span className="text-3xl">⭐</span>
              <span className="animate-bounce delay-100">👦</span>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-pink-600 block">
                Học sinh Trung tâm
              </span>
              <h3 className="font-black text-slate-800 text-sm">
                24 Bạn Nhỏ Lớp 3D
              </h3>
              <p className="text-[11px] text-slate-500 font-semibold">
                4 nhóm: Sao Mai, Sơn Ca, Chim Én, Búp Sen
              </p>
            </div>
            <div className="p-2.5 bg-pink-50 rounded-2xl border border-pink-100 text-[11px] font-bold text-pink-700">
              "Chúng em hào hứng học Toán & Tiếng Việt cùng Robot mỗi ngày!"
            </div>
          </div>
        </div>
      </div>

      {/* ================= 4 REAL PEDAGOGICAL SOLUTIONS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: '🎨',
            title: '1. Học liệu sinh động',
            desc: 'Sách tương tác, âm thanh tiếng Việt, hình minh họa trực quan bám sát GDPT 2018.',
            bg: 'bg-sky-50 border-sky-200 text-sky-800',
          },
          {
            icon: '🎯',
            title: '2. Phân hóa 3 mức độ',
            desc: 'Nhận biết – Thông hiểu – Vận dụng, bồi dưỡng học sinh khá giỏi và phụ đạo kịp thời.',
            bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          },
          {
            icon: '🤝',
            title: '3. Hợp tác & Sáng tạo',
            desc: 'Cùng vẽ sơ đồ tư duy, làm việc nhóm, viết truyện ngắn và bảo tàng lớp học.',
            bg: 'bg-pink-50 border-pink-200 text-pink-800',
          },
          {
            icon: '📊',
            title: '4. Giám sát thời gian thực',
            desc: 'Giáo viên theo dõi tiến độ từng học sinh, AI hỗ trợ soạn bài và nhận xét chuẩn mực.',
            bg: 'bg-purple-50 border-purple-200 text-purple-800',
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-3xl border ${item.bg} shadow-sm space-y-2 hover:-translate-y-1 transition`}
          >
            <span className="text-3xl block">{item.icon}</span>
            <h3 className="font-black text-base">{item.title}</h3>
            <p className="text-xs opacity-90 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* ================= 5 STATIONS SHORTCUT SHOWCASE ================= */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <span>🗺️</span> HÀNH TRÌNH 5 TRẠM PHIÊU LƯU TRI THỨC
            </h3>
            <p className="text-slate-500 text-xs">
              Mỗi trạm có nhân vật riêng, nhiệm vụ học tập cụ thể và trao thưởng sao vàng
            </p>
          </div>
          <button
            onClick={() => { onStartAdventure(); sounds.playPop(); }}
            className="text-xs font-black text-emerald-600 hover:underline flex items-center gap-1"
          >
            Xem bản đồ đầy đủ →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[
            { id: 1, name: 'Trạm 1: Khởi động', icon: '🤖', desc: 'Đố vui, đếm đồ vật, kích hoạt năng lượng', color: 'bg-amber-500' },
            { id: 2, name: 'Trạm 2: Khám phá', icon: '🔍', desc: 'Sách tương tác & âm thanh chuẩn tiếng Việt', color: 'bg-sky-500' },
            { id: 3, name: 'Trạm 3: Nhiệm vụ', icon: '🎯', desc: '3 Mức độ năng lực & phản hồi tức thời', color: 'bg-emerald-500' },
            { id: 4, name: 'Trạm 4: Sáng tạo', icon: '🎨', desc: 'Vẽ tranh, sơ đồ tư duy & bảo tàng lớp', color: 'bg-pink-500' },
            { id: 5, name: 'Trạm 5: Phản hồi', icon: '🌱', desc: 'Tự đánh giá cảm xúc & gợi ý bài tiếp theo', color: 'bg-purple-500' },
          ].map((st) => (
            <div
              key={st.id}
              onClick={() => { onOpenStation(st.id); sounds.playPop(); }}
              className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-emerald-200 hover:shadow-md cursor-pointer transition space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl group-hover:scale-110 transition">{st.icon}</span>
                <span className={`w-2 h-2 rounded-full ${st.color}`} />
              </div>
              <h4 className="font-black text-slate-800 text-xs">{st.name}</h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MODAL UPDATE TEACHER PHOTO ================= */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-800 text-lg">Cập nhật ảnh Cô giáo Thu Anh</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <p className="text-xs text-slate-500">
              Quy định dự thi: Nhà trường và giáo viên có thể dễ dàng tải lên ảnh thực tế phục vụ buổi báo cáo.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tải ảnh từ máy tính:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-2 text-[10px] text-slate-400 font-bold">HOẶC NHẬP LINK ẢNH</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <form onSubmit={handleUpdateImage} className="space-y-3">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-400"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow"
                >
                  Lưu ảnh mới
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
