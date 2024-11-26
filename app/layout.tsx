
"use client";

import "./globals.css";
import { AuthWrapper } from './context/authorization';
import { AuthWrapperOld } from './context/authorizationOld';
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
      <AuthWrapperOld>
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
      </AuthWrapperOld>
    </ApolloProvider>
  );
}
