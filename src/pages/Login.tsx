import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REGISTER_ROWS = [
  { label: "Mon", marked: true },
  { label: "Tue", marked: true },
  { label: "Wed", marked: true },
  { label: "Thu", marked: true },
  { label: "Fri", marked: false },
];

export default function Login() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message || "Invalid credentials. Please try again.");
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] flex">
      {/* Left panel — signature register motif, hidden below lg */}
      <div className="hidden lg:flex lg:w-[44%] xl:w-[40%] relative bg-[#4A5D4E] flex-col justify-between px-12 py-14 overflow-hidden">
        {/* faint ruled texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent, transparent 43px, #F9F7F2 43px, #F9F7F2 44px)",
          }}
        />

        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F9F7F2] text-[#4A5D4E]">
            <span className="text-lg font-black">T</span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#F9F7F2]/70">
            TeacherOS
          </span>
        </div>

        <div className="relative space-y-10">
          <h1 className="font-serif text-4xl xl:text-[42px] font-black leading-[1.1] text-[#F9F7F2]">
            Your register is
            <br />
            still open.
          </h1>
          <p className="max-w-xs text-[15px] leading-relaxed text-[#F9F7F2]/75">
            Sign back in to pick up your lesson plans, grading, and AI tools
            right where you left them.
          </p>

          {/* Signature: weekly register ledger */}
          <div className="rounded-3xl border border-[#F9F7F2]/15 bg-[#F9F7F2]/[0.06] p-5">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#F9F7F2]/50">
              This week's attendance
            </p>
            <ul className="space-y-3">
              {REGISTER_ROWS.map((row) => (
                <li
                  key={row.label}
                  className="flex items-center justify-between border-b border-[#F9F7F2]/10 pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-sm text-[#F9F7F2]/80">{row.label}</span>
                  {row.marked ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E6A05D] text-[#3D352F]">
                      <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
                        <path
                          d="M2 6.2L4.8 9 10 3"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  ) : (
                    <span className="h-5 w-5 rounded-full border border-dashed border-[#F9F7F2]/30" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="relative text-[11px] text-[#F9F7F2]/40">
          Built for the classroom, not the boardroom.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:py-14">
        <div className="w-full max-w-[400px]">
          <div className="mb-8 space-y-2 lg:text-left text-center">
            <div className="mx-auto lg:mx-0 mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E6A05D]/10 text-[#4A5D4E] lg:hidden">
              <span className="text-2xl font-black">T</span>
            </div>
            <h2 className="font-serif text-[28px] font-black leading-tight text-[#3D352F]">
              Welcome back
            </h2>
            <p className="text-sm text-[#8B7E74]">
              Sign in to continue using TeacherOS with your saved workspace
              and AI tools.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-[#8B7E74]"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-[#E8E4D9] bg-white px-4 py-3 text-sm text-[#3D352F] placeholder:text-[#B8AFA4] transition-colors focus:border-[#4A5D4E] focus:outline-none focus:ring-2 focus:ring-[#4A5D4E]/15"
                placeholder="teacher@school.edu.ng"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-[11px] font-bold uppercase tracking-wider text-[#8B7E74]"
                >
                  Password
                </label>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-[#E8E4D9] bg-white px-4 py-3 text-sm text-[#3D352F] placeholder:text-[#B8AFA4] transition-colors focus:border-[#4A5D4E] focus:outline-none focus:ring-2 focus:ring-[#4A5D4E]/15"
                placeholder="Enter your password"
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#4A5D4E] px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#3D4B3F] disabled:cursor-not-allowed disabled:bg-[#9CA69D]"
            >
              {isLoading && (
                <svg
                  className="h-4 w-4 animate-spin text-white/80"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              )}
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 border-t border-[#E8E4D9] pt-5 text-center text-sm text-[#8B7E74]">
            <p>
              New to TeacherOS?{" "}
              <Link
                to="/signup"
                className="font-semibold text-[#4A5D4E] hover:text-[#3D4B3F]"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}