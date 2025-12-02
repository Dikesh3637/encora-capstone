const express = require("express");
const WebSocket = require("ws");
const { WebSocketServer } = WebSocket;
const { URL } = require("url");
//const paymentRoutes = require("./paymentRoutes");

const app = express();
const PORT = 3000;

app.use(express.json());
//app.use("/payments", paymentRoutes);


// Health check
app.get("/", (req, res) => {
  res.send("Backend with WebSocket is up!");
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

/**
 * Map of userId -> Set<WebSocket>
 * Each WebSocket has:
 *   ws.userId
 *   ws.connectionId
 */
const userConnections = new Map();
let connectionCounter = 0;

// Add WebSocket connection
function addConnection(userId, ws) {
  if (!userConnections.has(userId)) {
    userConnections.set(userId, new Set());
  }
  userConnections.get(userId).add(ws);
}

// Remove WebSocket connection
function removeConnection(userId, ws) {
  const set = userConnections.get(userId);
  if (!set) return;

  set.delete(ws);

  if (set.size === 0) {
    userConnections.delete(userId);
  }
}

// Create WebSocket server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws, req) => {
  // IMPORTANT: API Gateway will send x-user-id after JWT validation
  let userId = req.headers["x-user-id"];

// ALLOW query param for LOCAL TESTING
if (!userId) {
  const fullUrl = new URL(req.url, `http://${req.headers.host}`);
  userId = fullUrl.searchParams.get("userId");
}

// still missing? reject
if (!userId) {
  console.warn("WebSocket connection without userId. Closing.");
  ws.close(1008, "Missing user id");
  return;
}

  const connectionId = `${userId}-${++connectionCounter}`;
  ws.userId = userId;
  ws.connectionId = connectionId;

  addConnection(userId, ws);

  console.log(
    `WebSocket connected: userId=${userId}, connectionId=${connectionId}`
  );

  // Notify client
  ws.send(
    JSON.stringify({
      type: "WS_CONNECTED",
      userId,
      connectionId,
      message: "WebSocket connected",
    })
  );

  // Incoming message handler
  ws.on("message", (raw) => {
    let msg;

    try {
      msg = JSON.parse(raw.toString());
    } catch {
      console.log(
        `Invalid JSON from ${userId}/${connectionId}:`,
        raw.toString()
      );
      return;
    }

    console.log(`Message from ${userId}/${connectionId}:`, msg);

    // Debug PING → PONG
    if (msg.type === "PING") {
      ws.send(
        JSON.stringify({
          type: "PONG",
          connectionId,
          timestamp: Date.now(),
        })
      );
    }
  });

  // On close
  ws.on("close", () => {
    console.log(
      `WebSocket closed: userId=${userId}, connectionId=${connectionId}`
    );
    removeConnection(userId, ws);
  });
});

// ... (your whole server.js same as before)

// Helper function: Send ORDER_PLACED notification to all active WebSocket
function sendOrderPlacedNotification(userId, orderId) {
  const connections = userConnections.get(userId);

  if (!connections || connections.size === 0) {
    console.log(
      `No active WebSocket connections for userId=${userId} (orderId=${orderId})`
    );
    return;
  }

  const payload = {
    type: "ORDER_PLACED",
    userId,
    orderId,
    message: `Your order ${orderId} has been placed successfully.`,
  };

  for (const ws of connections) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          ...payload,
          connectionId: ws.connectionId,
        })
      );
    }
  }

  console.log(
    `Sent ORDER_PLACED to ${connections.size} connection(s) for userId=${userId}`
  );
}

/**
 * STEP 3 TEST: Send a test message to a user (U101) 5 seconds after server starts
 */
setTimeout(() => {
  console.log("TEST: Sending test message to user U101");
  sendOrderPlacedNotification("U101", "TEST-ORDER-123");
}, 5000);

// Export for Kafka consumer
module.exports = {
  server,
  wss,
  userConnections,
  sendOrderPlacedNotification,
};
