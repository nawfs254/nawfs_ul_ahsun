import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

interface HeroProps {
  profile: any;
}

export default function HeroSection({ profile }: HeroProps) {
  return (
    <section className="max-w-7xl mx-auto min-h-[calc(100vh-80px)] flex items-center px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-center w-full mt-3">
        {/* LEFT */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1 text-xs text-cyan-500">
            <span className="h-2 w-2 rounded-full bg-cyan-500" />
            Available for work — Open to opportunities
          </div>

          <h1 className="mt-5 text-4xl lg:text-5xl font-black leading-none">
            Hi, I'm
            <br />
            {profile.name}
          </h1>

          <h2 className="mt-6 text-2xl text-muted-foreground">
            {profile.title}
          </h2>

          <p className="text-xs md:text-base mt-6 max-w-xl text-muted-foreground leading-8 text-justify">
            {profile.description}
          </p>

          <div className="mt-10 flex gap-4">
            <button className="px-6 py-3 rounded-xl bg-linear-to-r from-blue-700 to-blue-500 text-white font-medium text-sm md:text-base">
              View Projects
            </button>

            <button className="px-6 py-3 rounded-xl border border-border text-sm md:text-base">
              Contact Me
            </button>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <a className="h-12 w-12 rounded-full border flex items-center justify-center">
              <FaGithub />
            </a>

            <a className="h-12 w-12 rounded-full border flex items-center justify-center">
              <FaLinkedin />
            </a>

            <a className="h-12 w-12 rounded-full border flex items-center justify-center">
              <FaEnvelope />
            </a>

            <span className="text-muted-foreground ml-2">Find me on</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col items-center md:items-end">
          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-cyan-500/20 rounded-full" />

            <img
              src="/assets/image.jpg"
              alt={profile.name}
              className="relative h-[360px] w-[320px] object-cover rounded-[32px]"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 w-full max-w-md">
            <StatCard value="2+" label="Years Exp." />
            <StatCard value="15+" label="Projects" />
            <StatCard value="8+" label="Tech Stack" />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5 text-center">
      <h3 className="text-3xl font-bold text-blue-500">{value}</h3>

      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
