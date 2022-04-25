import { Teacher } from "../models/Teacher.model";

export class TeacherController {
  allTeachers: Teacher[] = [];

  constructor() {
    this.createTeacher({
      _id: Math.random().toString(36).slice(2),
      name: "John Doe",
      email: "john@doe.com",
      password: "12345678",
      course: "ABC123",
      department: "TEC",
    });

    this.createTeacher({
      _id: Math.random().toString(36).slice(2),
      name: "Jane Doe",
      email: "jane@doe.com",
      password: "12345678",
      course: "CHE839",
      department: "TOH",
    });

    this.createTeacher({
      _id: Math.random().toString(36).slice(2),
      name: "Michael Douglas",
      email: "michael@douglas.com",
      password: "12345678",
      course: "TQR572",
      department: "MOH",
    });
  }

  // getting all todos
  async getAllTeachers() {
    // return all todos
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
  async createTeacher(newTeacherObj: Teacher) {
    // create a todo, with random id and data sent
    const newTeacher = {
      _id: Math.random().toString(36).slice(2),
      ...newTeacherObj,
    };

    this.allTeachers.push(newTeacher);

    // return the new created todo
    return newTeacher;
  }

  // updating a todo
  async updateTeacher(id, updatedTeacherObj: Teacher) {
    try {
      this.getTeacher(id);
    } catch (e) {
      return `Couldn't find teacher with ${id}`;
    }

    // remove old teacher object
    const newTeachersArray = this.allTeachers.filter(
      (teacher) => teacher._id != updatedTeacherObj._id
    );
    newTeachersArray.push(updatedTeacherObj);
    this.allTeachers = newTeachersArray;

    return updatedTeacherObj;
  }

  // deleting a todo
  deleteTeacher(id: string): string {
    try {
      this.getTeacher(id);
    } catch (e) {
      return `Couldn't find teacher with ${id}`;
    }
    const newTeachersArray = this.allTeachers.filter(
      (teacher) => teacher._id != id
    );
    this.allTeachers = newTeachersArray;

    return `Teacher ${id} deleted successfully`;
  }
}
