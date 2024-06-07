export const DB_NAME =
  process.env.NODE_ENV == "development" ? "chora-club" : "chora-club";

export const BASE_URL =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3000"
    : "https://app.chora.club/";
