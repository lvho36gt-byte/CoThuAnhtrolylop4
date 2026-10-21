import React, { useState, useRef, useEffect } from 'react';
import { sounds } from '../../utils/sound';
import { 
  Bot, Send, Sparkles, Volume2, X, RefreshCw, 
  HelpCircle, Lightbulb, MessageSquare, HeartHandshake, ShieldCheck
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  source?: string;
}

interface AIChatbotProps {
  studentName?: string;
  subject?: string;
  isOpenFloating?: boolean;
  onCloseFloating?: () => void;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({
  studentName = 'Học sinh Lớp 3D',
  subject = 'Toán và Tiếng Việt Lớp 3',
  isOpenFloating = false,
  onCloseFloating,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Xin chào ${studentName}! Tớ là Robot Tri Thức 3D đây 🤖. Tớ rất vui được cùng bạn khám phá kiến thức lớp 3. Bạn có câu hỏi nào về bài học hay muốn tớ đố vui một câu không? Hãy bấm vào các nút bên dưới hoặc gõ tin nhắn cho tớ nhé!`,
      time: 'Vừa xong',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [dailyQuota, setDailyQuota] = useState(30); // Grade-3 safety quota limit
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    { label: 'Em chưa hiểu bài này', prompt: 'Em chưa hiểu bài này, bạn hướng dẫn từng bước giúp em với!' },
    { label: 'Giải thích dễ hơn cho em', prompt: 'Bạn giải thích thật dễ hiểu bằng hình ảnh hoặc ví dụ quen thuộc được không?' },
    { label: 'Cho em một ví dụ', prompt: 'Bạn cho em một ví dụ gần gũi với đời sống học sinh lớp 3 nhé!' },
    { label: 'Hãy hỏi em một câu', prompt: 'Bạn hãy hỏi em một câu đố vui về bài học để em suy nghĩ trả lời xem nào!' },
    { label: 'Em muốn luyện tập thêm', prompt: 'Em muốn luyện tập thêm một bài toán vui lớp 3, bạn cho em đề bài nhé!' },
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || loading) return;

    if (dailyQuota <= 0) {
      sounds.playTryAgain();
      return;
    }

    sounds.playPop();
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setLoading(true);
    setDailyQuota((q) => q - 1);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          studentName,
          subject,
          history: messages.slice(-4).map((m) => ({ role: m.sender, content: m.text })),
        }),
      });

      const data = await res.json();
      sounds.playStar();

      const botReply: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'Tớ luôn ở đây cùng bạn nhỏ, hãy tiếp tục đặt câu hỏi nhé!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source,
      };

      setMessages((prev) => [...prev, botReply]);
    } catch {
      sounds.playTryAgain();
      const botFallback: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: `Bạn nhỏ ${studentName} ơi! Tớ khuyên bạn hãy đọc thật kĩ lại đề bài, chú ý các số liệu quan trọng. Nếu vẫn còn băn khoăn, bạn hãy giơ tay nhờ cô giáo Nguyễn Hoàng Thu Anh hướng dẫn thêm nhé! ⭐`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botFallback]);
    } finally {
      setLoading(false);
    }
  };

  const handleTTS = (text: string) => {
    sounds.playPop();
    sounds.speakVietnamese(text);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-sky-100 flex flex-col h-[580px] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 via-indigo-500 to-pink-500 p-4 text-white flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl border border-white/30 animate-float">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-base">ROBOT TRI THỨC 3D</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-400 text-slate-900">
                AI Lớp 3
              </span>
            </div>
            <p className="text-[11px] text-sky-100 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Chuẩn GDPT 2018 – Sư phạm an toàn
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-full">
            Còn {dailyQuota} lượt hỏi
          </span>
          {onCloseFloating && (
            <button
              onClick={() => { onCloseFloating(); sounds.playPop(); sounds.stopSpeaking(); }}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 text-white font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="bg-amber-50 px-4 py-2 border-b border-amber-200 text-[11px] text-amber-800 flex items-center justify-between">
        <span>✨ Robot không giải hộ bài tập mà chỉ gợi ý từng bước để em tự tìm ra đáp án!</span>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-sky-500 text-white rounded-tr-none shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="text-[10px] font-black opacity-75">
                  {m.sender === 'user' ? studentName : '🤖 Robot Tri Thức'}
                </span>
                {m.sender === 'bot' && (
                  <button
                    onClick={() => handleTTS(m.text)}
                    className="text-slate-400 hover:text-sky-600 transition"
                    title="Nghe giọng đọc tiếng Việt"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="whitespace-pre-line">{m.text}</p>
            </div>
            <span className="text-[9px] text-slate-400 px-1 mt-0.5">{m.time}</span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
            <span className="animate-spin text-base">⚙️</span>
            <span>Robot đang suy nghĩ câu trả lời phù hợp nhất cho em...</span>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Quick Prompts */}
      <div className="p-2.5 bg-slate-100 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {quickPrompts.map((btn, i) => (
          <button
            key={i}
            onClick={() => handleSend(btn.prompt)}
            className="whitespace-nowrap px-3 py-1.5 bg-white border border-slate-200 hover:bg-sky-50 hover:border-sky-300 rounded-full text-xs font-bold text-slate-700 shadow-sm transition"
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
          placeholder="Nhập câu hỏi của em (ví dụ: 'Giúp em hiểu phép chia 28 : 4')..."
          className="flex-1 p-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !inputVal.trim()}
          className="w-11 h-11 rounded-2xl bg-sky-500 hover:bg-sky-600 disabled:opacity-40 text-white flex items-center justify-center shadow-md transition"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
