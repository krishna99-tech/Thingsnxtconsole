import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input, Button, Checkbox } from "@heroui/react";
import { Zap, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!email || !password) {
      setError("Please enter your credentials.");
      return;
    }
    setError("");
    setLoading(true);
    // Tiny artificial delay for UX realism
    await new Promise(r => setTimeout(r, 700));
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient orbs */}
      <div aria-hidden="true" className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="glass bg-black/40 rounded-3xl border border-white/10 p-8 shadow-2xl shadow-black/50">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 mb-4">
              <Zap size={28} fill="currentColor" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">IOT Console</h1>
            <p className="text-white/40 text-sm mt-1">Sign in to your admin workspace</p>
          </div>

          {/* Hint card */}
          <div className="mb-6 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
            <AlertCircle size={16} className="text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-xs text-blue-300/80 leading-relaxed">
              <span className="font-semibold">Demo credentials — </span>
              Email: <code className="bg-white/10 px-1 rounded">admin</code> &nbsp;·&nbsp;
              Password: <code className="bg-white/10 px-1 rounded">admin</code>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            aria-label="Login form"
            className="space-y-4"
          >
            <Input
              id="email"
              label="Email or Username"
              placeholder="admin@iot-console.com"
              type="email"
              autoComplete="username"
              value={email}
              onValueChange={(v) => { setEmail(v); setError(""); }}
              startContent={<Mail size={16} className="text-white/40" aria-hidden="true" />}
              isInvalid={!!error}
              classNames={{
                inputWrapper: "bg-white/5 border border-white/10 hover:border-white/20 group-data-[focus=true]:border-blue-500 group-data-[focus=true]:bg-white/10",
                label: "text-white/60",
                input: "text-white placeholder:text-white/20",
              }}
              aria-describedby={error ? "login-error" : undefined}
              aria-required="true"
            />

            <Input
              id="password"
              label="Password"
              placeholder="••••••••"
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onValueChange={(v) => { setPassword(v); setError(""); }}
              startContent={<Lock size={16} className="text-white/40" aria-hidden="true" />}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="text-white/30 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              isInvalid={!!error}
              classNames={{
                inputWrapper: "bg-white/5 border border-white/10 hover:border-white/20 group-data-[focus=true]:border-blue-500 group-data-[focus=true]:bg-white/10",
                label: "text-white/60",
                input: "text-white placeholder:text-white/20",
              }}
              aria-required="true"
            />

            {/* Error */}
            {error && (
              <motion.div
                id="login-error"
                role="alert"
                aria-live="assertive"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-rose-400 text-sm p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl"
              >
                <AlertCircle size={15} aria-hidden="true" />
                {error}
              </motion.div>
            )}

            <div className="flex items-center justify-between pt-1">
              <Checkbox
                size="sm"
                isSelected={remember}
                onValueChange={setRemember}
                classNames={{ label: "text-white/50 text-xs" }}
                aria-label="Remember me"
              >
                Remember me
              </Checkbox>
              <button
                type="button"
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              isLoading={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold h-11 rounded-xl shadow-lg shadow-blue-600/30 transition-all"
              endContent={!loading && <ArrowRight size={18} aria-hidden="true" />}
              aria-label="Sign in to IOT Console"
            >
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-xs text-white/20 mt-6">
            IOT Console · Enterprise Admin Hub · v2.4.1
          </p>
        </div>
      </motion.div>
    </div>
  );
};
