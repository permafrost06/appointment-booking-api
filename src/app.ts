import * as http from "http";
// import { Controller as Todo } from "./controller";
import { TeacherController } from "./controllers/TeachersController";
// import { Teacher } from "./models/Teacher.model";
import { getReqData } from "./utils";

const PORT = process.env.PORT || 5000;

const teachersController = new TeacherController();

const server = http.createServer(async (req, res) => {
  // /api/todos : GET
  if (req.url === "/api/teachers" && req.method === "GET") {
    // get the todos.
    const teachers = await teachersController.getAllTeachers();
    // set the status code, and content-type
    res.writeHead(200, { "Content-Type": "application/json" });
    // send the data
    res.end(JSON.stringify(teachers));
  }

  // /api/todos/:id : GET
  else if (
    req.url.match(/\/api\/teachers\/([0-9a-zA-Z]+)/) &&
    req.method === "GET"
  ) {
    try {
      // get id from url
      const id = req.url.split("/")[3];
      // get todo
      const teacher = await teachersController.getTeacher(id);
      // set the status code and content-type
      res.writeHead(200, { "Content-Type": "application/json" });
      // send the data
      res.end(JSON.stringify(teacher));
    } catch (error) {
      // set the status code and content-type
      res.writeHead(404, { "Content-Type": "application/json" });
      // send the error
      res.end(JSON.stringify({ message: error }));
    }
  }

  // /api/todos/:id : DELETE
  else if (
    req.url.match(/\/api\/teachers\/([0-9a-zA-Z]+)/) &&
    req.method === "DELETE"
  ) {
    try {
      // get the id from url
      const id = req.url.split("/")[3];
      // delete todo
      const message: string = teachersController.deleteTeacher(id);
      // set the status code and content-type
      res.writeHead(200, { "Content-Type": "application/json" });
      // send the message
      res.end(JSON.stringify({ message }));
    } catch (error) {
      // set the status code and content-type
      res.writeHead(404, { "Content-Type": "application/json" });
      // send the error
      res.end(JSON.stringify({ message: error }));
    }
  }

  // /api/todos/:id : UPDATE
  else if (
    req.url.match(/\/api\/teachers\/([0-9a-zA-Z]+)/) &&
    req.method === "PATCH"
  ) {
    try {
      // get the id from the url
      const id = req.url.split("/")[3];
      // update todo
      // get teacher data
      const updatedTeacherObj: string = (await getReqData(req)) as string;
      const updated_teacher = await teachersController.updateTeacher(
        id,
        JSON.parse(updatedTeacherObj)
      );
      // set the status code and content-type
      res.writeHead(200, { "Content-Type": "application/json" });
      // send the message
      res.end(JSON.stringify(updated_teacher));
    } catch (error) {
      // set the status code and content type
      res.writeHead(404, { "Content-Type": "application/json" });
      // send the error
      res.end(JSON.stringify({ message: error }));
    }
  }

  // /api/todos/ : POST
  else if (req.url === "/api/teachers" && req.method === "POST") {
    // get the data sent along
    const newTeacherObj: string = (await getReqData(req)) as string;
    // create the todo
    const teacher = await teachersController.createTeacher(
      JSON.parse(newTeacherObj)
    );
    // set the status code and content-type
    res.writeHead(200, { "Content-Type": "application/json" });
    //send the todo
    res.end(JSON.stringify(teacher));
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
