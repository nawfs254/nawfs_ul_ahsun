"use client";

import { Pencil, Trash2 } from "lucide-react";

interface Props {
  projects: any[];
  loading: boolean;
  onDelete: (id: string) => void;
  onEdit: (project: any) => void;
}

export default function ProjectsTable({
  projects,
  loading,
  onDelete,
  onEdit,
}: Props) {
  if (loading) {
    return <div className="rounded-sm border p-8">Loading...</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <table className="w-full">
        <thead className="border-b border-border bg-muted/40">
          <tr>
            <th className="p-4 text-left">Image</th>

            <th className="p-4 text-left">Title</th>

            <th className="p-4 text-left">Category</th>

            <th className="p-4 text-left">Featured</th>

            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((project) => (
            <tr key={project._id} className="border-b border-border py-1">
              <td
                className="p-4 w-[100px] h-[50px]"
                style={{
                  backgroundImage: `url(${project.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              ></td>

              <td className="p-4">
                <div>
                  <p className="font-medium">{project.title}</p>

                  <p className="line-clamp-1 text-sm text-muted-foreground">
                    {project.description}
                  </p>
                </div>
              </td>

              <td className="p-4">{project.category}</td>

              <td className="p-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    project.featured
                      ? "bg-green-500/10 text-green-500"
                      : "bg-gray-500/10 text-gray-500"
                  }`}
                >
                  {project.featured ? "Featured" : "Normal"}
                </span>
              </td>

              <td className="p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(project)}
                    className="rounded-lg border p-2 hover:bg-muted"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => onDelete(project._id)}
                    className="rounded-lg border border-red-500/20 p-2 text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!projects.length && (
        <div className="p-12 text-center text-muted-foreground">
          No projects found
        </div>
      )}
    </div>
  );
}
