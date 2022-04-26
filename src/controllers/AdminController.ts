import * as jwt from "jsonwebtoken";

export class AdminController {
  jwtSecretKey = process.env.JWT_SECRET_KEY;

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
}
