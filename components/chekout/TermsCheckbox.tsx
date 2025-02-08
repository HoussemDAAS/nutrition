"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";

interface TermsCheckboxProps {
  checked: boolean;
  error?: string;
  onChange: (checked: boolean) => void;
}

export const TermsCheckbox = ({ 
  checked, 
  error, 
  onChange 
}: TermsCheckboxProps) => (
  <div className="flex flex-col">
    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
      <Checkbox
        id="terms"
        checked={checked}
        onCheckedChange={(checked) => onChange(!!checked)}
        className="mt-1 focus:ring-2 focus:ring-AccentColor"
      />
      <label htmlFor="terms" className="text-sm text-gray-600">
        J&apos;accepte les termes et conditions *
      </label>
    </div>
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