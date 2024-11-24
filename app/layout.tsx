
"use client";

import "./globals.css";
import { AuthWrapper } from './context/authorizationold';
import NavBar from "./components/NavBar";
import { ApolloProvider } from '@apollo/client';
import client from './graphql/apolloClient';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ApolloProvider client={client}>
      <AuthWrapper>
        <html lang="en">
          <body
          // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <NavBar />
            {children}
          </body>
        </html>
      </AuthWrapper>
    </ApolloProvider>
  );
}
