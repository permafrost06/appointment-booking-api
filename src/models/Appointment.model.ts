export interface Appointment {
  _id: string;
  teacher_id: string;
  student_id: string;
  date: string;
  time: string;
  agenda: string;
  approved: boolean;
  _rev: string;
}
