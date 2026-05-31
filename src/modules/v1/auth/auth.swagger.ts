export const authPaths = {
    "/api/v1/auth/register": {
        post: {
            tags: ["Auth"],
            summary: "Register user",
            description: "Creates a new user account",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                name: {
                                    type: "string",
                                    example: "John Doe",
                                },
                                email: {
                                    type: "string",
                                    example: "john@example.com",
                                },
                                password: {
                                    type: "string",
                                    example: "Password@123",
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: "User registered successfully",
                },
            },
        },
    },

    "/api/v1/auth/login": {
        post: {
            tags: ["Auth"],
            summary: "Login user",
            description: "Authenticate user",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                email: {
                                    type: "string",
                                    example: "john@example.com",
                                },
                                password: {
                                    type: "string",
                                    example: "Password@123",
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: "Login successful",
                },
            },
        },
    },
};
