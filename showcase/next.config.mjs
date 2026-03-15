import webpack from 'webpack';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^(mongodb|mysql|mysql2|pg|mssql|sqlite3|redis|typeorm)$/,
        })
      );
    }
    return config;
  },
  serverExternalPackages: [
    "mongodb",
    "mysql",
    "mysql2",
    "pg",
    "mssql",
    "sqlite3",
    "redis",
    "typeorm"
  ]
};

export default nextConfig;
