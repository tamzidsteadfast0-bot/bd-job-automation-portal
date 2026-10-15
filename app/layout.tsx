import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BD Job Automation Portal",
  description: "Bangladesh job discovery and CV matching dashboard"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
