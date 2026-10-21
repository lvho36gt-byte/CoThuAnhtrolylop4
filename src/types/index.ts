export type Role = 'student' | 'teacher';

export type Subject = 
  | 'Toán' 
  | 'Tiếng Việt' 
  | 'Tự nhiên và Xã hội' 
  | 'Đạo đức' 
  | 'Tin học & Công nghệ' 
  | 'Hoạt động trải nghiệm';

export interface Student {
  id: string;
  code: string;
  name: string;
  gender: 'male' | 'female';
  class: string;
  group: string; // e.g. "Nhóm Sao Mai", "Nhóm Sơn Ca", "Nhóm Chim Én", "Nhóm Búp Sen"
  status: 'Chưa bắt đầu' | 'Đang thực hiện' | 'Đã hoàn thành' | 'Cần hỗ trợ' | 'Hoàn thành tốt';
  completedTasks: number;
  totalTasks: number;
  score: number; // 0 - 100
  stars: number;
  badges: string[];
  avatar: string;
  notes?: string;
  competencies: {
    reading: number; // 0 - 100
    math: number;
    problemSolving: number;
    collaboration: number;
    presentation: number;
    selfReflection: number;
  };
}

export interface QuizQuestion {
  id: string;
  stationId?: number;
  subject: Subject;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
  level: 1 | 2 | 3; // 1: Nhận biết, 2: Thông hiểu, 3: Vận dụng
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'word-problem';
  image?: string;
}

export interface StationData {
  id: number;
  title: string;
  subtitle: string;
  badgeName: string;
  color: string;
  bgGradient: string;
  iconName: string;
  character: string;
  objective: string;
  completed: boolean;
  unlocked: boolean;
  starsEarned: number;
}

export interface LearningMaterial {
  id: string;
  title: string;
  subject: Subject;
  week: number;
  topic: string;
  type: 'PDF' | 'Word' | 'Hình ảnh' | 'Video' | 'Phiếu học tập' | 'Bài giảng';
  level: 'Mức 1 (Nhận biết)' | 'Mức 2 (Thông hiểu)' | 'Mức 3 (Vận dụng)';
  summary: string;
  keyPoints: string[];
  fileUrl?: string;
  approved: boolean;
  uploadedAt: string;
}

export interface CreativeSubmission {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  type: 'Tranh vẽ' | 'Sơ đồ tư duy' | 'Câu chuyện' | 'Poster học tập' | 'Thiệp chúc mừng';
  description: string;
  mediaUrl: string; // data url or image
  approvedByTeacher: boolean;
  teacherComment?: string;
  submittedAt: string;
  likes: number;
  aiSuggestion?: string;
}

export interface ActivityStep {
  step: number;
  name: string;
  description: string;
  completed: boolean;
  icon: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: Subject;
  target: 'all' | 'group' | 'individual';
  targetDetail: string; // e.g. "Toàn lớp 3D", "Nhóm Sao Mai", "HS: Trần Bảo An"
  deadline: string;
  maxAttempts: number;
  totalSubmissions: number;
  status: 'Đang mở' | 'Đã đóng';
}
