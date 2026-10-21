import React from 'react';
import { sounds } from '../../utils/sound';
import { TEACHER_INFO } from '../../data/mockData';
import { Settings, ShieldCheck, Database, RefreshCw, X, Check, Volume2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onResetData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-600" />
            <h3 className="font-black text-slate-800 text-lg">CÀI ĐẶT & THÔNG TIN HỆ THỐNG</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 font-bold text-lg">✕</button>
        </div>

        {/* Product & Teacher Credentials */}
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-xs flex items-center gap-4">
          <img
            src="/assets/aistudio/image_8f93a0fd.png"
            alt="Cô giáo Nguyễn Hoàng Thu Anh"
            className="w-16 h-20 rounded-xl object-cover object-top border-2 border-emerald-400 shadow-sm flex-shrink-0"
          />
          <div className="space-y-1">
            <span className="font-black text-emerald-900 block text-sm">
              AI CÙNG EM – PHIÊU LƯU TRI THỨC LỚP 3
            </span>
            <div className="text-slate-700 space-y-0.5">
              <p><strong>Tác giả:</strong> Cô giáo {TEACHER_INFO.name}</p>
              <p><strong>Đơn vị:</strong> {TEACHER_INFO.school}</p>
              <p><strong>Lớp phụ trách:</strong> {TEACHER_INFO.classRoom} ({TEACHER_INFO.academicYear})</p>
              <p><strong>Khẩu hiệu:</strong> {TEACHER_INFO.slogan}</p>
            </div>
          </div>
        </div>

        {/* Demo Mode / Storage explanation */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
          <div className="flex items-center gap-2 font-black text-slate-800">
            <Database className="w-4 h-4 text-sky-600" />
            <span>Chế độ Demo Sư phạm (Bộ dữ liệu mẫu minh họa)</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Hệ thống đang hoạt động với 24 học sinh lớp 3D giả định và ngân hàng câu hỏi bám sát Chương trình GDPT 2018. Tiến trình học tập, điểm số và sao thưởng được lưu trữ cục bộ để phục vụ trình diễn trước Hội đồng Ban giám khảo.
          </p>
        </div>

        {/* Security & Pedagogical Compliance */}
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Tiêu chuẩn an toàn tiểu học:</strong> Không thu thập dữ liệu nhạy cảm của học sinh; Trợ lý AI có bộ lọc ngôn từ sư phạm, chỉ đóng vai trò gợi mở từng bước.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => {
              if (confirm('Khôi phục lại dữ liệu mẫu ban đầu cho Lớp 3D?')) {
                sounds.playPop();
                onResetData();
                onClose();
              }
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Đặt lại dữ liệu mẫu
          </button>

          <button
            onClick={() => { sounds.playPop(); onClose(); }}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs shadow"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
