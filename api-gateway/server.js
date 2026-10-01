const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const authenticateToken = require("./middleware/authMiddleware");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

// API Gateway Health
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        service: "FloodWatch API Gateway",
        timestamp: new Date()
    });
});

// Sensor Service
app.use(
    "/api/sensor",
    authenticateToken,
    createProxyMiddleware({
        target: "http://sensor-service:5001",
        changeOrigin: true,
        pathRewrite: {
            "^/api/sensor": ""
        }
    })
);

// Alert Service
app.use(
    "/api/alert",
    authenticateToken,
    createProxyMiddleware({
        target: "http://alert-service:5004",
        changeOrigin: true,
        pathRewrite: {
            "^/api/alert": ""
        },
        on: {
            proxyReq: (proxyReq, req) => {
                if (req.body) {
                    const bodyData = JSON.stringify(req.body);

                    proxyReq.setHeader(
                        "Content-Type",
                        "application/json"
                    );

                    proxyReq.setHeader(
                        "Content-Length",
                        Buffer.byteLength(bodyData)
                    );

                    proxyReq.write(bodyData);
                }
            }
        }
    })
);

// User Service
app.use(
    "/api/auth",
    createProxyMiddleware({
        target: "http://user-service:5005",
        changeOrigin: true,

        pathRewrite: {
            "^/api/auth": ""
        },

        on: {
            proxyReq: (proxyReq, req) => {

                if (req.body && Object.keys(req.body).length > 0) {

                    const bodyData = JSON.stringify(req.body);

                    proxyReq.setHeader(
                        "Content-Type",
                        "application/json"
                    );

                    proxyReq.setHeader(
                        "Content-Length",
                        Buffer.byteLength(bodyData)
                    );

                    proxyReq.write(bodyData);
                }
            }
        }
    })
);


// Backend Service
app.use(
    "/api",
    authenticateToken,
    createProxyMiddleware({
        target: "http://backend:5000",
        changeOrigin: true,
        pathRewrite: (path) => {
            return "/api" + path;
        }
    })
);

app.listen(PORT, () => {
    console.log(
        `🚪 API Gateway running on http://localhost:${PORT}`
    );
});