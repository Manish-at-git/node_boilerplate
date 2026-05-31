import swaggerJsdoc from "swagger-jsdoc";
import { authPaths } from "@/modules/v1/auth/auth.swagger";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "Node.js Boilerplate API",
            version: "1.0.0",
            description: "API Documentation",
        },

        servers: [
            {
                url: "http://localhost:8080",
                description: "Development Server",
            },
        ],

        paths: {
            ...authPaths,
        },

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                LoginRequest: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: {
                            type: "string",
                        },
                        password: {
                            type: "string",
                        },
                    },
                },
            },
        },
    },

    apis: ["./src/routes/**/*.ts", "./src/modules/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
