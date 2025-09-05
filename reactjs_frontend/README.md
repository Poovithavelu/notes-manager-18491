# Notes Frontend (React)

A minimalistic React UI for a JWT-secured Notes API. Implements:
- User signup, login/logout
- List, add, edit, delete notes
- JWT persistence in localStorage
- Helpful error feedback
- Light theme and brand colors (primary: #1976d2, accent: #ffca28, secondary: #424242)

## Configure
Create a `.env` file if necessary:
```
REACT_APP_API_BASE_URL=http://localhost:3001
```
See `.env.example`.

Backend endpoints expected:
- POST /register
- POST /login  -> returns JSON with an access token (access_token | token | jwt)
- GET /notes
- POST /notes
- PUT /notes/{id}
- DELETE /notes/{id}

## Run
- npm install
- npm start
Open http://localhost:3000

## Build
- npm run build

## Notes
- JWT is stored in localStorage under `notes_jwt_token`.
- You can change the backend URL via REACT_APP_API_BASE_URL without code changes.
