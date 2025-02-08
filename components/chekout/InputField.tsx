"use client";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface InputFieldProps {
  label: string;
  type?: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export const InputField = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  error 
}: InputFieldProps) => (
  <div>
    <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
    <Input
      required
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg focus:ring-2 focus:ring-AccentColor text-sm md:text-base"
    />
    {error && (
      <motion.p 
        initial={{ opacity: 0, y: -5 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-red-500 text-sm mt-1"
      >
        {error}
      </motion.p>
    )}
  </div>
);