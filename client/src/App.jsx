import { useEffect, useState } from "react";
import axios from "axios";

axios.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("floodwatch_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

axios.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("floodwatch_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

function App() {
    const [readings, setReadings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [alerts, setAlerts] = useState([]);
    const [alertHistory, setAlertHistory] = useState([]);

    // =================================
    // FETCH SENSOR READINGS
    // =================================

    const fetchReadings = async () => {
        try {
            const response = await axios.get(
                "/api/latest-readings"
            );

            setReadings(response.data.readings);
            setError("");
            setLoading(false);

        } catch (error) {
            console.error(error);
            setError("Unable to connect to FloodWatch backend");
            setLoading(false);
        }
    };

    // =================================
    // FETCH ACTIVE ALERTS
    // =================================

    const fetchAlerts = async () => {
        try {
            const response = await axios.get(
                "/api/alerts"
            );

            setAlerts(response.data.alerts);

        } catch (error) {
            console.error("Failed to fetch alerts:", error);
        }
    };

    // =================================
    // FETCH ALERT HISTORY
    // =================================

    const fetchAlertHistory = async () => {
        try {
            const response = await axios.get(
                "/api/alert/alerts"
            );

            setAlertHistory(response.data.alerts);

        } catch (error) {
            console.error("Failed to fetch alert history:", error);
        }
    };

    // =================================
    // AUTO REFRESH
    // =================================

    useEffect(() => {
        fetchReadings();
        fetchAlerts();
        fetchAlertHistory();

        const interval = setInterval(() => {
            fetchReadings();
            fetchAlerts();
            fetchAlertHistory();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // =================================
    // STATUS COLOR
    // =================================

    const getStatusColor = (status) => {
        if (status === "SAFE") {
            return "green";
        }

        if (status === "WARNING") {
            return "orange";
        }

        if (status === "DANGER") {
            return "red";
        }

        return "gray";
    };

    const totalLocations = readings.length;

    const activeAlertCount = alerts.length;

    const highestWaterLevel =
        readings.length > 0
            ? Math.max(
                ...readings.map((reading) => reading.waterLevel)
            ).toFixed(2)
            : "0.00";

    const highestSeverity =
        alerts.length > 0
            ? alerts.some((alert) => alert.severity === "HIGH")
                ? "HIGH"
                : alerts.some((alert) => alert.severity === "MEDIUM")
                    ? "MEDIUM"
                    : "LOW"
            : "NONE";
    

    



// =================================
    // LOADING
    // =================================

    if (loading) {
        return <h1>Loading FloodWatch...</h1>;
    }

    // =================================
    // DASHBOARD
    // =================================

    return (
        <div
            style={{
                fontFamily: "Arial",
                padding: "30px",
                backgroundColor: "#f4f7fb",
                color: "#1f2937",
                minHeight: "100vh"
            }}
        >

            <h1 style={{ color: "#2563eb" }}>
                🌊 FloodWatch Dashboard
            </h1>

            <p>
                Real-time flood monitoring system
            </p>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "20px",
                    margin: "25px 0 35px"
                }}
            >
                <div
                    style={{
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "12px",
                        boxShadow: "0 3px 10px rgba(0,0,0,0.1)"
                    }}
                >
                    <h3 style={{ color: "#2563eb" }}>
                        📍 Monitored Locations
                    </h3>

                    <p
                        style={{
                            fontSize: "32px",
                            fontWeight: "bold",
                            color: "#111827"
                        }}
                    >
                        {totalLocations}
                    </p>
                </div>

                <div
                    style={{
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "12px",
                        boxShadow: "0 3px 10px rgba(0,0,0,0.1)"
                    }}
                >
                    <h3 style={{ color: "#dc2626" }}>
                        🚨 Active Alerts
                    </h3>

                    <p
                        style={{
                            fontSize: "32px",
                            fontWeight: "bold",
                            color: "#111827"
                        }}
                    >
                        {activeAlertCount}
                    </p>
                </div>

                <div
                    style={{
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "12px",
                        boxShadow: "0 3px 10px rgba(0,0,0,0.1)"
                    }}
                >
                    <h3 style={{ color: "#0891b2" }}>
                        💧 Highest Water Level
                    </h3>

                    <p
                        style={{
                            fontSize: "32px",
                            fontWeight: "bold",
                            color: "#111827"
                        }}
                    >
                        {highestWaterLevel} m
                    </p>
                </div>

                <div
                    style={{
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "12px",
                        boxShadow: "0 3px 10px rgba(0,0,0,0.1)"
                    }}
                >
                    <h3 style={{ color: "#7c3aed" }}>
                        ⚠️ Highest Severity
                    </h3>

                    <p
                        style={{
                            fontSize: "32px",
                            fontWeight: "bold",
                            color: highestSeverity === "HIGH"
                                ? "#dc2626"
                                : highestSeverity === "MEDIUM"
                                    ? "#f59e0b"
                                    : "#16a34a"
                        }}
                    >
                        {highestSeverity}
                    </p>
                </div>
            </div>

            {/* ================================= */}
            {/* ERROR MESSAGE */}
            {/* ================================= */}

            {error && (
                <div
                    style={{
                        backgroundColor: "#ffdddd",
                        padding: "15px",
                        marginBottom: "20px",
                        borderRadius: "8px"
                    }}
                >
                    ❌ {error}
                </div>
            )}

            {/* ================================= */}
            {/* ACTIVE FLOOD ALERTS */}
            {/* ================================= */}

            <h2 style={{ color: "#dc2626" }}>
                🚨 Active Flood Alerts
            </h2>

            {alerts.length === 0 ? (

                <p>✅ No active flood alerts</p>

            ) : (

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "20px",
                        marginBottom: "30px"
                    }}
                >

                    {alerts.map((alert) => (

                        <div
                            key={alert._id}
                            style={{
                                backgroundColor: "#ffe5e5",
                                padding: "20px",
                                borderRadius: "12px",
                                boxShadow:
                                    "0 3px 10px rgba(0,0,0,0.1)",
                                border: "2px solid red"
                            }}
                        >

                            <h2>
                                📍 {alert.location}
                            </h2>

                            <div
                                style={{
                                    fontSize: "24px",
                                    fontWeight: "bold",
                                    color: "red",
                                    marginBottom: "15px"
                                }}
                            >
                                🚨 {alert.severity}
                            </div>

                            <p>
                                💧 Water Level:
                                <strong>
                                    {" "}
                                    {alert.waterLevel} m
                                </strong>
                            </p>

                            <p>
                                {alert.message}
                            </p>

                            <hr />

                            <small>
                                Alert time:{" "}
                                {new Date(
                                    alert.timestamp
                                ).toLocaleString()}
                            </small>

                        </div>

                    ))}

                </div>
            )}

            
            {/* ================================= */}
            {/* ALERT HISTORY */}
            {/* ================================= */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                    flexWrap: "wrap",
                    gap: "10px"
                }}
            >
                <div>
                    <h2
                        style={{
                            color: "#7c3aed",
                            marginBottom: "5px"
                        }}
                    >
                        📜 Alert History
                    </h2>

                    <p
                        style={{
                            margin: 0,
                            color: "#6b7280"
                        }}
                    >
                        Recent flood alerts and their current status
                    </p>
                </div>

                <div
                    style={{
                        backgroundColor: "#ede9fe",
                        color: "#6d28d9",
                        padding: "8px 14px",
                        borderRadius: "20px",
                        fontWeight: "bold",
                        fontSize: "14px"
                    }}
                >
                    {alertHistory.length} Records
                </div>
            </div>

            {alertHistory.length === 0 ? (

                <div
                    style={{
                        backgroundColor: "white",
                        padding: "30px",
                        borderRadius: "12px",
                        textAlign: "center",
                        boxShadow:
                            "0 3px 10px rgba(0,0,0,0.08)",
                        marginBottom: "30px"
                    }}
                >
                    <div
                        style={{
                            fontSize: "40px",
                            marginBottom: "10px"
                        }}
                    >
                        📜
                    </div>

                    <p
                        style={{
                            color: "#6b7280",
                            margin: 0
                        }}
                    >
                        No alert history available.
                    </p>
                </div>

            ) : (

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: "20px",
                        marginBottom: "35px"
                    }}
                >

                    {alertHistory.map((alert) => {

                        const severityColor =
                            alert.severity === "HIGH"
                                ? "#dc2626"
                                : alert.severity === "MEDIUM"
                                    ? "#f59e0b"
                                    : "#16a34a";

                        const severityBackground =
                            alert.severity === "HIGH"
                                ? "#fee2e2"
                                : alert.severity === "MEDIUM"
                                    ? "#fef3c7"
                                    : "#dcfce7";

                        const statusColor = alert.active
                            ? "#dc2626"
                            : "#16a34a";

                        const statusBackground = alert.active
                            ? "#fee2e2"
                            : "#dcfce7";

                        return (

                            <div
                                key={alert._id}
                                style={{
                                    backgroundColor: "white",
                                    padding: "22px",
                                    borderRadius: "16px",
                                    boxShadow:
                                        "0 4px 15px rgba(0,0,0,0.08)",
                                    borderLeft:
                                        `5px solid ${severityColor}`,
                                    transition:
                                        "transform 0.2s ease, box-shadow 0.2s ease"
                                }}
                            >

                                {/* HEADER */}

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "18px",
                                        gap: "10px"
                                    }}
                                >

                                    <div>
                                        <h3
                                            style={{
                                                margin: 0,
                                                color: "#111827",
                                                fontSize: "20px"
                                            }}
                                        >
                                            📍 {alert.location}
                                        </h3>

                                        <small
                                            style={{
                                                color: "#6b7280"
                                            }}
                                        >
                                            Flood monitoring alert
                                        </small>
                                    </div>

                                    {/* STATUS BADGE */}

                                    <span
                                        style={{
                                            backgroundColor:
                                                statusBackground,
                                            color: statusColor,
                                            padding:
                                                "6px 10px",
                                            borderRadius:
                                                "20px",
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                            whiteSpace:
                                                "nowrap"
                                        }}
                                    >
                                        {alert.active
                                            ? "🚨 ACTIVE"
                                            : "✓ RESOLVED"}
                                    </span>

                                </div>

                                {/* SEVERITY */}

                                <div
                                    style={{
                                        display: "inline-block",
                                        backgroundColor:
                                            severityBackground,
                                        color:
                                            severityColor,
                                        padding:
                                            "6px 12px",
                                        borderRadius:
                                            "20px",
                                        fontSize: "13px",
                                        fontWeight: "bold",
                                        marginBottom: "18px"
                                    }}
                                >
                                    ⚠️ {alert.severity} SEVERITY
                                </div>

                                {/* WATER LEVEL */}

                                <div
                                    style={{
                                        backgroundColor: "#f8fafc",
                                        padding: "15px",
                                        borderRadius: "10px",
                                        marginBottom: "15px"
                                    }}
                                >

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent:
                                                "space-between",
                                            marginBottom: "8px"
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: "#475569",
                                                fontSize: "14px"
                                            }}
                                        >
                                            💧 Water Level
                                        </span>

                                        <strong
                                            style={{
                                                color:
                                                    severityColor
                                            }}
                                        >
                                            {alert.waterLevel} m
                                        </strong>
                                    </div>

                                    <div
                                        style={{
                                            width: "100%",
                                            height: "8px",
                                            backgroundColor:
                                                "#e5e7eb",
                                            borderRadius: "10px",
                                            overflow: "hidden"
                                        }}
                                    >
                                        <div
                                            style={{
                                                width:
                                                    `${Math.min(
                                                        (alert.waterLevel / 6) * 100,
                                                        100
                                                    )}%`,
                                                height: "100%",
                                                backgroundColor:
                                                    severityColor,
                                                borderRadius:
                                                    "10px",
                                                transition:
                                                    "width 0.5s ease"
                                            }}
                                        />
                                    </div>

                                </div>

                                {/* MESSAGE */}

                                <div
                                    style={{
                                        backgroundColor:
                                            "#f9fafb",
                                        padding: "12px 14px",
                                        borderRadius: "8px",
                                        marginBottom: "18px"
                                    }}
                                >
                                    <p
                                        style={{
                                            margin: 0,
                                            color: "#374151",
                                            fontSize: "14px"
                                        }}
                                    >
                                        {alert.message}
                                    </p>
                                </div>

                                {/* FOOTER */}

                                <div
                                    style={{
                                        borderTop:
                                            "1px solid #e5e7eb",
                                        paddingTop: "12px",
                                        display: "flex",
                                        justifyContent:
                                            "space-between",
                                        alignItems: "center",
                                        gap: "10px",
                                        flexWrap: "wrap"
                                    }}
                                >

                                    <small
                                        style={{
                                            color: "#6b7280"
                                        }}
                                    >
                                        🕒{" "}
                                        {new Date(
                                            alert.timestamp
                                        ).toLocaleString()}
                                    </small>

                                    <small
                                        style={{
                                            color: statusColor,
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {alert.active
                                            ? "Monitoring"
                                            : "Closed"}
                                    </small>

                                </div>

                            </div>

                        );
                    })}

                </div>
            )}
```


            {/* ================================= */}
            {/* SENSOR READINGS */}
            {/* ================================= */}

            <h2 style={{ color: "#0891b2" }}>
                📊 Latest Sensor Readings
            </h2>

            {readings.length === 0 ? (

                <p>No sensor readings available.</p>

            ) : (

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "20px"
                    }}
                >

                    {readings.map((reading) => (

                        <div
                            key={reading._id}
                            style={{
                                backgroundColor: "white",
                                padding: "20px",
                                borderRadius: "12px",
                                boxShadow:
                                    "0 3px 10px rgba(0,0,0,0.1)"
                            }}
                        >

                            <h2>
                                📍 {reading.location}
                            </h2>

                            <div
                                style={{
                                    fontSize: "24px",
                                    fontWeight: "bold",
                                    color: getStatusColor(
                                        reading.status
                                    ),
                                    marginBottom: "15px"
                                }}
                            >
                                {reading.status}
                            </div>

                            <div style={{ marginBottom: "15px" }}>

                                <p>
                                    💧 Water Level:
                                    <strong>
                                        {" "}
                                        {reading.waterLevel} m
                                    </strong>
                                </p>

                                <div
                                    style={{
                                        width: "100%",
                                        height: "12px",
                                        backgroundColor: "#e5e7eb",
                                        borderRadius: "10px",
                                        overflow: "hidden"
                                    }}
                                >
                                    <div
                                        style={{
                                            width: `${Math.min(
                                                (reading.waterLevel / 6) * 100,
                                                100
                                            )}%`,

                                            height: "100%",

                                            backgroundColor:
                                                reading.status === "DANGER"
                                                    ? "#dc2626"
                                                    : reading.status === "WARNING"
                                                        ? "#f59e0b"
                                                        : "#16a34a",

                                            borderRadius: "10px",

                                            transition: "width 0.5s ease"
                                        }}
                                    />
                                </div>

                            </div>

                            <p>
                                🌧️ Rainfall:
                                <strong>
                                    {" "}
                                    {reading.rainfall} mm
                                </strong>
                            </p>

                            <p>
                                🌡️ Temperature:
                                <strong>
                                    {" "}
                                    {reading.temperature} °C
                                </strong>
                            </p>

                            <p>
                                💦 Humidity:
                                <strong>
                                    {" "}
                                    {reading.humidity}%
                                </strong>
                            </p>

                            <p>
                                🚨 Severity:
                                <strong>
                                    {" "}
                                    {reading.severity}
                                </strong>
                            </p>

                            <p>
                                {reading.message}
                            </p>

                            <hr />

                            <small>
                                Last update:{" "}
                                {new Date(
                                    reading.timestamp
                                ).toLocaleString()}
                            </small>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
}

export default App;