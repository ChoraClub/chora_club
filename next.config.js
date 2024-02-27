/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "l2beat.com",
      "s3.amazonaws.com",
      "raw.githubusercontent.com",
      "pbs.twimg.com",
      "cdn.stamp.fyi",
      "ltdfoto.ru",
      "cdn.discordapp.com",
      "i.ibb.co",
      "img.redbull.com",
      "www.google.com",
      "s3.hj",
    ],
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
