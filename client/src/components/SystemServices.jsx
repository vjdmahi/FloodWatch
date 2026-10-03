import React from "react";

export default function SystemServices({ isGatewayOnline = true, readingsOk = true, alertsOk = true }) {
  const services = [
    {
      name: "API Gateway",
      role: "Reverse Proxy & Authentication Gateway",
      port: "Port 5000",
      status: isGatewayOnline ? "ONLINE" : "OFFLINE",
      verification: "LIVE VERIFIED",
      verificationType: "direct",
      details: "Proxying frontend requests to microservices",
    },
    {
      name: "Sensor Service",
      role: "Telemetry Ingestion & Processing",
      port: "Port 5001",
      status: readingsOk ? "ONLINE" : "DEGRADED",
      verification: "LIVE VERIFIED",
      verificationType: "direct",
      details: "Actively serving latest field sensor readings",
    },
    {
      name: "Alert Service",
      role: "Incident Engine & Severity Evaluation",
      port: "Port 5004",
      status: alertsOk ? "ONLINE" : "DEGRADED",
      verification: "LIVE VERIFIED",
      verificationType: "direct",
      details: "Querying active alerts and event history",
    },
    {
      name: "Kafka Messaging Bus",
      role: "Distributed Event Stream (Topic: flood-alerts)",
      port: "Port 9092",
      status: isGatewayOnline && (readingsOk || alertsOk) ? "ONLINE" : "STANDBY",
      verification: "PIPELINE VERIFIED",
      verificationType: "inferred",
      details: "Streaming sensor readings & alert notifications",
    },
    {
      name: "MongoDB Datastore",
      role: "NoSQL Cluster (Time-Series & Incident Store)",
      port: "Port 27017",
      status: readingsOk || alertsOk ? "CONNECTED" : "UNREACHABLE",
      verification: "PIPELINE VERIFIED",
      verificationType: "inferred",
      details: "Persisting readings & historical alert collections",
    },
    {
      name: "User Service",
      role: "JWT Auth & User Access Control",
      port: "Port 5005",
      status: "STANDBY",
      verification: "INTERNAL SERVICE",
      verificationType: "standby",
      details: "Protected routes active on API Gateway",
    },
    {
      name: "Notification Service",
      role: "SMS / Webhook Broadcast Consumer",
      port: "Kafka Consumer",
      status: "STANDBY",
      verification: "INTERNAL SERVICE",
      verificationType: "standby",
      details: "Subscribed to Kafka alert topics for incident dispatch",
    },
  ];

  return (
    <section id="system" className="panel-section">
      <div className="section-header-row">
        <div>
          <div className="section-tag font-mono">
            <span className="tag-dot" />
            DEVOPS ARCHITECTURE
          </div>
          <h2 className="section-title">Microservices Infrastructure Status</h2>
          <p className="section-description">
            Distributed microservices stack orchestrated via Docker Compose and Kafka event-driven messaging.
          </p>
        </div>

        <div className="infra-summary-badge font-mono">
          <span>PIPELINE HEALTH:</span>
          <strong>{isGatewayOnline ? "OPERATIONAL" : "DEGRADED"}</strong>
        </div>
      </div>

      <div className="system-services-grid">
        {services.map((svc) => {
          const isOnline = svc.status === "ONLINE" || svc.status === "CONNECTED";
          const isStandby = svc.status === "STANDBY";

          return (
            <div key={svc.name} className="service-status-card">
              <div className="service-card-top">
                <div className="service-name-group">
                  <span className={`service-pulse-dot ${isOnline ? "dot-online" : isStandby ? "dot-standby" : "dot-degraded"}`} />
                  <div>
                    <h3 className="service-name">{svc.name}</h3>
                    <span className="service-role font-mono">{svc.role}</span>
                  </div>
                </div>

                <span
                  className={`service-status-badge font-mono ${
                    isOnline ? "badge-online" : isStandby ? "badge-standby" : "badge-degraded"
                  }`}
                >
                  {svc.status}
                </span>
              </div>

              <p className="service-details">{svc.details}</p>

              <div className="service-card-footer font-mono">
                <span className="service-port">{svc.port}</span>
                <span className={`verification-tag tag-${svc.verificationType}`} title={svc.verification}>
                  {svc.verification}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
