"use client";
import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  input: ReactNode;
}

export default function FormField({ label, error, input }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {input}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
