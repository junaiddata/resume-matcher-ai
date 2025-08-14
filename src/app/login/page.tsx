"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      window.location.href = "/";
    }
    
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem"
    }}>
      <main style={{
        background: "white",
        padding: "3rem 2rem",
        borderRadius: "10px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <h1 style={{
          fontSize: "2rem",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "2rem",
          color: "#333"
        }}>Welcome Back</h1>
        
        {error && (
          <div style={{
            background: "#fee",
            color: "#c00",
            padding: "0.75rem",
            borderRadius: "5px",
            marginBottom: "1rem",
            fontSize: "0.9rem",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              marginBottom: "0.5rem",
              color: "#555",
              fontSize: "0.9rem",
              fontWeight: "500"
            }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "1rem",
                border: "2px solid #e0e0e0",
                borderRadius: "5px",
                outline: "none",
                transition: "border-color 0.3s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#667eea"}
              onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              marginBottom: "0.5rem",
              color: "#555",
              fontSize: "0.9rem",
              fontWeight: "500"
            }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "1rem",
                border: "2px solid #e0e0e0",
                borderRadius: "5px",
                outline: "none",
                transition: "border-color 0.3s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#667eea"}
              onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.75rem",
              fontSize: "1rem",
              fontWeight: "600",
              color: "white",
              background: loading ? "#999" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "transform 0.2s",
              marginBottom: "1rem"
            }}
            onMouseOver={(e) => !loading && (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        

        <div className="space-y-3">
            <button onClick={() => signIn("google", { callbackUrl: "/" })} className="w-full py-3 px-4 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-2" />
              <span className="text-gray-700">Continue with Google</span>
            </button>
          </div>

        <div style={{
          textAlign: "center",
          marginTop: "1.5rem",
          paddingTop: "1.5rem",
          borderTop: "1px solid #e0e0e0"
        }}>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>
            Don't have an account?{" "}
            <a
              href="/signup"
              style={{
                color: "#667eea",
                textDecoration: "none",
                fontWeight: "600"
              }}
              onMouseOver={(e) => e.currentTarget.style.textDecoration = "underline"}
              onMouseOut={(e) => e.currentTarget.style.textDecoration = "none"}
            >
              Sign up
            </a>
          </p>
        </div>

        <div style={{
          textAlign: "center",
          marginTop: "1rem"
        }}>
          <a
            href="/"
            style={{
              color: "#999",
              textDecoration: "none",
              fontSize: "0.85rem"
            }}
            onMouseOver={(e) => e.currentTarget.style.color = "#667eea"}
            onMouseOut={(e) => e.currentTarget.style.color = "#999"}
          >
            ← Back to home
          </a>
        </div>
      </main>
    </div>
  );
}