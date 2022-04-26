import * as jwt from "jsonwebtoken";
import PouchDB from "pouchdb";

const requestsDB = new PouchDB("db/requests.db");

interface Request {
  _id: string;
  username: string;
  password: string;
  type: string;
  _rev: string;
}

export class AdminController {
  allRequests: Request[] = [];

  jwtSecretKey = "insecure_secret_key";

  constructor() {
    this.getFromDB();
  }

  async getFromDB() {
    try {
      const query = await requestsDB.allDocs({ include_docs: true });
      const docs = query.rows.map(({ doc }) => doc as Request);
      this.allRequests = docs;
    } catch (e) {
      console.error(e);
    }
  }

  signIn(username: string, password: string): string {
    if (username === "admin" && password === "password") {
      const data = {
        userLevel: "admin",
      };

      return jwt.sign(data, this.jwtSecretKey);
    } else throw `invalid credentials`;
  }

  isAdmin(token: string): boolean {
    try {
      interface Dec {
        userLevel: string;
        iat: number;
      }

      const decoded = jwt.verify(token.split(" ")[1], this.jwtSecretKey) as Dec;

      if (decoded.userLevel === "admin") return true;
    } catch (e) {
      console.log(e);
      return false;
    }
    return false;
  }

  async queueUserSignUpRequest(
    username: string,
    password: string,
    type: "teacher" | "student"
  ): Promise<boolean> {
    try {
      await requestsDB.put({
        _id: Math.random().toString(36).slice(2),
        username: username,
        password: password,
        type: type,
      });

      this.getFromDB();

      return true;
    } catch (e) {
      return false;
    }
  }

  async getUserSignUpRequests() {
    return this.allRequests;
  }

  async getRequestByID(id: string) {
    const matchRequestArray = this.allRequests.filter(
      (request) => request._id == id
    );

    if (matchRequestArray.length) {
      return matchRequestArray[0];
    } else throw `request not found`;
  }

  async deleteRequest(id: string): Promise<boolean> {
    try {
      const requestToDelete = await this.getRequestByID(id);
      try {
        requestsDB.remove(requestToDelete);
        this.getFromDB();
        return true;
      } catch (error) {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
}
