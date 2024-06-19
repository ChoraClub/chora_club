export const DB_NAME =
  process.env.NODE_ENV == "development"
    ? process.env.DEV_DB
    : process.env.PROD_DB;

export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_LOCAL_BASE_URL
    : process.env.NEXT_PUBLIC_HOSTED_BASE_URL;

export const IMAGE_URL =
  "https://gateway.lighthouse.storage/ipfs/QmZRLHd4CwA8btpa2WhbDHju46rnKbYGUFyzojAFXkhbt1";
