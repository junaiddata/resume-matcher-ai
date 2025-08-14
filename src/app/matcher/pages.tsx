"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";


export default function Home() {
  const [jd, setJd] = useState("");
  const { data: session } = useSession();
  
  const [files, setFiles] = useState<FileList | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

const handleUpload = async () => {
  if (!jd || !files) return alert("Please enter JD and upload files.");
  if (!session?.user?.email) return alert("Please log in to continue.");

  setLoading(true);
  const newResults = [];

  for (const file of Array.from(files)) {
    const reader = new FileReader();
    const text = await new Promise<string>((resolve) => {
      reader.onload = () => resolve(reader.result as string);
      reader.readAsText(file);
    });

    const res = await fetch("http://18.143.206.136/flaskapp/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        job_description: jd,
        resume: text,
        email: session.user.email, 
        filename: file.name,// ✅ send email to backend
      }),
    });

    const json = await res.json();

    if (res.status === 429) {
      window.location.href = "/plans?limit=true";
      return;
    }

    newResults.push({ filename: file.name, ...json });
  }

  setResults(newResults);
  setLoading(false);
};

  function downloadCSV() {
  if (results.length === 0) return;

  const header = ["Filename", "Score", "Matched Skills", "Missing Skills"];

  // Map each result object to an array of values for CSV
  const rows = results.map((r) => [
    r.filename,
    r.match_score,
    `"${r.matched_skills?.join(", ") || ""}"`, // quotes around strings with commas
    `"${r.missing_skills?.join(", ") || ""}"`,
  ]);

  // Combine header + rows
  const csvContent =
    [header.join(","), ...rows.map((r) => r.join(","))].join("\n");

  // Create blob and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "resume_scores.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "800px", margin: "auto" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>AUTOMATE</h1>

      <textarea
        placeholder="Paste Job Description here..."
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        rows={10}
        style={{ width: "100%", margin: "1rem 0", padding: "0.5rem" }}
      />

      <input
        type="file"
        accept=".txt,.pdf,.docx"
        multiple
        onChange={(e) => setFiles(e.target.files)}
        style={{ marginBottom: "1rem" }}
      />

      <br />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Matching..." : "Match Resumes"}
      </button>

      {results.length > 0 && (
        <>
        <table border={1} cellPadding={8} style={{ marginTop: "2rem", width: "100%" }}>
          <thead>
            <tr>
              <th>Filename</th>
              <th>Score</th>
              <th>Matched Skills</th>
              <th>Missing Skills</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i}>
                <td>{r.filename}</td>
                <td>{r.match_score}</td>
                <td>{r.matched_skills?.join(", ")}</td>
                <td>{r.missing_skills?.join(", ")}</td>
              </tr>
            ))}
          </tbody>

        </table>
          <button
      onClick={downloadCSV}
      style={{ marginTop: "1rem", padding: "0.5rem 1rem", cursor: "pointer" }}
    >
      Download CSV
    </button>
  </>
        
      )}
    </main>
  );
}
