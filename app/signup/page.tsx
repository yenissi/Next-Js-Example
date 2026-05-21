"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all fields correctly");
      return;
    }

    setLoading(true);

    try {
      // Get existing accounts
      const existingAccounts = JSON.parse(
        localStorage.getItem("accounts") || "[]"
      );

      // Check if email already exists
      const emailExists = existingAccounts.some(
        (acc: any) => acc.email === formData.email
      );

      if (emailExists) {
        toast.error("This email is already registered");
        setLoading(false);
        return;
      }

      // Add new account
      const newAccount = {
        id: Date.now(),
        ...formData,
      };

      existingAccounts.push(newAccount);
      localStorage.setItem("accounts", JSON.stringify(existingAccounts));

      toast.success("Account created successfully! You can now log in.");

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
      });

      // Redirect to login page after 1.5 seconds
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-black
        flex items-center justify-center
        px-4
      "
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="
          w-full max-w-md
          rounded-3xl
          border border-neutral-800
          bg-neutral-950
          p-8
          shadow-2xl
        "
      >
        {/* HEADER */}
        <div className="mb-8 flex flex-col items-center">
          <div
            className="
              mb-4 flex h-16 w-16 items-center justify-center
              rounded-2xl bg-blue-600
              text-2xl font-bold text-white
            "
          >
            NJ
          </div>

          <h1 className="text-3xl font-bold text-white">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-neutral-400">
            Sign up to continue
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* NAME */}
          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Full Name
            </label>

            <div
              className={`
                flex items-center gap-3
                rounded-xl border px-4
                bg-neutral-900
                ${errors.name ? "border-red-500" : "border-neutral-700"}
              `}
            >
              <User className="h-5 w-5 text-neutral-400" />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="
                  w-full bg-transparent py-4
                  text-white outline-none
                  placeholder:text-neutral-500
                "
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Email
            </label>

            <div
              className={`
                flex items-center gap-3
                rounded-xl border px-4
                bg-neutral-900
                ${errors.email ? "border-red-500" : "border-neutral-700"}
              `}
            >
              <Mail className="h-5 w-5 text-neutral-400" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="
                  w-full bg-transparent py-4
                  text-white outline-none
                  placeholder:text-neutral-500
                "
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Password
            </label>

            <div
              className={`
                flex items-center gap-3
                rounded-xl border px-4
                bg-neutral-900
                ${errors.password ? "border-red-500" : "border-neutral-700"}
              `}
            >
              <Lock className="h-5 w-5 text-neutral-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="
                  w-full bg-transparent py-4
                  text-white outline-none
                  placeholder:text-neutral-500
                "
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-neutral-400 hover:text-white transition"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 cursor-pointer" />
                ) : (
                  <Eye className="h-5 w-5 cursor-pointer" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full rounded-xl
              bg-blue-600 py-4
              font-semibold text-white
              transition hover:bg-blue-500
              disabled:opacity-50 disabled:cursor-not-allowed
              cursor-pointer
            "
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="mt-6 text-center text-sm text-neutral-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-500 hover:text-blue-400"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
