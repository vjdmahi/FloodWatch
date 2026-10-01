# 🌊 FloodWatch

A microservices-based real-time flood monitoring and emergency response system.

FloodWatch collects sensor data, detects flood risks, stores alerts, and sends notifications using a distributed microservice architecture.

## 🏗️ Architecture

```text
                    ┌───────────────┐
                    │   Frontend    │
                    │ React + Nginx │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ API Gateway   │
                    │ Express + JWT │
                    └───────┬───────┘
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
   │User Service │  │Sensor Service│  │Alert Service│
   └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                            ▼
                    ┌───────────────┐
                    │   MongoDB     │
                    └───────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │    Apache     │
                    │     Kafka     │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Notification  │
                    │    Service    │
                    └───────────────┘
🚀 Features
🌊 Real-time flood sensor simulation
📊 Water-level monitoring
🚨 Automatic flood-risk detection
🔴 SAFE / WARNING / DANGER status
📢 Kafka-based flood alert notifications
🔐 JWT authentication
👤 User registration and login
🗄️ MongoDB data persistence
🌐 API Gateway
🐳 Docker containerization
🔄 Docker Compose orchestration
⚙️ GitHub Actions CI pipeline
📈 Flood alert history
📱 Web dashboard


🛠️ Technologies
Frontend
React
Vite
Axios
Nginx
Backend
Node.js
Express.js
MongoDB
Mongoose
DevOps
Docker
Docker Compose
Git
GitHub
GitHub Actions
Messaging & Security
Apache Kafka
KafkaJS
JWT
bcrypt

📁 Microservices
| Service              | Purpose                              |
| -------------------- | ------------------------------------ |
| API Gateway          | Central entry point for APIs         |
| User Service         | Authentication and user management   |
| Sensor Service       | Sensor data processing               |
| Alert Service        | Flood detection and alert management |
| Notification Service | Kafka-based flood notifications      |
| Backend              | Dashboard and supporting APIs        |

🌊 Flood Detection

FloodWatch classifies water levels into three categories:

| Water Level | Status  | Severity |
| ------------| ------- | -------- |
| < 3.0 m     | SAFE    | LOW      |
| 3.0 – 4.0 m | WARNING | MEDIUM   |
| > 4.0 m     | DANGER  | HIGH     |
