
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const supabase = createClient();

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.session) {
          window.location.href = "/";
          return;
        }

        setMessage(
          "Registration request successful. আপনার ইমেইল চেক করুন এবং confirmation link থাকলে সেটিতে ক্লিক করুন।"
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        window.location.href = "/";
        return;
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "কোনো সমস্যা হয়েছে। আবার চেষ্টা করুন।"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        maxWidth: 440,
        margin: "60px auto",
        padding: 24,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>BD JobPilot</h1>
      <h2>{mode === "login" ? "Login করুন" : "নতুন অ্যাকাউন্ট তৈরি করুন"}</h2>
      <p>আপনার চাকরি খোঁজার যাত্রা শুরু করুন।</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">ইমেইল ঠিকানা</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          style={{ display: "block", width: "100%", padding: 12, margin: "8px 0 18px" }}
        />

        <label htmlFor="password">পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)</label>
        <input
          id="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          style={{ display: "block", width: "100%", padding: 12, margin: "8px 0 18px" }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: 12, cursor: "pointer" }}
        >
          {loading
            ? "অপেক্ষা করুন..."
            : mode === "login"
              ? "Login"
              : "Registration করুন"}
        </button>
      </form>

      {message && (
        <p role="status" style={{ overflowWrap: "anywhere", marginTop: 18 }}>
          {message}
        </p>
      )}

      <p style={{ marginTop: 22 }}>
        {mode === "login"
          ? "নতুন ব্যবহারকারী?"
          : "আগে থেকেই অ্যাকাউন্ট আছে?"}{" "}
        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setMessage("");
          }}
        >
          {mode === "login" ? "Registration করুন" : "Login করুন"}
        </button>
      </p>

      <Link href="/">মূল পেজে ফিরে যান</Link>
    </main>
  );
}
