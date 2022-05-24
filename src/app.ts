import { SimpleAPI } from "./SimpleAPI";
import { AdminController } from "./controllers/AdminController";
import { StudentController } from "./controllers/StudentsController";
import { TeacherController } from "./controllers/TeachersController";
import { AppointmentsController } from "./controllers/AppointmentsController";
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
  verifyTeacherIDExists,
  verifyStudentIDExists,
  isAppointmentOwner,
} from "./middleware";

export const teachersController = new TeacherController();
export const studentsController = new StudentController();
export const adminController = new AdminController();
export const appointmentsController = new AppointmentsController();

const PORT = process.env.PORT || 5000;

export const app = new SimpleAPI();

app.addEndpoint("POST", "/api/signup/teacher", async (req, res) => {
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

app.addEndpoint("POST", "/api/login/teacher", async (req, res) => {
  const loginRequestObject = req.body.json;
  try {
    const returnObj = teachersController.signIn(
      loginRequestObject.username,
      loginRequestObject.password
    );

    sendJSON(res, 200, returnObj);
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
  verifyTeacherIDExists,
  async (req, res) => {
    const id = req.params.id;

    try {
      const appointments =
        await appointmentsController.getTeacherApprovedAppointments(id);
      sendJSON(res, 200, appointments);
    } catch (e) {
      res.writeHead(300);
      res.end();
    }
  }
);

app.addEndpoint(
  "GET",
  "/api/teachers/:id/appointments/all",
  verifyUserExists,
  verifyTeacherIDExists,
  async (req, res) => {
    const id = req.params.id;

    try {
      const appointments = await appointmentsController.getTeacherAppointments(
        id
      );
      sendJSON(res, 200, appointments);
    } catch (e) {
      res.writeHead(300);
      res.end();
    }
  }
);

app.addEndpoint(
  "GET",
  "/api/teachers/:id/appointments/pending",
  verifyUserExists,
  verifyTeacherIDExists,
  async (req, res) => {
    const id = req.params.id;

    try {
      const appointments =
        await appointmentsController.getTeacherPendingAppointments(id);
      sendJSON(res, 200, appointments);
    } catch (e) {
      res.writeHead(300);
      res.end();
    }
  }
);

app.addEndpoint(
  "GET",
  "/api/teachers/:id/appointments/:app_id/approve",
  verifyUserExists,
  isAppointmentOwner,
  async (req, res) => {
    const id = req.params.app_id;

    try {
      const appointment = await appointmentsController.approveAppointment(id);
      sendJSON(res, 200, appointment);
    } catch (e) {
      res.writeHead(300);
      res.end();
    }
  }
);

app.addEndpoint(
  "GET",
  "/api/teachers/:id/appointments/:app_id/reject",
  verifyUserExists,
  isAppointmentOwner,
  async (req, res) => {
    const id = req.params.app_id;

    try {
      const message: string = await appointmentsController.rejectAppointment(
        id
      );
      sendJSON(res, 200, message);
    } catch (error) {
      sendJSON(res, 404, { message: error });
    }
  }
);

app.addEndpoint(
  "POST",
  "/api/teachers/:id/appointments",
  verifyUserExists,
  verifyTeacherIDExists,
  hasAppointmentCreateAccess,
  async (req, res) => {
    const newAppointmentObj = req.body.json;
    const id = req.params.id;

    try {
      const appointment = await appointmentsController.queueAppointment(
        id,
        newAppointmentObj.student_id,
        newAppointmentObj.date,
        newAppointmentObj.time,
        newAppointmentObj.agenda
      );
      sendJSON(res, 200, appointment);
    } catch (error) {
      sendJSON(res, 404, { message: error });
    }
  }
);

app.addEndpoint("POST", "/api/signup/student", async (req, res) => {
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

app.addEndpoint("POST", "/api/login/student", async (req, res) => {
  const loginRequestObject = req.body.json;

  try {
    const returnObj = studentsController.signIn(
      loginRequestObject.username,
      loginRequestObject.password
    );
    sendJSON(res, 200, returnObj);
  } catch (error) {
    console.log(error);
    sendJSON(res, 401, { message: "invalid credentials provided" });
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

app.addEndpoint(
  "GET",
  "/api/students/:id/appointments",
  verifyUserExists,
  verifyStudentIDExists,
  async (req, res) => {
    const id = req.params.id;

    try {
      const appointments = await appointmentsController.getStudentAppointments(
        id
      );
      sendJSON(res, 200, appointments);
    } catch (e) {
      res.writeHead(300);
      res.end();
    }
  }
);

app.addEndpoint("POST", "/api/login/admin", async (req, res) => {
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

app.addEndpoint(
  "GET",
  "/api/admin/appointments",
  verifyUserExists,
  isAdmin,
  async (req, res) => {
    const appointments = appointmentsController.getAllAppointments();
    sendJSON(res, 200, appointments);
  }
);

app.startServer(PORT);
