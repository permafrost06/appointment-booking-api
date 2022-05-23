import { SimpleAPI } from "./SimpleAPI";
import { AdminController } from "./controllers/AdminController";
import { StudentController } from "./controllers/StudentsController";
import { TeacherController } from "./controllers/TeachersController";
import { Student } from "./models/Student.model";
import { Teacher } from "./models/Teacher.model";
import { sendJSON } from "./utils";
import {
  hasAppointmentCreateAccess,
  hasStudentPatchAccess,
  hasTeacherPatchAccess,
  isAdmin,
  isOwnerTeacher,
  isOwnerStudent,
  verifyUserExists,
} from "./middleware";

const teachersController = new TeacherController();
const studentsController = new StudentController();
const adminController = new AdminController();

const PORT = process.env.PORT || 5000;

export const app = new SimpleAPI();

app.addEndpoint("POST", "/api/teachers/signup", async (req, res) => {
  const loginRequestObject = req.body.json;

  const response = await adminController.queueUserSignUpRequest(
    loginRequestObject.username,
    loginRequestObject.password,
    "teacher"
  );

  if (response) {
    sendJSON(res, 200, {
      message: "account requested. waiting for admin approval",
    });
  }
});

app.addEndpoint("POST", "/api/teachers/login", async (req, res) => {
  const loginRequestObject = req.body.json;
  try {
    const token = teachersController.signIn(
      loginRequestObject.username,
      loginRequestObject.password
    );

    sendJSON(res, 200, { token });
  } catch (error) {
    console.log(error);
    sendJSON(res, 401, { message: "invalid credentials provided" });
  }
});

app.addEndpoint(
  "POST",
  "/api/teachers",
  verifyUserExists,
  isAdmin,
  async (req, res) => {
    const newTeacherObj = req.body.json as unknown;
    try {
      const teacher = await teachersController.createTeacher(
        newTeacherObj as Teacher
      );
      sendJSON(res, 200, teacher);
    } catch (error) {
      sendJSON(res, 404, { message: error });
    }
  }
);

app.addEndpoint("GET", "/api/teachers", verifyUserExists, async (req, res) => {
  const teachers = await teachersController.getAllTeachers();
  sendJSON(res, 200, teachers);
});

app.addEndpoint(
  "DELETE",
  "/api/teachers/:id",
  verifyUserExists,
  isAdmin,
  async (req, res) => {
    try {
      const id = req.params.id;
      const message: string = await teachersController.deleteTeacher(id);
      sendJSON(res, 200, { message });
    } catch (error) {
      sendJSON(res, 404, { message: error });
    }
  }
);

app.addEndpoint(
  "PATCH",
  "/api/teachers/:id",
  verifyUserExists,
  hasTeacherPatchAccess,
  isOwnerTeacher,
  async (req, res) => {
    try {
      const id = req.params.id;
      const updatedTeacherObj = req.body.json as unknown;
      const updated_teacher = await teachersController.updateTeacher(
        id,
        updatedTeacherObj as Teacher
      );
      sendJSON(res, 200, updated_teacher);
    } catch (error) {
      sendJSON(res, 404, { message: error });
    }
  }
);

app.addEndpoint(
  "GET",
  "/api/teachers/:id",
  verifyUserExists,
  async (req, res) => {
    try {
      const id = req.params.id;
      const teacher = await teachersController.getTeacher(id);
      sendJSON(res, 200, teacher);
    } catch (error) {
      sendJSON(res, 404, { message: error });
    }
  }
);

app.addEndpoint(
  "GET",
  "/api/teachers/:id/appointments",
  verifyUserExists,
  async (req, res) => {
    const id = req.params.id;

    try {
      const appointments = await teachersController.getTeacherAppointments(id);
      sendJSON(res, 200, appointments);
    } catch (e) {
      res.writeHead(300);
      res.end();
    }
  }
);

app.addEndpoint(
  "POST",
  "/api/teachers/:id/appointments",
  verifyUserExists,
  hasAppointmentCreateAccess,
  async (req, res) => {
    const newAppointmentObj = req.body.json;
    const id = req.params.id;

    try {
      const appointment = await teachersController.queueTeacherAppointment(
        id,
        newAppointmentObj.student_id,
        newAppointmentObj.date,
        newAppointmentObj.time
      );
      sendJSON(res, 200, appointment);
    } catch (error) {
      sendJSON(res, 404, { message: error });
    }
  }
);

app.addEndpoint("POST", "/api/students/signup", async (req, res) => {
  const loginRequestObject = req.body.json;

  const response = await adminController.queueUserSignUpRequest(
    loginRequestObject.username,
    loginRequestObject.password,
    "student"
  );

  if (response) {
    sendJSON(res, 200, {
      message: "account requested. waiting for admin approval",
    });
  }
});

app.addEndpoint("POST", "/api/students/login", async (req, res) => {
  const loginRequestObject = req.body.json;
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
});

app.addEndpoint(
  "POST",
  "/api/students",
  verifyUserExists,
  isAdmin,
  async (req, res) => {
    const newStudentObj = req.body.json as unknown;
    try {
      const student = await studentsController.createStudent(
        newStudentObj as Student
      );
      sendJSON(res, 200, student);
    } catch (error) {
      sendJSON(res, 404, { message: error });
    }
  }
);

app.addEndpoint("GET", "/api/students", verifyUserExists, async (req, res) => {
  const students = await studentsController.getAllStudents();
  sendJSON(res, 200, students);
});

app.addEndpoint(
  "GET",
  "/api/students/:id",
  verifyUserExists,
  async (req, res) => {
    try {
      const id = req.params.id;
      const student = await studentsController.getStudent(id);
      sendJSON(res, 200, student);
    } catch (error) {
      sendJSON(res, 404, { message: error });
    }
  }
);

app.addEndpoint(
  "DELETE",
  "/api/students/:id",
  verifyUserExists,
  isAdmin,
  async (req, res) => {
    try {
      const id = req.params.id;
      const message: string = await studentsController.deleteStudent(id);
      sendJSON(res, 200, { message });
    } catch (error) {
      sendJSON(res, 404, { message: error });
    }
  }
);

app.addEndpoint(
  "PATCH",
  "/api/students/:id",
  verifyUserExists,
  hasStudentPatchAccess,
  isOwnerStudent,
  async (req, res) => {
    try {
      const id = req.params.id;
      const updatedStudentObj = req.body.json as unknown;
      const updated_student = await studentsController.updateStudent(
        id,
        updatedStudentObj as Student
      );
      sendJSON(res, 200, updated_student);
    } catch (error) {
      sendJSON(res, 404, { message: error });
    }
  }
);

app.addEndpoint("POST", "/api/admin/login", async (req, res) => {
  const loginRequestObject = req.body.json;
  try {
    const token = adminController.signIn(
      loginRequestObject.username,
      loginRequestObject.password
    );
    sendJSON(res, 200, { token });
  } catch (error) {
    sendJSON(res, 401, { message: "invalid credentials provided" });
  }
});

app.addEndpoint(
  "GET",
  "/api/admin/requests",
  verifyUserExists,
  isAdmin,
  async (req, res) => {
    try {
      const requests = await adminController.getUserSignUpRequests();
      sendJSON(res, 200, requests);
    } catch (e) {
      res.writeHead(300);
      res.end();
    }
  }
);

app.addEndpoint(
  "GET",
  "/api/admin/requests/:id/approve",
  verifyUserExists,
  isAdmin,
  async (req, res) => {
    try {
      const id = req.params.id;
      const requestObj = await adminController.getRequestByID(id);

      if (requestObj.type === "teacher") {
        try {
          const teacher = await teachersController.createTeacher({
            _id: requestObj._id,
            email: requestObj.username,
            password: requestObj.password,
          } as Teacher);
          sendJSON(res, 200, teacher);
        } catch (error) {
          sendJSON(res, 404, { message: error });
        }
      }

      if (requestObj.type === "student") {
        try {
          const teacher = await studentsController.createStudent({
            _id: requestObj._id,
            email: requestObj.username,
            password: requestObj.password,
          } as Student);
          sendJSON(res, 200, teacher);
        } catch (error) {
          sendJSON(res, 404, { message: error });
        }
      }

      try {
        adminController.deleteRequest(requestObj._id);
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      sendJSON(res, 404, {
        message: `request ${req.params.id} not found`,
      });
    }
  }
);

app.startServer(PORT);
