import React, { useState, useEffect } from 'react';
import { SAMPLE_QUESTIONS } from '../../data/mockData';
import { sounds } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { 
  X, Play, Pause, RotateCcw, Eye, EyeOff, ChevronRight, 
  ChevronLeft, Trophy, Clock, Check, Sparkles, Volume2 
} from 'lucide-react';

interface PresentationModeProps {
  onExit: () => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({ onExit }) => {
  const [qIndex, setQIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const q = SAMPLE_QUESTIONS[qIndex];

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerRunning) {
      sounds.playTryAgain();
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  const toggleTimer = () => {
    sounds.playPop();
    setTimerRunning(!timerRunning);
  };

  const resetTimer = () => {
    sounds.playPop();
    setTimeLeft(30);
    setTimerRunning(false);
  };

  const handleNext = () => {
    sounds.playPop();
    setShowAnswer(false);
    resetTimer();
    if (qIndex + 1 < SAMPLE_QUESTIONS.length) {
      setQIndex(qIndex + 1);
    } else {
      confetti({ particleCount: 100, spread: 80 });
      setShowSummary(true);
    }
  };

  const handlePrev = () => {
    sounds.playPop();
    setShowAnswer(false);
    resetTimer();
    if (qIndex > 0) {
      setQIndex(qIndex - 1);
    }
  };

  const reveal = () => {
    sounds.playCorrect();
    setShowAnswer(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col justify-between p-6 sm:p-12 select-none">
      {/* Top Bar Controls */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📺</span>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-amber-400 tracking-wide">
              CHẾ ĐỘ TRÌNH CHIẾU MÀN HÌNH LỚP 3D
            </h1>
            <p className="text-xs text-slate-400">
              Giáo viên: Nguyễn Hoàng Thu Anh – Trường Tiểu học Khoái Châu 1
            </p>
          </div>
        </div>

        {/* Timer Box */}
        <div className="flex items-center gap-4 bg-slate-800/80 px-5 py-2.5 rounded-2xl border border-slate-700">
          <Clock className="w-6 h-6 text-amber-400" />
          <span className={`text-3xl font-black font-mono ${timeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>
            {timeLeft}s
          </span>
          <button
            onClick={toggleTimer}
            className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold"
          >
            {timerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button
            onClick={resetTimer}
            className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={onExit}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-sm flex items-center gap-2"
        >
          <X className="w-5 h-5" /> Thoát trình chiếu
        </button>
      </div>

      {/* Main Question Display */}
      {!showSummary ? (
        <div className="max-w-4xl mx-auto w-full space-y-8 my-auto">
          <div className="flex items-center justify-between">
            <span className="px-4 py-1.5 rounded-full text-sm font-black bg-emerald-500 text-slate-900">
              Câu hỏi {qIndex + 1}/{SAMPLE_QUESTIONS.length} – Môn {q.subject}
            </span>
            <button
              onClick={() => sounds.speakVietnamese(q.question)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Volume2 className="w-4 h-4" /> Đọc câu hỏi
            </button>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white leading-snug drop-shadow">
            {q.question}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {q.options.map((opt, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-3xl border-2 text-xl font-bold transition flex items-center justify-between ${
                  showAnswer && idx === q.correctIndex
                    ? 'bg-emerald-500 border-emerald-400 text-slate-900 shadow-2xl scale-102 ring-4 ring-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-black text-amber-400 text-lg">
                    {['A', 'B', 'C', 'D'][idx]}
                  </span>
                  <span>{opt}</span>
                </div>
                {showAnswer && idx === q.correctIndex && (
                  <Check className="w-8 h-8 text-slate-900" />
                )}
              </div>
            ))}
          </div>

          {showAnswer && (
            <div className="p-5 bg-emerald-950/80 border-2 border-emerald-500 rounded-2xl text-emerald-300 text-base font-bold animate-fadeIn">
              💡 Lời giải chi tiết: {q.explanation}
            </div>
          )}
        </div>
      ) : (
        /* Summary celebration */
        <div className="max-w-xl mx-auto text-center space-y-6 my-auto">
          <div className="text-7xl animate-bounce">🏆</div>
          <h2 className="text-3xl font-black text-amber-400">
            TỔNG KẾT TIẾT HỌC LỚP 3D
          </h2>
          <p className="text-base text-slate-300 leading-relaxed">
            Chúc mừng toàn thể 24 bạn nhỏ Lớp 3D và Cô giáo Nguyễn Hoàng Thu Anh đã hoàn thành xuất sắc các thử thách tri thức hôm nay!
          </p>
          <button
            onClick={() => { setShowSummary(false); setQIndex(0); }}
            className="px-8 py-3 bg-emerald-500 text-slate-900 font-black rounded-full text-base shadow-lg hover:bg-emerald-400"
          >
            Trình chiếu lại từ đầu ↺
          </button>
        </div>
      )}

      {/* Bottom Nav Buttons */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-4">
        <button
          onClick={handlePrev}
          disabled={qIndex === 0}
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-2xl font-bold text-base flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" /> Câu trước
        </button>

        <button
          onClick={reveal}
          className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-2xl font-black text-lg flex items-center gap-2 shadow-lg hover:scale-105 transition"
        >
          {showAnswer ? <Eye className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
          {showAnswer ? 'ĐÃ HIỆN ĐÁP ÁN' : 'HIỆN ĐÁP ÁN'}
        </button>

        <button
          onClick={handleNext}
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold text-base flex items-center gap-2"
        >
          {qIndex + 1 < SAMPLE_QUESTIONS.length ? 'Câu tiếp theo' : 'Tổng kết tiết học'} <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
