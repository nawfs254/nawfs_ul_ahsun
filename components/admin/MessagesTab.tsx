"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Mail,
  MailOpen,
  Send,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  User,
  Phone,
  RefreshCw,
  Loader2,
  AlertCircle,
  X,
  Reply,
  ExternalLink,
  Inbox,
  Filter,
  Radio,
  Zap,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useRealtimeMessages } from "@/lib/useRealtimeMessages";

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

interface MessagesTabProps {
  onStatsChange?: () => void;
}

export default function MessagesTab({ onStatsChange }: MessagesTabProps) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "unread" | "read" | "replied"
  >("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Live Toast for newly received messages
  const [liveAlert, setLiveAlert] = useState<ContactMessage | null>(null);

  // Reply state
  const [replySubject, setReplySubject] = useState("");
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  // Handle incoming live message simultaneously
  const handleRealtimeNewMessage = useCallback(
    (newMsg: ContactMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === newMsg._id)) return prev;
        return [newMsg, ...prev];
      });

      // Trigger pop-up alert
      setLiveAlert(newMsg);

      if (onStatsChange) {
        onStatsChange();
      }
    },
    [onStatsChange],
  );

  // Real-time WebSocket hook with fallback
  const { connectionStatus, transport } = useRealtimeMessages({
    onNewMessage: handleRealtimeNewMessage,
    playAudioAlert: true,
    enabled: true,
  });

  // Auto-dismiss live alert toast after 8 seconds
  useEffect(() => {
    if (!liveAlert) return;
    const timer = setTimeout(() => {
      setLiveAlert(null);
    }, 8000);
    return () => clearTimeout(timer);
  }, [liveAlert]);

  // Fetch messages from API
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/messages");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setMessages(json.data);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Status counts
  const totalCount = messages.length;
  const unreadCount = messages.filter((m) => m.status === "unread").length;
  const repliedCount = messages.filter((m) => m.status === "replied").length;
  const readCount = messages.filter((m) => m.status === "read").length;

  // Filter & Search
  const filteredMessages = messages.filter((m) => {
    const matchesFilter =
      statusFilter === "all" ? true : m.status === statusFilter;
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (m.name || "").toLowerCase().includes(query) ||
      (m.email || "").toLowerCase().includes(query) ||
      (m.subject || "").toLowerCase().includes(query) ||
      (m.message || "").toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  // Open Message details & mark as read if unread
  const openMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setReplySubject(
      msg.subject.startsWith("Re:")
        ? msg.subject
        : `Re: ${msg.subject || "Portfolio Inquiry"}`,
    );
    setReplyText("");
    setReplySuccess(false);
    setReplyError(null);

    // If unread, automatically mark as read
    if (msg.status === "unread") {
      try {
        await fetch("/api/admin/messages", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: msg._id, status: "read" }),
        });
        setMessages((prev) =>
          prev.map((item) =>
            item._id === msg._id ? { ...item, status: "read" } : item,
          ),
        );
        if (onStatsChange) onStatsChange();
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    }
  };

  // Toggle status
  const handleToggleStatus = async (
    msg: ContactMessage,
    newStatus: "unread" | "read",
  ) => {
    setUpdatingId(msg._id);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: msg._id, status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");

      setMessages((prev) =>
        prev.map((item) =>
          item._id === msg._id ? { ...item, status: newStatus } : item,
        ),
      );

      if (selectedMessage?._id === msg._id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
      if (onStatsChange) onStatsChange();
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete message
  const handleDelete = async (msg: ContactMessage) => {
    if (
      !confirm(
        `Are you sure you want to delete the message from "${msg.name}"?`,
      )
    ) {
      return;
    }

    setDeletingId(msg._id);
    try {
      const res = await fetch(`/api/admin/messages?id=${msg._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete message");

      setMessages((prev) => prev.filter((item) => item._id !== msg._id));
      if (selectedMessage?._id === msg._id) {
        setSelectedMessage(null);
      }
      if (onStatsChange) onStatsChange();
    } catch (err: any) {
      alert(err.message || "Failed to delete message");
    } finally {
      setDeletingId(null);
    }
  };

  // Send Direct Email Reply
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage || !replyText.trim()) return;

    setSendingReply(true);
    setReplyError(null);
    setReplySuccess(false);

    try {
      const res = await fetch("/api/admin/messages/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: selectedMessage._id,
          to: selectedMessage.email,
          subject: replySubject,
          replyText: replyText,
          originalMessage: selectedMessage.message,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send email");
      }

      setReplySuccess(true);
      const newReply = data.reply;

      // Update local state
      const updatedReplies = [...(selectedMessage.replies || []), newReply];
      const updatedMessage: ContactMessage = {
        ...selectedMessage,
        status: "replied",
        replies: updatedReplies,
      };

      setSelectedMessage(updatedMessage);
      setMessages((prev) =>
        prev.map((item) =>
          item._id === selectedMessage._id ? updatedMessage : item,
        ),
      );

      setReplyText("");
      if (onStatsChange) onStatsChange();
    } catch (err: any) {
      setReplyError(err.message || "Failed to send email reply");
    } finally {
      setSendingReply(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <span>Visitor Inquiries & Inbox</span>
            {unreadCount > 0 && (
              <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                {unreadCount} unread
              </span>
            )}
          </h2>
          <p className="text-sm text-muted-foreground">
            Messages sent by portfolio visitors saved in MongoDB. Reply directly
            to their email via Gmail SMTP.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          {/* Live Sync Status Pill */}
          {connectionStatus === "connected" ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>
                {transport === "websocket" ? "WebSocket Live (3001)" : "Live"}
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold">
              <Loader2 size={12} className="animate-spin text-amber-500" />
              <span>Connecting Live...</span>
            </div>
          )}

          <button
            onClick={fetchMessages}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold transition-all cursor-pointer"
            title="Refresh Inbox"
          >
            <RefreshCw
              size={13}
              className={loading ? "animate-spin text-blue-500" : ""}
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Real-time Message Alert Banner */}
      {liveAlert && (
        <div className="p-4 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 shadow-lg shadow-emerald-500/5 flex items-center justify-between gap-3 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Zap size={18} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">
                  ⚡ New message from {liveAlert.name}!
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                  Live
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate max-w-md">
                {liveAlert.subject || "Portfolio Inquiry"}: &quot;
                {liveAlert.message}&quot;
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => openMessage(liveAlert)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              View & Reply
            </button>
            <button
              onClick={() => setLiveAlert(null)}
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
              title="Dismiss alert"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div
          onClick={() => setStatusFilter("all")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === "all"
              ? "border-blue-500 bg-blue-500/5 shadow-xs"
              : "border-border/80 bg-card hover:border-blue-500/30"
          }`}
        >
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-semibold">Total Received</span>
            <Inbox size={16} />
          </div>
          <div className="text-2xl font-bold text-foreground">{totalCount}</div>
        </div>

        <div
          onClick={() => setStatusFilter("unread")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === "unread"
              ? "border-cyan-500 bg-cyan-500/5 shadow-xs"
              : "border-border/80 bg-card hover:border-cyan-500/30"
          }`}
        >
          <div className="flex items-center justify-between text-cyan-500 mb-1">
            <span className="text-xs font-semibold">Unread</span>
            <Mail size={16} />
          </div>
          <div className="text-2xl font-bold text-cyan-500">{unreadCount}</div>
        </div>

        <div
          onClick={() => setStatusFilter("replied")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === "replied"
              ? "border-emerald-500 bg-emerald-500/5 shadow-xs"
              : "border-border/80 bg-card hover:border-emerald-500/30"
          }`}
        >
          <div className="flex items-center justify-between text-emerald-500 mb-1">
            <span className="text-xs font-semibold">Replied</span>
            <CheckCircle2 size={16} />
          </div>
          <div className="text-2xl font-bold text-emerald-500">
            {repliedCount}
          </div>
        </div>

        <div
          onClick={() => setStatusFilter("read")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === "read"
              ? "border-slate-500 bg-slate-500/5 shadow-xs"
              : "border-border/80 bg-card hover:border-slate-500/30"
          }`}
        >
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-semibold">Read</span>
            <MailOpen size={16} />
          </div>
          <div className="text-2xl font-bold text-foreground">{readCount}</div>
        </div>
      </div>

      {/* Controls Bar: Search & Status Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border/80">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search by name, email, subject, or message content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-border bg-background outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto pb-1 sm:pb-0">
          {(["all", "unread", "replied", "read"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                statusFilter === filter
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      {loading && messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-border/80">
          <Loader2 size={32} className="animate-spin text-blue-500 mb-2" />
          <span className="text-xs text-muted-foreground font-medium">
            Loading inbox messages...
          </span>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-card rounded-2xl border border-border/80">
          <div className="h-12 w-12 rounded-2xl bg-muted/60 text-muted-foreground flex items-center justify-center mb-3">
            <Inbox size={24} />
          </div>
          <h3 className="text-sm font-bold text-foreground">
            No messages found
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            {search || statusFilter !== "all"
              ? "No messages match your search filter. Try clearing filters or searching for different keywords."
              : "When visitors submit your portfolio contact form, their inquiries will be delivered and saved right here."}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredMessages.map((msg) => {
            const isUnread = msg.status === "unread";
            const isReplied = msg.status === "replied";

            return (
              <div
                key={msg._id}
                className={`group rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 ${
                  isUnread
                    ? "border-blue-500/40 bg-blue-500/[0.03] shadow-xs hover:border-blue-500"
                    : "border-border/80 bg-card hover:border-blue-500/30"
                }`}
              >
                {/* Left: Avatar & Message Summary */}
                <div
                  onClick={() => openMessage(msg)}
                  className="flex items-start gap-3.5 flex-1 cursor-pointer min-w-0"
                >
                  {/* Avatar Circle */}
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-xs ${
                      isUnread
                        ? "bg-gradient-to-tr from-blue-600 to-cyan-400"
                        : isReplied
                          ? "bg-gradient-to-tr from-emerald-600 to-teal-400"
                          : "bg-gradient-to-tr from-slate-600 to-slate-400"
                    }`}
                  >
                    {(msg.name || "U")[0].toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span
                        className={`text-sm font-bold ${isUnread ? "text-foreground" : "text-foreground/90"}`}
                      >
                        {msg.name}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">
                        &lt;{msg.email}&gt;
                      </span>

                      {/* Status Badges */}
                      {isUnread && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-500 border border-blue-500/25">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                          New
                        </span>
                      )}
                      {isReplied && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-500 border border-emerald-500/25">
                          <CheckCircle2 size={10} />
                          Replied ({msg.replies?.length || 1})
                        </span>
                      )}
                    </div>

                    {/* Subject Line */}
                    <p
                      className={`text-xs ${isUnread ? "font-semibold text-foreground" : "text-muted-foreground"} truncate`}
                    >
                      {msg.subject || "No Subject"}
                    </p>

                    {/* Message Preview Snippet */}
                    <p className="text-xs text-muted-foreground/80 line-clamp-1 mt-1">
                      {msg.message}
                    </p>
                  </div>
                </div>

                {/* Right: Date & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap font-mono flex items-center gap-1">
                    <Clock size={12} />
                    {formatDate(msg.createdAt)}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openMessage(msg)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 text-xs font-semibold transition-colors cursor-pointer"
                      title="View & Reply"
                    >
                      <Reply size={13} />
                      <span>Reply</span>
                    </button>

                    {isUnread ? (
                      <button
                        onClick={() => handleToggleStatus(msg, "read")}
                        disabled={updatingId === msg._id}
                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
                        title="Mark as read"
                      >
                        <MailOpen size={15} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleStatus(msg, "unread")}
                        disabled={updatingId === msg._id}
                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
                        title="Mark as unread"
                      >
                        <Mail size={15} />
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(msg)}
                      disabled={deletingId === msg._id}
                      className="p-1.5 text-red-500/80 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete message"
                    >
                      {deletingId === msg._id ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Message Details & Email Reply Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border/80 flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold flex items-center justify-center shadow-xs">
                  {selectedMessage.name[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground leading-tight">
                    {selectedMessage.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-blue-500 hover:underline flex items-center gap-1 font-mono"
                    >
                      {selectedMessage.email} <ExternalLink size={11} />
                    </a>
                    {selectedMessage.phone && (
                      <span className="flex items-center gap-1 font-mono">
                        • <Phone size={11} /> {selectedMessage.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(selectedMessage)}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                  title="Delete message"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors cursor-pointer"
                  title="Close dialog"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body: Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Message Header info */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-muted/30 border border-border/60 text-xs">
                <div>
                  <span className="text-muted-foreground font-medium">
                    Subject:{" "}
                  </span>
                  <span className="font-bold text-foreground">
                    {selectedMessage.subject || "No Subject"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground font-mono text-[11px]">
                  <Clock size={12} />
                  <span>{formatDate(selectedMessage.createdAt)}</span>
                </div>
              </div>

              {/* Original Visitor Message Content */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Visitor Message
                </label>
                <div className="rounded-2xl border border-border/80 bg-background p-4 text-sm leading-relaxed text-foreground whitespace-pre-wrap select-text font-normal shadow-inner">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Previous Reply Thread if any */}
              {selectedMessage.replies &&
                selectedMessage.replies.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-semibold text-emerald-500 uppercase tracking-wider">
                      Sent Email Replies ({selectedMessage.replies.length})
                    </label>
                    {selectedMessage.replies.map((rep, rIdx) => (
                      <div
                        key={rIdx}
                        className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between text-muted-foreground font-mono text-[11px] pb-1 border-b border-emerald-500/20">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            To: {rep.recipient || selectedMessage.email}
                          </span>
                          <span>{formatDate(rep.sentAt)}</span>
                        </div>
                        <p className="text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                          {rep.replyText}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

              {/* Reply Form */}
              <div className="pt-3 border-t border-border/60 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Send size={13} className="text-blue-500" />
                    Send Direct Email Reply via Gmail
                  </h4>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    Sender: {process.env.NEXT_PUBLIC_EMAIL_USER || "Gmail SMTP"}
                  </span>
                </div>

                {replySuccess && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs animate-in fade-in">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span>
                      Email sent successfully! Message status updated to
                      "Replied".
                    </span>
                  </div>
                )}

                {replyError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs animate-in fade-in">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{replyError}</span>
                  </div>
                )}

                <form onSubmit={handleSendReply} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={replySubject}
                      onChange={(e) => setReplySubject(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-medium outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Email Reply Content
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Hi ${selectedMessage.name},\n\nThank you for reaching out! Regarding your inquiry...`}
                      className="w-full rounded-xl border border-border bg-background p-3.5 text-xs font-normal outline-none focus:border-blue-500 leading-relaxed resize-y"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMessage(null)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      disabled={sendingReply || !replyText.trim()}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {sendingReply ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          <span>Sending via Gmail...</span>
                        </>
                      ) : (
                        <>
                          <Send size={13} />
                          <span>Send Email Reply</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
