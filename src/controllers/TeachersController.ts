import { Teacher } from "../models/Teacher.model";
import PouchDB from "pouchdb";

const TeachersDB = new PouchDB("db/teachers.db");

export class TeacherController {
  allTeachers: Teacher[] = [];

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
  }

  async getAllTeachers() {
    return this.allTeachers;
  }

  // getting a single todo
  async getTeacher(id) {
    // get the todo
    const teacher = this.allTeachers.find((teacher) => teacher._id === id);
    if (teacher) {
      // return the todo
      return teacher;
    } else {
      // return an error
      throw `Teacher with id ${id} not found `;
    }
  }

  // creating a todo
  async createTeacher(newTeacherObj: Teacher): Promise<Teacher> {
    const newTeacher = {
      _id: Math.random().toString(36).slice(2),
      ...newTeacherObj,
    };

    try {
      await TeachersDB.put(newTeacher);

      this.getFromDB();

      return newTeacher;
    } catch (e) {
      throw `TeachersController Error: Couldn't create teacher - ${e.message}`;
    }
  }

  // updating a todo
  async updateTeacher(id, updatedTeacherObj: Teacher): Promise<Teacher> {
    try {
      this.getTeacher(id);
    } catch (e) {
      throw `Couldn't find teacher with ${id}`;
    }

    try {
      await TeachersDB.put(updatedTeacherObj);

      this.getFromDB();

      return updatedTeacherObj;
    } catch (e) {
      throw `TeachersController Error: Couldn't update teacher - ${e.message}`;
    }
  }

  // deleting a todo
  async deleteTeacher(id: string): Promise<string> {
    try {
      const teacherToDelete = await this.getTeacher(id);
      try {
        TeachersDB.remove(teacherToDelete);
        this.getFromDB();
      } catch (error) {
        return `Couldn't remove teacher ${error}`;
      }
    } catch (e) {
      return `Couldn't find teacher with ${id}`;
    }

    return `Teacher ${id} deleted successfully`;
  }
}
