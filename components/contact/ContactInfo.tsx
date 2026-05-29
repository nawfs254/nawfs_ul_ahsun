import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactInfo({ data }: { data: any }) {
  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-cyan-500/30 bg-cyan-500/5 p-6">
        <h3 className="font-semibold">Available for Work</h3>

        <p className="mt-2 text-sm text-muted-foreground">
          {data.hiringStatus}
        </p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex gap-4">
          <Mail className="text-blue-500" size={20} />

          <div>
            <p className="text-sm text-muted-foreground">Email</p>

            <p>{data.email}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex gap-4">
          <Phone className="text-blue-500" size={20} />

          <div>
            <p className="text-sm text-muted-foreground">Phone</p>

            <p>{data.phone}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex gap-4">
          <MapPin className="text-blue-500" size={20} />

          <div>
            <p className="text-sm text-muted-foreground">Location</p>

            <p>{data.location}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <h3 className="mb-5 font-semibold">Social Links</h3>

        <div className="space-y-3">
          {data.contactLinks?.map((link: any) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              className="flex items-center justify-between rounded-xl border border-border p-4 transition hover:bg-muted"
            >
              <span>{link.name}</span>

              <span>↗</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
