export const DB_NAME =
  process.env.NODE_ENV == "development" ? "chora-club-dev" : "chora-club-dev";

export const BASE_URL =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3000"
    : "https://chora-club-dev.vercel.app/";
