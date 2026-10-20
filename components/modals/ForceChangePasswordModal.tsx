"use client";

import { useMemo, useState } from "react";
import { Shield, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { passwordUserInputs } from "@/lib/password-policy";
import { PasswordFields } from "@/components/auth/password-fields";
import { usePasswordCheck } from "@/hooks/usePasswordCheck";

interface ForceChangePasswordModalProps {
  onSuccess: () => void;
}

export function ForceChangePasswordModal({ onSuccess }: ForceChangePasswordModalProps) {
  const { user, refreshSession } = useAuth();
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordInputs = useMemo(() => passwordUserInputs(user), [user]);
  const passwordCheck = usePasswordCheck(newPassword, passwordInputs);
  const isStrong = passwordCheck.allPassed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isStrong) {
      setError("Please meet all password security requirements.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to change password");
      }

      await refreshSession();
      onSuccess();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0EA5E9]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8 relative z-10">
            <div className="w-16 h-16 bg-[#0EA5E9]/10 rounded-2xl flex items-center justify-center mb-5 rotate-3 hover:rotate-0 transition-transform duration-300">
              <Shield className="w-8 h-8 text-[#0EA5E9]" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
              Action Required
            </h1>
            <p className="text-sm text-slate-400 max-w-[280px]">
              For your security, please change your temporary password before accessing the system.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            <PasswordFields
              newPassword={newPassword}
              onNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              onConfirmPassword={setConfirmPassword}
              check={passwordCheck}
              disabled={loading}
            />

            <Button
              type="submit"
              disabled={loading || !isStrong || confirmPassword.length === 0 || newPassword !== confirmPassword}
              className="w-full h-12 mt-4 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-semibold flex items-center justify-center gap-2 group transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-400 border-t-slate-900 rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Secure Account & Continue
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
