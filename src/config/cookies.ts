// src/config/cookies.ts

import env from "./env";

export const cookieConfig = {
    accessToken: {
        httpOnly: true,
        secure: env.isProduction,
        sameSite: "lax" as const,
        maxAge: 30 * 60 * 1000, // 30 min
        path: "/",
    },

    refreshToken: {
        httpOnly: true,
        secure: env.isProduction,
        sameSite: "lax" as const,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        path: "/",
    },
};