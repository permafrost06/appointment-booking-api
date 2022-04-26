import * as jwt from "jsonwebtoken";
import PouchDB from "pouchdb";

const requestsDB = new PouchDB("db/requests.db");

export class AdminController {
  jwtSecretKey = "insecure_secret_key";

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
        email: username,
        password: password,
        type: type,
      });

      return true;
    } catch (e) {
      return false;
    }
  }

  async getUserSignUpRequests() {
    try {
      const query = await requestsDB.allDocs({ include_docs: true });
      const docs = query.rows.map(({ doc }) => doc);
      return docs;
    } catch (e) {
      throw `cannot get data - ${e}`;
    }
  }
}
