import { User } from "./User.model";

export interface Student extends User {
  name: string;
  department: string;
}
