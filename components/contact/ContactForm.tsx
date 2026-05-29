"use client";

export default function ContactForm() {
  return (
    <div className="rounded-3xl border border-border bg-card p-8">
      <h2 className="text-3xl font-bold">Send a Message</h2>

      <p className="mt-2 text-muted-foreground">
        Fill out the form and I'll get back to you shortly.
      </p>

      <form className="mt-8 space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <input
            placeholder="First Name"
            className="rounded-xl border border-border bg-background px-4 py-3 outline-none"
          />

          <input
            placeholder="Last Name"
            className="rounded-xl border border-border bg-background px-4 py-3 outline-none"
          />
        </div>

        <input
          placeholder="Email Address"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none"
        />

        <input
          placeholder="Subject"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none"
        />

        <textarea
          rows={6}
          placeholder="Your Message..."
          className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none"
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 py-4 font-medium text-white"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
