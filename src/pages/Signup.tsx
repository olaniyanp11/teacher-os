import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const { user, signUp } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!fullName.trim() || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(fullName.trim(), email, password);
    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message || "Unable to create account. Please try again.");
      return;
    }

    setSuccessMessage("Account created successfully. Redirecting to your dashboard...");
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-[32px] border border-[#E8E4D9] bg-white p-8 shadow-sm">
        <div className="mb-8 space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#4A5D4E]/10 text-[#4A5D4E]">
            <span className="text-2xl font-black">T</span>
          </div>
          <h1 className="text-2xl font-serif font-black text-[#3D352F]">Create your TeacherOS account</h1>
          <p className="text-sm text-[#8B7E74]">Sign up to save lesson drafts, access the AI classroom assistant, and keep your workspace persistent.</p>
        </div>

        {(errorMessage || successMessage) && (
          <div
            className={`mb-4 rounded-2xl border p-4 text-sm ${
              errorMessage ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {errorMessage || successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8B7E74]">
            Full name
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="mt-2 w-full rounded-3xl border border-[#E8E4D9] bg-[#F9F7F2] px-4 py-3 text-sm text-[#3D352F] focus:border-[#4A5D4E] focus:outline-none"
              placeholder="Teacher Chinedu"
              disabled={isLoading}
            />
          </label>

          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8B7E74]">
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-3xl border border-[#E8E4D9] bg-[#F9F7F2] px-4 py-3 text-sm text-[#3D352F] focus:border-[#4A5D4E] focus:outline-none"
              placeholder="teacher@school.edu.ng"
              disabled={isLoading}
            />
          </label>

          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8B7E74]">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-3xl border border-[#E8E4D9] bg-[#F9F7F2] px-4 py-3 text-sm text-[#3D352F] focus:border-[#4A5D4E] focus:outline-none"
              placeholder="Minimum 8 characters"
              disabled={isLoading}
            />
          </label>

          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8B7E74]">
            Confirm password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="mt-2 w-full rounded-3xl border border-[#E8E4D9] bg-[#F9F7F2] px-4 py-3 text-sm text-[#3D352F] focus:border-[#4A5D4E] focus:outline-none"
              placeholder="Repeat your password"
              disabled={isLoading}
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-3xl bg-[#4A5D4E] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#3D4B3F] disabled:cursor-not-allowed disabled:bg-[#9CA69D]"
          >
            {isLoading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <div className="mt-6 border-t border-[#E8E4D9] pt-4 text-center text-sm text-[#8B7E74]">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#4A5D4E] hover:text-[#3D4B3F]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
