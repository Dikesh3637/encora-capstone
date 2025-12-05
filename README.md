# 🛍️ Clothes Ecommerce Platform (Microservices Architecture)

A robust, event-driven e-commerce application built using a Microservices architecture. This project features a Spring Boot backend, a React frontend, real-time notifications via WebSockets, and asynchronous communication using Apache Kafka.

---

## 🚀 Key Features

* **Microservices Architecture**: Decomposed into domain-specific services (Auth, Product, Order, Cart).
* **API Gateway**: Centralized entry point with JWT validation via gRPC.
* **Event-Driven Orders**: Asynchronous order processing and stock reservation using Kafka.
* **Real-Time Notifications**: WebSocket server pushes order status updates to the frontend.
* **Security**: Role-based access control (Admin/User), JWT Authentication, and Secure Cookies.
* **Frontend**: Modern React UI with Tailwind CSS, DaisyUI, and TanStack Query.
* **Cloud Storage**: AWS S3 integration for product image storage.

---

## 🛠 Tech Stack

### Backend
| Technology | Usage |
| :--- | :--- |
| **Java 17/21** | Core language for microservices. |
| **Spring Boot 3.x** | Framework for Auth, Product, Order, Cart, and Gateway services. |
| **Spring Cloud Gateway** | API Gateway and routing. |
| **gRPC** | High-performance communication between Gateway and Auth Service. |
| **Apache Kafka** | Event streaming for order placement and stock checks. |
| **Node.js / Express** | Dedicated WebSocket notification server. |
| **H2 Database** | In-memory database for development. |
| **AWS S3** | Cloud storage for product images. |

### Frontend
| Technology | Usage |
| :--- | :--- |
| **React 19** | UI Library. |
| **Vite** | Build tool and dev server. |
| **Tailwind CSS & DaisyUI** | Styling and UI components. |
| **TanStack Query** | Data fetching and state management. |
| **Axios** | HTTP Client. |

---

## 📂 Service Architecture & Ports

The system is composed of the following services:

| Service | Port | Description | Build Tool |
| :--- | :--- | :--- | :--- |
| **API Gateway** | `8083` | Entry point, routing, JWT validation  | Gradle |
| **Auth Service** | `8084` | User management, JWT issuance, gRPC server | Gradle |
| **Product Service** | `8085` | Product catalog, inventory, S3 uploads | Gradle |
| **Order Service** | `8086` | Order processing, Kafka producer/consumer | Maven |
| **Cart Service** | `8087` | Shopping cart management | Maven |
| **WebSocket Srv** | `8081` | Node.js real-time notification server  | NPM |
| **Frontend** | `5173` | React User Interface | Vite |
| **Kafka Broker** | `9092` | Message Broker | Docker |
| **Kafka UI** | `8080` | GUI for Kafka | Docker |

---

## ⚙️ Getting Started

### 1. Infrastructure Setup
Start the required infrastructure (Kafka and Zookeeper/KRaft) using Docker Compose.

```bash
cd encora-capstone-main/infra
docker-compose up -d
```

Access Kafka UI at http://localhost:8080

### 2. Build Shared Libraries
The backend services rely on a shared library (shared-events) for DTOs and Proto files. This must be built first.

```bash
cd encora-capstone-main/backend/shared-events
./gradlew publishToMavenLocal
```

### 3. Backend Setup
Since the project uses a mix of Gradle and Maven, follow the instructions for each service.

Environment Variables: For the Product Service, ensure you have AWS S3 credentials configured in application.yml or passed as environment variables:

* app.aws.s3.access-key-id
* app.aws.s3.secret-access-key
* app.aws.s3.bucket-name
* app.aws.s3.region

#### Running Gradle Services (Gateway, Auth, Product):

```bash
# Terminal 1: Auth Service
cd encora-capstone-main/backend/auth-service
./gradlew bootRun

# Terminal 2: Product Service
cd encora-capstone-main/backend/product-service
./gradlew bootRun

# Terminal 3: API Gateway
cd encora-capstone-main/backend/api-gateway
./gradlew bootRun
```

#### Running Maven Services (Order, ShoppingCart):

```bash
# Terminal 4: Order Service
cd encora-capstone-main/backend/orderservice
./mvnw spring-boot:run

# Terminal 5: Shopping Cart
cd encora-capstone-main/backend/shoppingcart
./mvnw spring-boot:run
```

#### Running WebSocket Server:

```bash
# Terminal 6: WebSocket
cd encora-capstone-main/backend/websocket
npm install
npm start
```

### 4. Frontend Setup

```bash
# Terminal 7: Frontend
cd encora-capstone-main/frontend
npm install
npm run dev
```

Access the application at http://localhost:5173.

### 🧪 Testing

#### Backend
Run unit tests for individual services:

```bash
# Gradle
./gradlew test

# Maven
./mvnw test
```

#### Frontend
Linting is configured via ESLint:

```bash
npm run lint
```

### 🔄 Event Flow Example: Placing an Order

1. **Frontend**: User clicks "Buy Now". Request sent to Order Service.

2. **Order Service**: Sends a ProductCheckEvent to Kafka topic product-check-event.

3. **Product Service**: Consumes event, verifies stock, reduces inventory, and sends PlaceOrderEvent (Success/Fail) to place-order-event-topic.

4. **Order Service**: Consumes response. If success, saves order to DB. Sends OrderPlacedNotificationEvent to order-notification-topic.

5. **WebSocket Service**: Consumes notification from Kafka and pushes JSON message to the connected Frontend client via WebSocket.

6. **Frontend**: Displays a Toast notification confirming the order.
