import { Teacher } from "../models/Teacher.model";
import PouchDB from "pouchdb";
import * as jwt from "jsonwebtoken";
import { Appointment } from "../models/Appointment.model";

const TeachersDB = new PouchDB("db/teachers.db");
const AppointmentsDB = new PouchDB("db/appointments.db");

export class TeacherController {
  allTeachers: Teacher[] = [];
  allAppointments: Appointment[] = [];

  jwtSecretKey = "insecure_secret_key";

  constructor() {
    this.getFromDB();
  }

  async getFromDB() {
    try {
      const query = await TeachersDB.allDocs({ include_docs: true });
      const docs = query.rows.map(({ doc }) => doc as Teacher);
      this.allTeachers = docs;
    } catch (e) {
      console.error(e);
    }

    try {
      const query = await AppointmentsDB.allDocs({ include_docs: true });
      const docs = query.rows.map(({ doc }) => doc as Appointment);
      this.allAppointments = docs;
    } catch (e) {
      console.error(e);
    }
  }

  async getAllTeachers() {
    return this.allTeachers;
  }

  async getTeacher(id) {
    // get the todo
    const teacher = this.allTeachers.find((teacher) => teacher._id === id);
    if (teacher) {
      return teacher;
    } else {
      throw `Teacher with id ${id} not found `;
    }
  }

  async createTeacher(newTeacher: Teacher): Promise<Teacher> {
    try {
      const response = await TeachersDB.put(newTeacher);

      this.getFromDB();

      newTeacher._rev = response.rev;
      return newTeacher;
    } catch (e) {
      throw `TeachersController Error: Couldn't create teacher - ${e.message}`;
    }
  }

  async updateTeacher(id, updatedTeacherObj: Teacher): Promise<Teacher> {
    try {
      this.getTeacher(id);
    } catch (e) {
      throw `Couldn't find teacher with ${id}`;
    }

    try {
      const response = await TeachersDB.put(updatedTeacherObj);

      this.getFromDB();

      updatedTeacherObj._rev = response.rev;
      return updatedTeacherObj;
    } catch (e) {
      throw `TeachersController Error: Couldn't update teacher - ${e.message}`;
    }
  }

  async deleteTeacher(id: string): Promise<string> {
    try {
      const teacherToDelete = await this.getTeacher(id);
      try {
        TeachersDB.remove(teacherToDelete);
        this.getFromDB();
      } catch (error) {
        throw `Couldn't remove teacher ${error}`;
      }
    } catch (e) {
      throw `Couldn't find teacher with ${id}`;
    }

    return `Teacher ${id} deleted successfully`;
  }

  signIn(username: string, password: string): string {
    const matchTeacherArray = this.allTeachers.filter(
      (teacher) => teacher.email === username
    );

    if (matchTeacherArray.length) {
      const teacherObj = matchTeacherArray[0];

      if (teacherObj.password === password) {
        const data = {
          userLevel: "teacher",
          _id: teacherObj._id,
        };

        return jwt.sign(data, this.jwtSecretKey);
      } else throw `invalid credentials`;
    } else throw `invalid credentials`;
  }

  isTeacher(token: string): boolean {
    try {
      interface Dec {
        userLevel: string;
        iat: number;
      }

      const decoded = jwt.verify(token.split(" ")[1], this.jwtSecretKey) as Dec;

      if (decoded.userLevel === "teacher") return true;
    } catch (e) {
      console.log(e);
      return false;
    }
    return false;
  }

  getTeacherIDFromToken(token: string): string {
    try {
      interface Dec {
        userLevel: string;
        _id: string;
        iat: number;
      }

      const decoded = jwt.verify(token.split(" ")[1], this.jwtSecretKey) as Dec;
      console.log(decoded);

      if (!(decoded.userLevel === "teacher")) throw `user is not teacher`;
      else return decoded._id;
    } catch (e) {
      console.log(e);
      throw `invalid token`;
    }
  }

  getTeacherAppointments(id: string): Appointment[] {
    return this.allAppointments.filter(
      (appointment) => appointment.teacher_id == id
    );
  }

  async queueTeacherAppointment(
    teacher_id: string,
    student_id: string,
    date: string,
    time: string
  ) {
    const appointmentObj: Appointment = {
      _id: Math.random().toString(36).slice(2),
      teacher_id,
      student_id,
      date,
      time,
      approved: false,
      _rev: "",
    };

    try {
      const response = await AppointmentsDB.put(appointmentObj);

      this.getFromDB();

      appointmentObj._rev = response.rev;
      return appointmentObj;
    } catch (e) {
      throw `TeachersController Error: Couldn't create appointment - ${e.message}`;
    }
  }
}
