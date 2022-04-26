import * as http from "http";
import { AdminController } from "./controllers/AdminController";
import { StudentController } from "./controllers/StudentsController";
import { TeacherController } from "./controllers/TeachersController";
import { getReqData } from "./utils";

const PORT = process.env.PORT || 5000;

const teachersController = new TeacherController();
const studentsController = new StudentController();
const adminController = new AdminController();

const server = http.createServer(async (req, res) => {
  if (req.url === "/api/teachers/login" && req.method === "POST") {
    const loginRequestObject = JSON.parse(await getReqData(req));
    try {
      const token = teachersController.signIn(
        loginRequestObject.username,
        loginRequestObject.password
      );
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ token }));
    } catch (error) {
      console.log(error);
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "invalid credentials provided" }));
    }
  } else if (req.url === "/api/teachers" && req.method === "GET") {
    if (!req.headers.authorization) {
      res.writeHead(403);
      res.end();
      return;
    }
    const authHeader = req.headers.authorization;

    if (
      !(
        adminController.isAdmin(authHeader) ||
        teachersController.isTeacher(authHeader) ||
        studentsController.isStudent(authHeader)
      )
    ) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "the user does not have permission" }));
      return;
    }

    const teachers = await teachersController.getAllTeachers();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(teachers));
  } else if (
    req.url.match(/\/api\/teachers\/([0-9a-zA-Z]+)/) &&
    req.method === "GET"
  ) {
    if (!req.headers.authorization) {
      res.writeHead(403);
      res.end();
      return;
    }
    const authHeader = req.headers.authorization;

    if (
      !(
        adminController.isAdmin(authHeader) ||
        teachersController.isTeacher(authHeader) ||
        studentsController.isStudent(authHeader)
      )
    ) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "the user does not have permission" }));
      return;
    }

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
    if (!req.headers.authorization) {
      res.writeHead(403);
      res.end();
      return;
    }
    if (!adminController.isAdmin(req.headers.authorization)) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "the user does not have permission" }));
      return;
    }

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
    if (!req.headers.authorization) {
      res.writeHead(403);
      res.end();
      return;
    }
    if (!adminController.isAdmin(req.headers.authorization)) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "the user does not have permission" }));
      return;
    }

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
  } else if (req.url === "/api/students/login" && req.method === "POST") {
    const loginRequestObject = JSON.parse(await getReqData(req));
    try {
      const token = studentsController.signIn(
        loginRequestObject.username,
        loginRequestObject.password
      );
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ token }));
    } catch (error) {
      console.log(error);
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "invalid credentials provided" }));
    }
  } else if (req.url === "/api/students" && req.method === "GET") {
    if (!req.headers.authorization) {
      res.writeHead(403);
      res.end();
      return;
    }
    const authHeader = req.headers.authorization;

    if (
      !(
        adminController.isAdmin(authHeader) ||
        teachersController.isTeacher(authHeader) ||
        studentsController.isStudent(authHeader)
      )
    ) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "the user does not have permission" }));
      return;
    }

    const students = await studentsController.getAllStudents();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(students));
  } else if (
    req.url.match(/\/api\/students\/([0-9a-zA-Z]+)/) &&
    req.method === "GET"
  ) {
    if (!req.headers.authorization) {
      res.writeHead(403);
      res.end();
      return;
    }
    const authHeader = req.headers.authorization;

    if (
      !(
        adminController.isAdmin(authHeader) ||
        teachersController.isTeacher(authHeader) ||
        studentsController.isStudent(authHeader)
      )
    ) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "the user does not have permission" }));
      return;
    }

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
    if (!req.headers.authorization) {
      res.writeHead(403);
      res.end();
      return;
    }
    if (!adminController.isAdmin(req.headers.authorization)) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "the user does not have permission" }));
      return;
    }

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
    if (!req.headers.authorization) {
      res.writeHead(403);
      res.end();
      return;
    }
    if (!adminController.isAdmin(req.headers.authorization)) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "the user does not have permission" }));
      return;
    }

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
  } else if (req.url === "/api/admin/login" && req.method === "POST") {
    const loginRequestObject = JSON.parse(await getReqData(req));
    try {
      const token = adminController.signIn(
        loginRequestObject.username,
        loginRequestObject.password
      );
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ token }));
    } catch (error) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "invalid credentials provided" }));
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
