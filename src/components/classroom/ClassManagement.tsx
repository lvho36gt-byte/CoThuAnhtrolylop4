import React, { useState } from 'react';
import { Student, Assignment } from '../../types';
import { INITIAL_ASSIGNMENTS } from '../../data/mockData';
import { sounds } from '../../utils/sound';
import { 
  Users, UserPlus, Search, Filter, Download, Upload, Edit, 
  Trash2, Send, CheckCircle2, AlertCircle, Clock, Star, Award, 
  Eye, FileSpreadsheet, Plus, X
} from 'lucide-react';

interface ClassManagementProps {
  students: Student[];
  onUpdateStudents: (students: Student[]) => void;
  onSelectStudentForView?: (student: Student) => void;
}

export const ClassManagement: React.FC<ClassManagementProps> = ({
  students,
  onUpdateStudents,
  onSelectStudentForView,
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'assignments' | 'portfolio'>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Selected student for e-portfolio modal
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  // Student selection for batch actions
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [showBatchDeleteModal, setShowBatchDeleteModal] = useState(false);

  // New Student modal
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGender, setNewStudentGender] = useState<'male' | 'female'>('male');
  const [newStudentGroup, setNewStudentGroup] = useState('Nhóm Sao Mai');

  // Assignments
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [asgTitle, setAsgTitle] = useState('');
  const [asgSubject, setAsgSubject] = useState<'Toán' | 'Tiếng Việt' | 'Tự nhiên và Xã hội'>('Toán');
  const [asgTarget, setAsgTarget] = useState<'all' | 'group' | 'individual'>('all');
  const [asgTargetDetail, setAsgTargetDetail] = useState('Toàn lớp 3D');
  const [asgDeadline, setAsgDeadline] = useState('28/10/2026');

  const groups = ['Nhóm Sao Mai', 'Nhóm Sơn Ca', 'Nhóm Chim Én', 'Nhóm Búp Sen'];

  const filteredStudents = students.filter((s) => {
    const matchName = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGroup = selectedGroup === 'all' || s.group === selectedGroup;
    const matchStatus = selectedStatus === 'all' || s.status === selectedStatus;
    return matchName && matchGroup && matchStatus;
  });

  const handleToggleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map((s) => s.id));
    }
  };

  const handleToggleSelectStudent = (id: string) => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter((item) => item !== id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  };

  const handleConfirmDeleteSingle = () => {
    if (!studentToDelete) return;
    sounds.playPop();
    onUpdateStudents(students.filter((s) => s.id !== studentToDelete.id));
    setSelectedStudentIds(selectedStudentIds.filter((id) => id !== studentToDelete.id));
    setStudentToDelete(null);
  };

  const handleConfirmBatchDelete = () => {
    sounds.playPop();
    onUpdateStudents(students.filter((s) => !selectedStudentIds.includes(s.id)));
    setSelectedStudentIds([]);
    setShowBatchDeleteModal(false);
  };

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    sounds.playCorrect();

    const newCode = `3D-${(students.length + 1).toString().padStart(2, '0')}`;
    const newS: Student = {
      id: `hs-${Date.now()}`,
      code: newCode,
      name: newStudentName.trim(),
      gender: newStudentGender,
      class: '3D',
      group: newStudentGroup,
      status: 'Chưa bắt đầu',
      completedTasks: 0,
      totalTasks: 20,
      score: 0,
      stars: 0,
      badges: ['Chiến binh kiên trì'],
      avatar: newStudentGender === 'male' ? '👦' : '👧',
      competencies: { reading: 70, math: 70, problemSolving: 70, collaboration: 75, presentation: 70, selfReflection: 70 },
    };

    onUpdateStudents([...students, newS]);
    setShowAddStudent(false);
    setNewStudentName('');
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('Cô có chắc chắn muốn xóa học sinh này khỏi danh sách lớp 3D?')) {
      sounds.playPop();
      onUpdateStudents(students.filter((s) => s.id !== id));
    }
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgTitle.trim()) return;
    sounds.playCorrect();

    const newAsg: Assignment = {
      id: `asg-${Date.now()}`,
      title: asgTitle.trim(),
      subject: asgSubject,
      target: asgTarget,
      targetDetail: asgTargetDetail,
      deadline: asgDeadline,
      maxAttempts: 3,
      totalSubmissions: 0,
      status: 'Đang mở',
    };

    setAssignments([newAsg, ...assignments]);
    setShowAddAssignment(false);
    setAsgTitle('');
  };

  // CSV Export
  const handleExportCSV = () => {
    sounds.playPop();
    const headers = 'Mã HS,Họ và tên,Lớp,Nhóm,Trạng thái,Số nhiệm vụ,Điểm số,Số sao\n';
    const rows = students
      .map((s) => `${s.code},"${s.name}",${s.class},"${s.group}","${s.status}",${s.completedTasks}/${s.totalTasks},${s.score},${s.stars}`)
      .join('\n');
    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Danh_Sach_Lop_3D_Kiem_Tra.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src="/assets/aistudio/image_8f93a0fd.png"
            alt="Cô giáo Nguyễn Hoàng Thu Anh"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover object-top border-2 border-emerald-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-800">
                DỮ LIỆU MINH HỌA
              </span>
              <span className="text-xs text-slate-400">Trường Tiểu học Khoái Châu 1</span>
            </div>
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <span className="text-3xl">🏫</span> QUẢN LÝ LỚP HỌC 3D (24 HỌC SINH)
            </h2>
            <p className="text-slate-500 text-sm font-semibold">
              Giáo viên chủ nhiệm: <strong className="text-emerald-700">Nguyễn Hoàng Thu Anh</strong> – Năm học 2026–2027
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4" /> Xuất Excel/CSV
          </button>
          <button
            onClick={() => { setShowAddStudent(true); sounds.playPop(); }}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs flex items-center gap-1.5 shadow transition"
          >
            <UserPlus className="w-4 h-4" /> Thêm học sinh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl max-w-md">
        <button
          onClick={() => { setActiveTab('students'); sounds.playPop(); }}
          className={`flex-1 py-2.5 rounded-xl font-black text-xs transition ${
            activeTab === 'students' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'
          }`}
        >
          👥 Danh sách học sinh ({students.length})
        </button>
        <button
          onClick={() => { setActiveTab('assignments'); sounds.playPop(); }}
          className={`flex-1 py-2.5 rounded-xl font-black text-xs transition ${
            activeTab === 'assignments' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'
          }`}
        >
          📋 Giao nhiệm vụ ({assignments.length})
        </button>
      </div>

      {activeTab === 'students' && (
        <div className="space-y-4">
          {/* Filters & Action Bar with Prominent Add/Delete buttons */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="min-w-[200px] flex-1 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm tên hoặc mã học sinh..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                />
              </div>

              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700"
              >
                <option value="all">Tất cả nhóm</option>
                {groups.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Hoàn thành tốt">Hoàn thành tốt</option>
                <option value="Đã hoàn thành">Đã hoàn thành</option>
                <option value="Đang thực hiện">Đang thực hiện</option>
                <option value="Cần hỗ trợ">Cần hỗ trợ</option>
                <option value="Chưa bắt đầu">Chưa bắt đầu</option>
              </select>
            </div>

            {/* PROMINENT ADD & DELETE BUTTONS */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setShowAddStudent(true); sounds.playPop(); }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs flex items-center gap-1.5 shadow-sm transition hover:scale-102"
              >
                <UserPlus className="w-4 h-4" /> THÊM HỌC SINH MỚI
              </button>

              <button
                onClick={() => {
                  if (selectedStudentIds.length === 0) {
                    alert('Cô giáo hãy tích chọn ít nhất 1 học sinh ở danh sách bên dưới để xóa nhé!');
                    return;
                  }
                  setShowBatchDeleteModal(true);
                  sounds.playPop();
                }}
                disabled={selectedStudentIds.length === 0}
                className={`px-4 py-2 rounded-2xl font-black text-xs flex items-center gap-1.5 transition ${
                  selectedStudentIds.length > 0
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:scale-102'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
                title="Tích chọn học sinh bên dưới để xóa"
              >
                <Trash2 className="w-4 h-4" /> XÓA HỌC SINH {selectedStudentIds.length > 0 ? `(${selectedStudentIds.length})` : ''}
              </button>
            </div>
          </div>

          {/* Active selection alert banner */}
          {selectedStudentIds.length > 0 && (
            <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-3 flex items-center justify-between animate-fadeIn text-xs">
              <span className="font-bold text-rose-800 flex items-center gap-2">
                <span>⚠️</span> Đang chọn <strong className="text-rose-950 font-black">{selectedStudentIds.length}</strong> học sinh trong Lớp 3D.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedStudentIds([])}
                  className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-600 rounded-xl font-bold border border-slate-200"
                >
                  Bỏ chọn tất cả
                </button>
                <button
                  onClick={() => setShowBatchDeleteModal(true)}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black shadow flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Xác nhận xóa {selectedStudentIds.length} học sinh
                </button>
              </div>
            </div>
          )}

          {/* Student Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="p-4 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0}
                        onChange={handleToggleSelectAll}
                        className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                        title="Chọn tất cả học sinh"
                      />
                    </th>
                    <th className="p-4">Mã HS</th>
                    <th className="p-4">Họ và tên</th>
                    <th className="p-4">Nhóm học tập</th>
                    <th className="p-4">Trạng thái</th>
                    <th className="p-4 text-center">Nhiệm vụ</th>
                    <th className="p-4 text-center">Điểm số</th>
                    <th className="p-4 text-center">Số sao</th>
                    <th className="p-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((s) => (
                    <tr
                      key={s.id}
                      className={`hover:bg-slate-50/80 transition ${
                        selectedStudentIds.includes(s.id) ? 'bg-rose-50/40' : ''
                      }`}
                    >
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedStudentIds.includes(s.id)}
                          onChange={() => handleToggleSelectStudent(s.id)}
                          className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                        />
                      </td>
                      <td className="p-4 font-black text-slate-600">{s.code}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{s.avatar}</span>
                          <div>
                            <span className="font-black text-slate-800 block">{s.name}</span>
                            <span className="text-[10px] text-slate-400">Lớp {s.class}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full font-bold text-[11px] bg-slate-100 text-slate-700">
                          {s.group}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[11px] inline-flex items-center gap-1 ${
                            s.status === 'Hoàn thành tốt'
                              ? 'bg-emerald-100 text-emerald-800'
                              : s.status === 'Đã hoàn thành'
                              ? 'bg-sky-100 text-sky-800'
                              : s.status === 'Đang thực hiện'
                              ? 'bg-amber-100 text-amber-800'
                              : s.status === 'Cần hỗ trợ'
                              ? 'bg-rose-100 text-rose-800 animate-pulse'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {s.status}
                        </span>
                        {s.notes && (
                          <span className="block text-[10px] text-rose-600 mt-1 max-w-[180px] truncate">
                            ⚠️ {s.notes}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center font-bold text-slate-700">
                        {s.completedTasks}/{s.totalTasks}
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-black text-sm text-emerald-700">{s.score}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-bold text-amber-600 flex items-center justify-center gap-0.5">
                          ⭐ {s.stars}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => { setViewingStudent(s); sounds.playPop(); }}
                            className="px-2.5 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-xl font-bold flex items-center gap-1 transition"
                            title="Hồ sơ năng lực điện tử"
                          >
                            <Eye className="w-3.5 h-3.5" /> Hồ sơ
                          </button>
                          <button
                            onClick={() => { setStudentToDelete(s); sounds.playPop(); }}
                            className="px-2.5 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white rounded-xl font-bold flex items-center gap-1 transition"
                            title="Xóa học sinh này"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => { setShowAddAssignment(true); sounds.playPop(); }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" /> Giao nhiệm vụ mới
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assignments.map((asg) => (
              <div key={asg.id} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                    {asg.subject}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                    Hạn: {asg.deadline}
                  </span>
                </div>

                <h3 className="font-black text-slate-800 text-base">{asg.title}</h3>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Đối tượng:</span>
                    <span className="font-bold text-slate-700">{asg.targetDetail}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Số bài đã nộp:</span>
                    <span className="font-bold text-emerald-600">{asg.totalSubmissions}/24</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {asg.status}
                  </span>
                  <button
                    onClick={() => { sounds.playPop(); alert(`Đang kiểm tra kết quả bài tập: ${asg.title}`); }}
                    className="font-bold text-sky-600 hover:underline"
                  >
                    Xem chi tiết →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL HỒ SƠ HỌC TẬP ĐIỆN TỬ HỌC SINH */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-5 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{viewingStudent.avatar}</span>
                <div>
                  <h3 className="font-black text-slate-800 text-lg">{viewingStudent.name}</h3>
                  <p className="text-xs text-slate-500">Mã HS: {viewingStudent.code} – {viewingStudent.group}</p>
                </div>
              </div>
              <button onClick={() => setViewingStudent(null)} className="text-slate-400 font-bold text-lg">✕</button>
            </div>

            <div className="space-y-3">
              <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider">
                Đánh giá năng lực cốt lõi (GDPT 2018):
              </h4>
              <div className="space-y-2 text-xs">
                {[
                  { label: 'Kỹ năng đọc hiểu & ngôn ngữ', val: viewingStudent.competencies.reading },
                  { label: 'Tư duy toán học & tính toán', val: viewingStudent.competencies.math },
                  { label: 'Giải quyết vấn đề', val: viewingStudent.competencies.problemSolving },
                  { label: 'Hợp tác nhóm', val: viewingStudent.competencies.collaboration },
                  { label: 'Tự tin trình bày', val: viewingStudent.competencies.presentation },
                  { label: 'Khả năng tự đánh giá', val: viewingStudent.competencies.selfReflection },
                ].map((c) => (
                  <div key={c.label} className="space-y-0.5">
                    <div className="flex justify-between font-bold text-slate-600">
                      <span>{c.label}</span>
                      <span>{c.val}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        style={{ width: `${c.val}%` }}
                        className="bg-emerald-500 h-2 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1">
              <span className="font-bold text-emerald-900 block">Lời nhận xét của Cô giáo Nguyễn Hoàng Thu Anh:</span>
              <p className="text-slate-700">
                {viewingStudent.status === 'Hoàn thành tốt'
                  ? 'Em có tinh thần tự giác rất cao, tích cực giúp đỡ các bạn trong nhóm và sáng tạo vượt trội.'
                  : viewingStudent.status === 'Cần hỗ trợ'
                  ? 'Em rất cố gắng nhưng cần rèn luyện thêm bảng nhân và tự tin hơn khi trình bày trước lớp.'
                  : 'Em hoàn thành tốt các nhiệm vụ được giao, chăm chỉ và có tiến bộ từng tuần.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL THÊM HỌC SINH */}
      {showAddStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-800 text-lg">Thêm học sinh mới vào Lớp 3D</h3>
              <button onClick={() => setShowAddStudent(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleAddStudentSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Họ và tên học sinh:</label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="Ví dụ: Hoàng Minh Đức..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Giới tính:</label>
                  <select
                    value={newStudentGender}
                    onChange={(e) => setNewStudentGender(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  >
                    <option value="male">Nam (👦)</option>
                    <option value="female">Nữ (👧)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Nhóm học tập:</label>
                  <select
                    value={newStudentGroup}
                    onChange={(e) => setNewStudentGroup(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  >
                    {groups.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 text-white rounded-xl font-black text-xs shadow hover:bg-emerald-700"
              >
                Thêm vào danh sách lớp
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL GIAO NHIỆM VỤ MỚI */}
      {showAddAssignment && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-800 text-lg">Giao nhiệm vụ học tập mới</h3>
              <button onClick={() => setShowAddAssignment(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Tên nhiệm vụ / bài học:</label>
                <input
                  type="text"
                  required
                  value={asgTitle}
                  onChange={(e) => setAsgTitle(e.target.value)}
                  placeholder="Ví dụ: Luyện tập bảng chia 7..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Môn học:</label>
                  <select
                    value={asgSubject}
                    onChange={(e) => setAsgSubject(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  >
                    <option value="Toán">Toán</option>
                    <option value="Tiếng Việt">Tiếng Việt</option>
                    <option value="Tự nhiên và Xã hội">Tự nhiên và Xã hội</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Hạn nộp:</label>
                  <input
                    type="text"
                    value={asgDeadline}
                    onChange={(e) => setAsgDeadline(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Giao cho đối tượng:</label>
                <select
                  value={asgTarget}
                  onChange={(e) => {
                    const t = e.target.value as any;
                    setAsgTarget(t);
                    if (t === 'all') setAsgTargetDetail('Toàn lớp 3D');
                    else if (t === 'group') setAsgTargetDetail('Nhóm Sao Mai & Nhóm Chim Én');
                    else setAsgTargetDetail('HS cần hỗ trợ thêm');
                  }}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs mb-1"
                >
                  <option value="all">Toàn bộ lớp 3D</option>
                  <option value="group">Theo nhóm học tập</option>
                  <option value="individual">Cá nhân học sinh cần hỗ trợ</option>
                </select>
                <input
                  type="text"
                  value={asgTargetDetail}
                  onChange={(e) => setAsgTargetDetail(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 text-white rounded-xl font-black text-xs shadow hover:bg-emerald-700"
              >
                Phát hành nhiệm vụ 🚀
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL XÁC NHẬN XÓA 1 HỌC SINH */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-2xl">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-black text-slate-800 text-lg">Xác nhận xóa học sinh</h3>
              <p className="text-xs text-slate-500">
                Cô Thu Anh có chắc chắn muốn xóa học sinh dưới đây khỏi danh sách Lớp 3D?
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
              <span className="text-3xl">{studentToDelete.avatar}</span>
              <div>
                <span className="font-black text-slate-800 text-sm block">{studentToDelete.name}</span>
                <span className="text-xs text-slate-500 font-semibold">
                  Mã: {studentToDelete.code} • {studentToDelete.group}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStudentToDelete(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmDeleteSingle}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs shadow transition"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XÁC NHẬN XÓA NHIỀU HỌC SINH ĐÃ CHỌN */}
      {showBatchDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-2xl">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-black text-slate-800 text-lg">Xóa học sinh đã chọn</h3>
              <p className="text-xs text-slate-500">
                Cô Thu Anh đang yêu cầu xóa <strong className="text-rose-700 font-black">{selectedStudentIds.length}</strong> học sinh khỏi Lớp 3D.
              </p>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 font-semibold">
              ⚠️ Hành động này sẽ xóa dữ liệu điểm số, số sao và bài tập của các em đã chọn.
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowBatchDeleteModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmBatchDelete}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs shadow transition"
              >
                Xóa {selectedStudentIds.length} học sinh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
