export const DB_NAME =
  process.env.NODE_ENV == "development" ? "chora-club-dev" : "chora-club-dev";

export const BASE_URL =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3000"
    : "https://chora-club-dev.vercel.app/";



export const IMAGE_URL = "https://gateway.lighthouse.storage/ipfs/QmZRLHd4CwA8btpa2WhbDHju46rnKbYGUFyzojAFXkhbt1"
