| function                    | method | route                           | protected | permission-level | example                              | req body |
| --------------------------- | ------ | ------------------------------- | --------- | ---------------- | ------------------------------------ | -------- |
| teacher signup/request      | POST   | /api/teachers/signup            |           |                  | /api/teachers/signup                 | **\***   |
| teacher login               | POST   | /api/teachers/login             |           |                  | /api/teachers/login                  | **\***   |
| create teacher              | POST   | /api/teachers                   | **\***    | admin            | /api/teachers                        | **\***   |
| get teacher list            | GET    | /api/teachers                   | **\***    | logged in        | /api/teachers                        |          |
| delete teacher              | DELETE | /api/teachers/:id               | **\***    | admin            | /api/teachers/khoe0u9o               |          |
| modify teacher              | PATCH  | /api/teachers/:id               | **\***    | admin, owner     | /api/teachers/khoe0u9o               | **\***   |
| get teacher with id         | GET    | /api/teachers/:id               | **\***    | logged in        | /api/teachers/khoe0u9o               |          |
| get appointments of teacher | GET    | /api/teachers/:id/appointments  | **\***    | logged in        | /api/teachers/khoe0u9o/appointments  |          |
| set appointment request     | POST   | /api/teachers/:id/appointments  | **\***    | admin, student   | /api/teachers/khoe0u9o/appointments  | **\***   |
| student signup/request      | POST   | /api/students/signup            |           |                  | /api/students/signup                 | **\***   |
| student login               | POST   | /api/students/login             |           |                  | /api/students/login                  | **\***   |
| create student              | POST   | /api/students                   | **\***    | admin            | /api/students                        | **\***   |
| get students                | GET    | /api/students                   | **\***    | logged in        | /api/students                        |          |
| get student with id         | GET    | /api/students/:id               | **\***    | logged in        | /api/students/khoe0u9o               |          |
| delete student              | DELETE | /api/students/:id               | **\***    | admin            | /api/students/khoe0u9o               | **\***   |
| update student              | PATCH  | /api/students/:id               | **\***    | admin, owner     | /api/students/khoe0u9o               | **\***   |
| admin login                 | POST   | /api/admin/login                |           |                  | /api/admin/login                     | **\***   |
| get queued requests         | GET    | /api/admin/requests             | **\***    | admin            | /api/admin/requests                  |          |
| approve request             | GET    | /api/admin/requests/:id/approve | **\***    | admin            | /api/admin/requests/khoe0u9o/approve |          |
| reject request              | GET    | /api/admin/requests/:id/reject  | **\***    | admin            | /api/admin/requests/khoe0u9o/reject  |          |

```
addEndpoint("/api/teachers/signup")
addEndpoint("/api/teachers/login")
addEndpoint("/api/teachers")
addEndpoint("/api/teachers/:id")
addEndpoint("/api/teachers/:id/appointments")
addEndpoint("/api/students/signup")
addEndpoint("/api/students/login")
addEndpoint("/api/students")
addEndpoint("/api/students/:id")
addEndpoint("/api/admin/login")
addEndpoint("/api/admin/requests")

const test_routes = ["/api/teachers/signup", "/api/teachers/login", "/api/teachers", "/api/teachers/khoe0u9o",
                      "/api/teachers/khoe0u9o/appointments", "/api/students/signup", "/api/students/login",
                      "/api/students", "/api/students/khoe0u9o", "/api/admin/login", "/api/admin/requests"]

\/api\/teachers\/signup
\/api\/teachers\/login
\/api\/teachers
\/api\/teachers\/(?<id>\w+)
\/api\/teachers\/(?<id>\w+)\/appointments
\/api\/students\/signup
\/api\/students\/login
\/api\/students
\/api\/students\/(?<id>\w+)
\/api\/admin\/login
\/api\/admin\/requests
```

```
app.addEndpoint("POST", "/api/teachers/signup")
app.addEndpoint("POST", "/api/teachers/login")
app.addEndpoint("POST", "/api/teachers")
app.addEndpoint("GET", "/api/teachers")
app.addEndpoint("DELETE", "/api/teachers/:id")
app.addEndpoint("PATCH", "/api/teachers/:id")
app.addEndpoint("GET", "/api/teachers/:id")
app.addEndpoint("GET", "/api/teachers/:id/appointments")
app.addEndpoint("POST", "/api/teachers/:id/appointments")
app.addEndpoint("POST", "/api/students/signup")
app.addEndpoint("POST", "/api/students/login")
app.addEndpoint("POST", "/api/students")
app.addEndpoint("GET", "/api/students")
app.addEndpoint("GET", "/api/students/:id")
app.addEndpoint("DELETE", "/api/students/:id")
app.addEndpoint("PATCH", "/api/students/:id")
app.addEndpoint("POST", "/api/admin/login")
app.addEndpoint("GET", "/api/admin/requests")
app.addEndpoint
```
