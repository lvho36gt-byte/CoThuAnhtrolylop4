import React, { useState, useRef } from 'react';
import { StationData, Student, QuizQuestion } from '../../types';
import { STATIONS, SAMPLE_QUESTIONS, CREATIVE_GALLERY } from '../../data/mockData';
import { sounds } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { 
  Sparkles, BookOpen, CheckCircle2, Palette, TrendingUp, Star, Lock, 
  Volume2, VolumeX, ArrowRight, RotateCcw, Award, Lightbulb, Smile, HelpCircle,
  ThumbsUp, Send, Check, Heart, ShieldAlert
} from 'lucide-react';

interface AdventureMapProps {
  currentStudent: Student;
  onUpdateStudent: (updated: Partial<Student>) => void;
  isTeacherView?: boolean;
}

export const AdventureMap: React.FC<AdventureMapProps> = ({
  currentStudent,
  onUpdateStudent,
  isTeacherView = false,
}) => {
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [stations, setStations] = useState<StationData[]>(STATIONS);

  const handleOpenStation = (st: StationData) => {
    if (!st.unlocked && !isTeacherView) {
      sounds.playTryAgain();
      return;
    }
    sounds.playPop();
    setSelectedStation(st.id);
  };

  const handleCompleteStation = (stationId: number, stars: number) => {
    sounds.playCorrect();
    sounds.playStar();
    confetti({ particleCount: 80, spread: 70 });

    setStations((prev) =>
      prev.map((s) => {
        if (s.id === stationId) {
          return { ...s, completed: true, starsEarned: stars };
        }
        if (s.id === stationId + 1) {
          return { ...s, unlocked: true };
        }
        return s;
      })
    );

    onUpdateStudent({
      stars: currentStudent.stars + stars,
      completedTasks: Math.min(currentStudent.totalTasks, currentStudent.completedTasks + 1),
      score: Math.min(100, currentStudent.score + 2),
    });
  };

  return (
    <div className="space-y-6">
      {/* Journey Map Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <span>🚀</span> Bản đồ hành trình 5 trạm học tập
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              Chào mừng {currentStudent.name} đến với Vườn Tri Thức Lớp 3D!
            </h2>
            <p className="text-sky-100 text-sm">
              Hãy cùng Robot Tri Thức hoàn thành từng trạm phiêu lưu để thu thập đủ 15 ngôi sao và mở khóa Huy hiệu Xuất sắc!
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/30 self-start md:self-auto">
            <div className="text-center">
              <span className="text-xs uppercase font-bold text-sky-100 block">Số sao đạt</span>
              <span className="text-3xl font-black text-amber-300 flex items-center justify-center gap-1">
                ⭐ {currentStudent.stars}
              </span>
            </div>
            <div className="w-px h-10 bg-white/30" />
            <div className="text-center">
              <span className="text-xs uppercase font-bold text-sky-100 block">Nhiệm vụ</span>
              <span className="text-3xl font-black text-white">
                {currentStudent.completedTasks}/{currentStudent.totalTasks}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Stations Interactive Path */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
        {stations.map((st, index) => {
          const isCurrent = !st.completed && st.unlocked;
          return (
            <div
              key={st.id}
              onClick={() => handleOpenStation(st)}
              className={`relative rounded-3xl p-5 border-2 transition duration-300 flex flex-col justify-between cursor-pointer ${
                st.unlocked
                  ? `${st.bgGradient} hover:-translate-y-2 hover:shadow-xl`
                  : 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
              } ${isCurrent ? 'ring-4 ring-amber-400 ring-offset-2 animate-pulse' : ''}`}
            >
              {/* Star Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-black text-sm text-slate-700">
                  {st.id}
                </span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3].map((starNum) => (
                    <span
                      key={starNum}
                      className={`text-base ${
                        st.completed && starNum <= st.starsEarned
                          ? 'text-amber-400 drop-shadow'
                          : 'text-slate-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              {/* Station Icon & Title */}
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl mx-auto">
                  {st.id === 1 && '🤖'}
                  {st.id === 2 && '🔍'}
                  {st.id === 3 && '🎯'}
                  {st.id === 4 && '🎨'}
                  {st.id === 5 && '🌱'}
                </div>
                <h3 className="font-black text-slate-800 text-sm text-center leading-snug">
                  {st.title.replace('TRẠM ' + st.id + ': ', '')}
                </h3>
                <p className="text-[11px] text-slate-500 text-center line-clamp-2">
                  {st.subtitle}
                </p>
              </div>

              {/* Station Status Bottom */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-center">
                {st.completed ? (
                  <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-600 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                    <Check className="w-3.5 h-3.5" /> Hoàn thành
                  </span>
                ) : st.unlocked ? (
                  <span className="inline-flex items-center gap-1 text-xs font-black text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                    Khám phá ngay →
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400">
                    <Lock className="w-3.5 h-3.5" /> Khóa
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL STATION WORKBENCH */}
      {selectedStation !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-sky-50 to-pink-50">
              <div className="flex items-center gap-3">
                <span className="text-3xl">
                  {selectedStation === 1 && '🤖'}
                  {selectedStation === 2 && '🔍'}
                  {selectedStation === 3 && '🎯'}
                  {selectedStation === 4 && '🎨'}
                  {selectedStation === 5 && '🌱'}
                </span>
                <div>
                  <h3 className="font-black text-slate-800 text-lg sm:text-xl">
                    {stations.find((s) => s.id === selectedStation)?.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {stations.find((s) => s.id === selectedStation)?.objective}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setSelectedStation(null); sounds.playPop(); sounds.stopSpeaking(); }}
                className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {selectedStation === 1 && (
                <Station1Warmup onFinish={(stars) => { handleCompleteStation(1, stars); setSelectedStation(null); }} />
              )}
              {selectedStation === 2 && (
                <Station2Discovery onFinish={(stars) => { handleCompleteStation(2, stars); setSelectedStation(null); }} />
              )}
              {selectedStation === 3 && (
                <Station3Missions onFinish={(stars) => { handleCompleteStation(3, stars); setSelectedStation(null); }} />
              )}
              {selectedStation === 4 && (
                <Station4Creative currentStudent={currentStudent} onFinish={(stars) => { handleCompleteStation(4, stars); setSelectedStation(null); }} />
              )}
              {selectedStation === 5 && (
                <Station5Reflection currentStudent={currentStudent} onFinish={(stars) => { handleCompleteStation(5, stars); setSelectedStation(null); }} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== TRẠM 1: KHỞI ĐỘNG HỨNG THÚ ====================
function Station1Warmup({ onFinish }: { onFinish: (stars: number) => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const warmupQuestions = [
    {
      type: 'Đố vui tranh',
      q: 'Quan sát tranh: Có 3 khay bánh, mỗi khay đựng đúng 7 chiếc bánh quy sô-cô-la thơm lừng. Hỏi có tất cả bao nhiêu chiếc bánh quy?',
      options: ['21 chiếc bánh', '14 chiếc bánh', '28 chiếc bánh', '24 chiếc bánh'],
      correct: 0,
      hint: 'Hãy lấy 7 chiếc bánh nhân với 3 khay: 7 x 3 = ?',
      explanation: 'Đúng rồi! Ta có phép nhân: 7 x 3 = 21 chiếc bánh quy.',
      graphic: '🍪🍪🍪🍪🍪🍪🍪  +  🍪🍪🍪🍪🍪🍪🍪  +  🍪🍪🍪🍪🍪🍪🍪'
    },
    {
      type: 'Ai nhanh hơn',
      q: 'Đố vui khởi động: "Con gì đuôi ngắn tai dài - Mắt hồng lông mượt có tài chạy nhanh?"',
      options: ['Con thỏ trắng', 'Con mèo mướp', 'Con sóc nâu', 'Con hươu sao'],
      correct: 0,
      hint: 'Con vật này rất thích ăn củ cà rốt giòn ngọt!',
      explanation: 'Chính xác! Đó chính là chú thỏ con đáng yêu đấy!',
      graphic: '🐰 🥕'
    },
    {
      type: 'Ô cửa bí mật',
      q: 'Trong câu: "Mùa thu, lá bàng đỏ như màu lửa", hình ảnh so sánh là gì?',
      options: [
        'Lá bàng được so sánh với màu lửa',
        'Mùa thu so sánh với lá bàng',
        'Màu lửa so sánh với mùa thu',
        'Không có hình ảnh so sánh'
      ],
      correct: 0,
      hint: 'Tìm từ "như" nằm giữa lá bàng đỏ và màu lửa.',
      explanation: 'Xuất sắc! Sự vật 1 là lá bàng đỏ được so sánh với sự vật 2 là màu lửa!',
      graphic: '🍂 🔥'
    }
  ];

  const q = warmupQuestions[currentIdx];

  const handleChoose = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    if (idx === q.correct) {
      sounds.playCorrect();
      setCorrectCount((prev) => prev + 1);
      setFeedback('🎉 Tuyệt vời! ' + q.explanation);
    } else {
      sounds.playTryAgain();
      setFeedback('💡 Chưa đúng rồi! ' + q.hint);
    }
  };

  const nextQuestion = () => {
    if (currentIdx + 1 < warmupQuestions.length) {
      setCurrentIdx(currentIdx + 1);
      setSelectedAnswer(null);
      setFeedback(null);
    } else {
      onFinish(3);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-amber-50 p-4 rounded-2xl border border-amber-200">
        <span className="font-black text-amber-900 text-sm">
          🌟 Thử thách khởi động: Câu {currentIdx + 1}/{warmupQuestions.length} ({q.type})
        </span>
        <span className="text-xs font-bold text-amber-700 bg-amber-200/60 px-3 py-1 rounded-full">
          Đúng: {correctCount} câu
        </span>
      </div>

      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-3">
        <div className="text-2xl tracking-widest p-3 bg-white rounded-xl shadow-inner inline-block">
          {q.graphic}
        </div>
        <h4 className="text-base sm:text-lg font-black text-slate-800">{q.q}</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleChoose(i)}
            className={`p-4 rounded-2xl border text-left font-bold text-sm transition ${
              selectedAnswer === null
                ? 'hover:bg-amber-50 border-slate-200 text-slate-700'
                : i === q.correct
                ? 'bg-emerald-100 border-emerald-400 text-emerald-800 shadow-sm'
                : selectedAnswer === i
                ? 'bg-rose-100 border-rose-400 text-rose-800'
                : 'border-slate-100 text-slate-400'
            }`}
          >
            <span className="font-black mr-2">{['A', 'B', 'C', 'D'][i]}.</span> {opt}
          </button>
        ))}
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
          <p className="text-sm font-bold text-emerald-800">{feedback}</p>
          <button
            onClick={nextQuestion}
            className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700"
          >
            {currentIdx + 1 < warmupQuestions.length ? 'Câu tiếp theo →' : 'Hoàn thành trạm 1 🏆'}
          </button>
        </div>
      )}
    </div>
  );
}

// ==================== TRẠM 2: KHÁM PHÁ TRI THỨC ====================
function Station2Discovery({ onFinish }: { onFinish: (stars: number) => void }) {
  const [activeTab, setActiveTab] = useState<'plants' | 'math7'>('plants');
  const [selectedPart, setSelectedPart] = useState<string>('re');
  const [quizAnswered, setQuizAnswered] = useState(false);

  const plantParts = [
    {
      id: 're',
      name: 'Rễ cây',
      icon: '🌱',
      desc: 'Rễ cây đâm sâu vào lòng đất, có nhiệm vụ hút nước và chất khoáng hòa tan để nuôi dưỡng toàn bộ cây. Đồng thời rễ giúp giữ cho cây đứng vững không bị đổ khi có gió bão!',
      tip: 'Nhớ nè: Rễ giống như những chiếc ống hút diệu kỳ dưới lòng đất!'
    },
    {
      id: 'than',
      name: 'Thân cây',
      icon: '🪵',
      desc: 'Thân cây có nhiệm vụ vận chuyển nước và chất dinh dưỡng từ rễ lên lá, và vận chuyển chất hữu cơ từ lá đi khắp các bộ phận của cây.',
      tip: 'Thân cây giống như một đại lộ giao thông hai chiều vận chuyển thức ăn.'
    },
    {
      id: 'la',
      name: 'Lá cây',
      icon: '🍃',
      desc: 'Lá cây có màu xanh lục nhờ chất diệp lục. Ban ngày, dưới ánh sáng mặt trời, lá cây thực hiện quá trình quang hợp hút khí các-bô-níc và thải ra khí ô-xy giúp bầu không khí trong lành.',
      tip: 'Lá cây là nhà máy sản xuất thức ăn và máy lọc không khí cho Trái Đất!'
    },
    {
      id: 'hoa',
      name: 'Hoa và Quả',
      icon: '🌸',
      desc: 'Hoa là cơ quan sinh sản của cây, sau khi được thụ phấn hoa sẽ phát triển thành quả. Trong quả có chứa hạt, hạt rơi xuống đất ẩm sẽ nảy mầm thành cây con mới.',
      tip: 'Hoa quả giúp cây duy trì và phát triển nòi giống tươi tốt!'
    }
  ];

  const math7Rows = [
    { expr: '7 x 1 = 7', hint: '1 nhóm 7 bạn' },
    { expr: '7 x 2 = 14', hint: '2 nhóm: 7 + 7 = 14' },
    { expr: '7 x 3 = 21', hint: '3 nhóm: 14 + 7 = 21' },
    { expr: '7 x 4 = 28', hint: '4 nhóm: 21 + 7 = 28' },
    { expr: '7 x 5 = 35', hint: '5 nhóm: 28 + 7 = 35' },
    { expr: '7 x 6 = 42', hint: '6 nhóm: 35 + 7 = 42' },
    { expr: '7 x 7 = 49', hint: '7 nhóm: 42 + 7 = 49' },
    { expr: '7 x 8 = 56', hint: '8 nhóm: 49 + 7 = 56' },
    { expr: '7 x 9 = 63', hint: '9 nhóm: 56 + 7 = 63' },
    { expr: '7 x 10 = 70', hint: '10 nhóm: 63 + 7 = 70' },
  ];

  const currentPlant = plantParts.find((p) => p.id === selectedPart)!;

  const playTTS = (text: string) => {
    sounds.playPop();
    sounds.speakVietnamese(text);
  };

  return (
    <div className="space-y-6">
      {/* Subject Selector */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
        <button
          onClick={() => { setActiveTab('plants'); sounds.playPop(); }}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition ${
            activeTab === 'plants' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'
          }`}
        >
          🌿 TN & Xã hội: Các bộ phận của cây
        </button>
        <button
          onClick={() => { setActiveTab('math7'); sounds.playPop(); }}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition ${
            activeTab === 'math7' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-500'
          }`}
        >
          🔢 Toán lớp 3: Bảng nhân 7 trực quan
        </button>
      </div>

      {activeTab === 'plants' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Interactive Tree parts */}
          <div className="md:col-span-1 bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex flex-col gap-2">
            <h4 className="font-black text-emerald-900 text-sm mb-2 text-center">
              Nhấp vào các bộ phận cây:
            </h4>
            {plantParts.map((part) => (
              <button
                key={part.id}
                onClick={() => { setSelectedPart(part.id); sounds.playPop(); }}
                className={`p-3 rounded-xl font-bold text-sm text-left flex items-center justify-between transition ${
                  selectedPart === part.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-emerald-100 border border-emerald-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">{part.icon}</span> {part.name}
                </span>
                <span>→</span>
              </button>
            ))}
          </div>

          {/* Plant Part Detail Panel */}
          <div className="md:col-span-2 bg-white rounded-2xl p-6 border-2 border-emerald-200 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-black text-slate-800 flex items-center gap-2">
                  <span className="text-3xl">{currentPlant.icon}</span> {currentPlant.name}
                </span>
                <button
                  onClick={() => playTTS(`${currentPlant.name}. ${currentPlant.desc}`)}
                  className="px-3 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Volume2 className="w-4 h-4" /> Nghe đọc tiếng Việt
                </button>
              </div>

              <p className="text-slate-700 text-sm leading-relaxed mb-4">
                {currentPlant.desc}
              </p>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-800">
                💡 {currentPlant.tip}
              </div>
            </div>

            {/* Quick check question */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-500">Câu hỏi kiểm tra nhanh:</span>
              <p className="text-xs font-black text-slate-800">
                Nhờ bộ phận nào mà cây quang hợp và thải ra khí ô-xy?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    sounds.playCorrect();
                    setQuizAnswered(true);
                  }}
                  className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-bold"
                >
                  Lá cây
                </button>
                <button
                  onClick={() => sounds.playTryAgain()}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold"
                >
                  Rễ cây
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Math 7 Visualizer */
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {math7Rows.map((row, idx) => (
              <div
                key={idx}
                onClick={() => playTTS(row.expr)}
                className="p-3 bg-sky-50 hover:bg-sky-100 rounded-xl border border-sky-200 text-center cursor-pointer transition hover:scale-105"
              >
                <div className="font-black text-sky-900 text-sm">{row.expr}</div>
                <div className="text-[10px] text-sky-600 mt-1">{row.hint}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 text-center">
            Mẹo: Nhấp vào từng ô để nghe đọc to và ghi nhớ quy luật cộng thêm 7!
          </p>
        </div>
      )}

      {/* Completion Button */}
      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          onClick={() => onFinish(3)}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-black text-sm shadow-md"
        >
          Hoàn thành khám phá & Nhận 3 sao ⭐
        </button>
      </div>
    </div>
  );
}

// ==================== TRẠM 3: NHIỆM VỤ THÔNG MINH (3 MỨC ĐỘ) ====================
function Station3Missions({ onFinish }: { onFinish: (stars: number) => void }) {
  const [currentLevel, setCurrentLevel] = useState<1 | 2 | 3>(2);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  const levelQuestions: Record<1 | 2 | 3, QuizQuestion[]> = {
    1: [
      {
        id: 'l1-1',
        subject: 'Toán',
        question: 'Mức 1 (Khởi đầu - Nhận biết): 7 x 4 = ?',
        options: ['28', '24', '32', '35'],
        correctIndex: 0,
        explanation: '7 x 4 = 28 trong bảng nhân 7.',
        hint: '7 cộng 4 lần hoặc 7 x 3 = 21, thêm 7 bằng 28.',
        level: 1,
        type: 'multiple-choice',
      },
      {
        id: 'l1-2',
        subject: 'Tiếng Việt',
        question: 'Mức 1 (Khởi đầu - Nhận biết): Từ nào chỉ đồ dùng học tập của học sinh lớp 3?',
        options: ['Thước kẻ', 'Cái xẻng', 'Chiếc xe tải', 'Nồi cơm điện'],
        correctIndex: 0,
        explanation: 'Thước kẻ dùng để kẻ những đường thẳng ngay ngắn trong vở.',
        hint: 'Đồ vật em để trong hộp bút.',
        level: 1,
        type: 'multiple-choice',
      }
    ],
    2: [
      {
        id: 'l2-1',
        subject: 'Toán',
        question: 'Mức 2 (Khám phá - Thông hiểu): Mỗi ngày bạn An đọc 7 trang sách. Hỏi trong một tuần lễ bạn An đọc được bao nhiêu trang sách?',
        options: ['49 trang sách', '42 trang sách', '35 trang sách', '56 trang sách'],
        correctIndex: 0,
        explanation: 'Một tuần có 7 ngày. Bạn An đọc được: 7 x 7 = 49 (trang).',
        hint: 'Một tuần có 7 ngày, mỗi ngày 7 trang.',
        level: 2,
        type: 'multiple-choice',
      },
      {
        id: 'l2-2',
        subject: 'Tiếng Việt',
        question: 'Mức 2 (Khám phá - Thông hiểu): Trong câu: "Bác kim giờ thận trọng, nhích từng li từng li", sự vật "kim giờ" được nhân hóa giống như ai?',
        options: ['Một người lớn tuổi cẩn thận, điềm đạm', 'Một đứa trẻ tinh nghịch', 'Một chú sóc nhỏ nhanh nhẹn', 'Không có nhân hóa'],
        correctIndex: 0,
        explanation: 'Từ "bác", "thận trọng" là những từ dùng tả con người được dùng cho kim giờ!',
        hint: 'Từ "bác" thường dùng để gọi ai?',
        level: 2,
        type: 'multiple-choice',
      }
    ],
    3: [
      {
        id: 'l3-1',
        subject: 'Toán',
        question: 'Mức 3 (Chinh phục - Vận dụng): Lớp 3D có 35 học sinh. Trong giờ hoạt động trải nghiệm, cô giáo chia đều thành 5 nhóm. Nếu mỗi bạn trong một nhóm làm được 2 bông hoa giấy, hỏi cả nhóm đó làm được bao nhiêu bông hoa?',
        options: ['14 bông hoa', '12 bông hoa', '10 bông hoa', '16 bông hoa'],
        correctIndex: 0,
        explanation: 'Mỗi nhóm có: 35 : 5 = 7 (bạn). Cả nhóm làm được: 7 x 2 = 14 (bông hoa).',
        hint: 'Bước 1: Tìm số bạn mỗi nhóm. Bước 2: Nhân với 2.',
        level: 3,
        type: 'word-problem',
      }
    ]
  };

  const currentQuestions = levelQuestions[currentLevel];
  const q = currentQuestions[answeredCount % currentQuestions.length];

  const handleSelect = (idx: number) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    if (idx === q.correctIndex) {
      sounds.playCorrect();
      setScore((s) => s + 50);
    } else {
      sounds.playTryAgain();
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setAnsweredCount((c) => c + 1);
  };

  return (
    <div className="space-y-6">
      {/* 3 Level Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
        <button
          onClick={() => { setCurrentLevel(1); setSelectedOpt(null); sounds.playPop(); }}
          className={`flex-1 py-2.5 rounded-xl font-black text-xs transition ${
            currentLevel === 1 ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-600'
          }`}
        >
          🌱 Mức 1: Nhận biết
        </button>
        <button
          onClick={() => { setCurrentLevel(2); setSelectedOpt(null); sounds.playPop(); }}
          className={`flex-1 py-2.5 rounded-xl font-black text-xs transition ${
            currentLevel === 2 ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600'
          }`}
        >
          🔍 Mức 2: Thông hiểu
        </button>
        <button
          onClick={() => { setCurrentLevel(3); setSelectedOpt(null); sounds.playPop(); }}
          className={`flex-1 py-2.5 rounded-xl font-black text-xs transition ${
            currentLevel === 3 ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600'
          }`}
        >
          🚀 Mức 3: Vận dụng
        </button>
      </div>

      <div className="p-6 bg-white rounded-2xl border-2 border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Môn {q.subject}
          </span>
          <span className="font-bold text-xs text-slate-500">Điểm: {score}</span>
        </div>

        <h4 className="text-base font-black text-slate-800">{q.question}</h4>

        <div className="space-y-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full p-3.5 rounded-xl border text-left font-bold text-sm transition ${
                selectedOpt === null
                  ? 'hover:bg-slate-50 border-slate-200 text-slate-700'
                  : i === q.correctIndex
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                  : selectedOpt === i
                  ? 'bg-rose-100 border-rose-400 text-rose-900'
                  : 'border-slate-100 text-slate-400'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {selectedOpt !== null && (
          <div className="p-4 bg-slate-50 rounded-xl space-y-3">
            <p className="text-xs font-bold text-slate-700">
              {selectedOpt === q.correctIndex ? '✅ ' : '❌ '} {q.explanation}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleNext}
                className="px-4 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
              >
                Câu khác
              </button>
              <button
                onClick={() => onFinish(3)}
                className="px-5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-black shadow-sm"
              >
                Hoàn thành Trạm 3 🎯
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== TRẠM 4: SÁNG TẠO CÙNG AI & BẢO TÀNG LỚP 3D ====================
function Station4Creative({
  currentStudent,
  onFinish,
}: {
  currentStudent: Student;
  onFinish: (stars: number) => void;
}) {
  const [tab, setTab] = useState<'draw' | 'story' | 'gallery'>('draw');
  const [storyPrompt, setStoryPrompt] = useState('');
  const [storyResult, setStoryResult] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  // Canvas Drawing
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#10b981');

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const endDraw = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // AI Story Assistant
  const generateStorySuggestions = async () => {
    if (!storyPrompt.trim()) return;
    setAiGenerating(true);
    sounds.playPop();

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Gợi ý cho học sinh lớp 3 viết tiếp câu chuyện ngắn: "${storyPrompt}". Hãy đưa ra 3 ý tưởng mở rộng vui tươi, giàu tính nhân văn và phù hợp tâm lý học sinh 8-9 tuổi.`,
          studentName: currentStudent.name,
          subject: 'Tiếng Việt',
        }),
      });
      const data = await res.json();
      setStoryResult(data.reply);
      sounds.playStar();
    } catch {
      setStoryResult('Robot gợi ý: Em có thể tưởng tượng một ngày bạn nhỏ và Robot Tri Thức cùng nhau đi trồng 7 cây hoa trước cổng trường Khoái Châu 1. Cả hai đã học được bài học đoàn kết thật ý nghĩa!');
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
        <button
          onClick={() => { setTab('draw'); sounds.playPop(); }}
          className={`flex-1 py-2.5 rounded-xl font-black text-xs transition ${
            tab === 'draw' ? 'bg-pink-500 text-white shadow-sm' : 'text-slate-600'
          }`}
        >
          🎨 Vẽ tranh & Sơ đồ tư duy
        </button>
        <button
          onClick={() => { setTab('story'); sounds.playPop(); }}
          className={`flex-1 py-2.5 rounded-xl font-black text-xs transition ${
            tab === 'story' ? 'bg-purple-500 text-white shadow-sm' : 'text-slate-600'
          }`}
        >
          ✍️ Viết truyện cùng AI
        </button>
        <button
          onClick={() => { setTab('gallery'); sounds.playPop(); }}
          className={`flex-1 py-2.5 rounded-xl font-black text-xs transition ${
            tab === 'gallery' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600'
          }`}
        >
          🏛️ Bảo tàng sáng tạo lớp 3D
        </button>
      </div>

      {tab === 'draw' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Chọn màu:</span>
              {['#10b981', '#3b82f6', '#ec4899', '#f59e0b', '#8b5cf6', '#1e293b'].map((col) => (
                <button
                  key={col}
                  onClick={() => setBrushColor(col)}
                  style={{ backgroundColor: col }}
                  className={`w-6 h-6 rounded-full transition ${brushColor === col ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : ''}`}
                />
              ))}
            </div>
            <button
              onClick={clearCanvas}
              className="text-xs font-bold text-rose-500 hover:text-rose-700"
            >
              Tẩy trắng bảng ✕
            </button>
          </div>

          <canvas
            ref={canvasRef}
            width={600}
            height={320}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            className="w-full h-72 bg-white rounded-2xl border-2 border-dashed border-slate-300 shadow-inner cursor-crosshair"
          />

          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-slate-500">
              💡 Học sinh có thể vẽ sơ đồ rễ, thân, lá hoặc tranh tình bạn lớp 3D!
            </span>
            <button
              onClick={() => onFinish(3)}
              className="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-black text-xs shadow-md"
            >
              Nộp cho cô Thu Anh & Lưu vào Bảo tàng ⭐
            </button>
          </div>
        </div>
      )}

      {tab === 'story' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">
              Nhập ý tưởng câu chuyện của em:
            </label>
            <textarea
              value={storyPrompt}
              onChange={(e) => setStoryPrompt(e.target.value)}
              placeholder="Ví dụ: Một buổi sáng đẹp trời ở trường Khoái Châu 1, em gặp một chú chim sẻ bị ướt cánh..."
              className="w-full p-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
              rows={3}
            />
          </div>

          <button
            onClick={generateStorySuggestions}
            disabled={aiGenerating || !storyPrompt.trim()}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl font-black text-xs flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {aiGenerating ? 'Robot AI đang nghĩ gợi ý...' : 'Nhờ Robot gợi mở ý tưởng!'}
          </button>

          {storyResult && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl space-y-2">
              <span className="text-xs font-black text-purple-900 block">
                🤖 Gợi ý mở rộng của Robot Tri Thức:
              </span>
              <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                {storyResult}
              </p>
            </div>
          )}
        </div>
      )}

      {tab === 'gallery' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              Các sản phẩm đã được Cô giáo Nguyễn Hoàng Thu Anh phê duyệt:
            </span>
            <span className="text-xs font-black text-emerald-600">
              {CREATIVE_GALLERY.length} sản phẩm xuất sắc
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CREATIVE_GALLERY.map((sub) => (
              <div key={sub.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-800 text-sm">{sub.title}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
                    {sub.type}
                  </span>
                </div>
                <img
                  src={sub.mediaUrl}
                  alt={sub.title}
                  className="w-full h-36 object-cover rounded-xl shadow-sm"
                />
                <p className="text-xs text-slate-600">{sub.description}</p>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500">Tác giả: {sub.studentName}</span>
                  <span className="text-rose-500 font-bold flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-rose-500" /> {sub.likes} tim
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== TRẠM 5: PHẢN HỒI VÀ PHÁT TRIỂN ====================
function Station5Reflection({
  currentStudent,
  onFinish,
}: {
  currentStudent: Student;
  onFinish: (stars: number) => void;
}) {
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [reflectionText, setReflectionText] = useState('');
  const [groupRating, setGroupRating] = useState('Tuyệt vời');
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);

  const feelings = [
    { id: 'happy', emoji: '😊', label: 'Em đã hiểu bài', color: 'bg-emerald-50 border-emerald-300 text-emerald-800' },
    { id: 'thinking', emoji: '🤔', label: 'Em cần luyện tập thêm', color: 'bg-amber-50 border-amber-300 text-amber-800' },
    { id: 'challenge', emoji: '💡', label: 'Em muốn thử thách mới', color: 'bg-purple-50 border-purple-300 text-purple-800' },
  ];

  const handleSubmit = () => {
    sounds.playCorrect();
    sounds.playStar();
    if (selectedFeeling === 'happy') {
      setAiAdvice(`🌟 Robot Tri Thức khen ngợi ${currentStudent.name}: "Em đã nắm rất chắc kiến thức hôm nay! Hãy tiếp tục phát huy và giúp đỡ các bạn trong nhóm nhé!"`);
    } else if (selectedFeeling === 'thinking') {
      setAiAdvice(`🌱 Lời khuyên ấm áp: "Không sao đâu ${currentStudent.name} ơi, em hãy xem lại bảng nhân 7 ở Trạm 2 và làm thêm 2 bài tập cơ bản nhé. Cô Thu Anh và Robot luôn ở bên em!"`);
    } else {
      setAiAdvice(`🚀 Thử thách mới dành cho ${currentStudent.name}: "Em có thể mở mục Trò chơi tương tác để thử sức với vòng quay tri thức mức vận dụng nhé!"`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h4 className="font-black text-slate-800 text-base">
          Hôm nay em cảm thấy thế nào về buổi học?
        </h4>
        <p className="text-xs text-slate-500">
          Hãy chia sẻ thật lòng cảm nghĩ của mình nhé!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {feelings.map((f) => (
          <button
            key={f.id}
            onClick={() => { setSelectedFeeling(f.id); sounds.playPop(); }}
            className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition ${
              selectedFeeling === f.id ? `${f.color} ring-4 ring-emerald-300 scale-105 shadow-md` : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="text-4xl">{f.emoji}</span>
            <span className="font-black text-xs text-slate-800">{f.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-black text-slate-700">
          Điều em thích nhất hoặc điều em muốn hỏi thêm:
        </label>
        <textarea
          value={reflectionText}
          onChange={(e) => setReflectionText(e.target.value)}
          placeholder="Em thích nhất phần sơ đồ các bộ phận của cây..."
          className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-400 focus:outline-none"
          rows={3}
        />
      </div>

      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
        <span>Đánh giá tinh thần hoạt động của nhóm:</span>
        <select
          value={groupRating}
          onChange={(e) => setGroupRating(e.target.value)}
          className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs"
        >
          <option value="Tuyệt vời">⭐⭐⭐ Cả nhóm rất đoàn kết</option>
          <option value="Khá tốt">⭐⭐ Khá tốt, cần cố gắng hơn</option>
          <option value="Cần hỗ trợ">⭐ Cần cô giáo hướng dẫn thêm</option>
        </select>
      </div>

      {!aiAdvice ? (
        <button
          onClick={handleSubmit}
          disabled={!selectedFeeling}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-full font-black text-sm shadow-md"
        >
          Gửi tự đánh giá & Nhận phản hồi của Robot AI ✨
        </button>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-900 leading-relaxed">
            {aiAdvice}
          </div>
          <button
            onClick={() => onFinish(3)}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-black text-sm shadow-md"
          >
            HOÀN THÀNH TOÀN BỘ 5 TRẠM PHIÊU LƯU 🏆
          </button>
        </div>
      )}
    </div>
  );
}
