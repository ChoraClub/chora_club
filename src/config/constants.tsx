export const DB_NAME =
  process.env.NODE_ENV == "development"
    ? process.env.DEV_DB
    : process.env.PROD_DB;

export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_LOCAL_BASE_URL
    : process.env.NEXT_PUBLIC_HOSTED_BASE_URL;

export const SCHEMA_ID =
  process.env.NODE_ENV == "development"
    ? "0xbaeab565ea1cf3cd3808b75fef04b811606b2c0d6f57a39c6abb60ee642fdcc0"
    : "0xf9e214a80b66125cad64453abe4cef5263be3a7f01760d0cc72789236fca2b5d";

export const OFFCHAIN_OP_ATTESTATION_BASE_URL =
  process.env.NODE_ENV == "development"
    ? "https://optimism-sepolia.easscan.org"
    : "https://optimism.easscan.org";

export const OFFCHAIN_ARB_ATTESTATION_BASE_URL =
  process.env.NODE_ENV == "development"
    ? "https://optimism-sepolia.easscan.org"
    : "https://arbitrum.easscan.org";

export const ATTESTATION_OP_URL =
  process.env.NODE_ENV == "development"
    ? process.env.NEXT_PUBLIC_SEPOLIA_ATTESTATION_URL
    : process.env.NEXT_PUBLIC_OP_ATTESTATION_URL;

export const ATTESTATION_ARB_URL =
  process.env.NODE_ENV == "development"
    ? process.env.NEXT_PUBLIC_SEPOLIA_ATTESTATION_URL
    : process.env.NEXT_PUBLIC_ARB_ATTESTATION_URL;

export const opBlock = [
  {
    title: "Forum",
    link: "https://gov.optimism.io/",
  },
  {
    title: "Website",
    link: "https://optimism.io/",
  },
  {
    title: "Block Explorer",
    link: "https://optimistic.etherscan.io/",
  },
  {
    title: "Optimism Twitter Profile",
    link: "https://twitter.com/Optimism",
  },
  {
    title: "Optimism DAO Twitter Profile",
    link: "https://twitter.com/OptimismGov",
  },
];

export const arbBlock = [
  {
    title: "Forum",
    link: "https://forum.arbitrum.foundation",
  },
  {
    title: "Website",
    link: "https://arbitrum.io",
  },
  {
    title: "Arbitrum Foundation Website",
    link: "https://arbitrum.foundation",
  },
  {
    title: "Block Explorer",
    link: "https://arbiscan.io",
  },
  {
    title: "Arbitrum Twitter Profile",
    link: "https://twitter.com/arbitrum",
  },
  {
    title: "Arbitrum DAO Twitter Profile",
    link: "https://twitter.com/DAO_Arbitrum",
  },
];

export const IMAGE_URL =
  "https://gateway.lighthouse.storage/ipfs/QmZRLHd4CwA8btpa2WhbDHju46rnKbYGUFyzojAFXkhbt1";

// For development testing
//   export const DB_NAME =
//   process.env.NODE_ENV == "development"
//     ? process.env.DEV_DB
//     : process.env.PROD_DB;

// export const BASE_URL =
//   process.env.NODE_ENV === "development"
//     ? process.env.NEXT_PUBLIC_LOCAL_BASE_URL
//     : process.env.NEXT_PUBLIC_HOSTED_BASE_URL;
// // "https://c470-2405-204-800d-888b-11b2-94d6-5f66-9199.ngrok-free.app" ||
// // "http://localhost:3000";

// export const SCHEMA_ID =
//   process.env.NODE_ENV == "development"
//     ? "0xf9e214a80b66125cad64453abe4cef5263be3a7f01760d0cc72789236fca2b5d"
//     : "0xf9e214a80b66125cad64453abe4cef5263be3a7f01760d0cc72789236fca2b5d";

// export const OFFCHAIN_OP_ATTESTATION_BASE_URL =
//   process.env.NODE_ENV == "development"
//     ? "https://optimism.easscan.org"
//     : "https://optimism.easscan.org";

// export const OFFCHAIN_ARB_ATTESTATION_BASE_URL =
//   process.env.NODE_ENV == "development"
//     ? "https://arbitrum.easscan.org"
//     : "https://arbitrum.easscan.org";

// export const ATTESTATION_OP_URL =
//   process.env.NODE_ENV == "development"
//     ? process.env.NEXT_PUBLIC_OP_ATTESTATION_URL
//     : process.env.NEXT_PUBLIC_OP_ATTESTATION_URL;

// export const ATTESTATION_ARB_URL =
//   process.env.NODE_ENV == "development"
//     ? process.env.NEXT_PUBLIC_SEPOLIA_ATTESTATION_URL
//     : process.env.NEXT_PUBLIC_ARB_ATTESTATION_URL;
