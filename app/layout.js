'use client';

import "./globals.css";
import { ThemeProvider } from "@material-tailwind/react";

export default Layout = ({ children }) => <html><body className="flex min-h-screen flex-col items-center justify-between p-24"><ThemeProvider>{children}</ThemeProvider></body></html>
Layout.displayName = 'Layout';