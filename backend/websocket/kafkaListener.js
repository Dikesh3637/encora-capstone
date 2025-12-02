// kafkaListener.js
// Usage: configure through environment variables and run with `node kafkaListener.js`

const { Kafka } = require("kafkajs");
const wsManager = require("./wsManager"); // adjust path if you moved files

// CONFIG (use env vars in production)
const KAFKA_BROKERS = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(",") : ["localhost:9092"];
const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID || "websocket-notifier";
const KAFKA_GROUP_ID = process.env.KAFKA_GROUP_ID || "ws-notifier-group";
const TOPIC = process.env.KAFKA_TOPIC || "order-placed";

// Create Kafka client
const kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: KAFKA_BROKERS,
  // ssl/sasl options here if needed
});

const consumer = kafka.consumer({ groupId: KAFKA_GROUP_ID });

async function start() {
  await consumer.connect();
  console.log(`Kafka consumer connected. Subscribing to topic "${TOPIC}"`);
  await consumer.subscribe({ topic: TOPIC, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const raw = message.value.toString();
        console.log(`Received message on ${topic} partition ${partition}: ${raw}`);

        // Parse message according to your contract
        // Expected example: { userId: "U101", orderId: "O-123", event: "ORDER_PLACED", payload: {...} }
        let parsed;
        try {
          parsed = JSON.parse(raw);
        } catch (err) {
          console.error("Invalid JSON in Kafka message:", err);
          return; // skip bad message
        }

        // Basic validation
        const { userId, orderId, event } = parsed;
        if (!userId || !orderId) {
          console.warn("Message missing userId or orderId, skipping:", parsed);
          return;
        }

        // Implement routing for multiple event types if needed
        if (event === "ORDER_PLACED" || parsed.type === "ORDER_PLACED") {
          // Use wsManager to push notification to connected websockets
          wsManager.sendOrderPlacedNotification(userId, orderId);
        } else {
          // Generic fallback: send arbitrary payload
          wsManager.sendToUser(userId, {
            type: event || parsed.type || "KAFKA_EVENT",
            ...parsed.payload,
            orderId,
            userId,
            raw: parsed,
          });
        }
      } catch (err) {
        console.error("Error processing Kafka message:", err);
        // decide whether to rethrow or swallow. We swallow to keep consumer running.
      }
    },
  });
}

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received — disconnecting Kafka consumer...");
  try {
    await consumer.disconnect();
  } catch (e) {
    console.error("Error during Kafka disconnect:", e);
  } finally {
    process.exit(0);
  }
});

start().catch((err) => {
  console.error("Failed to start Kafka consumer:", err);
  process.exit(1);
});
