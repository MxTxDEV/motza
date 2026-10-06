"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  multiline?: false;
}

const base = "w-full border bg-transparent px-4 py-3.5 text-base text-paper placeholder:text-bone/30 transition-colors focus:border-bone focus:outline-none";

export function Field({ label, error, className, ...rest }: FieldProps) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="t-eyebrow mb-2 block text-bone">
        {label}
        {rest.required && <span aria-hidden className="text-signal"> *</span>}
      </label>
      <input id={id} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} className={cn(base, error ? "border-signal" : "border-bone/30")} {...rest} />
      {error && <p id={`${id}-err`} className="mt-1.5 text-sm text-signal">{error}</p>}
    </div>
  );
}

export function TextArea({ label, error, className, ...rest }: Omit<FieldProps, "type"> & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="t-eyebrow mb-2 block text-bone">
        {label}
        {rest.required && <span aria-hidden className="text-signal"> *</span>}
      </label>
      <textarea id={id} rows={6} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} className={cn(base, "resize-y", error ? "border-signal" : "border-bone/30")} {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} />
      {error && <p id={`${id}-err`} className="mt-1.5 text-sm text-signal">{error}</p>}
    </div>
  );
}
