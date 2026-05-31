import { Download } from "lucide-react";

export default function ExperienceHero({ data }: { data: any }) {
  const handleResume = () => {
    const pdfUrl = "/assets/cv.pdf";

    // Open preview in new tab
    window.open(pdfUrl, "_blank");

    // Trigger download
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "Nawfs-Ul-Ahsun_CV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mb-14">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-500">
        Resume
      </p>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="max-w-xl text-5xl font-bold lg:text-6xl">
            {data.experienceHero?.title}
          </h1>

          <p className="mt-5 max-w-2xl text-muted-foreground">
            {data.experienceHero?.subtitle}
          </p>
        </div>

        <button
          onClick={handleResume}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
        >
          <Download size={18} />
          Download Resume
        </button>
      </div>
    </div>
  );
}
