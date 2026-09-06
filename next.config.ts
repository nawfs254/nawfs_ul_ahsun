import type { NextConfig } from "next";
import os from "os";

function getLocalIpAddresses(): string[] {
  const interfaces = os.networkInterfaces();
  const addresses: string[] = [];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        addresses.push(net.address);
      }
    }
  }
  return addresses;
}

const localIps = getLocalIpAddresses();

const nextConfig: NextConfig = {
  // Allow dev server access from local network IPs (e.g. mobile testing, LAN IP)
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "10.94.82.138",
    ...localIps,
    "10.*.*.*",
    "192.168.*.*",
    "172.*.*.*",
  ],
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "/api/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
