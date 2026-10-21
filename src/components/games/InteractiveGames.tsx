import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { 
  RotateCw, HelpCircle, Trophy, Sparkles, Volume2, VolumeX, ArrowLeft, 
  Users, User, Check, X, Award, Flame, Star, ShieldCheck, Heart
} from 'lucide-react';

interface GameProps {
  onBack?: () => void;
  onGameComplete?: (gameTitle: string, score: number) => void;
}

interface Question {
  q: string;
  options: string[];
  correct: number;
  hint: string;
  subject: string;
}

const GAME_QUESTIONS: Question[] = [
  { q: 'Phép tính nào dưới đây có kết quả bằng 42?', options: ['7 x 6', '7 x 5', '6 x 6', '8 x 5'], correct: 0, hint: 'Trong bảng nhân 7, 7 nhân mấy bằng 42?', subject: 'Toán' },
  { q: 'Từ nào sau đây là từ chỉ đặc điểm?', options: ['Xanh biếc', 'Chạy nhảy', 'Học sinh', 'Quyển sách'], correct: 0, hint: 'Từ này chỉ màu sắc của bầu trời hoặc mặt biển.', subject: 'Tiếng Việt' },
  { q: 'Một tuần lễ có mấy ngày?', options: ['7 ngày', '5 ngày', '6 ngày', '8 ngày'], correct: 0, hint: 'Từ Thứ Hai đến Chủ Nhật.', subject: 'Toán' },
  { q: 'Bộ phận nào của cây làm nhiệm vụ quang hợp tạo chất dinh dưỡng?', options: ['Lá cây', 'Rễ cây', 'Thân cây', 'Hoa'], correct: 0, hint: 'Bộ phận thường có màu xanh lục hứng ánh nắng mặt trời.', subject: 'Tự nhiên & Xã hội' },
  { q: '7 x 8 bằng bao nhiêu?', options: ['56', '54', '48', '63'], correct: 0, hint: '7 x 7 = 49, thêm 7 nữa bằng bao nhiêu?', subject: 'Toán' },
  { q: 'Trong câu: "Mặt hồ phẳng lặng như gương", từ so sánh là từ nào?', options: ['như', 'mặt hồ', 'phẳng lặng', 'gương'], correct: 0, hint: 'Từ nối giữa 2 vế so sánh.', subject: 'Tiếng Việt' },
  { q: '63 : 7 bằng bao nhiêu?', options: ['9', '8', '7', '6'], correct: 0, hint: '7 x 9 = 63 đó em!', subject: 'Toán' },
  { q: 'Khi tham gia giao thông, học sinh đi bộ phải đi ở đâu?', options: ['Trên vỉa hè', 'Dưới lòng đường', 'Giữa tim đường', 'Bất cứ chỗ nào'], correct: 0, hint: 'Nơi an toàn dành riêng cho người đi bộ ven đường.', subject: 'Đạo đức' },
];

export const InteractiveGames: React.FC<GameProps> = ({ onGameComplete }) => {
  const [activeGameId, setActiveGameId] = useState<number | null>(null);
  const [gameMode, setGameMode] = useState<'individual' | 'group'>('individual');
  const [soundOn, setSoundOn] = useState(true);

  const toggleSound = () => {
    sounds.enabled = !soundOn;
    setSoundOn(!soundOn);
  };

  const gamesList = [
    { id: 1, title: 'Vòng quay tri thức', desc: 'Quay kim may mắn để nhận câu hỏi và tích điểm sao vàng!', icon: '🎡', color: 'from-amber-400 to-orange-500' },
    { id: 2, title: 'Ai là triệu phú nhí', desc: 'Thử thách 10 câu hỏi hồi hộp cùng quyền trợ giúp 50:50 & Robot AI!', icon: '🏆', color: 'from-blue-500 to-indigo-600' },
    { id: 3, title: 'Ô cửa bí mật', desc: 'Lật mở 4 cánh cửa bí ẩn để ghép nên bức tranh tri thức hoàn hảo!', icon: '🚪', color: 'from-emerald-400 to-teal-600' },
    { id: 4, title: 'Hái hoa dân chủ', desc: 'Cây tri thức nở rộ bông hoa rực rỡ, bấm hái hoa để trả lời!', icon: '🌸', color: 'from-rose-400 to-pink-600' },
    { id: 5, title: 'Đường lên đỉnh tri thức', desc: 'Vượt qua từng mốc dốc núi để cắm cờ vinh quang trên đỉnh!', icon: '⛰️', color: 'from-cyan-500 to-blue-600' },
    { id: 6, title: 'Ghép đôi thông minh', desc: 'Lật mở các tấm thẻ bài để ghép cặp thuật ngữ và định nghĩa tương ứng!', icon: '🃏', color: 'from-purple-400 to-violet-600' },
    { id: 7, title: 'Giải cứu robot AI', desc: 'Robot Sparky bị cạn năng lượng! Trả lời đúng để nạp đủ 100% pin!', icon: '🤖', color: 'from-amber-500 to-yellow-600' },
    { id: 8, title: 'Săn tìm kho báu', desc: 'Khám phá hòn đảo hoang và tìm chìa khóa mở rương vàng tri thức!', icon: '🗺️', color: 'from-emerald-500 to-lime-600' },
    { id: 9, title: 'Vượt chướng ngại vật', desc: 'Điều khiển nhân vật nhảy qua chướng ngại vật bằng đáp án chuẩn xác!', icon: '🏃', color: 'from-orange-400 to-red-500' },
    { id: 10, title: 'Cuộc đua kiến thức', desc: 'Khinh khí cầu và xe đua tăng tốc thần kỳ sau mỗi câu trả lời đúng!', icon: '🏎️', color: 'from-fuchsia-500 to-pink-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-emerald-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <span className="text-3xl">🎮</span> HỆ THỐNG 10 TRÒ CHƠI TƯƠNG TÁC LỚP 3D
          </h2>
          <p className="text-slate-500 text-sm">Học qua chơi – Chơi mà học – Rèn luyện tư duy và tinh thần hợp tác</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center text-sm font-bold">
            <button
              onClick={() => { setGameMode('individual'); sounds.playPop(); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                gameMode === 'individual' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <User className="w-4 h-4" /> Cá nhân
            </button>
            <button
              onClick={() => { setGameMode('group'); sounds.playPop(); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                gameMode === 'group' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Users className="w-4 h-4" /> Thi theo nhóm
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2.5 rounded-2xl border transition ${
              soundOn ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
            title={soundOn ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {activeGameId === null ? (
        /* Game Selection Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {gamesList.map((game) => (
            <div
              key={game.id}
              onClick={() => { setActiveGameId(game.id); sounds.playPop(); }}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${game.color} opacity-10 rounded-full blur-xl group-hover:scale-150 transition`} />
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-3xl mb-4 shadow-inner group-hover:scale-110 transition">
                  {game.icon}
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 mb-2">
                  Trò chơi số {game.id}
                </div>
                <h3 className="font-black text-slate-800 text-lg group-hover:text-emerald-600 transition leading-snug">
                  {game.title}
                </h3>
                <p className="text-slate-500 text-xs mt-2 line-clamp-3">
                  {game.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">
                  {gameMode === 'group' ? 'Nhóm 4-6 bạn' : 'Cá nhân'}
                </span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition">
                  Chơi ngay →
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Active Game Arena */
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 min-h-[500px]">
          <button
            onClick={() => { setActiveGameId(null); sounds.playPop(); }}
            className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại danh sách trò chơi
          </button>

          {activeGameId === 1 && <SpinWheelGame onFinish={() => onGameComplete?.('Vòng quay tri thức', 100)} />}
          {activeGameId === 2 && <MillionaireGame onFinish={() => onGameComplete?.('Ai là triệu phú nhí', 100)} />}
          {activeGameId === 3 && <SecretDoorsGame onFinish={() => onGameComplete?.('Ô cửa bí mật', 100)} />}
          {activeGameId === 4 && <FlowerPickingGame onFinish={() => onGameComplete?.('Hái hoa dân chủ', 100)} />}
          {activeGameId === 5 && <MountainClimberGame onFinish={() => onGameComplete?.('Đường lên đỉnh tri thức', 100)} />}
          {activeGameId === 6 && <MemoryMatchGame onFinish={() => onGameComplete?.('Ghép đôi thông minh', 100)} />}
          {activeGameId === 7 && <SaveRobotGame onFinish={() => onGameComplete?.('Giải cứu robot AI', 100)} />}
          {activeGameId === 8 && <TreasureHuntGame onFinish={() => onGameComplete?.('Săn tìm kho báu', 100)} />}
          {activeGameId === 9 && <HurdleRaceGame onFinish={() => onGameComplete?.('Vượt chướng ngại vật', 100)} />}
          {activeGameId === 10 && <KnowledgeRaceGame onFinish={() => onGameComplete?.('Cuộc đua kiến thức', 100)} />}
        </div>
      )}
    </div>
  );
};

// ==================== 1. VÒNG QUAY TRI THỨC ====================
function SpinWheelGame({ onFinish }: { onFinish: () => void }) {
  const [spinning, setSpinning] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const spin = () => {
    if (spinning || currentQuestion) return;
    setSpinning(true);
    sounds.playPop();
    const newRotation = rotation + 1440 + Math.floor(Math.random() * 360);
    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      const q = GAME_QUESTIONS[Math.floor(Math.random() * GAME_QUESTIONS.length)];
      setCurrentQuestion(q);
      setSelectedAnswer(null);
      setFeedback(null);
      sounds.playStar();
    }, 2500);
  };

  const handleAnswer = (index: number) => {
    if (!currentQuestion || selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === currentQuestion.correct) {
      sounds.playCorrect();
      confetti({ particleCount: 50, spread: 60 });
      setCurrentScore((prev) => prev + 20);
      setFeedback('Chính xác tuyệt vời! Bạn được cộng 20 điểm sao!');
    } else {
      sounds.playTryAgain();
      setFeedback(`Gợi ý nhỏ: ${currentQuestion.hint}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center space-y-6">
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-center justify-between">
        <span className="font-bold text-amber-800">🎡 Vòng quay tri thức lớp 3D</span>
        <span className="font-black text-amber-600 text-lg flex items-center gap-1">
          <Star className="w-5 h-5 fill-amber-400 text-amber-400" /> {currentScore} điểm
        </span>
      </div>

      <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
        {/* Pointer */}
        <div className="absolute -top-3 z-20 text-3xl text-rose-500 drop-shadow">🔻</div>
        {/* Rotating Wheel */}
        <div
          style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 2.5s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
          className="w-full h-full rounded-full border-8 border-amber-300 shadow-xl overflow-hidden relative flex items-center justify-center bg-conic-gradient"
        >
          <div className="w-full h-full rounded-full grid grid-cols-2 grid-rows-2">
            <div className="bg-rose-400 flex items-center justify-center font-black text-white text-xs">Toán 7x</div>
            <div className="bg-sky-400 flex items-center justify-center font-black text-white text-xs">Tiếng Việt</div>
            <div className="bg-emerald-400 flex items-center justify-center font-black text-white text-xs">TN & XH</div>
            <div className="bg-amber-400 flex items-center justify-center font-black text-white text-xs">+50 Điểm</div>
          </div>
          <div className="absolute w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center font-black text-slate-700 text-sm border-4 border-amber-200">
            QUAY
          </div>
        </div>
      </div>

      {!currentQuestion ? (
        <button
          onClick={spin}
          disabled={spinning}
          className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-black text-lg shadow-lg hover:shadow-amber-200 hover:scale-105 transition disabled:opacity-50"
        >
          {spinning ? 'VÒNG QUAY ĐANG QUAY...' : 'NHẤP ĐỂ QUAY KIM! 🎯'}
        </button>
      ) : (
        <div className="bg-white rounded-2xl p-6 border-2 border-emerald-200 shadow-md text-left space-y-4">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-700">
            Môn {currentQuestion.subject}
          </div>
          <h4 className="font-extrabold text-slate-800 text-lg">{currentQuestion.q}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQuestion.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={`p-3.5 rounded-xl border text-left font-bold text-sm transition ${
                  selectedAnswer === null
                    ? 'hover:bg-amber-50 border-slate-200 text-slate-700'
                    : i === currentQuestion.correct
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                    : selectedAnswer === i
                    ? 'bg-rose-100 border-rose-400 text-rose-800'
                    : 'border-slate-100 text-slate-400'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {feedback && (
            <div className="p-3 bg-slate-50 rounded-xl font-bold text-sm text-slate-700 flex items-center justify-between">
              <span>{feedback}</span>
              <button
                onClick={() => { setCurrentQuestion(null); if (currentScore >= 60) onFinish(); }}
                className="px-4 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-black hover:bg-emerald-600"
              >
                Tiếp tục quay ↺
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==================== 2. AI LÀ TRIỆU PHÚ NHÍ ====================
function MillionaireGame({ onFinish }: { onFinish: () => void }) {
  const [level, setLevel] = useState(0);
  const [used5050, setUsed5050] = useState(false);
  const [usedAIHint, setUsedAIHint] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);

  const q = GAME_QUESTIONS[level % GAME_QUESTIONS.length];

  const answer = (idx: number) => {
    if (idx === q.correct) {
      sounds.playCorrect();
      if (level + 1 >= 5) {
        confetti({ particleCount: 100, spread: 80 });
        setGameOver(true);
        onFinish();
      } else {
        setLevel(level + 1);
        setHiddenOptions([]);
        setAiMessage(null);
      }
    } else {
      sounds.playTryAgain();
      setGameOver(true);
    }
  };

  const use5050 = () => {
    if (used5050) return;
    sounds.playPop();
    setUsed5050(true);
    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== q.correct);
    setHiddenOptions([wrongIndices[0], wrongIndices[1]]);
  };

  const useAI = () => {
    if (usedAIHint) return;
    sounds.playStar();
    setUsedAIHint(true);
    setAiMessage(`🤖 Robot AI gợi ý: "Bạn nhỏ ơi, theo tớ thì ${q.hint} Chúc bạn chọn đúng nha!"`);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between bg-blue-900 text-white p-4 rounded-2xl shadow">
        <span className="font-black text-amber-400 flex items-center gap-2">
          <Trophy className="w-5 h-5" /> Câu số {level + 1}/5
        </span>
        <div className="flex gap-2">
          <button
            onClick={use5050}
            disabled={used5050}
            className="px-3 py-1 bg-blue-800 hover:bg-blue-700 disabled:opacity-30 rounded-lg text-xs font-black border border-blue-400"
          >
            50:50
          </button>
          <button
            onClick={useAI}
            disabled={usedAIHint}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-30 rounded-lg text-xs font-black text-slate-900"
          >
            Hỏi Robot AI
          </button>
        </div>
      </div>

      {aiMessage && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold animate-pulse">
          {aiMessage}
        </div>
      )}

      {!gameOver ? (
        <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm space-y-4">
          <h4 className="font-black text-slate-800 text-lg text-center py-2">{q.q}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {q.options.map((opt, i) => (
              <button
                key={i}
                disabled={hiddenOptions.includes(i)}
                onClick={() => answer(i)}
                className={`p-4 rounded-xl border text-left font-bold text-sm transition ${
                  hiddenOptions.includes(i)
                    ? 'opacity-0 pointer-events-none'
                    : 'bg-blue-50 border-blue-200 text-blue-950 hover:bg-blue-600 hover:text-white'
                }`}
              >
                <span className="font-black text-amber-500 mr-2">{['A', 'B', 'C', 'D'][i]}.</span> {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center p-8 bg-blue-50 rounded-2xl border border-blue-200 space-y-4">
          <h3 className="text-2xl font-black text-blue-900">
            {level >= 4 ? '🎉 XUẤT SẮC! BẠN LÀ TRIỆU PHÚ TRI THỨC NHÍ!' : 'Bạn đã dừng bước ở câu này rồi!'}
          </h3>
          <p className="text-sm text-slate-600">Thành tích đạt được: Vượt qua {level} câu hỏi thử thách!</p>
          <button
            onClick={() => { setLevel(0); setGameOver(false); setUsed5050(false); setUsedAIHint(false); setHiddenOptions([]); setAiMessage(null); }}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700"
          >
            Thử thách lại từ đầu ↺
          </button>
        </div>
      )}
    </div>
  );
}

// ==================== 3. Ô CỬA BÍ MẬT ====================
function SecretDoorsGame({ onFinish }: { onFinish: () => void }) {
  const [openedDoors, setOpenedDoors] = useState<number[]>([]);
  const [activeDoor, setActiveDoor] = useState<number | null>(null);

  const doors = [
    { id: 1, title: 'Cửa Xanh Lam', q: GAME_QUESTIONS[0] },
    { id: 2, title: 'Cửa Vàng Cam', q: GAME_QUESTIONS[1] },
    { id: 3, title: 'Cửa Xanh Lá', q: GAME_QUESTIONS[2] },
    { id: 4, title: 'Cửa Hồng Ngọc', q: GAME_QUESTIONS[3] },
  ];

  const handleDoorAnswer = (doorId: number, optionIdx: number) => {
    const door = doors.find((d) => d.id === doorId);
    if (door && optionIdx === door.q.correct) {
      sounds.playCorrect();
      setOpenedDoors([...openedDoors, doorId]);
      setActiveDoor(null);
      if (openedDoors.length + 1 === 4) {
        confetti({ particleCount: 70, spread: 70 });
        onFinish();
      }
    } else {
      sounds.playTryAgain();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-center">
      <h3 className="text-xl font-black text-slate-800">🚪 Mở 4 ô cửa để khám phá thông điệp lớp 3D</h3>
      <div className="grid grid-cols-2 gap-4">
        {doors.map((door) => {
          const isOpen = openedDoors.includes(door.id);
          return (
            <div
              key={door.id}
              onClick={() => { if (!isOpen) { setActiveDoor(door.id); sounds.playPop(); } }}
              className={`h-40 rounded-3xl border-4 flex flex-col items-center justify-center p-4 cursor-pointer transition ${
                isOpen
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                  : 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300 text-white shadow-lg hover:scale-105'
              }`}
            >
              <span className="text-4xl mb-2">{isOpen ? '🌟' : '🔒'}</span>
              <span className="font-black text-base">{door.title}</span>
              <span className="text-xs font-semibold">{isOpen ? 'ĐÃ MỞ KHÓA!' : 'Nhấp để giải đố'}</span>
            </div>
          );
        })}
      </div>

      {openedDoors.length === 4 && (
        <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl text-white font-black text-lg shadow-lg">
          🌈 CHÚC MỪNG EM! THÔNG ĐIỆP BÍ MẬT: "CHĂM CHỈ HỌC TẬP - TỰ TIN SÁNG TẠO CÙNG AI!"
        </div>
      )}

      {activeDoor !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl text-left space-y-4">
            <h4 className="font-black text-slate-800 text-base">
              Thử thách ô cửa {activeDoor}: {doors.find((d) => d.id === activeDoor)?.q.q}
            </h4>
            <div className="space-y-2">
              {doors.find((d) => d.id === activeDoor)?.q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleDoorAnswer(activeDoor, i)}
                  className="w-full p-3 rounded-xl border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 text-left font-bold text-sm text-slate-700"
                >
                  {opt}
                </button>
              ))}
            </div>
            <button onClick={() => setActiveDoor(null)} className="w-full text-center text-xs font-bold text-slate-400">
              Đóng lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== 4. HÁI HOA DÂN CHỦ ====================
function FlowerPickingGame({ onFinish }: { onFinish: () => void }) {
  const [picked, setPicked] = useState<number[]>([]);
  const [currentFlower, setCurrentFlower] = useState<number | null>(null);

  const flowers = [
    { id: 1, color: 'text-rose-500', name: 'Hoa Hồng' },
    { id: 2, color: 'text-amber-500', name: 'Hoa Cúc' },
    { id: 3, color: 'text-sky-500', name: 'Hoa Cẩm Tú' },
    { id: 4, color: 'text-purple-500', name: 'Hoa Thược Dược' },
    { id: 5, color: 'text-emerald-500', name: 'Hoa Sen' },
  ];

  const handlePick = (id: number) => {
    if (picked.includes(id)) return;
    sounds.playPop();
    setCurrentFlower(id);
  };

  const answerFlower = (isCorrect: boolean) => {
    if (isCorrect) {
      sounds.playCorrect();
      setPicked([...picked, currentFlower!]);
      setCurrentFlower(null);
      if (picked.length + 1 >= flowers.length) {
        confetti({ particleCount: 70 });
        onFinish();
      }
    } else {
      sounds.playTryAgain();
    }
  };

  return (
    <div className="max-w-xl mx-auto text-center space-y-6">
      <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200">
        <h3 className="font-black text-rose-800 text-lg">🌸 Vườn hoa dân chủ lớp 3D</h3>
        <p className="text-xs text-rose-600">Đã hái được {picked.length}/{flowers.length} bông hoa ngát hương</p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 py-6">
        {flowers.map((fl) => {
          const isDone = picked.includes(fl.id);
          return (
            <button
              key={fl.id}
              onClick={() => handlePick(fl.id)}
              disabled={isDone}
              className={`p-4 rounded-3xl bg-white border-2 shadow-md transition ${
                isDone ? 'opacity-30 border-slate-200' : 'hover:scale-110 border-rose-200 hover:shadow-lg'
              }`}
            >
              <div className={`text-5xl ${fl.color}`}>{isDone ? '✨' : '🌺'}</div>
              <span className="block font-bold text-xs mt-2 text-slate-700">{fl.name}</span>
            </button>
          );
        })}
      </div>

      {currentFlower !== null && (
        <div className="p-4 bg-white rounded-2xl border border-rose-200 shadow-lg text-left space-y-3">
          <p className="font-bold text-slate-800">
            Câu hỏi bông hoa số {currentFlower}: {GAME_QUESTIONS[(currentFlower - 1) % GAME_QUESTIONS.length].q}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {GAME_QUESTIONS[(currentFlower - 1) % GAME_QUESTIONS.length].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => answerFlower(i === GAME_QUESTIONS[(currentFlower - 1) % GAME_QUESTIONS.length].correct)}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-rose-50 font-bold text-xs text-slate-700"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== 5. ĐƯỜNG LÊN ĐỈNH TRI THỨC ====================
function MountainClimberGame({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0);
  const totalSteps = 5;

  const handleStep = (idx: number) => {
    const q = GAME_QUESTIONS[step];
    if (idx === q.correct) {
      sounds.playCorrect();
      if (step + 1 >= totalSteps) {
        confetti({ particleCount: 100 });
        setStep(totalSteps);
        onFinish();
      } else {
        setStep(step + 1);
      }
    } else {
      sounds.playTryAgain();
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-sky-50 p-4 rounded-2xl border border-sky-200 text-center">
        <h3 className="font-black text-sky-900 text-lg">⛰️ Đường lên đỉnh tri thức</h3>
        <p className="text-xs text-sky-600">Độ cao: {step * 200}m / 1000m đỉnh núi</p>
      </div>

      <div className="relative h-20 bg-slate-100 rounded-full p-2 flex items-center justify-between border-2 border-sky-200">
        {[0, 1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition ${
              step >= s ? 'bg-sky-500 text-white shadow' : 'bg-white text-slate-400'
            }`}
          >
            {s === 5 ? '🚩' : `${s * 200}m`}
          </div>
        ))}
      </div>

      {step < totalSteps ? (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h4 className="font-bold text-slate-800">Trạm leo núi số {step + 1}: {GAME_QUESTIONS[step].q}</h4>
          <div className="grid grid-cols-2 gap-2">
            {GAME_QUESTIONS[step].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleStep(i)}
                className="p-3 rounded-xl border border-slate-200 hover:bg-sky-50 text-left font-bold text-xs"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
          <p className="font-black text-emerald-800 text-xl">🎉 CHÚC MỪNG EM ĐÃ CHINH PHỤC ĐỈNH NÚI TRI THỨC!</p>
          <button onClick={() => setStep(0)} className="mt-3 px-5 py-2 bg-emerald-500 text-white rounded-full font-bold text-xs">
            Leo lại từ đầu ↺
          </button>
        </div>
      )}
    </div>
  );
}

// ==================== 6. GHÉP ĐÔI THÔNG MINH ====================
function MemoryMatchGame({ onFinish }: { onFinish: () => void }) {
  const cardsData = [
    { id: 1, text: '7 x 3', matchId: 'm1' },
    { id: 2, text: '21', matchId: 'm1' },
    { id: 3, text: 'Rễ cây', matchId: 'm2' },
    { id: 4, text: 'Hút nước', matchId: 'm2' },
    { id: 5, text: '7 x 5', matchId: 'm3' },
    { id: 6, text: '35', matchId: 'm3' },
  ];

  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);

  const handleCardClick = (id: number) => {
    if (flipped.length === 2 || flipped.includes(id)) return;
    sounds.playPop();
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const c1 = cardsData.find((c) => c.id === newFlipped[0]);
      const c2 = cardsData.find((c) => c.id === newFlipped[1]);
      if (c1 && c2 && c1.matchId === c2.matchId) {
        sounds.playCorrect();
        setMatched([...matched, c1.matchId]);
        setFlipped([]);
        if (matched.length + 1 >= 3) {
          confetti({ particleCount: 70 });
          onFinish();
        }
      } else {
        setTimeout(() => {
          sounds.playTryAgain();
          setFlipped([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto text-center space-y-4">
      <h3 className="font-black text-purple-900 text-lg">🃏 Ghép cặp thuật ngữ tương ứng</h3>
      <div className="grid grid-cols-3 gap-3">
        {cardsData.map((c) => {
          const isFlipped = flipped.includes(c.id) || matched.includes(c.matchId);
          return (
            <button
              key={c.id}
              onClick={() => handleCardClick(c.id)}
              className={`h-24 rounded-2xl font-black text-sm border-2 transition ${
                isFlipped
                  ? 'bg-purple-100 border-purple-400 text-purple-900'
                  : 'bg-gradient-to-br from-purple-500 to-indigo-600 border-purple-300 text-white shadow-md'
              }`}
            >
              {isFlipped ? c.text : '❓'}
            </button>
          );
        })}
      </div>
      {matched.length === 3 && (
        <div className="p-3 bg-purple-50 text-purple-800 font-bold rounded-xl text-sm">
          🎉 Bạn có trí nhớ và tư duy ghép nối xuất sắc!
        </div>
      )}
    </div>
  );
}

// ==================== 7. GIẢI CỨU ROBOT AI ====================
function SaveRobotGame({ onFinish }: { onFinish: () => void }) {
  const [battery, setBattery] = useState(20);
  const [qIndex, setQIndex] = useState(0);

  const answer = (isCorrect: boolean) => {
    if (isCorrect) {
      sounds.playCorrect();
      const newBat = Math.min(100, battery + 25);
      setBattery(newBat);
      if (newBat >= 100) {
        confetti({ particleCount: 80 });
        onFinish();
      } else {
        setQIndex((qIndex + 1) % GAME_QUESTIONS.length);
      }
    } else {
      sounds.playTryAgain();
    }
  };

  const q = GAME_QUESTIONS[qIndex];

  return (
    <div className="max-w-md mx-auto text-center space-y-5">
      <div className="text-6xl animate-bounce">🤖</div>
      <h3 className="font-black text-slate-800 text-lg">Nạp pin cứu bạn Robot Sparky!</h3>

      {/* Battery indicator */}
      <div className="w-full bg-slate-100 rounded-full h-7 p-1 border-2 border-amber-300 relative">
        <div
          style={{ width: `${battery}%` }}
          className="bg-gradient-to-r from-amber-400 to-emerald-500 h-full rounded-full transition-all duration-500"
        />
        <span className="absolute inset-0 flex items-center justify-center font-black text-xs text-slate-800">
          Năng lượng: {battery}%
        </span>
      </div>

      {battery < 100 ? (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 text-left space-y-3">
          <p className="font-bold text-slate-800 text-sm">{q.q}</p>
          <div className="space-y-2">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => answer(i === q.correct)}
                className="w-full p-2.5 rounded-xl border border-slate-200 hover:bg-amber-50 font-bold text-xs text-slate-700 text-left"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50 text-emerald-800 font-bold rounded-2xl">
          🌟 Robot Sparky đã được sạc đầy 100%! Cảm ơn bạn nhỏ rất nhiều!
        </div>
      )}
    </div>
  );
}

// ==================== 8. SĂN TÌM KHO BÁU ====================
function TreasureHuntGame({ onFinish }: { onFinish: () => void }) {
  const [chestFound, setChestFound] = useState(false);

  const chooseChest = (isRight: boolean) => {
    if (isRight) {
      sounds.playCorrect();
      setChestFound(true);
      confetti({ particleCount: 70 });
      onFinish();
    } else {
      sounds.playTryAgain();
    }
  };

  return (
    <div className="max-w-md mx-auto text-center space-y-5">
      <h3 className="font-black text-emerald-900 text-lg">🗺️ Săn tìm rương vàng tri thức</h3>
      <p className="text-xs text-slate-500">
        Câu đố chỉ đường: "Trong bảng nhân 7, tích nào lớn nhất trong các số sau: 28, 35, 49, 42?"
      </p>
      <div className="grid grid-cols-2 gap-4">
        {[28, 35, 49, 42].map((num) => (
          <button
            key={num}
            onClick={() => chooseChest(num === 49)}
            className="p-5 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-white font-black text-xl shadow-md hover:scale-105"
          >
            📦 Rương {num}
          </button>
        ))}
      </div>
      {chestFound && (
        <div className="p-4 bg-emerald-100 text-emerald-800 font-black rounded-2xl">
          👑 BẠN ĐÃ MỞ ĐƯỢC RƯƠNG KHO BÁU CHỨA 100 VIÊN NGỌC TRI THỨC!
        </div>
      )}
    </div>
  );
}

// ==================== 9. VƯỢT CHƯỚNG NGẠI VẬT ====================
function HurdleRaceGame({ onFinish }: { onFinish: () => void }) {
  const [hurdlesCleared, setHurdlesCleared] = useState(0);

  const jump = (correct: boolean) => {
    if (correct) {
      sounds.playCorrect();
      setHurdlesCleared(hurdlesCleared + 1);
      if (hurdlesCleared + 1 >= 3) {
        confetti({ particleCount: 80 });
        onFinish();
      }
    } else {
      sounds.playTryAgain();
    }
  };

  return (
    <div className="max-w-md mx-auto text-center space-y-5">
      <h3 className="font-black text-orange-900 text-lg">🏃 Vượt chướng ngại vật đường đua</h3>
      <div className="text-4xl">🏃‍♂️ 🚧 🚧 🚧 🏁</div>
      <p className="text-xs text-slate-500">Đã vượt qua: {hurdlesCleared}/3 chướng ngại vật</p>

      {hurdlesCleared < 3 ? (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 text-left space-y-3">
          <p className="font-bold text-sm text-slate-800">
            Chướng ngại vật {hurdlesCleared + 1}: {GAME_QUESTIONS[hurdlesCleared + 2].q}
          </p>
          <div className="space-y-2">
            {GAME_QUESTIONS[hurdlesCleared + 2].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => jump(i === GAME_QUESTIONS[hurdlesCleared + 2].correct)}
                className="w-full p-2.5 rounded-xl border border-slate-200 hover:bg-orange-50 font-bold text-xs text-left"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50 text-emerald-800 font-black rounded-2xl">
          🏁 VỀ ĐÍCH AN TOÀN! XUẤT SẮC ĐẠT HUY CHƯƠNG VÀNG!
        </div>
      )}
    </div>
  );
}

// ==================== 10. CUỘC ĐUA KIẾN THỨC ====================
function KnowledgeRaceGame({ onFinish }: { onFinish: () => void }) {
  const [carPosition, setCarPosition] = useState(10);

  const boost = (isCorrect: boolean) => {
    if (isCorrect) {
      sounds.playCorrect();
      const newPos = carPosition + 30;
      setCarPosition(newPos);
      if (newPos >= 100) {
        confetti({ particleCount: 90 });
        onFinish();
      }
    } else {
      sounds.playTryAgain();
    }
  };

  return (
    <div className="max-w-md mx-auto text-center space-y-5">
      <h3 className="font-black text-fuchsia-900 text-lg">🏎️ Cuộc đua khinh khí cầu & siêu xe</h3>
      <div className="w-full bg-slate-100 rounded-2xl h-14 relative flex items-center p-2 border-2 border-fuchsia-200 overflow-hidden">
        <div
          style={{ left: `${Math.min(85, carPosition)}%` }}
          className="absolute text-3xl transition-all duration-500"
        >
          🏎️💨
        </div>
        <div className="absolute right-3 text-2xl">🏁</div>
      </div>

      {carPosition < 100 ? (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 text-left space-y-3">
          <p className="font-bold text-sm text-slate-800">
            Tăng tốc: {GAME_QUESTIONS[4].q}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {GAME_QUESTIONS[4].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => boost(i === GAME_QUESTIONS[4].correct)}
                className="p-3 rounded-xl border border-slate-200 hover:bg-fuchsia-50 font-bold text-xs"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50 text-emerald-800 font-black rounded-2xl">
          🏆 CHIẾN THẮNG CHẶNG ĐUA! BẠN NHỎ LỚP 3D QUÁ ĐỈNH!
        </div>
      )}
    </div>
  );
}
