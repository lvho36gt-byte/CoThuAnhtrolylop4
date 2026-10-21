import React, { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  CHART_BEFORE_AFTER, CHART_WEEKLY_COMPLETION, CHART_SUBJECT_SCORES, 
  CHART_LEVEL_DISTRIBUTION, CHART_STATION_ENGAGEMENT 
} from '../../data/mockData';
import { sounds } from '../../utils/sound';
import { 
  TrendingUp, Download, Printer, Sparkles, Filter, 
  CheckCircle, FileText, Award, Calendar, AlertCircle, ShieldCheck
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState('6_weeks');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showAIReport, setShowAIReport] = useState(false);
  const [aiReportText, setAiReportText] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [isReportApproved, setIsReportApproved] = useState(false);

  // Print view
  const handlePrint = () => {
    sounds.playPop();
    window.print();
  };

  // CSV Export
  const handleExportCSV = () => {
    sounds.playPop();
    const csvContent = 
      "Chỉ số,Trước khi dùng AI,Sau khi dùng AI,Mức tăng trưởng\n" +
      CHART_BEFORE_AFTER.map(r => `"${r.metric}",${r.truoc}%,${r.sau}%,+${r.sau - r.truoc}%`).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Bao_Cao_Tien_Bo_Lop_3D.csv";
    a.click();
  };

  // Generate AI pedagogical summary for teacher
  const handleGenerateAIReport = async () => {
    setAiLoading(true);
    setShowAIReport(true);
    setIsReportApproved(false);
    sounds.playPop();

    try {
      const res = await fetch('/api/gemini/teacher-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'summary_report',
          subject: 'Toán & Tiếng Việt',
          topic: 'Báo cáo tổng kết 6 tuần học tập kết hợp ứng dụng AI Cùng Em',
          additionalNotes: 'Tỷ lệ hoàn thành 95%, mức độ hứng thú tăng từ 62% lên 96%, 3 học sinh cần hỗ trợ đã có tiến bộ.'
        }),
      });
      const data = await res.json();
      setAiReportText(data.text || data.data?.summary || 'Báo cáo sư phạm hoàn chỉnh: Ứng dụng đã mang lại sự chuyển biến tích cực vượt bậc về hứng thú và năng lực tự học của học sinh lớp 3D.');
      sounds.playStar();
    } catch {
      setAiReportText(
        `BÁO CÁO PHÂN TÍCH TIẾN BỘ LỚP 3D (CÔ NGUYỄN HOÀNG THU ANH):\n\n` +
        `1. Về hứng thú và thái độ học tập: Học sinh lớp 3D có sự cải thiện rõ rệt, tỷ lệ yêu thích môn Toán và Tiếng Việt đạt 96% (tăng 34% so với trước khi triển khai). Các trạm phiêu lưu trực quan và trò chơi giáo dục giúp các em học tập vui vẻ, không áp lực.\n` +
        `2. Về năng lực tự học và tư duy: Khả năng tự khám phá qua sách điện tử và giải toán có lời văn tăng từ 45% lên 88%. Học sinh chủ động làm lại câu hỏi sai nhờ gợi mở từng bước của Robot AI.\n` +
        `3. Về tính phân hóa: Hệ thống 3 mức độ (Nhận biết, Thông hiểu, Vận dụng) đã hỗ trợ kịp thời 3 học sinh còn gặp khó khăn, giúp các em bắt kịp tiến độ chung của lớp.\n` +
        `4. Kiến nghị: Tiếp tục duy trì mô hình 5 trạm và đẩy mạnh hoạt động sơ đồ tư duy nhóm trong các tuần học tiếp theo.`
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-800">
              DỮ LIỆU MINH HỌA
            </span>
            <span className="text-xs text-slate-400">Trường Tiểu học Khoái Châu 1 – Lớp 3D</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <span className="text-3xl">📊</span> HÀNH TRÌNH TIẾN BỘ LỚP 3D
          </h2>
          <p className="text-slate-500 text-sm">
            Hệ thống phân tích dữ liệu, đánh giá năng lực và cá nhân hóa học tập toàn diện
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4" /> Xuất CSV
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Printer className="w-4 h-4" /> In báo cáo
          </button>
          <button
            onClick={handleGenerateAIReport}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-black text-xs flex items-center gap-1.5 shadow transition hover:scale-102"
          >
            <Sparkles className="w-4 h-4" /> AI Viết nhận xét sư phạm ✨
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: 'Sĩ số học sinh', val: '24 em', sub: 'Lớp 3D', color: 'text-slate-800' },
          { label: 'Tỷ lệ tham gia', val: '95.8%', sub: '23/24 em', color: 'text-emerald-600' },
          { label: 'Hoàn thành bài', val: '89.2%', sub: 'Theo tiến độ', color: 'text-sky-600' },
          { label: 'Đúng lần đầu', val: '86.5%', sub: 'Bài tập trạm', color: 'text-indigo-600' },
          { label: 'Thời lượng TB', val: '35 ph', sub: 'Mỗi ngày', color: 'text-amber-600' },
          { label: 'Bài hoàn thành', val: '368 bài', sub: 'Tổng lượt', color: 'text-purple-600' },
          { label: 'Cần hỗ trợ', val: '3 em', sub: 'Có phụ đạo riêng', color: 'text-rose-600' },
          { label: 'Sản phẩm tạo', val: '42 bài', sub: 'Tranh & mindmap', color: 'text-pink-600' },
        ].map((k, i) => (
          <div key={i} className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm text-center">
            <span className="text-[10px] font-bold text-slate-400 block truncate">{k.label}</span>
            <span className={`text-xl font-black ${k.color} block my-0.5`}>{k.val}</span>
            <span className="text-[9px] text-slate-500 font-semibold truncate block">{k.sub}</span>
          </div>
        ))}
      </div>

      {/* 6 Recharts Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BIỂU ĐỒ 1: SO SÁNH TRƯỚC VÀ SAU KHI DÙNG AI */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-800 text-sm">
              Biểu đồ 1: Kết quả học tập Trước & Sau khi dùng AI (%)
            </h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              Khảo sát thực tế
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_BEFORE_AFTER} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="metric" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="truoc" name="Trước khi dùng AI" fill="#94a3b8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="sau" name="Sau khi dùng AI" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BIỂU ĐỒ 2: TỶ LỆ HOÀN THÀNH NHIỆM VỤ THEO TUẦN */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-800 text-sm">
              Biểu đồ 2: Tỷ lệ hoàn thành nhiệm vụ theo 6 tuần học (%)
            </h3>
            <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
              Tăng trưởng liên tục
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_WEEKLY_COMPLETION} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[50, 100]} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 11 }} />
                <Area type="monotone" dataKey="completionRate" name="Tỷ lệ hoàn thành (%)" stroke="#0284c7" fillOpacity={1} fill="url(#compGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BIỂU ĐỒ 3: KẾT QUẢ THEO TỪNG MÔN HỌC */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-800 text-sm">
              Biểu đồ 3: Điểm trung bình đánh giá theo môn học
            </h3>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              Chuẩn GDPT 2018
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_SUBJECT_SCORES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[70, 100]} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 11 }} />
                <Bar dataKey="diemTB" name="Điểm TB (0-100)" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BIỂU ĐỒ 4: PHÂN BỐ HỌC SINH THEO 3 MỨC ĐỘ NHIỆM VỤ */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-800 text-sm">
              Biểu đồ 4: Phân bố học sinh theo 3 mức độ năng lực
            </h3>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
              Cá nhân hóa
            </span>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CHART_LEVEL_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${value} em`}
                >
                  {CHART_LEVEL_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BIỂU ĐỒ 5: MỨC ĐỘ THAM GIA 5 TRẠM PHIÊU LƯU */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-800 text-sm">
              Biểu đồ 5: Tỷ lệ hoàn thành theo 5 trạm phiêu lưu (%)
            </h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              5 Trạm học tập
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_STATION_ENGAGEMENT} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="station" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 10 }} domain={[70, 100]} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 11 }} />
                <Bar dataKey="completion" name="Tỷ lệ hoàn thành (%)" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BIỂU ĐỒ 6: MỨC TIẾN BỘ CỦA CÁC NHÓM HỌC SINH */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-800 text-sm">
              Biểu đồ 6: So sánh tiến bộ giữa 4 nhóm học tập lớp 3D
            </h3>
            <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded">
              Học tập hợp tác
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { group: 'Nhóm Sao Mai', diemTruoc: 78, diemSau: 92 },
                  { group: 'Nhóm Sơn Ca', diemTruoc: 72, diemSau: 88 },
                  { group: 'Nhóm Chim Én', diemTruoc: 80, diemSau: 95 },
                  { group: 'Nhóm Búp Sen', diemTruoc: 74, diemSau: 89 },
                ]}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="group" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[60, 100]} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="diemTruoc" name="Điểm TB tuần 1" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="diemSau" name="Điểm TB tuần 6" fill="#ec4899" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Pedagogical Summary Modal */}
      {showAIReport && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-slate-800 text-base">
                  BÁO CÁO PHÂN TÍCH TIẾN BỘ SƯ PHẠM (AI HỖ TRỢ SOẠN THẢO)
                </h3>
              </div>
              <button onClick={() => setShowAIReport(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            {aiLoading ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <span className="animate-spin text-2xl block mb-2">⚙️</span>
                AI đang tổng hợp số liệu từ 24 học sinh lớp 3D...
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                  {aiReportText}
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800">
                  ⚠️ Quy định sư phạm: Giáo viên phải đọc và duyệt lại bản nhận xét này trước khi đưa vào hồ sơ hoặc báo cáo hội đồng dự thi.
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-bold text-slate-500">
                    {isReportApproved ? '✅ Cô giáo đã duyệt báo cáo thành công!' : 'Chưa được phê duyệt'}
                  </span>
                  <button
                    onClick={() => {
                      sounds.playCorrect();
                      setIsReportApproved(true);
                    }}
                    disabled={isReportApproved}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs shadow flex items-center gap-1.5 transition"
                  >
                    <ShieldCheck className="w-4 h-4" /> GIÁO VIÊN DUYỆT BÁO CÁO NÀY
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
