"use client";

import { Plus, Trash2 } from "lucide-react";
import { ReactNode } from "react";

interface Props {
  title: string;
  icon?: ReactNode;
  values: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

export default function StringArrayEditor({ title, icon, values, onChange, placeholder = "Enter value" }: Props) {
  const updateItem = (index: number, value: string) => {
    const updated = [...values];
    updated[index] = value;
    onChange(updated);
  };

  const removeItem = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {icon} {title}
        </label>

        <button
          type="button"
          onClick={() => onChange([...(values || []), ""])}
          className="flex items-center gap-1.5 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/40"
        >
          <Plus size={14} /> Add {title.replace(/s$/, '')}
        </button>
      </div>

      <div className="space-y-3">
        {(!values || values.length === 0) && (
          <div className="rounded-xl border border-dashed border-border py-4 text-center text-sm text-muted-foreground">
            No items added yet.
          </div>
        )}

        {(values || []).map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={placeholder}
              className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
            />

            <button
              type="button"
              onClick={() => removeItem(index)}
              className="flex shrink-0 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300 dark:border-red-900/30 dark:bg-red-900/20 dark:hover:bg-red-900/40 px-3 transition-colors"
              title="Remove Item"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

