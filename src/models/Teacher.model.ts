import { User } from "./User.model";

export interface Teacher extends User {
  name: string;
  department: string;
  course: string;
  hours: number;
}
