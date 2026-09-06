import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import { getEventEmitter, initRealtimeServer } from "@/lib/realtime";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(req: Request) {
  const session = await requireAuth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Ensure WebSocket server is initialized
  initRealtimeServer();

  const emitter = getEventEmitter();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial confirmation event
      controller.enqueue(
        encoder.encode(
          `event: connected\ndata: ${JSON.stringify({ status: "connected", time: new Date().toISOString() })}\n\n`
        )
      );

      const messageListener = (msg: any) => {
        try {
          const payload = `event: new_message\ndata: ${JSON.stringify(msg)}\n\n`;
          controller.enqueue(encoder.encode(payload));
        } catch (err) {
          // stream could be closed
        }
      };

      emitter.on("new_message", messageListener);

      // Heartbeat comment ping every 20 seconds to prevent connection timeout
      const heartbeatInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch {
          clearInterval(heartbeatInterval);
        }
      }, 20000);

      req.signal.addEventListener("abort", () => {
        clearInterval(heartbeatInterval);
        emitter.off("new_message", messageListener);
        try {
          controller.close();
        } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
