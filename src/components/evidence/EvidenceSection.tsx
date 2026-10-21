import React, { useState } from 'react';
import { COMPETITION_EVIDENCE } from '../../data/mockData';
import { sounds } from '../../utils/sound';
import { 
  Award, ShieldCheck, CheckCircle, FileCheck, Image as ImageIcon, 
  Upload, Eye, Lock, FileSpreadsheet, Plus, Calendar
} from 'lucide-react';

interface EvidenceItem {
  id: string;
  category: 'A' | 'B' | 'C' | 'D';
  title: string;
  date: string;
  desc: string;
  stat?: string;
  imageUrl?: string;
}

export const EvidenceSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [maskStudentNames, setMaskStudentNames] = useState(false);
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([
    {
      id: 'ev-1',
      category: 'D',
      title: 'Tiết học trải nghiệm thực hành bảng nhân 7 kết hợp Trợ lý AI',
      date: '15/10/2026',
      desc: 'Học sinh lớp 3D hào hứng tham gia trạm Khởi động và Khám phá qua màn hình tương tác.',
      imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'ev-2',
      category: 'D',
      title: 'Hoạt động nhóm 4 bạn vẽ sơ đồ tư duy các bộ phận cây xanh',
      date: '18/10/2026',
      desc: 'Các nhóm phối hợp phân công vai trò trưởng nhóm, thư ký và người thuyết trình.',
      imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'ev-3',
      category: 'D',
      title: 'Trưng bày sản phẩm sáng tạo và thiệp tri ân của học sinh lớp 3D',
      date: '20/10/2026',
      desc: 'Sản phẩm sau khi được cô giáo Nguyễn Hoàng Thu Anh phê duyệt được vinh danh trong bảo tàng lớp.',
      imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    }
  ]);

  const [showAddEvidence, setShowAddEvidence] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'A' | 'B' | 'C' | 'D'>('D');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    sounds.playCorrect();

    const newItem: EvidenceItem = {
      id: `ev-${Date.now()}`,
      category: newCategory,
      title: newTitle.trim(),
      date: '21/10/2026',
      desc: newDesc || 'Minh chứng thực tế hoạt động ứng dụng AI giáo dục tại lớp 3D.',
      imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
    };

    setEvidenceItems([newItem, ...evidenceItems]);
    setShowAddEvidence(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src="/assets/aistudio/image_8f93a0fd.png"
            alt="Cô giáo Nguyễn Hoàng Thu Anh"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover object-top border-2 border-emerald-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-800">
                HỒ SƠ THAM GIA CUỘC THI NĂM HỌC 2026–2027
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <span className="text-3xl">🏅</span> HỒ SƠ MINH CHỨNG – HIỆU QUẢ ỨNG DỤNG AI
            </h2>
            <p className="text-slate-600 text-sm font-semibold">
              Tác giả: <strong className="text-emerald-700">Nguyễn Hoàng Thu Anh</strong> – Trường Tiểu học Khoái Châu 1 – Lớp 3D
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-3 py-2 rounded-2xl text-xs font-bold text-slate-700">
            <input
              type="checkbox"
              checked={maskStudentNames}
              onChange={(e) => setMaskStudentNames(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded"
            />
            <Lock className="w-3.5 h-3.5 text-slate-400" /> Che tên HS (Bảo vệ riêng tư)
          </label>

          <button
            onClick={() => { setShowAddEvidence(true); sounds.playPop(); }}
            className="px-4 py-2 bg-emerald-600 text-white rounded-2xl font-black text-xs shadow flex items-center gap-1.5 hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4" /> Thêm minh chứng
          </button>
        </div>
      </div>

      {/* 4 Groups Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { id: 'A', title: 'A. Đối với Học sinh', desc: 'Hứng thú, tự học, tiến bộ', icon: '👦' },
          { id: 'B', title: 'B. Đối với Giáo viên', desc: 'Tiết kiệm thời gian, cá nhân hóa', icon: '👩‍🏫' },
          { id: 'C', title: 'C. Đối với Nhà trường', desc: 'Nhân rộng, chuyển đổi số', icon: '🏫' },
          { id: 'D', title: 'D. Hình ảnh & Sản phẩm', desc: 'Thư viện ảnh hoạt động lớp', icon: '📸' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveCategory(tab.id as any); sounds.playPop(); }}
            className={`p-4 rounded-3xl border-2 text-left transition ${
              activeCategory === tab.id
                ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                : 'bg-white border-slate-100 hover:bg-slate-50'
            }`}
          >
            <span className="text-2xl mb-1 block">{tab.icon}</span>
            <span className="font-black text-slate-800 text-sm block">{tab.title}</span>
            <span className="text-[11px] text-slate-500">{tab.desc}</span>
          </button>
        ))}
      </div>

      {/* Group A Content */}
      {activeCategory === 'A' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COMPETITION_EVIDENCE.groupA_Students.map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="font-black text-slate-800 text-base">{item.title}</span>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
              <span className="text-2xl font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-2xl whitespace-nowrap">
                {item.stat}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Group B Content */}
      {activeCategory === 'B' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COMPETITION_EVIDENCE.groupB_Teachers.map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-2">
              <span className="text-3xl font-black text-sky-600 block">{item.stat}</span>
              <h4 className="font-black text-slate-800 text-base">{item.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Group C Content */}
      {activeCategory === 'C' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COMPETITION_EVIDENCE.groupC_School.map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-2">
              <span className="text-2xl font-black text-indigo-600 block">{item.stat}</span>
              <h4 className="font-black text-slate-800 text-base">{item.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Group D Content: Pictures & Artifacts */}
      {activeCategory === 'D' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {evidenceItems.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm space-y-3">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-44 object-cover"
              />
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                  <span>{item.date}</span>
                  <span className="text-emerald-600">Minh chứng thực tế</span>
                </div>
                <h4 className="font-black text-slate-800 text-sm leading-snug">{item.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL THÊM MINH CHỨNG */}
      {showAddEvidence && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-800 text-lg">Thêm minh chứng dự thi</h3>
              <button onClick={() => setShowAddEvidence(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Tiêu đề minh chứng:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Giờ học thực hành bảng nhân 7..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Nhóm tiêu chí:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                >
                  <option value="A">Nhóm A: Học sinh</option>
                  <option value="B">Nhóm B: Giáo viên</option>
                  <option value="C">Nhóm C: Nhà trường</option>
                  <option value="D">Nhóm D: Hình ảnh hoạt động</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Mô tả chi tiết / Số liệu:</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Ghi lại kết quả quan sát..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 text-white rounded-xl font-black text-xs shadow hover:bg-emerald-700"
              >
                Lưu vào hồ sơ minh chứng
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
