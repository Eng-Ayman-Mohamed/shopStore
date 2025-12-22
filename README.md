# ShopStore

Simple full-stack demo application with a Node/Express backend and a React frontend.

## Overview

- Backend: `shopStore-backend` — Express API using MongoDB (Mongoose).
- Frontend: `ShopStore-frontend` — React app (Create React App / react-scripts).

## Prerequisites

- Node.js (v16+ recommended)
- npm
- MongoDB (remote or local) and connection string set in `shopStore-backend/config.env`

## Backend — Quick start

1. Open a terminal and change to the backend folder:

   ```bash
   cd shopStore-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Provide environment variables. Edit or create `config.env` in `shopStore-backend` with the necessary MongoDB URI and other settings.

4. Start the server:

   ```bash
   npm start    # uses nodemon if available
   # OR
   node server.js
   ```

The backend `start` script uses `nodemon server.js` (nodemon may need to be installed globally).

## Frontend — Quick start

1. Change to the frontend folder:

   ```bash
   cd ShopStore-frontend
   ```

2. Install dependencies and start:

   ```bash
   npm install
   npm start
   ```

The frontend runs on the typical CRA dev server (usually http://localhost:3000).

## Project Structure

- `shopStore-backend/` — backend API, controllers, models, routers
- `ShopStore-frontend/` — React UI, components, pages, services

## Notes

- Ensure your backend `config.env` has the correct MongoDB connection string before starting the server.
- If `npm start` on the backend fails because `nodemon` is not found, either install it globally with `npm i -g nodemon` or run `node server.js` directly.

## Cloudinary & Environment Variables

- This project uses Cloudinary for image upload/storage. The backend reads Cloudinary credentials from the environment (see the example below).

- A demo backend env file has been added at `shopStore-backend/config.env.example`. Copy it to `shopStore-backend/config.env` and fill in real values.

   Example `shopStore-backend/config.env` entries (from `config.env.example`):

   ```
   DATABASE=your_mongodb_connection_string_here
   ```

- Frontend (React) environment variables should be placed in a `.env` file inside `ShopStore-frontend` (e.g. `.env.local`). Example frontend variables to include:

   ```
   REACT_APP_API_BASE=http://localhost:8000/api
   REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_preset_name
   ```

These `REACT_APP_` variables are readable by the React app during build/start and are required for the frontend to know where the API and Cloudinary upload preset live.

