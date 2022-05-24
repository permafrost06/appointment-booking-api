import { IncomingAPIMessage } from "../SimpleAPI";
import { ServerResponse } from "http";

import { sendJSON } from "../utils";
import {
  adminController,
  appointmentsController,
  studentsController,
  teachersController,
} from "../app";

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
export const isAppointmentOwner = (
  req: IncomingAPIMessage,
  res: ServerResponse,
  next
) => {
  isOwnerTeacher(req, res, async () => {
    const appointment = await appointmentsController.getAppointment(
      req.params.app_id
    );

    if (req.params.id !== appointment.teacher_id) {
      sendJSON(res, 401, { message: "the user does not have permission" });
      return;
    } else {
      next();
    }
  });
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

export const verifyTeacherIDExists = async (
  req: IncomingAPIMessage,
  res: ServerResponse,
  next
) => {
  const id = req.params.id;

  try {
    await teachersController.getTeacher(id);
    next();
  } catch (error) {
    sendJSON(res, 404, { meassage: error });
  }
};

export const verifyStudentIDExists = async (
  req: IncomingAPIMessage,
  res: ServerResponse,
  next
) => {
  const id = req.params.id;

  try {
    await studentsController.getStudent(id);
    next();
  } catch (error) {
    sendJSON(res, 404, { meassage: error });
  }
};
