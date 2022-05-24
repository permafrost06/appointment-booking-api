import { Appointment } from "../models/Appointment.model";

import { teachersController } from "../app";

import PouchDB from "pouchdb";

const AppointmentsDB = new PouchDB("db/appointments.db");

export class AppointmentsController {
  allAppointments: Appointment[] = [];

  constructor() {
    this.getFromDB();
  }

  async getFromDB() {
    try {
      const query = await AppointmentsDB.allDocs({ include_docs: true });
      const docs = query.rows.map(({ doc }) => doc as Appointment);
      this.allAppointments = docs;
    } catch (e) {
      console.error(e);
    }
  }

  async getAllAppointments() {
    return this.allAppointments;
  }

  getAppointment(id: string): Appointment {
    const appointment = this.allAppointments.find(
      (appointment) => appointment._id === id
    );
    if (appointment) {
      return appointment;
    } else {
      throw `Appointment with id ${id} not found `;
    }
  }

  getTeacherAppointments(id: string): Appointment[] {
    return this.allAppointments.filter(
      (appointment) => appointment.teacher_id == id
    );
  }

  getTeacherPendingAppointments(id: string): Appointment[] {
    return this.getTeacherAppointments(id).filter(
      (appointment) => !appointment.approved
    );
  }

  getTeacherApprovedAppointments(id: string): Appointment[] {
    return this.getTeacherAppointments(id).filter(
      (appointment) => appointment.approved
    );
  }

  getStudentAppointments(id: string): Appointment[] {
    return this.allAppointments.filter(
      (appointment) => appointment.student_id == id
    );
  }

  async queueAppointment(
    teacher_id: string,
    student_id: string,
    date: string,
    time: string,
    agenda: string
  ) {
    const teacher = await teachersController.getTeacher(teacher_id);

    if (teacher.hours) {
      if (Number(time) / 100 - 9 <= teacher.hours - 1) {
        const appointmentObj: Appointment = {
          _id: Math.random().toString(36).slice(2),
          teacher_id,
          student_id,
          date,
          time,
          agenda,
          approved: false,
          _rev: "",
        };

        try {
          const response = await AppointmentsDB.put(appointmentObj);

          this.getFromDB();

          appointmentObj._rev = response.rev;
          return appointmentObj;
        } catch (e) {
          throw `AppointmentsController Error: Couldn't create appointment - ${e.message}`;
        }
      } else {
        throw `Teacher not available at ${time}`;
      }
    } else {
      throw `AppointmentsController Error: Teacher ${teacher_id} does not have their hours set`;
    }
  }

  async approveAppointment(id: string): Promise<Appointment> {
    let appointment: Appointment;

    try {
      appointment = this.getAppointment(id);
    } catch (e) {
      throw `Couldn't find teacher with ${id}`;
    }

    appointment.approved = true;

    try {
      const response = await AppointmentsDB.put(appointment);

      this.getFromDB();

      appointment._rev = response.rev;
      return appointment;
    } catch (e) {
      throw `Couldn't approve appointment - ${e.message}`;
    }
  }

  async rejectAppointment(id: string): Promise<string> {
    try {
      const appointmentToDelete = await this.getAppointment(id);
      try {
        AppointmentsDB.remove(appointmentToDelete);
        this.getFromDB();
      } catch (error) {
        throw `Couldn't remove appointment ${error}`;
      }
    } catch (e) {
      throw `Couldn't find appointment with ${id}`;
    }

    return `Appointment ${id} deleted successfully`;
  }

  async deleteAppointment(id: string): Promise<string> {
    try {
      const appointmentToDelete = await this.getAppointment(id);
      try {
        AppointmentsDB.remove(appointmentToDelete);
        this.getFromDB();
      } catch (error) {
        throw `Couldn't remove Appointment ${error}`;
      }
    } catch (e) {
      throw `Couldn't find Appointment with ${id}`;
    }

    return `Appointment ${id} deleted successfully`;
  }
}
