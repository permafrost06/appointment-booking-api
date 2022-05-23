import { IncomingAPIMessage } from "../SimpleAPI";
import { ServerResponse } from "http";

import { AdminController } from "../controllers/AdminController";
import { StudentController } from "../controllers/StudentsController";
import { TeacherController } from "../controllers/TeachersController";
import { sendJSON } from "../utils";

const teachersController = new TeacherController();
const studentsController = new StudentController();
const adminController = new AdminController();

export const verifyUserExists = (
  req: IncomingAPIMessage,
  res: ServerResponse,
  next
) => {
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
    sendJSON(res, 401, { message: "the user does not have permission" });
    return;
  } else {
    next();
  }
};

export const isAdmin = (req: IncomingAPIMessage, res: ServerResponse, next) => {
  if (!adminController.isAdmin(req.headers.authorization)) {
    sendJSON(res, 401, { message: "the user does not have permission" });
    return;
  } else {
    next();
  }
};

export const hasTeacherPatchAccess = (
  req: IncomingAPIMessage,
  res: ServerResponse,
  next
) => {
  const authHeader = req.headers.authorization;

  if (
    !(
      adminController.isAdmin(authHeader) ||
      teachersController.isTeacher(authHeader)
    )
  ) {
    sendJSON(res, 401, { message: "the user does not have permission" });
    return;
  } else {
    next();
  }
};

export const hasStudentPatchAccess = (
  req: IncomingAPIMessage,
  res: ServerResponse,
  next
) => {
  const authHeader = req.headers.authorization;

  if (
    !(
      adminController.isAdmin(authHeader) ||
      studentsController.isStudent(authHeader)
    )
  ) {
    sendJSON(res, 401, { message: "the user does not have permission" });
    return;
  } else {
    next();
  }
};

export const hasAppointmentCreateAccess = (
  req: IncomingAPIMessage,
  res: ServerResponse,
  next
) => {
  const authHeader = req.headers.authorization;

  if (teachersController.isTeacher(authHeader)) {
    sendJSON(res, 401, { message: "the user does not have permission" });
    return;
  } else {
    next();
  }
};

export const isOwnerTeacher = (
  req: IncomingAPIMessage,
  res: ServerResponse,
  next
) => {
  const authHeader = req.headers.authorization;

  if (teachersController.isTeacher(authHeader)) {
    const requestUserID = teachersController.getTeacherIDFromToken(authHeader);

    if (req.params.id !== requestUserID) {
      sendJSON(res, 401, { message: "the user does not have permission" });
      return;
    } else {
      next();
    }
  } else {
    sendJSON(res, 401, { message: "the user does not have permission" });
  }
};

export const isOwnerStudent = (
  req: IncomingAPIMessage,
  res: ServerResponse,
  next
) => {
  const authHeader = req.headers.authorization;

  if (studentsController.isStudent(authHeader)) {
    const requestUserID = studentsController.getStudentIDFromToken(authHeader);

    if (req.params.id !== requestUserID) {
      sendJSON(res, 401, { message: "the user does not have permission" });
      return;
    } else {
      next();
    }
  } else {
    sendJSON(res, 401, { message: "the user does not have permission" });
  }
};
