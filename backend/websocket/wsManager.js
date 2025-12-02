// wsManager.js
const WebSocket = require("ws");

// userId -> Set<WebSocket>
const userConnections = new Map();

// Auto-increment connection counter
let connectionCounter = 0;

/**
 * Create a unique connectionId for a user
 */
function createConnectionId(userId) {
  return `${userId}-${++connectionCounter}`;
}

/**
 * Add WebSocket to user connection map
 */
function addConnection(userId, ws) {
  if (!userConnections.has(userId)) {
    userConnections.set(userId, new Set());
  }
  userConnections.get(userId).add(ws);
}

/**
 * Remove WebSocket from map on disconnect
 */
function removeConnection(userId, ws) {
  const set = userConnections.get(userId);
  if (!set) return;

  set.delete(ws);
  if (set.size === 0) userConnections.delete(userId);
}

/**
 * Send a message to ALL connections for a given userId
 */
function sendToUser(userId, payload) {
  const connections = userConnections.get(userId);
  if (!connections) return;

  for (const ws of connections) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    }
  }
}

/**
 * Send a message to a specific connectionId
 */
function sendToConnectionId(userId, connectionId, payload) {
  const connections = userConnections.get(userId);
  if (!connections) return;

  for (const ws of connections) {
    if (ws.connectionId === connectionId && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
      break;
    }
  }
}

/**
 * High-level notification (used by Kafka later)
 */
function sendOrderPlacedNotification(userId, orderId) {
  sendToUser(userId, {
    type: "ORDER_PLACED",
    orderId,
    userId,
    message: `Your order ${orderId} has been placed successfully.`,
  });
}

module.exports = {
  userConnections,
  createConnectionId,
  addConnection,
  removeConnection,
  sendToUser,
  sendToConnectionId,
  sendOrderPlacedNotification,
};
