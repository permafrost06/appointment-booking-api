import { ServerResponse } from "http";

export const sendJSON = (
  res: ServerResponse,
  code: number,
  message: unknown
) => {
  res.writeHead(code, { "Content-Type": "application/json" });
  res.end(JSON.stringify(message));
};
