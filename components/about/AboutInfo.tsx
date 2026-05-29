export default function AboutInfo({ data }: { data: any }) {
  return (
    <section>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-blue-500">
        About Me
      </p>

      <h1 className="max-w-3xl text-5xl font-bold md:text-7xl">
        {data.about?.title || "The Story Behind the Developer"}
      </h1>

      <p className="mt-6 max-w-2xl text-muted-foreground">
        {data.about?.subtitle || data.description}
      </p>

      <div className="mt-16 grid gap-12 lg:grid-cols-2">
        <div>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card">
            <img
              src={data.about?.profileImage || "/profile.jpg"}
              alt={data.name}
              className="h-[500px] w-full object-cover"
            />

            <div className="absolute bottom-5 right-5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-2 text-sm text-white">
              {data.hiringStatus}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <h2 className="mb-6 text-4xl font-bold">Who I Am</h2>

          {data.about?.bio?.map((paragraph: string) => (
            <p key={paragraph} className="mb-5 leading-8 text-muted-foreground">
              {paragraph}
            </p>
          ))}

          <div className="mt-8 grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>

              <p className="font-semibold">{data.name}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Role</p>

              <p className="font-semibold">{data.title}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Location</p>

              <p className="font-semibold">{data.location}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Email</p>

              <p className="font-semibold">{data.email}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
