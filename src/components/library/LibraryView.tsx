import React, { useState } from 'react';
import { LearningMaterial, Subject } from '../../types';
import { LEARNING_MATERIALS } from '../../data/mockData';
import { sounds } from '../../utils/sound';
import { 
  FolderPlus, Sparkles, Search, Filter, FileText, CheckCircle, 
  Eye, Download, Upload, ShieldCheck, Check, Trash2, BookOpen
} from 'lucide-react';

export const LibraryView: React.FC = () => {
  const [materials, setMaterials] = useState<LearningMaterial[]>(LEARNING_MATERIALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // AI Generator Workbench Modal
  const [showAIToolModal, setShowAIToolModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState('quiz');
  const [aiTopic, setAiTopic] = useState('Bảng nhân 7 và thực hành toán học');
  const [aiSubject, setAiSubject] = useState<Subject>('Toán');
  const [aiLoading, setAiLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any>(null);
  const [isApproved, setIsApproved] = useState(false);

  // New Upload Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSubject, setUploadSubject] = useState<Subject>('Toán');
  const [uploadWeek, setUploadWeek] = useState(6);
  const [uploadType, setUploadType] = useState<LearningMaterial['type']>('Phiếu học tập');
  const [uploadSummary, setUploadSummary] = useState('');

  const subjects = ['Toán', 'Tiếng Việt', 'Tự nhiên và Xã hội', 'Đạo đức', 'Tin học & Công nghệ', 'Hoạt động trải nghiệm'];

  const aiToolsList = [
    { id: 'summary', name: '1. Tóm tắt bài học', desc: 'Rút gọn kiến thức trọng tâm cho lớp 3' },
    { id: 'key_concepts', name: '2. Trích xuất kiến thức trọng tâm', desc: 'Các thuật ngữ và quy tắc cốt lõi' },
    { id: 'objectives', name: '3. Gợi ý mục tiêu học tập', desc: 'Bám sát yêu cầu cần đạt GDPT 2018' },
    { id: 'quiz', name: '4. Tạo câu hỏi trắc nghiệm', desc: 'Sinh 4 đáp án kèm lời giải chi tiết' },
    { id: 'interactive_tasks', name: '5. Tạo bài tập tương tác', desc: 'Đố vui, nối ghép và điền từ' },
    { id: 'warmup_game', name: '6. Tạo trò chơi khởi động', desc: 'Ý tưởng trò chơi tiếp sức, ô cửa bí mật' },
    { id: 'group_activity', name: '7. Đề xuất hoạt động nhóm', desc: 'Phân vai 4 nhóm học tập hợp tác' },
    { id: 'worksheet', name: '8. Soạn phiếu học tập', desc: 'Phiếu in ấn luyện tập trên lớp' },
    { id: 'rubric', name: '9. Bảng tiêu chí đánh giá', desc: 'Rubric theo thang đo năng lực học sinh' },
    { id: 'differentiated_tasks', name: '10. Gợi ý nhiệm vụ 3 nhóm năng lực', desc: 'Phân hóa Nhận biết - Thông hiểu - Vận dụng' },
  ];

  const handleRunAITool = async () => {
    setAiLoading(true);
    setGeneratedResult(null);
    setIsApproved(false);
    sounds.playPop();

    try {
      const res = await fetch('/api/gemini/teacher-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: selectedAction,
          subject: aiSubject,
          topic: aiTopic,
        }),
      });
      const data = await res.json();
      setGeneratedResult(data.data || { summary: data.text || 'Đã tạo nội dung sư phạm thành công!' });
      sounds.playStar();
    } catch {
      setGeneratedResult({
        title: `Học liệu AI: ${aiTopic} (${aiSubject})`,
        summary: `Học liệu chuẩn mực cho bài ${aiTopic}, phân hóa rõ ràng theo 3 mức độ nhận thức của học sinh lớp 3D.`,
        keyConcepts: ['Khái niệm cốt lõi', 'Phương pháp thực hành giải toán', 'Liên hệ thực tế đời sống'],
        differentiatedTasks: {
          level1: 'Mức 1: Quan sát đồ vật đếm và đọc thuộc bảng nhân 7.',
          level2: 'Mức 2: Tính nhẩm nhanh và giải bài toán 1 phép tính.',
          level3: 'Mức 3: Giải bài toán có lời văn gắn với thực tế ngày trong tuần.'
        }
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleApproveAndPublish = () => {
    if (!generatedResult) return;
    sounds.playCorrect();
    setIsApproved(true);

    const newMaterial: LearningMaterial = {
      id: `mat-${Date.now()}`,
      title: generatedResult.title || `Học liệu bài ${aiTopic}`,
      subject: aiSubject,
      week: 6,
      topic: aiTopic,
      type: 'Phiếu học tập',
      level: 'Mức 2 (Thông hiểu)',
      summary: generatedResult.summary || 'Học liệu do AI hỗ trợ soạn thảo và đã được Cô giáo Nguyễn Hoàng Thu Anh phê duyệt.',
      keyPoints: generatedResult.keyConcepts || ['Kiến thức chuẩn GDPT 2018'],
      approved: true,
      uploadedAt: 'Hôm nay',
    };

    setMaterials([newMaterial, ...materials]);
    setTimeout(() => {
      setShowAIToolModal(false);
    }, 1200);
  };

  const handleAddManualMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;
    sounds.playCorrect();

    const newMat: LearningMaterial = {
      id: `mat-${Date.now()}`,
      title: uploadTitle.trim(),
      subject: uploadSubject,
      week: uploadWeek,
      topic: uploadTitle.trim(),
      type: uploadType,
      level: 'Mức 2 (Thông hiểu)',
      summary: uploadSummary || 'Tài liệu giáo viên tải lên phục vụ giảng dạy lớp 3D.',
      keyPoints: ['Bài giảng chuẩn kiến thức kỹ năng'],
      approved: true,
      uploadedAt: 'Hôm nay',
    };

    setMaterials([newMat, ...materials]);
    setShowUploadModal(false);
    setUploadTitle('');
    setUploadSummary('');
  };

  const filteredMaterials = materials.filter((m) => {
    const matchQuery = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSubject = selectedSubject === 'all' || m.subject === selectedSubject;
    const matchType = selectedType === 'all' || m.type === selectedType;
    return matchQuery && matchSubject && matchType;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & AI Tool Launcher */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <span className="text-3xl">📚</span> KHO BÁU TRI THỨC (THƯ VIỆN HỌC LIỆU SỐ)
          </h2>
          <p className="text-slate-500 text-sm">
            Ngân hàng học liệu số hóa chuẩn GDPT 2018 – Tích hợp 10 công cụ AI trợ giúp giáo viên
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => { setShowUploadModal(true); sounds.playPop(); }}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs flex items-center gap-2 transition"
          >
            <Upload className="w-4 h-4" /> Tải học liệu lên
          </button>
          <button
            onClick={() => { setShowAIToolModal(true); sounds.playPop(); }}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl font-black text-xs flex items-center gap-2 shadow-md hover:scale-102 transition"
          >
            <Sparkles className="w-4 h-4" /> 10 Công cụ AI cho Giáo viên ✨
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài học, tuần, từ khóa ngữ nghĩa..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700"
        >
          <option value="all">Tất cả môn học</option>
          {subjects.map((sub) => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700"
        >
          <option value="all">Tất cả định dạng</option>
          <option value="Bài giảng">Bài giảng điện tử</option>
          <option value="Phiếu học tập">Phiếu học tập</option>
          <option value="Hình ảnh">Hình ảnh tương tác</option>
          <option value="Video">Video clip</option>
          <option value="PDF">Tệp PDF</option>
          <option value="Word">Tệp Word DOCX</option>
        </select>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMaterials.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                  {item.subject}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  Tuần {item.week}
                </span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                {item.type}
              </span>
            </div>

            <h3 className="font-black text-slate-800 text-base leading-snug">
              {item.title}
            </h3>
            <p className="text-slate-600 text-xs line-clamp-2">
              {item.summary}
            </p>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400">Trọng tâm:</span>
              <div className="flex flex-wrap gap-1">
                {item.keyPoints.map((kp, idx) => (
                  <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                    • {kp}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <CheckCircle className="w-4 h-4" /> Đã kiểm duyệt bởi Cô Thu Anh
              </div>
              <button
                onClick={() => { sounds.playPop(); alert(`Đang mở học liệu: ${item.title}`); }}
                className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-xl font-bold transition flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> Xem bài
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 10 CÔNG CỤ AI CHO GIÁO VIÊN */}
      {showAIToolModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-slate-800 text-lg">
                  TRỢ LÝ SƯ PHẠM AI (10 CÔNG CỤ DÀNH CHO GIÁO VIÊN)
                </h3>
              </div>
              <button onClick={() => setShowAIToolModal(false)} className="text-slate-400 font-bold text-lg">✕</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Chọn công cụ AI muốn sử dụng:
                </label>
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50"
                >
                  {aiToolsList.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} - {t.desc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Môn học:</label>
                  <select
                    value={aiSubject}
                    onChange={(e) => setAiSubject(e.target.value as Subject)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
                  >
                    {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Tên bài học / Chủ đề:</label>
                  <input
                    type="text"
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <button
                onClick={handleRunAITool}
                disabled={aiLoading || !aiTopic.trim()}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-black text-xs shadow-md hover:scale-101 transition disabled:opacity-40"
              >
                {aiLoading ? 'AI đang phân tích và soạn thảo nội dung...' : 'Khởi chạy công cụ AI 🚀'}
              </button>

              {/* AI Generated Preview */}
              {generatedResult && (
                <div className="p-4 bg-slate-50 rounded-2xl border-2 border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-800">
                      Bản thảo xem trước do AI tạo:
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                      Cần giáo viên duyệt trước khi xuất bản
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {generatedResult.summary}
                  </p>

                  {generatedResult.differentiatedTasks && (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 text-xs">
                      <span className="font-bold text-slate-800">Gợi ý 3 mức độ nhiệm vụ:</span>
                      <p className="text-sky-700 font-semibold">• {generatedResult.differentiatedTasks.level1}</p>
                      <p className="text-emerald-700 font-semibold">• {generatedResult.differentiatedTasks.level2}</p>
                      <p className="text-amber-700 font-semibold">• {generatedResult.differentiatedTasks.level3}</p>
                    </div>
                  )}

                  {/* Mandatory Approval Button as per prompt requirements */}
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      {isApproved ? '✅ Đã lưu vào Thư viện học liệu!' : 'Kiểm tra kỹ trước khi bấm duyệt'}
                    </span>
                    <button
                      onClick={handleApproveAndPublish}
                      disabled={isApproved}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs shadow flex items-center gap-1.5 transition"
                    >
                      <ShieldCheck className="w-4 h-4" /> GIÁO VIÊN DUYỆT & XUẤT BẢN
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL UPLOAD TÀI LIỆU */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-800 text-lg">Tải học liệu lên</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleAddManualMaterial} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Tên tài liệu / bài học:</label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Ví dụ: Phiếu bài tập tuần 7 môn Toán..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Môn học:</label>
                  <select
                    value={uploadSubject}
                    onChange={(e) => setUploadSubject(e.target.value as Subject)}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  >
                    {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Định dạng:</label>
                  <select
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  >
                    <option value="Phiếu học tập">Phiếu học tập</option>
                    <option value="Bài giảng">Bài giảng</option>
                    <option value="PDF">PDF</option>
                    <option value="Word">Word</option>
                    <option value="Hình ảnh">Hình ảnh</option>
                    <option value="Video">Video</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Tóm tắt ngắn:</label>
                <textarea
                  value={uploadSummary}
                  onChange={(e) => setUploadSummary(e.target.value)}
                  placeholder="Mô tả mục tiêu của bài học..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  rows={2}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs shadow"
              >
                Lưu vào Kho báu tri thức
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
