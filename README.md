# appointment-booking-api
A nodejs backend for managing appointments between teachers and students. This was a demonstration project.
I had to implement this without using a backend framework.
I ended up creating a custom framework that sort of works like express.

## Features
1. Login via JWT.
1. Admin account with full access.
1. Request for account, admin accepts/rejects request.
1. Teacher and student profile - can be modified.
1. Logged in user can see all teachers and their appointments.
1. Students can request appointment, teacher accepts/rejects request.

## API Features
1. Add endpoints.
    1. Specific HTTP method.
    1. Add route.
    1. Add chaining middleware(s).
    1. Add callback.
1. Named request route parameters.
1. Get request JSON data.
1. Send JSON response with code.
1. Handles CORS.

## Instructions
Run `npm run start` to run project.

Run `npm run dev` to run project and listen to live changes.
