import * as http from "http";
import { StudentController } from "./controllers/StudentsController";
import { TeacherController } from "./controllers/TeachersController";
import { getReqData } from "./utils";

const PORT = process.env.PORT || 5000;

const teachersController = new TeacherController();
const studentsController = new StudentController();

const server = http.createServer(async (req, res) => {
  if (req.url === "/api/teachers" && req.method === "GET") {
    const teachers = await teachersController.getAllTeachers();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(teachers));
  } else if (
    req.url.match(/\/api\/teachers\/([0-9a-zA-Z]+)/) &&
    req.method === "GET"
  ) {
    try {
      const id = req.url.split("/")[3];
      const teacher = await teachersController.getTeacher(id);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(teacher));
    } catch (error) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: error }));
    }
  } else if (
    req.url.match(/\/api\/teachers\/([0-9a-zA-Z]+)/) &&
    req.method === "DELETE"
  ) {
    try {
      const id = req.url.split("/")[3];
      const message: string = await teachersController.deleteTeacher(id);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message }));
    } catch (error) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: error }));
    }
  } else if (
    req.url.match(/\/api\/teachers\/([0-9a-zA-Z]+)/) &&
    req.method === "PATCH"
  ) {
    try {
      const id = req.url.split("/")[3];
      const updatedTeacherObj: string = (await getReqData(req)) as string;
      const updated_teacher = await teachersController.updateTeacher(
        id,
        JSON.parse(updatedTeacherObj)
      );
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(updated_teacher));
    } catch (error) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: error }));
    }
  } else if (req.url === "/api/teachers" && req.method === "POST") {
    const newTeacherObj: string = (await getReqData(req)) as string;
    try {
      const teacher = await teachersController.createTeacher(
        JSON.parse(newTeacherObj)
      );
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(teacher));
    } catch (error) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: error }));
    }
  } else if (req.url === "/api/students" && req.method === "GET") {
    const students = await studentsController.getAllStudents();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(students));
  } else if (
    req.url.match(/\/api\/students\/([0-9a-zA-Z]+)/) &&
    req.method === "GET"
  ) {
    try {
      const id = req.url.split("/")[3];
      const student = await studentsController.getStudent(id);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(student));
    } catch (error) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: error }));
    }
  } else if (
    req.url.match(/\/api\/students\/([0-9a-zA-Z]+)/) &&
    req.method === "DELETE"
  ) {
    try {
      const id = req.url.split("/")[3];
      const message: string = await studentsController.deleteStudent(id);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message }));
    } catch (error) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: error }));
    }
  } else if (
    req.url.match(/\/api\/students\/([0-9a-zA-Z]+)/) &&
    req.method === "PATCH"
  ) {
    try {
      const id = req.url.split("/")[3];
      const updatedStudentObj: string = (await getReqData(req)) as string;
      const updated_student = await studentsController.updateStudent(
        id,
        JSON.parse(updatedStudentObj)
      );
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(updated_student));
    } catch (error) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: error }));
    }
  } else if (req.url === "/api/students" && req.method === "POST") {
    const newStudentObj: string = await getReqData(req);
    try {
      const student = await studentsController.createStudent(
        JSON.parse(newStudentObj)
      );
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(student));
    } catch (error) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: error }));
    }
  }

  // No route present
  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});
