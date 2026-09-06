import { WebSocketServer, WebSocket } from "ws";
import { EventEmitter } from "events";

declare global {
  var __portfolioEventEmitter: EventEmitter | undefined;
  var __portfolioWSS: WebSocketServer | undefined;
}

const WS_PORT = 3001;

// Get or initialize singleton EventEmitter
export function getEventEmitter(): EventEmitter {
  if (!globalThis.__portfolioEventEmitter) {
    globalThis.__portfolioEventEmitter = new EventEmitter();
    globalThis.__portfolioEventEmitter.setMaxListeners(50);
  }
  return globalThis.__portfolioEventEmitter;
}

// Get or initialize singleton WebSocketServer
export function initRealtimeServer(): WebSocketServer | null {
  // Only run in Node.js runtime
  if (typeof window !== "undefined") return null;

  if (!globalThis.__portfolioWSS) {
    try {
      const wss = new WebSocketServer({
        port: WS_PORT,
        host: "0.0.0.0",
      });

      wss.on("connection", (ws, req) => {
        const clientIp = req.socket.remoteAddress;
        // Send initial greeting to confirm active socket connection
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              type: "connected",
              message: "WebSocket live inbox channel connected",
              port: WS_PORT,
              time: new Date().toISOString(),
            })
          );
        }

        // Heartbeat ping/pong to prevent idle socket drop
        const interval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.ping();
          } else {
            clearInterval(interval);
          }
        }, 25000);

        ws.on("close", () => {
          clearInterval(interval);
        });

        ws.on("error", (err) => {
          console.warn("[WebSocket client error]:", err.message);
        });
      });

      wss.on("error", (err: any) => {
        if (err.code === "EADDRINUSE") {
          console.log(`[WebSocket] Port ${WS_PORT} is already in use, reusing existing socket.`);
        } else {
          console.error("[WebSocket Server Error]:", err);
        }
      });

      globalThis.__portfolioWSS = wss;
      console.log(`[WebSocket] Realtime message server listening on ws://0.0.0.0:${WS_PORT}`);
    } catch (err: any) {
      console.warn("[WebSocket Init Warning]:", err.message);
    }
  }

  return globalThis.__portfolioWSS || null;
}

// Broadcast new visitor message to all active WebSocket clients & SSE listeners
export function broadcastNewMessage(messageData: any) {
  // 1. Broadcast via WebSocket
  const wss = initRealtimeServer();
  if (wss) {
    const payload = JSON.stringify({
      type: "new_message",
      data: messageData,
      timestamp: new Date().toISOString(),
    });

    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(payload);
        } catch (err) {
          console.warn("[WebSocket broadcast failed for client]:", err);
        }
      }
    }
  }

  // 2. Broadcast via EventEmitter for SSE fallback stream
  const emitter = getEventEmitter();
  emitter.emit("new_message", messageData);
}
