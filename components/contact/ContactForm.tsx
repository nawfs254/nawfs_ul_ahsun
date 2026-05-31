"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        alert("Message sent successfully!");

        setForm({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        alert("Failed to send message");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-8">
      <h2 className="text-3xl font-bold">Send a Message</h2>

      <p className="mt-2 text-muted-foreground">
        Fill out the form and I'll get back to you shortly.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <input
            value={form.firstName}
            onChange={(e) =>
              setForm({
                ...form,
                firstName: e.target.value,
              })
            }
            placeholder="First Name"
            className="rounded-xl border border-border bg-background px-4 py-3"
          />

          <input
            value={form.lastName}
            onChange={(e) =>
              setForm({
                ...form,
                lastName: e.target.value,
              })
            }
            placeholder="Last Name"
            className="rounded-xl border border-border bg-background px-4 py-3"
          />
        </div>

        <input
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
          placeholder="Email Address"
          className="w-full rounded-xl border border-border bg-background px-4 py-3"
        />

        <input
          value={form.subject}
          onChange={(e) =>
            setForm({
              ...form,
              subject: e.target.value,
            })
          }
          placeholder="Subject"
          className="w-full rounded-xl border border-border bg-background px-4 py-3"
        />

        <textarea
          rows={6}
          value={form.message}
          onChange={(e) =>
            setForm({
              ...form,
              message: e.target.value,
            })
          }
          placeholder="Your Message..."
          className="w-full rounded-xl border border-border bg-background px-4 py-3"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 py-4 font-medium text-white"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
