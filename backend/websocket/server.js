const WebSocket = require("ws");
const { Kafka } = require("kafkajs");

// --- CONFIGURATION ---
const KAFKA_BROKER = "localhost:9092";
const TOPIC = "order-notification-topic";
const WS_PORT = 8081;

// --- 1. WEBSOCKET SERVER SETUP ---
const wss = new WebSocket.Server({ port: WS_PORT });
const clients = new Map(); // Store clients: userId -> WebSocket Connection

console.log(`WebSocket server started on port ${WS_PORT}`);

wss.on("connection", (ws, req) => {
  const urlParams = new URLSearchParams(req.url.split("?")[1]);
  const userId = urlParams.get("userId");

  if (!userId) {
    console.log("Connection rejected: No userId provided");
    ws.close();
    return;
  }

  // Store the connection
  clients.set(userId, ws);
  console.log(`User connected: ${userId}`);

  ws.on("close", () => {
    clients.delete(userId);
    console.log(`User disconnected: ${userId}`);
  });

  ws.on("message", (message) => {
    console.log(`Received message from ${userId}: ${message}`);
  });
});

// --- 2. KAFKA CONSUMER SETUP ---
const kafka = new Kafka({
  clientId: "notification-service",
  brokers: [KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: "notification-group" });

const runKafkaConsumer = async () => {
  await consumer.connect();
  console.log("Kafka Consumer connected");

  await consumer.subscribe({ topic: TOPIC, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        // Parse the message value (Kafka sends buffers)
        const event = JSON.parse(message.value.toString());
        const targetUserId = event.userId;

        console.log(
          `Received notification for User: ${targetUserId}, Status: ${event.status}`
        );

        // --- 3. PUSH TO USER ---
        const clientWs = clients.get(targetUserId);
        if (clientWs && clientWs.readyState === WebSocket.OPEN) {
          clientWs.send(JSON.stringify(event));
          console.log(`Notification sent to User: ${targetUserId}`);
        } else {
          console.log(
            `User ${targetUserId} is not connected. Notification skipped.`
          );
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    },
  });
};

runKafkaConsumer().catch(console.error);
