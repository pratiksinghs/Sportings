
/*
=========================================================
 SPORTING - BACKEND SERVER
 File: backend/server.js
=========================================================
*/

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes =
    require("./routes/authRoutes");

const applicationRoutes =
    require("./routes/applicationRoutes");

const eventRoutes =
    require("./routes/eventRoutes");

const participantRoutes =
    require("./routes/participantRoutes");

const contactRoutes =
    require("./routes/contactRoutes");

const {
    verifyEmailConnection
} = require("./utils/email");

/*
=========================================================
 EXPRESS APP
=========================================================
*/

const app =
    express();

/*
=========================================================
 ENVIRONMENT
=========================================================
*/

const PORT =
    process.env.PORT ||
    5000;

const NODE_ENV =
    process.env.NODE_ENV ||
    "development";

/*
=========================================================
 CORS CONFIGURATION
=========================================================
*/

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
];

const corsOptions = {

    origin:
        (origin, callback) => {

            if (!origin) {
                return callback(
                    null,
                    true
                );
            }

            if (
                NODE_ENV ===
                "development"
            ) {
                return callback(
                    null,
                    true
                );
            }

            if (
                allowedOrigins.includes(
                    origin
                )
            ) {
                return callback(
                    null,
                    true
                );
            }

            const frontendURL =
                process.env.FRONTEND_URL;

            if (
                frontendURL &&
                origin ===
                    frontendURL
            ) {
                return callback(
                    null,
                    true
                );
            }

            return callback(
                new Error(
                    "CORS policy: This origin is not allowed."
                )
            );
        },

    methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS"
    ],

    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ],

    credentials:
        true
};

/*
=========================================================
 MIDDLEWARE
=========================================================
*/

app.use(
    cors(
        corsOptions
    )
);

/*
=========================================================
 BODY PARSERS
=========================================================
*/

app.use(
    express.json({
        limit:
            "2mb"
    })
);

app.use(
    express.urlencoded({
        extended:
            true,
        limit:
            "2mb"
    })
);

/*
=========================================================
 REQUEST LOGGER
=========================================================
*/

app.use(
    (req, res, next) => {

        const start =
            Date.now();

        res.on(
            "finish",
            () => {

                const duration =
                    Date.now() -
                    start;

                console.log(
                    `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
                );
            }
        );

        next();
    }
);

/*
=========================================================
 ROOT ROUTE
 GET /
=========================================================
*/

app.get(
    "/",
    (req, res) => {

        const statusPage = `<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <meta
        name="description"
        content="SPORTING API production status and server information."
    >

    <title>
        SPORTING API | Run. Play. Achieve.
    </title>

    <style>

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {

            min-height: 100vh;

            display: flex;

            align-items: center;

            justify-content: center;

            padding: 24px;

            font-family:
                Arial,
                Helvetica,
                sans-serif;

            background:
                #07110d;

            color:
                #f4fff8;
        }

        .card {

            width:
                min(680px, 100%);

            padding:
                42px;

            border:
                1px solid #294d3b;

            border-radius:
                24px;

            background:
                #0d1b14;

            box-shadow:
                0 24px 70px
                rgba(0, 0, 0, 0.45);
        }

        .badge {

            display:
                inline-flex;

            align-items:
                center;

            gap:
                8px;

            padding:
                8px 14px;

            border-radius:
                999px;

            background:
                #b7ff3c;

            color:
                #07110d;

            font-size:
                13px;

            font-weight:
                800;

            letter-spacing:
                0.08em;

            text-transform:
                uppercase;
        }

        .dot {

            width:
                9px;

            height:
                9px;

            border-radius:
                50%;

            background:
                #07110d;
        }

        h1 {

            margin-top:
                24px;

            font-size:
                clamp(42px, 8vw, 72px);

            line-height:
                0.95;

            letter-spacing:
                -0.04em;
        }

        .tagline {

            margin-top:
                14px;

            color:
                #b7ff3c;

            font-size:
                20px;

            font-weight:
                700;
        }

        .message {

            margin-top:
                18px;

            color:
                #b8c9bf;

            line-height:
                1.7;
        }

        .grid {

            display:
                grid;

            grid-template-columns:
                repeat(2, 1fr);

            gap:
                14px;

            margin-top:
                30px;
        }

        .item {

            padding:
                18px;

            border-radius:
                16px;

            background:
                #12241b;

            border:
                1px solid #203d2e;
        }

        .label {

            display:
                block;

            margin-bottom:
                7px;

            color:
                #829b8c;

            font-size:
                12px;

            text-transform:
                uppercase;

            letter-spacing:
                0.08em;
        }

        .value {

            font-weight:
                700;

            word-break:
                break-word;
        }

        .links {

            display:
                flex;

            flex-wrap:
                wrap;

            gap:
                12px;

            margin-top:
                28px;
        }

        a {

            display:
                inline-block;

            padding:
                12px 18px;

            border-radius:
                12px;

            text-decoration:
                none;

            font-weight:
                700;

            background:
                #b7ff3c;

            color:
                #07110d;
        }

        a.secondary {

            background:
                transparent;

            color:
                #b7ff3c;

            border:
                1px solid #42674f;
        }

        footer {

            margin-top:
                30px;

            color:
                #667d70;

            font-size:
                12px;
        }

        @media (max-width: 560px) {

            .card {

                padding:
                    28px;
            }

            .grid {

                grid-template-columns:
                    1fr;
            }
        }

    </style>

</head>

<body>

    <main class="card">

        <div class="badge">

            <span class="dot"></span>

            API Online

        </div>

        <h1>
            SPORTING
        </h1>

        <p class="tagline">
            Run. Play. Achieve.
        </p>

        <p class="message">

            Welcome to the SPORTING API.
            The production server is online
            and ready to power the SPORTING
            sports event management platform.

        </p>

        <section class="grid">

            <div class="item">

                <span class="label">
                    Status
                </span>

                <span class="value">
                    Online
                </span>

            </div>

            <div class="item">

                <span class="label">
                    Environment
                </span>

                <span class="value">
                    ${NODE_ENV}
                </span>

            </div>

            <div class="item">

                <span class="label">
                    API
                </span>

                <span class="value">
                    /api
                </span>

            </div>

            <div class="item">

                <span class="label">
                    Server Time
                </span>

                <span class="value">
                    ${new Date().toISOString()}
                </span>

            </div>

        </section>

        <div class="links">

            <a href="/api/health">
                Health Check
            </a>

            <a
                class="secondary"
                href="/api/test"
            >
                API Test
            </a>

        </div>

        <footer>
            SPORTING Backend • Production API
        </footer>

    </main>

</body>

</html>`;

        res
            .status(200)
            .type("html")
            .send(statusPage);
    }
);

/*
=========================================================
 API HEALTH CHECK
 GET /api/test
=========================================================
*/

app.get(
    "/api/test",
    (req, res) => {

        res.status(200).json({

            success:
                true,

            message:
                "SPORTING API is working.",

            server:
                "online",

            database:
                "connected",

            timestamp:
                new Date().toISOString()
        });
    }
);

/*
=========================================================
 API HEALTH / STATUS
 GET /api/health
=========================================================
*/

app.get(
    "/api/health",
    (req, res) => {

        const mongoose =
            require("mongoose");

        const dbState =
            mongoose.connection.readyState;

        let databaseStatus =
            "disconnected";

        if (
            dbState ===
            1
        ) {

            databaseStatus =
                "connected";
        }

        if (
            dbState ===
            2
        ) {

            databaseStatus =
                "connecting";
        }

        if (
            dbState ===
            3
        ) {

            databaseStatus =
                "disconnecting";
        }

        res.status(200).json({

            success:
                true,

            server:
                "online",

            database:
                databaseStatus,

            environment:
                NODE_ENV,

            uptime:
                process.uptime(),

            timestamp:
                new Date().toISOString()
        });
    }
);

/*
=========================================================
 API ROUTES
=========================================================
*/

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/applications",
    applicationRoutes
);

app.use(
    "/api/events",
    eventRoutes
);

app.use(
    "/api/participants",
    participantRoutes
);

app.use(
    "/api/contacts",
    contactRoutes
);

/*
=========================================================
 404 ROUTE
=========================================================
*/

app.use(
    (req, res) => {

        res.status(404).json({

            success:
                false,

            message:
                "API route not found.",

            path:
                req.originalUrl,

            method:
                req.method
        });
    }
);

/*
=========================================================
 GLOBAL ERROR HANDLER
=========================================================
*/

app.use(
    (
        error,
        req,
        res,
        next
    ) => {

        console.error(
            "Global server error:",
            error
        );

        if (
            error.message &&
            error.message.includes(
                "CORS policy"
            )
        ) {

            return res.status(403).json({

                success:
                    false,

                message:
                    "Request blocked by CORS policy."
            });
        }

        if (
            error instanceof
            SyntaxError &&
            error.status ===
                400 &&
            "body" in error
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "Invalid JSON request body."
            });
        }

        if (
            error.type ===
            "entity.too.large"
        ) {

            return res.status(413).json({

                success:
                    false,

                message:
                    "Request payload is too large."
            });
        }

        return res.status(500).json({

            success:
                false,

            message:
                NODE_ENV ===
                    "development"
                    ? error.message
                    : "Internal server error."
        });
    }
);

/*
=========================================================
 START SERVER
=========================================================
*/

const startServer =
    async () => {

        try {

            const requiredEnvironment =
                [
                    "MONGO_URI",
                    "JWT_SECRET"
                ];

            const missingEnvironment =
                requiredEnvironment.filter(
                    (key) =>
                        !process.env[
                            key
                        ]
                );

            if (
                missingEnvironment.length >
                0
            ) {

                console.error(
                    "\nMissing required environment variables:"
                );

                missingEnvironment.forEach(
                    (key) => {

                        console.error(
                            `- ${key}`
                        );
                    }
                );

                console.error(
                    "\nPlease add them to backend/.env before starting SPORTING.\n"
                );

                process.exit(1);
            }

            await connectDB();

            const server =
                app.listen(
                    PORT,
                    () => {

                        console.log(
                            "\n========================================"
                        );

                        console.log(
                            "        SPORTING BACKEND SERVER"
                        );

                        console.log(
                            "========================================"
                        );

                        console.log(
                            `Environment: ${NODE_ENV}`
                        );

                        console.log(
                            `Server: http://localhost:${PORT}`
                        );

                        console.log(
                            `API: http://localhost:${PORT}/api`
                        );

                        console.log(
                            `Health: http://localhost:${PORT}/api/health`
                        );

                        console.log(
                            `Test: http://localhost:${PORT}/api/test`
                        );

                        console.log(
                            "Database: Connected"
                        );

                        console.log(
                            "========================================\n"
                        );
                    }
                );

            verifyEmailConnection()
                .then(
                    (result) => {

                        if (
                            result.success
                        ) {

                            console.log(
                                "Email service: Ready"
                            );

                        } else {

                            console.log(
                                "Email service: Not configured"
                            );
                        }
                    }
                )
                .catch(
                    (error) => {

                        console.error(
                            "Email service check failed:",
                            error.message
                        );
                    }
                );

            process.on(
                "SIGINT",
                async () => {

                    console.log(
                        "\nSIGINT received. Shutting down..."
                    );

                    server.close(
                        async () => {

                            try {

                                const mongoose =
                                    require(
                                        "mongoose"
                                    );

                                await mongoose.connection.close();

                                console.log(
                                    "MongoDB connection closed."
                                );

                            } catch (
                                error
                            ) {

                                console.error(
                                    "MongoDB shutdown error:",
                                    error.message
                                );
                            }

                            console.log(
                                "SPORTING server stopped."
                            );

                            process.exit(
                                0
                            );
                        }
                    );
                }
            );

            process.on(
                "SIGTERM",
                async () => {

                    console.log(
                        "\nSIGTERM received. Shutting down..."
                    );

                    server.close(
                        async () => {

                            try {

                                const mongoose =
                                    require(
                                        "mongoose"
                                    );

                                await mongoose.connection.close();

                                console.log(
                                    "MongoDB connection closed."
                                );

                            } catch (
                                error
                            ) {

                                console.error(
                                    "MongoDB shutdown error:",
                                    error.message
                                );
                            }

                            console.log(
                                "SPORTING server stopped."
                            );

                            process.exit(
                                0
                            );
                        }
                    );
                }
            );

        } catch (error) {

            console.error(
                "\n========================================"
            );

            console.error(
                "SPORTING SERVER STARTUP FAILED"
            );

            console.error(
                "========================================"
            );

            console.error(
                error.message
            );

            console.error(
                "========================================\n"
            );

            process.exit(1);
        }
    };

/*
=========================================================
 START
=========================================================
*/

startServer();

/*
=========================================================
 EXPORT APP
 Useful for testing
=========================================================
*/

module.exports =
    app;
