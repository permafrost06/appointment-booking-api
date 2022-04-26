import * as http from "http";
import { AdminController } from "./controllers/AdminController";
import { StudentController } from "./controllers/StudentsController";
import { TeacherController } from "./controllers/TeachersController";
import { Student } from "./models/Student.model";
import { Teacher } from "./models/Teacher.model";
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
  } else if (req.url === "/api/teachers/signup" && req.method === "POST") {
    const loginRequestObject = JSON.parse(await getReqData(req));

    const response = await adminController.queueUserSignUpRequest(
      loginRequestObject.username,
      loginRequestObject.password,
      "teacher"
    );

    if (response) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "account requested. waiting for admin approval",
        })
      );
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
    if (!req.headers.authorization) {
      res.writeHead(403);
      res.end();
      return;
    }
    const authHeader = req.headers.authorization;

    if (
      !(
        adminController.isAdmin(authHeader) ||
        teachersController.isTeacher(authHeader)
      )
    ) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "the user does not have permission" }));
      return;
    }

    if (teachersController.isTeacher(authHeader)) {
      const requestUserID =
        teachersController.getTeacherIDFromToken(authHeader);

      if (req.url.split("/")[3] !== requestUserID) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ message: "the user does not have permission" })
        );
        return;
      }
    }

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
  } else if (req.url === "/api/students/signup" && req.method === "POST") {
    const loginRequestObject = JSON.parse(await getReqData(req));

    const response = await adminController.queueUserSignUpRequest(
      loginRequestObject.username,
      loginRequestObject.password,
      "student"
    );

    if (response) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "account requested. waiting for admin approval",
        })
      );
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
    if (!req.headers.authorization) {
      res.writeHead(403);
      res.end();
      return;
    }
    const authHeader = req.headers.authorization;

    if (
      !(
        adminController.isAdmin(authHeader) ||
        studentsController.isStudent(authHeader)
      )
    ) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "the user does not have permission" }));
      return;
    }

    if (studentsController.isStudent(authHeader)) {
      const requestUserID =
        studentsController.getStudentIDFromToken(authHeader);

      if (req.url.split("/")[3] !== requestUserID) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ message: "the user does not have permission" })
        );
        return;
      }
    }

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
  } else if (req.url === "/api/admin/requests" && req.method === "GET") {
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
      const requests = await adminController.getUserSignUpRequests();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(requests));
    } catch (e) {
      res.writeHead(300);
      res.end();
    }
  } else if (
    req.url.match(/\/api\/admin\/requests\/([0-9a-zA-Z]+)\/approve/) &&
    req.method == "GET"
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
      const id = req.url.split("/")[4];
      const requestObj = await adminController.getRequestByID(id);

      if (requestObj.type === "teacher") {
        try {
          const teacher = await teachersController.createTeacher({
            _id: requestObj._id,
            email: requestObj.username,
            password: requestObj.password,
          } as Teacher);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(teacher));
        } catch (error) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: error }));
        }
      }

      if (requestObj.type === "student") {
        try {
          const teacher = await studentsController.createStudent({
            _id: requestObj._id,
            email: requestObj.username,
            password: requestObj.password,
          } as Student);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(teacher));
        } catch (error) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: error }));
        }
      }

      try {
        adminController.deleteRequest(requestObj._id);
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: `request ${req.url.split("/")[4]} not found`,
        })
      );
    }
  } else if (
    req.url.match(/\/api\/admin\/requests\/([0-9a-zA-Z]+)\/reject/) &&
    req.method == "GET"
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

    const id = req.url.split("/")[4];

    if (await adminController.deleteRequest(id)) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ message: `request ${id} deleted successfully` })
      );
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: `request ${id} not found` }));
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
