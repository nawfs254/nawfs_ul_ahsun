import { GraduationCap, Award } from "lucide-react";

export default function EducationSection({
  education,
  certifications,
}: {
  education: any[];
  certifications: any[];
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-500">
        Education
      </p>

      <h2 className="mb-8 text-3xl font-bold">Qualifications</h2>

      <div className="space-y-4">
        {education.map((item) => (
          <div
            key={item.degree}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex gap-4">
              <GraduationCap className="text-blue-500" size={20} />

              <div>
                <h3 className="font-semibold">{item.degree}</h3>

                <p className="text-muted-foreground">{item.institute}</p>

                <p className="mt-1 text-sm text-blue-500">{item.result}</p>
              </div>
            </div>
          </div>
        ))}

        {certifications?.map((cert) => (
          <div
            key={cert.title}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex gap-4">
              <Award className="text-blue-500" size={20} />

              <div>
                <h3 className="font-semibold">{cert.title}</h3>

                <p className="text-muted-foreground">{cert.issuer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
