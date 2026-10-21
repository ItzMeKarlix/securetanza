"use client";

import { useMemo, useState } from "react";
import { Shield, AlertCircle, Loader2 } from "lucide-react";
import { AUTH_BADGE, AUTH_ERROR, AUTH_PRIMARY, AUTH_SUBTITLE, AUTH_TITLE } from "@/components/auth/auth-shell";
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
    <div className="fixed inset-0 z-[100] flex overflow-y-auto bg-slate-950/50 p-4 py-8 dark:bg-black/70">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="force-change-title"
        className="relative mx-auto my-auto w-full max-w-md animate-in fade-in zoom-in-95 duration-200 rounded-xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/20 dark:border-white/10 dark:bg-[#0F172A] dark:shadow-black/50"
      >
        <div className="mb-8">
          <div className={AUTH_BADGE}>
            <Shield className="h-5 w-5" />
          </div>
          <h1 id="force-change-title" className={AUTH_TITLE}>
            Change your temporary password
          </h1>
          <p className={AUTH_SUBTITLE}>
            For your security, please change your temporary password before accessing the system.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className={AUTH_ERROR} role="alert">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p>{error}</p>
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

          <button
            type="submit"
            disabled={loading || !isStrong || confirmPassword.length === 0 || newPassword !== confirmPassword}
            className={`${AUTH_PRIMARY} mt-2`}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving…
              </>
            ) : (
              "Secure Account & Continue"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
