const API_BASE_URL = process.env.API_BASE_URL;
const TELEPHONY_SERVER_URL = process.env.TELEPHONY_SERVER_URL;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      /* ---------------------------- To be deprecated ---------------------------- */
      {
        source: "/api/main/:path*",
        destination: `${API_BASE_URL}/:path*`,
      },
      {
        source: "/api/leads/:path*",
        destination: `https://leads.ics-collection.com/:path*`,
      },
      {
        source: "/v1/admin/:path*",
        destination: "https://admindashboard.ics-collection.com/:path*",
      },
      {
        source: "/api/telephony/:path*",
        destination: `${TELEPHONY_SERVER_URL}/:path*`,
      },
      /* ------------------------------------ - ----------------------------------- */
      {
        source: "/api/ics/main/:path*",
        destination: `${process.env.ICS_MAIN_API_BASE_URL}/:path*`,
      },
      {
        source: "/api/arr/main/:path*",
        destination: `${process.env.ARR_MAIN_API_BASE_URL}/:path*`,
      },
      {
        source: "/v1/ics/admin/:path*",
        destination: `${process.env.ICS_ADMIN_API_BASE_URL}/:path*`,
      },
      {
        source: "/v1/arr/admin/:path*",
        destination: `${process.env.ARR_ADMIN_API_BASE_URL}/:path*`,
      },
      {
        source: "/v1/ics/payment-server/:path*",
        // destination: `https://dev-web-server.onrender.com/:path*`,
        destination: `https://telephony-server.onrender.com/:path*`,
      },
      {
        source: "/v1/arr/payment-server/:path*",
        // destination: `https://dev-web-server.onrender.com/:path*`,
        destination: "https://arr-telephony-web-server.onrender.com/:path*",
      },
      {
        source: "/:path*",
        destination:
          "https://communicationsapi-production.up.railway.app/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
