/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // remotePatterns: [
    //   { hostname: "l2beat.com" },
    //   { hostname: "s3.amazonaws.com" },
    //   { hostname: "raw.githubusercontent.com" },
    //   { hostname: "pbs.twimg.com" },
    //   { hostname: "cdn.stamp.fyi" },
    //   { hostname: "ltdfoto.ru" },
    //   { hostname: "cdn.discordapp.com" },
    //   { hostname: "i.ibb.co" },
    //   { hostname: "img.redbull.com" },
    //   { hostname: "www.google.com" },
    //   { hostname: "s3.hj" },
    //   { hostname: "gateway.lighthouse.storage" },
    //   { hostname: "static.tally.xyz" },
    //   { hostname: "ugc.production.linktr.ee" },
    //   { hostname: "i.imgur.com" },
    // ],
    remotePatterns: [{ protocol: "https", hostname: "**", },],
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
