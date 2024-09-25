"use client";
//
// allows session state (loggedin/out) to be accessed from any component as context throughout the app
import { SessionProvider } from "next-auth/react";
// re-export as a client component
export default SessionProvider;
