"use client";

import { useState, useEffect, useRef } from "react";

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  status: "unread" | "read" | "replied";
  createdAt: string;
  updatedAt?: string;
  replies?: Array<{
    subject: string;
    replyText: string;
    sentAt: string;
    sentBy: string;
    recipient: string;
  }>;
}

interface UseRealtimeMessagesOptions {
  onNewMessage?: (msg: ContactMessage) => void;
  playAudioAlert?: boolean;
  enabled?: boolean;
}

/**
 * Synthesizes a gentle, premium notification chime using the Web Audio API.
 * Requires no external audio assets and runs safely across all browsers.
 */
export function playMessageChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // Pleasant two-tone bell chime
    osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
    osc.frequency.setValueAtTime(880.0, ctx.currentTime + 0.12); // A5

    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.45);
  } catch {
    // Autoplay restrictions before initial user gesture
  }
}

export function useRealtimeMessages(options: UseRealtimeMessagesOptions = {}) {
  const { onNewMessage, playAudioAlert = true, enabled = true } = options;

  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "reconnecting" | "disconnected"
  >("connecting");
  const [transport, setTransport] = useState<"websocket" | "sse" | "none">("none");
  const [latestMessage, setLatestMessage] = useState<ContactMessage | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const sseRef = useRef<EventSource | null>(null);
  const isCleaningUp = useRef(false);
  const reconnectTimeoutRef = useRef<any>(null);

  // Keep callback reference updated
  const onNewMessageRef = useRef(onNewMessage);
  useEffect(() => {
    onNewMessageRef.current = onNewMessage;
  }, [onNewMessage]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    isCleaningUp.current = false;

    function handleIncomingMessage(msg: ContactMessage) {
      setLatestMessage(msg);
      if (playAudioAlert) {
        playMessageChime();
      }
      if (onNewMessageRef.current) {
        onNewMessageRef.current(msg);
      }
    }

    function startSSEFallback() {
      if (isCleaningUp.current) return;

      // Close existing SSE if any
      if (sseRef.current) {
        sseRef.current.close();
        sseRef.current = null;
      }

      setConnectionStatus("connecting");
      try {
        const sse = new EventSource("/api/admin/messages/stream");
        sseRef.current = sse;

        sse.addEventListener("connected", () => {
          if (!isCleaningUp.current) {
            setConnectionStatus("connected");
            setTransport("sse");
          }
        });

        sse.addEventListener("new_message", (e: MessageEvent) => {
          try {
            const data = JSON.parse(e.data);
            handleIncomingMessage(data);
          } catch (err) {
            console.warn("Failed to parse SSE message data:", err);
          }
        });

        sse.onerror = () => {
          if (!isCleaningUp.current) {
            setConnectionStatus("reconnecting");
          }
        };
      } catch (sseErr) {
        console.warn("SSE fallback connection error:", sseErr);
        setConnectionStatus("disconnected");
      }
    }

    function startWebSocket() {
      if (isCleaningUp.current) return;

      // Determine WebSocket URL based on current host
      const host = window.location.hostname;
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${host}:3001`;

      setConnectionStatus("connecting");

      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        const openTimeout = setTimeout(() => {
          // If WS didn't open within 3.5 seconds, switch over to SSE fallback
          if (ws.readyState !== WebSocket.OPEN && !isCleaningUp.current) {
            ws.close();
            startSSEFallback();
          }
        }, 3500);

        ws.onopen = () => {
          clearTimeout(openTimeout);
          if (!isCleaningUp.current) {
            setConnectionStatus("connected");
            setTransport("websocket");
          }
        };

        ws.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data);
            if (payload.type === "new_message" && payload.data) {
              handleIncomingMessage(payload.data);
            }
          } catch (parseErr) {
            console.warn("WebSocket parse error:", parseErr);
          }
        };

        ws.onerror = () => {
          clearTimeout(openTimeout);
          // If WS encounters error, fallback to SSE
          if (!isCleaningUp.current && transport !== "sse") {
            try {
              ws.close();
            } catch {}
            startSSEFallback();
          }
        };

        ws.onclose = () => {
          clearTimeout(openTimeout);
          if (!isCleaningUp.current && transport !== "sse") {
            // If WS closed unexpectedly, fallback to SSE
            startSSEFallback();
          }
        };
      } catch (wsErr) {
        console.warn("WebSocket initialization error, using SSE fallback:", wsErr);
        startSSEFallback();
      }
    }

    startWebSocket();

    return () => {
      isCleaningUp.current = true;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch {}
        wsRef.current = null;
      }
      if (sseRef.current) {
        try {
          sseRef.current.close();
        } catch {}
        sseRef.current = null;
      }
    };
  }, [enabled, playAudioAlert]);

  return {
    connectionStatus,
    transport,
    latestMessage,
  };
}
