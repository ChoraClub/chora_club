import type { Metadata } from "next";

export const DEFAULT_METADATA: Metadata = {
  metadataBase: new URL("https://app.chora.club/"),
  title: "Chora Club",
  description: "The requested page does not exist.",
  openGraph: {
    title: "Chora Club - Page Not Found",
    description: "The requested page does not exist.",
    url: "https://app.chora.club/",
    siteName: "Chora Club",
    images: [
      {
        url: "https://gateway.lighthouse.storage/ipfs/bafybeiez3e5gvqra2r3ijbg2arrdhaalzoqqzgr5s4tc2tlysyuywnzude", // Default or error image
        width: 800,
        height: 600,
        alt: "img",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};
