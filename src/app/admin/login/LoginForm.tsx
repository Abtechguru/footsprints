"use client";

import { useState } from "react";
import SubmitButton from "@/components/SubmitButton";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm({ loginAction }: { loginAction: (formData: FormData) => Promise<void> }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={loginAction} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-[#1D1D1D]">Email Address</label>
        <input 
          name="email" 
          type="email" 
          required 
          className="w-full px-4 py-3 rounded-lg border border-[#1D1D1D]/10 focus:outline-none focus:border-[#FD630A] transition-colors"
          placeholder="admin@footprintsenergy.com"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-[#1D1D1D]">Password</label>
        <div className="relative">
          <input 
            name="password" 
            type={showPassword ? "text" : "password"} 
            required 
            className="w-full px-4 py-3 rounded-lg border border-[#1D1D1D]/10 focus:outline-none focus:border-[#FD630A] transition-colors pr-12"
            placeholder="••••••••"
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1D1D1D]/50 hover:text-[#FD630A] transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      <SubmitButton 
        defaultText="Sign In" 
        loadingText="Signing In..." 
        className="w-full bg-[#1D1D1D] text-white font-bold py-4 rounded-lg hover:bg-[#FD630A]"
      />
    </form>
  );
}
