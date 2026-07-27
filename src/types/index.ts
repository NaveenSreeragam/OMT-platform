export type UserRole = 'student' | 'admin';
export type SessionStatus = 'upcoming' | 'active' | 'completed' | 'archived';
export type RegistrationStatus = 'registered' | 'completed' | 'absent' | 'withdrawn' | 'cancelled';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  title: string;
  session_date: string;
  venue: string;
  registration_deadline: string;
  max_participants: number;
  status: SessionStatus;
  created_at: string;
  updated_at: string;
}

export interface Registration {
  id: string;
  registration_number: string;
  student_id: string;
  session_id: string;
  status: RegistrationStatus;
  registered_at: string;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  sessions?: Session;
}

export interface Score {
  id: string;
  registration_id: string;
  communication: number;
  confidence: number;
  content: number;
  time_management: number;
  total_score: number;
  advisor_remarks: string;
  evaluated_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
  registrations?: Registration & {
    profiles?: Profile;
    sessions?: Session;
  };
}

export interface LeaderboardEntry {
  score_id: string;
  registration_id: string;
  session_id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  department: string;
  college: string;
  registration_number: string;
  communication: number;
  confidence: number;
  content: number;
  time_management: number;
  total_score: number;
  advisor_remarks: string;
  evaluated_at: string;
  rank: number;
}
