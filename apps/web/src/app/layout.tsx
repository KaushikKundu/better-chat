import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../index.css";
import Providers from "@/components/providers";
import { AuthProvider } from "./providers";
const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "mychat",
	description: "mychat",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" >
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<AuthProvider>
				<Providers>
					<div className="grid grid-rows-[auto_1fr] h-svh">
						{children}
					</div>
				</Providers>
				</AuthProvider>
			</body>
		</html>
	);
}
