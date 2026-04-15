export interface School {
  id: string;
  name: string;
  address: string;
  headmaster: string;
  phone: string;
  latitude: number;
  longitude: number;
  studentCount: number;
  imageUrl: string;
  description: string;
}

export interface Student {
  id: string;
  name: string;
  schoolId: string;
  schoolName: string;
  grade: number;
  avatarUrl?: string;
  initials: string;
  videos: Video[];
  journalsLogged: number;
  skillsEarned: number;
  monthsActive: number;
  sponsorCount: number;
}

export interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  durationSeconds: number;
  date: string;
  activityType: string;
  studentId: string;
  studentName: string;
  schoolName: string;
}

export interface Donor {
  id: string;
  name: string;
  avatarUrl?: string;
  isAnonymous: boolean;
  totalDonated: number;
  studentsSupported: number;
}

export interface Donation {
  id: string;
  donorId: string;
  studentId?: string;
  schoolId?: string;
  amount: number;
  date: string;
  type: 'student' | 'school' | 'general';
  receiptUrl?: string;
}

export interface ImpactMetric {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  subLabel: string;
}

export interface FavoriteItem {
  id: string;
  type: 'student' | 'school';
  savedAt: string;
}

// Publications types
export interface BookChapter {
  id: string;
  number: number;
  title: string;
  paragraphs: string[];
  videoUrl?: string;
  videoCaption?: string;
}

export interface Book {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  coverDescription: string;
  chapters: BookChapter[];
}

export interface Highlight {
  id: string;
  bookId: string;
  chapterId: string;
  paragraphIndex: number;
  startOffset: number;
  endOffset: number;
  text: string;
  count: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  bookId: string;
  chapterId: string;
  paragraphIndex: number;
  author: string;
  text: string;
  parentId: string | null;
  createdAt: string;
}

export interface HighlightRange {
  paragraphIndex: number;
  startOffset: number;
  endOffset: number;
  text: string;
}
