        if (req.method === "OPTIONS") {
          res.writeHead(200);
          res.end();
          return;
        }

        if (route) {
        } else {
          sendJSON(res, 404, { message: "route not found" });
        }
