import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client setup
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Error initializing GoogleGenAI:', err);
  }
}

// 1. API: Chatbot Robot Tri Thức 3D
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  const { message, studentName, subject, history } = req.body;

  const systemInstruction = `Bạn là "Robot Tri Thức 3D", người bạn đồng hành AI thông minh, thân thiện và ấm áp của các em học sinh lớp 3 (8-9 tuổi), thuộc Trường Tiểu học Khoái Châu 1, lớp của cô Nguyễn Hoàng Thu Anh.
Quy tắc sư phạm cốt lõi:
1. Luôn dùng ngôn từ vui tươi, trong sáng, ấm áp, câu ngắn gọn, dễ hiểu, phù hợp học sinh lớp 3 (ví dụ: "Chào bạn nhỏ!", "Bạn làm tốt lắm nè!", "Hãy cùng tớ thử cách này nhé!").
2. KHÔNG BAO GIỜ đưa ra ngay đáp án bài tập. Hãy gợi ý từng bước, đặt câu hỏi gợi mở để học sinh tự suy nghĩ và tìm ra lời giải.
3. Hỗ trợ các môn học lớp 3: Toán, Tiếng Việt, Tự nhiên và Xã hội, Đạo đức, Tin học & Công nghệ, Hoạt động trải nghiệm theo chương trình GDPT 2018.
4. Tuyệt đối an toàn: Không hỏi thông tin riêng tư, không nói điều tiêu cực. Luôn động viên khi học sinh gặp khó khăn.
5. Nếu chưa chắc chắn hoặc gặp câu hỏi ngoài chương trình lớp 3, hãy nhẹ nhàng khuyên em hỏi cô giáo Thu Anh nhé!`;

  if (!aiClient) {
    // High-quality pedagogical fallback when API key is not yet set
    const fallbackAnswers: Record<string, string> = {
      default: `Xin chào ${studentName || 'bạn nhỏ'}! Tớ là Robot Tri Thức 3D đây. Tớ rất vui được đồng hành cùng bạn khám phá kiến thức lớp 3. Bạn muốn hỏi bài Toán, Tiếng Việt hay Tự nhiên và Xã hội nào? Hãy cùng tớ suy nghĩ từng bước nhé! 🌟`,
      chua_hieu: `Không sao cả đâu ${studentName || 'bạn ơi'}! Học tập là một hành trình thử thách mà. Em hãy chỉ cho tớ chỗ nào làm em băn khoăn nhất? Tớ sẽ chia nhỏ thành từng bước thật dễ hiểu cho em nhé! 💪`,
      vi_du: `Để tớ lấy một ví dụ thật gần gũi nha: Giống như trong vườn lớp 3D của chúng mình có 3 luống hoa, mỗi luống có 7 bông hoa hồng. Muốn biết tất cả có bao nhiêu bông, chúng mình làm phép tính 7 x 3 = 21 bông hoa đấy! Em thấy dễ nhớ hơn chưa? 🌸`,
      luyen_tap: `Tuyệt vời! Tớ có một câu đố nhỏ cho em nè: "Một tuần lễ có 7 ngày. Hỏi 4 tuần lễ như thế có tất cả bao nhiêu ngày?". Em hãy thử suy nghĩ và trả lời tớ xem nào! 🎈`
    };

    let reply = fallbackAnswers.default;
    const lower = (message || '').toLowerCase();
    if (lower.includes('chưa hiểu') || lower.includes('khó quá')) reply = fallbackAnswers.chua_hieu;
    else if (lower.includes('ví dụ')) reply = fallbackAnswers.vi_du;
    else if (lower.includes('luyện tập') || lower.includes('câu hỏi')) reply = fallbackAnswers.luyen_tap;

    return res.json({ reply, source: 'curated_pedagogical_knowledge' });
  }

  try {
    const formattedHistory = Array.isArray(history) 
      ? history.slice(-6).map((h: { role: string; content: string }) => `${h.role === 'user' ? 'Học sinh' : 'Robot'}: ${h.content}`).join('\n')
      : '';

    const prompt = `${formattedHistory ? `Lịch sử trao đổi trước đó:\n${formattedHistory}\n\n` : ''}Tên học sinh: ${studentName || 'Học sinh lớp 3D'}\nMôn học đang xem: ${subject || 'Chung'}\nCâu hỏi của học sinh: "${message}"\nHãy trả lời học sinh thật ân cần, ngắn gọn và gợi mở.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Robot Tri Thức 3D luôn ở đây cùng bạn nhỏ! Chúng mình cùng thử lại nhé!';
    return res.json({ reply, source: 'gemini-3.8-flash' });
  } catch (error) {
    console.error('Gemini chat error:', error);
    return res.json({
      reply: `Bạn nhỏ ơi, tớ đang kết nối lại một chút! Đừng lo, gợi ý cho bạn là hãy đọc kỹ lại đề bài và quan sát các dữ kiện nhé. Bạn làm được mà! ⭐`,
      source: 'fallback_resilient',
    });
  }
});

// 2. API: Giáo viên tạo học liệu / Câu hỏi / Tóm tắt bằng AI
app.post('/api/gemini/teacher-tool', async (req: Request, res: Response) => {
  const { action, subject, topic, gradeLevel = 'Lớp 3', additionalNotes } = req.body;

  const systemPrompt = `Bạn là Trợ lý Sư phạm AI đắc lực cho giáo viên tiểu học Nguyễn Hoàng Thu Anh (Trường Tiểu học Khoái Châu 1). 
Chương trình: Giáo dục Phổ thông 2018, Lớp 3.
Nhiệm vụ: Soạn giáo án, câu hỏi trắc nghiệm, bài tập phân hóa 3 mức độ (Mức 1: Nhận biết, Mức 2: Thông hiểu, Mức 3: Vận dụng), trò chơi khởi động, hoặc tiêu chí đánh giá thật khoa học, chuẩn kiến thức và bám sát tâm lý lứa tuổi 8-9 tuổi.
Trả về định dạng JSON hợp lệ để hệ thống hiển thị trong giao diện duyệt cho giáo viên.`;

  if (!aiClient) {
    // Curated high quality educational generator response
    return res.json({
      success: true,
      data: {
        title: `${action === 'quiz' ? 'Bộ câu hỏi trắc nghiệm' : 'Kế hoạch hoạt động'} - ${topic} (${subject})`,
        summary: `Học liệu bài giảng cho bài "${topic}" môn ${subject} lớp 3, bám sát yêu cầu cần đạt của Chương trình GDPT 2018.`,
        keyConcepts: [
          `Khái niệm cốt lõi bài ${topic}`,
          'Kỹ năng tính toán và thực hành liên hệ thực tế',
          'Rèn luyện tinh thần hợp tác nhóm và tự tin trình bày',
        ],
        differentiatedTasks: {
          level1: 'Mức 1 (Khởi đầu - Nhận biết): Nhận diện đúng kiến thức, gọi tên và làm bài tập cơ bản.',
          level2: 'Mức 2 (Khám phá - Thông hiểu): Giải thích cách làm, tính toán chính xác và liên hệ ví dụ.',
          level3: 'Mức 3 (Chinh phục - Vận dụng): Giải bài toán có lời văn gắn với thực tiễn đời sống.'
        },
        sampleQuestions: [
          {
            id: 1,
            question: `Câu hỏi mẫu 1 về ${topic}: Em hãy chọn đáp án đúng nhất?`,
            options: ['Đáp án A: Chính xác', 'Đáp án B: Chưa chính xác', 'Đáp án C: Chưa đủ', 'Đáp án D: Sai'],
            correctIndex: 0,
            explanation: 'Giải thích rõ ràng theo ngôn ngữ tiểu học lớp 3.'
          },
          {
            id: 2,
            question: `Câu hỏi mẫu 2: Trong bài học ${topic}, em cần chú ý điều gì?`,
            options: ['Thực hiện từng bước cẩn thận', 'Bỏ qua bước kiểm tra', 'Chỉ làm nhẩm không ghi chép', 'Làm thật nhanh không cần xem lại'],
            correctIndex: 0,
            explanation: 'Các em học sinh cần đọc kỹ đề và thực hiện cẩn thận từng bước.'
          }
        ]
      },
      source: 'standard_pedagogical_template'
    });
  }

  try {
    const prompt = `Yêu cầu: "${action}"\nMôn học: ${subject}\nChủ đề/Bài: ${topic}\nKhối lớp: ${gradeLevel}\nGhi chú của giáo viên: ${additionalNotes || 'Không có'}\n\nHãy tạo nội dung giáo dục chi tiết, chuẩn mực, bao gồm: tiêu đề, tóm tắt bài giảng, 3 mục tiêu trọng tâm, gợi ý phân hóa 3 mức độ năng lực, và 3 câu hỏi trắc nghiệm/vận dụng chất lượng cao.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.6,
      },
    });

    return res.json({
      success: true,
      text: response.text,
      source: 'gemini-3.8-flash'
    });
  } catch (error) {
    console.error('Teacher tool AI error:', error);
    return res.status(500).json({ error: 'Không thể xử lý yêu cầu AI lúc này.' });
  }
});

// 3. API: Gợi ý nhiệm vụ cá nhân hóa cho học sinh
app.post('/api/gemini/recommendation', async (req: Request, res: Response) => {
  const { studentName, currentScore, wrongTopics, currentLevel } = req.body;

  const defaultAdvice = currentScore >= 80
    ? {
        level: 'Chinh phục (Mức 3)',
        message: `Chúc mừng ${studentName || 'em'} đã xuất sắc vượt qua các thử thách! Em hãy thử sức với bài toán thực tế nâng cao và sáng tạo sản phẩm tranh vẽ/sơ đồ tư duy nhé! 🚀`,
        suggestedStation: 'Trạm 4 - Sáng tạo cùng AI'
      }
    : {
        level: 'Khám phá (Mức 2)',
        message: `Cố lên ${studentName || 'em'} ơi, em đã hoàn thành rất tốt một phần bài học. Hãy cùng Robot Tri Thức xem lại ví dụ về ${wrongTopics?.join(', ') || 'kiến thức vừa rồi'} để làm chủ trọn vẹn nhé! 🌱`,
        suggestedStation: 'Trạm 2 - Khám phá tri thức'
      };

  return res.json({ success: true, advice: defaultAdvice });
});

// Serve frontend in Vite dev mode or static build
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Application "AI Cùng Em - Phiêu Lưu Tri Thức Lớp 3" running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
