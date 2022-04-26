import { Student } from "../models/Student.model";
import PouchDB from "pouchdb";

const StudentsDB = new PouchDB("db/students.db");

export class StudentController {
  allStudents: Student[] = [];

  constructor() {
    this.getFromDB();
  }

  async getFromDB() {
    try {
      const query = await StudentsDB.allDocs({ include_docs: true });
      const docs = query.rows.map(({ doc }) => doc as Student);
      this.allStudents = docs;
    } catch (e) {
      console.error(e);
    }
  }

  async getAllStudents() {
    return this.allStudents;
  }

  async getStudent(id) {
    // get the todo
    const student = this.allStudents.find((student) => student._id === id);
    if (student) {
      return student;
    } else {
      throw `Student with id ${id} not found `;
    }
  }

  async createStudent(newStudentObj: Student): Promise<Student> {
    const newStudent = {
      _id: Math.random().toString(36).slice(2),
      ...newStudentObj,
    };

    try {
      const response = await StudentsDB.put(newStudent);

      this.getFromDB();

      newStudent._rev = response.rev;
      return newStudent;
    } catch (e) {
      throw `StudentsController Error: Couldn't create student - ${e.message}`;
    }
  }

  async updateStudent(id, updatedStudentObj: Student): Promise<Student> {
    try {
      this.getStudent(id);
    } catch (e) {
      throw `Couldn't find student with ${id}`;
    }

    try {
      const response = await StudentsDB.put(updatedStudentObj);

      this.getFromDB();

      updatedStudentObj._rev = response.rev;
      return updatedStudentObj;
    } catch (e) {
      throw `StudentsController Error: Couldn't update student - ${e.message}`;
    }
  }

  async deleteStudent(id: string): Promise<string> {
    try {
      const studentToDelete = await this.getStudent(id);
      try {
        StudentsDB.remove(studentToDelete);
        this.getFromDB();
      } catch (error) {
        throw `Couldn't remove student ${error}`;
      }
    } catch (e) {
      throw `Couldn't find student with ${id}`;
    }

    return `Student ${id} deleted successfully`;
  }
}
