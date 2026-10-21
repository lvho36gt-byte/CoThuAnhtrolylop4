import React, { useState } from 'react';
import { Student } from '../../types';
import { sounds } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { 
  CheckCircle, Circle, Play, BookOpen, GitFork, Users, 
  UploadCloud, Star, Award, Mic, Volume2, Sparkles, Send, Check
} from 'lucide-react';

interface StudentActivitiesProps {
  currentStudent: Student;
  onUpdateScore: (additionalScore: number, additionalStars: number) => void;
}

export const StudentActivities: React.FC<StudentActivitiesProps> = ({
  currentStudent,
  onUpdateScore,
}) => {
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);

  // Step 1 State: Warmup
  const [step1Answer, setStep1Answer] = useState<number | null>(null);

  // Step 2 State: Reading & Audio
  const [step2ReadDone, setStep2ReadDone] = useState(false);

  // Step 3 State: Mindmap interactive nodes
  const [mindmapNodes, setMindmapNodes] = useState([
    { id: 'root', label: 'CÂY XANH 🌳', color: 'bg-emerald-500 text-white' },
    { id: 're', label: 'Rễ: Hút nước & khoáng', color: 'bg-amber-100 text-amber-800' },
    { id: 'than', label: 'Thân: Dẫn truyền nhựa', color: 'bg-sky-100 text-sky-800' },
    { id: 'la', label: 'Lá: Quang hợp & thở', color: 'bg-emerald-100 text-emerald-800' },
    { id: 'hoa', label: 'Hoa - Quả: Sinh sản', color: 'bg-pink-100 text-pink-800' },
  ]);
  const [newNodeText, setNewNodeText] = useState('');

  // Step 4 State: Group Task
  const [groupRole, setGroupRole] = useState('Trưởng nhóm trình bày');
  const [groupTaskFinished, setGroupTaskFinished] = useState(false);

  // Step 5 State: Presentation
  const [presType, setPresType] = useState<'text' | 'audio'>('text');
  const [presText, setPresText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [presSubmitted, setPresSubmitted] = useState(false);

  // Step 6 State: Self Assessment
  const [selfScore, setSelfScore] = useState(5);
  const [selfFeedback, setSelfFeedback] = useState('Hôm nay em rất vui vì đã làm quen với bảng nhân 7 và sơ đồ cây!');
  const [finishedActivity, setFinishedActivity] = useState(false);

  const stepsList = [
    { step: 1, name: 'Bước 1: Khởi động', icon: '🚀', desc: 'Đố vui kích hoạt hành trình' },
    { step: 2, name: 'Bước 2: Đọc hiểu – Khám phá', icon: '📖', desc: 'Đọc bài giảng & nghe giọng đọc' },
    { step: 3, name: 'Bước 3: Sơ đồ tư duy', icon: '🌿', desc: 'Hệ thống kiến thức tương tác' },
    { step: 4, name: 'Bước 4: Nhiệm vụ nhóm', icon: '👥', desc: 'Phối hợp cùng bạn trong nhóm' },
    { step: 5, name: 'Bước 5: Trình bày sản phẩm', icon: '🎤', desc: 'Thuyết trình bài làm của em' },
    { step: 6, name: 'Bước 6: Tự đánh giá', icon: '⭐', desc: 'Nhìn lại thành tích & nhận sao' },
  ];

  const markStepComplete = (stepNum: number) => {
    sounds.playCorrect();
    sounds.playStar();
    if (!completedSteps.includes(stepNum)) {
      setCompletedSteps([...completedSteps, stepNum]);
    }
    if (stepNum < 6) {
      setActiveStep(stepNum + 1);
    }
  };

  const addMindmapNode = () => {
    if (!newNodeText.trim()) return;
    sounds.playPop();
    setMindmapNodes([
      ...mindmapNodes,
      { id: `node-${Date.now()}`, label: newNodeText.trim(), color: 'bg-purple-100 text-purple-800' }
    ]);
    setNewNodeText('');
  };

  const completeAll = () => {
    sounds.playCorrect();
    confetti({ particleCount: 100, spread: 80 });
    setFinishedActivity(true);
    onUpdateScore(10, 5);
  };

  return (
    <div className="space-y-6">
      {/* Header Pipeline Tracker */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-emerald-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
              <span className="text-3xl">🎒</span> HOẠT ĐỘNG CỦA EM (6 BƯỚC HỌC TẬP TÍCH HỢP)
            </h2>
            <p className="text-xs text-slate-500">
              Quy trình học tập chủ động – Phát triển toàn diện năng lực học sinh lớp 3D
            </p>
          </div>
          <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
            Học sinh: {currentStudent.name} ({currentStudent.group})
          </span>
        </div>

        {/* Steps pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {stepsList.map((s) => {
            const isCompleted = completedSteps.includes(s.step);
            const isActive = activeStep === s.step;
            return (
              <button
                key={s.step}
                onClick={() => { setActiveStep(s.step); sounds.playPop(); }}
                className={`p-3 rounded-2xl text-left border transition ${
                  isActive
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-102'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg">{s.icon}</span>
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300" />
                  )}
                </div>
                <div className="font-black text-xs truncate">{s.name}</div>
                <div className="text-[10px] opacity-80 truncate">{s.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Panel */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 min-h-[420px]">
        {/* BƯỚC 1: KHỞI ĐỘNG */}
        {activeStep === 1 && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-black text-xs">
                Bước 1: Trò chơi khởi động nhận thức
              </span>
              <h3 className="text-xl font-black text-slate-800">
                Câu đố: Trong các hình ảnh dưới đây, hình nào có 28 ngôi sao nhỏ?
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: '4 nhóm, mỗi nhóm 7 ngôi sao (4 x 7)', count: 28, correct: true },
                { label: '3 nhóm, mỗi nhóm 7 ngôi sao (3 x 7)', count: 21, correct: false },
                { label: '5 nhóm, mỗi nhóm 5 ngôi sao (5 x 5)', count: 25, correct: false },
                { label: '4 nhóm, mỗi nhóm 6 ngôi sao (4 x 6)', count: 24, correct: false },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setStep1Answer(idx);
                    if (item.correct) {
                      sounds.playCorrect();
                    } else {
                      sounds.playTryAgain();
                    }
                  }}
                  className={`p-5 rounded-2xl border-2 font-bold text-sm text-left transition ${
                    step1Answer === idx
                      ? item.correct
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                        : 'bg-rose-100 border-rose-400 text-rose-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="text-2xl mb-2">⭐</div>
                  {item.label}
                </button>
              ))}
            </div>

            {step1Answer !== null && (
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => markStepComplete(1)}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-full font-black text-sm shadow hover:bg-emerald-700"
                >
                  Chính xác! Chuyển sang Bước 2 →
                </button>
              </div>
            )}
          </div>
        )}

        {/* BƯỚC 2: ĐỌC HIỂU - KHÁM PHÁ */}
        {activeStep === 2 && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-1">
              <span className="inline-block px-3 py-1 bg-sky-100 text-sky-800 rounded-full font-black text-xs">
                Bước 2: Học liệu trực quan điện tử
              </span>
              <h3 className="text-xl font-black text-slate-800">
                Bài học: "Cây xanh và lá phổi của Trái Đất"
              </h3>
            </div>

            <div className="p-6 bg-sky-50/60 rounded-2xl border border-sky-100 space-y-4">
              <div className="flex justify-end">
                <button
                  onClick={() => sounds.speakVietnamese('Cây xanh là người bạn thân thiết của con người. Ban ngày, dưới ánh sáng mặt trời, lá cây hấp thụ khí các-bô-níc và thải ra khí ô-xy giúp chúng ta hít thở trong lành.')}
                  className="px-3 py-1.5 bg-white shadow-sm border border-sky-200 text-sky-700 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-sky-50"
                >
                  <Volume2 className="w-4 h-4" /> Bật giọng đọc mẫu
                </button>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                "Cây xanh là người bạn thân thiết của con người. Ban ngày, dưới ánh sáng mặt trời, lá cây hấp thụ khí các-bô-níc và thải ra khí ô-xy giúp chúng ta hít thở trong lành. Rễ cây cắm sâu vào đất giữ nước và chống xói mòn. Vì vậy, mỗi bạn nhỏ lớp 3D chúng mình hãy cùng chung tay trồng và chăm sóc thật nhiều cây xanh nhé!"
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={step2ReadDone}
                  onChange={(e) => setStep2ReadDone(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                Em đã đọc kĩ và hiểu nội dung bài học
              </label>

              <button
                disabled={!step2ReadDone}
                onClick={() => markStepComplete(2)}
                className="px-6 py-2.5 bg-emerald-600 disabled:opacity-40 text-white rounded-full font-black text-sm shadow hover:bg-emerald-700"
              >
                Tiếp tục Bước 3 →
              </button>
            </div>
          </div>
        )}

        {/* BƯỚC 3: SƠ ĐỒ TƯ DUY */}
        {activeStep === 3 && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-1">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-black text-xs">
                Bước 3: Sơ đồ tư duy kiến thức
              </span>
              <h3 className="text-xl font-black text-slate-800">
                Hệ thống hóa các nhánh kiến thức
              </h3>
            </div>

            {/* Mindmap preview */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 min-h-[200px] flex flex-wrap items-center justify-center gap-3">
              {mindmapNodes.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-2.5 rounded-2xl font-black text-xs shadow-sm border border-black/5 animate-float`}
                >
                  <span className={`px-2 py-1 rounded-xl ${n.color}`}>
                    {n.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Add Node form */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newNodeText}
                onChange={(e) => setNewNodeText(e.target.value)}
                placeholder="Thêm nhánh mới (ví dụ: Bảo vệ cây xanh)..."
                className="flex-1 p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                onClick={addMindmapNode}
                className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700"
              >
                + Thêm nhánh
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => markStepComplete(3)}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-full font-black text-sm shadow hover:bg-emerald-700"
              >
                Hoàn thành sơ đồ & Sang Bước 4 →
              </button>
            </div>
          </div>
        )}

        {/* BƯỚC 4: NHIỆM VỤ NHÓM */}
        {activeStep === 4 && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-1">
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-black text-xs">
                Bước 4: Hợp tác nhóm thông minh
              </span>
              <h3 className="text-xl font-black text-slate-800">
                Nhiệm vụ {currentStudent.group}: Phân công chuẩn bị bài thuyết trình
              </h3>
            </div>

            <div className="p-5 bg-purple-50 rounded-2xl border border-purple-200 space-y-3">
              <span className="text-xs font-bold text-purple-900 block">
                Chọn vai trò của em trong nhóm hôm nay:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Trưởng nhóm điều phối',
                  'Thư ký ghi chép sơ đồ',
                  'Người tìm tư liệu & tranh ảnh',
                  'Người thuyết trình trước lớp'
                ].map((role) => (
                  <button
                    key={role}
                    onClick={() => { setGroupRole(role); sounds.playPop(); }}
                    className={`p-3 rounded-xl border font-bold text-xs text-left transition ${
                      groupRole === role
                        ? 'bg-purple-600 text-white border-purple-600 shadow'
                        : 'bg-white text-slate-700 border-purple-100 hover:bg-purple-100'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => markStepComplete(4)}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-full font-black text-sm shadow hover:bg-emerald-700"
              >
                Xác nhận vai trò nhóm & Sang Bước 5 →
              </button>
            </div>
          </div>
        )}

        {/* BƯỚC 5: TRÌNH BÀY SẢN PHẨM */}
        {activeStep === 5 && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-1">
              <span className="inline-block px-3 py-1 bg-pink-100 text-pink-800 rounded-full font-black text-xs">
                Bước 5: Trình bày & nộp sản phẩm
              </span>
              <h3 className="text-xl font-black text-slate-800">
                Ghi âm hoặc viết bài thuyết trình của em
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setPresType('text')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                    presType === 'text' ? 'bg-pink-50 border-pink-300 text-pink-700' : 'text-slate-400'
                  }`}
                >
                  📝 Viết bài trình bày
                </button>
                <button
                  onClick={() => setPresType('audio')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                    presType === 'audio' ? 'bg-pink-50 border-pink-300 text-pink-700' : 'text-slate-400'
                  }`}
                >
                  🎤 Ghi âm giọng nói
                </button>
              </div>

              {presType === 'text' ? (
                <textarea
                  value={presText}
                  onChange={(e) => setPresText(e.target.value)}
                  placeholder="Kính thưa cô giáo và các bạn, hôm nay nhóm em xin phép trình bày về ý nghĩa của việc học bảng nhân 7..."
                  className="w-full p-4 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-400 focus:outline-none"
                  rows={4}
                />
              ) : (
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
                  <button
                    onClick={() => {
                      sounds.playPop();
                      setIsRecording(!isRecording);
                    }}
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto text-white shadow-lg transition ${
                      isRecording ? 'bg-rose-500 animate-pulse' : 'bg-pink-500 hover:bg-pink-600'
                    }`}
                  >
                    <Mic className="w-8 h-8" />
                  </button>
                  <p className="text-xs font-bold text-slate-600">
                    {isRecording ? '🔴 Đang ghi âm giọng đọc của bạn nhỏ...' : 'Nhấp vào micro để bắt đầu nói'}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => markStepComplete(5)}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-full font-black text-sm shadow hover:bg-emerald-700"
              >
                Nộp sản phẩm thuyết trình & Sang Bước 6 →
              </button>
            </div>
          </div>
        )}

        {/* BƯỚC 6: TỰ ĐÁNH GIÁ CUỐI HOẠT ĐỘNG */}
        {activeStep === 6 && (
          <div className="space-y-6 max-w-2xl mx-auto text-center">
            <div className="space-y-1">
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-black text-xs">
                Bước 6: Tự đánh giá và tổng kết
              </span>
              <h3 className="text-xl font-black text-slate-800">
                Chúc mừng {currentStudent.name} đã đi đến bước cuối cùng!
              </h3>
            </div>

            <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 space-y-4">
              <span className="text-xs font-bold text-amber-800 block">
                Em tự chấm cho sự nỗ lực của mình hôm nay mấy ngôi sao?
              </span>
              <div className="flex justify-center gap-2 text-3xl">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setSelfScore(s); sounds.playStar(); }}
                    className={`transition ${s <= selfScore ? 'text-amber-400 scale-110 drop-shadow' : 'text-slate-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <textarea
                value={selfFeedback}
                onChange={(e) => setSelfFeedback(e.target.value)}
                className="w-full p-3 rounded-xl border border-amber-200 text-xs bg-white focus:outline-none"
                rows={2}
              />
            </div>

            {!finishedActivity ? (
              <button
                onClick={completeAll}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-base rounded-full shadow-lg hover:scale-105 transition"
              >
                HOÀN THÀNH TOÀN BỘ 6 HOẠT ĐỘNG 🏆
              </button>
            ) : (
              <div className="p-4 bg-emerald-100 text-emerald-900 rounded-2xl font-black text-sm">
                🎉 XUẤT SẮC! BẠN ĐÃ NHẬN THÊM 5 NGÔI SAO VÀ ĐIỂM THƯỞNG TÍCH CỰC!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
