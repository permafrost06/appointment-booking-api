import { Student } from "./Student.model";
import { Teacher } from "./Teacher.model";
import { User } from "./User.model";

export interface SignInResponse {
  token: string;
  userObj: User | Student | Teacher;
}
