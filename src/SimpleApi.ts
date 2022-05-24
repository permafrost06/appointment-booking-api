import { sendJSON } from "./utils";
import { createServer, Server, IncomingMessage, ServerResponse } from "http";

export class IncomingAPIMessage extends IncomingMessage {
  params: { [key: string]: string };
  body: {
    json: { [key: string]: string } | null;
    raw: string;
  };
}

interface RequestHandlerFunc {
  (req: IncomingAPIMessage, res: ServerResponse, next?: () => void): void;
}

interface RouteObject {
  regexp: RegExp;
  method: HTTPRequestMethods;
  functions: Array<RequestHandlerFunc>;
}

type HTTPRequestMethods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export class SimpleAPI {
  routeTable: Array<RouteObject> = [];

  server: Server;

  constructor() {
    this.server = createServer(
      async (req: IncomingAPIMessage, res: ServerResponse) => {
        this.#setCORSHeaders(res);

        if (req.method === "OPTIONS") {
          res.writeHead(200);
          res.end();
          return;
        }

        const route = this.routeTable.find(
          (route) => req.url.match(route.regexp) && req.method === route.method
        );

        if (route) {
          if (req.url.match(route.regexp).groups) {
            req.params = req.url.match(route.regexp).groups;
          }

          const body = await this.#getReqBody(req);

          if (body) {
            req.body = {
              raw: body,
              json: null,
            };

            try {
              req.body.json = JSON.parse(body);
            } catch (e) {
              req.body.json = null;
            }
          }
        } else {
          sendJSON(res, 404, { message: "route not found" });
        }

        // https://stackoverflow.com/a/60879046/14853035
        const callFuncChain = (req, res, func_list) => {
          if (func_list.length === 0) return;

          const current_func = func_list[0];

          current_func(req, res, () => {
            callFuncChain(req, res, func_list.slice(1));
          });
        };

        callFuncChain(req, res, route.functions);
      }
    );
  }

  #pathToRegex(path: string) {
    const param_regexp = new RegExp(":(\\w+)", "g");

    const replacer = (match, param_name) => {
      return `(?<${param_name}>\\w+)`;
    };

    if (path.match(param_regexp)) {
      path = path.replaceAll(param_regexp, replacer);
    }

    return new RegExp(path + "$");
  }

  #getReqBody(req): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        let body = "";
        // listen to data sent by client
        req.on("data", (chunk) => {
          // append the string version to the body
          body += chunk.toString();
        });
        // listen till the end
        req.on("end", () => {
          // send back the data
          resolve(body);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  addEndpoint(
    method: HTTPRequestMethods,
    path: string,
    ...functions: Array<RequestHandlerFunc>
  ) {
    this.routeTable.push({
      regexp: this.#pathToRegex(path),
      method,
      functions,
    });
  }

  #setCORSHeaders(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
  }

  startServer(port) {
    this.server.listen(port, () => {
      console.log(`server started on port: ${port}`);
    });
  }
}
